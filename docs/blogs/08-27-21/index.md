# Developer experience for an event-driven microservice

Event-driven solutions are complex to implement, a lot of parts need to be considered, and I did not find any article that goes into
how to do things with the last technology available to us ('last' meaning August 2021). 

I want to propose a set of articles to address this developer's experience, not fully in the perfect order of developer's activities, as normally  we should start by event-storming and DDD.

So here is how I see the different high level task developers may need to follow:

* Use [Domain-driven design]() and [event storming]() to discover the business process to support and discover the different bounded contexts
which are potential microservice candidates.
* Use a code template as a base for the event-driven microservice depending of the messaging to use: MQ or Kafka. Those templates
use the DDD Onion architecture, and are based on Quarkus. The code also assume the services are containerized and deploy to Kubernetes or OpenShift.
* Create a GitOps repository with KAM, deploy the pipelines and gitops to manage the solution and the different 
deployment environments (`dev` and `staging`). Define specific pipelines tasks and pipeline flow. Connect git repository  via webhook to the pipeline tool (Tekton)
* Define message structure using AVRO or JSON schema, generate Java Beans from the event definition
* Connect and upload schemas to schema registry
* Define REST end point and OpenAPI, then manage those APIs in API management
* Apply test driven development for the business logic, assess integration tests scope and tune development environment accordingly. 
* Ensure continuous deployment with ArgoCD 

In this article I will try to propose a developer journey to support the implementation of an event-driven microservice
that will participate in a Command Query Responsibility Segregation pattern using the following:


## From Domain Driven Design...

The journey starts from an event storming workshop where architect, Subject Matter Experts, analysts and developers work together
to discover the business process with an event focus. Then applying domain-driven design practices, they should identify
bounded contexts and context map. The last part of the architecture decision activity will be to map bounded contexts to microservices.
This is not a one to one mapping, but the classical approach is to manage  big entity in its own microservices.

So if we take the traditional order processing domain, wee will discover events about the Order entity life cycle
and the Order entities with its value objects and references to other services. The figure below presents
some basic DDD elements: Commands in blue, Entity-aggregate in dark green, value-objects in light green, and events in orange.

![](./images/evt-driv-ms.png)

The right side of the diagram presents a DDD approach of application architecture, describes in layers. 
We can use also the onion architecture, but the important approach is to isolate the layers.

Commands will help to define API and REST resources and may be a service layer. Root aggregate defines what will
be persisted in the repository, but also what will be exposed via the APIs. In fact it is immediately important
to enforce avoiding designing a data model with a canonical model, and expose a complex data model in te APIs.

Finally Events will define Avro schemas that will be used in the messaging layer. 

I will detail OpenAPI and AsyncAPI elements, and the different layer later in this article.

## ... To code repositories

Developer starts to create a code repository in its preferred Software Configuration Manager, 
I will use GitHub (See [this repo for the command order microservice](https://github.com/jbcodeforce/eda-order-cmd-ms)) code
and [the separate gitops repository](https://github.com/jbcodeforce/eda-order-gitops) for CI/CD 
and [this repository for environment and external service deployment](https://github.com/ibm-cloud-architecture/eda-environment) .

As presented in [this note](), CQRS is implemented in two separate code units, in our case two separate microservices. 
As the subject of this article is about starting on strong foundations for developing event-driven microservices,
I will address the Command part of the CQRS which will use Kafka Consumer, and MQ producer.

To support a GitOps approach for development and deployment, Red Hat has delivered two operators around [Tekton]()
for continuous integration, and [ArgoCD]() for continuous deployment. As part of the OpenShift GitOps, there is also the [KAM CLI]() tool
 to help developer to start on the good track, at least for simple solution.

The core idea of GitOps is having a Git repository that always contains declarative descriptions 
of the infrastructure currently desired in the production environment and an automated process 
to make the production environment match the described state in the repository.

To get the basis knowledge related to this article I recommend reading the following documentations:

* [Understand GitOps](https://www.gitops.tech/)
* [Study KAM](https://github.com/redhat-developer/kam)
* []()

At the high level, by just following KAM's [Day 1 Operations](https://github.com/redhat-developer/kam/tree/master/docs/journey/day1) I want to
manage three event-driven microservices

### Basic solution organization

While adopting a GitOps approach for continuous integration and deployment, developer needs to create:

* One repository for environment, for the dependant product configuration and deployment. We recommend starting
from our [EDA environment repository](https://github.com/ibm-cloud-architecture/eda-environment) to get Strimzi or IBM Event Streams deployment.
* One repository for GitOps of the solution, to control application  configuration and continuous deployment
* One repository for the Command microservice
* One repository for the Query microservice
* One repository for integration tests

## Getting Started

We assume you have access to an OpenShift 4.7 Cluster: if not you can use [IBM OpenLab](https://developer.ibm.com/openlabs) to get a free cluster for one hour. 

Login to your cluster, and create a project.

```sh
oc login --token=.... --server=....
# Create a project for the demo and Kafka, MQ and postgresql
oc new-project eda-demo
```

### Install environments

The first thing to do, is to install operators for the different services / middleware, and then create one or more
instance of those 'services'. I will use some Open Source and IBM products for this solution. The products I'm using for the order microservices are

* IBM MQ
* RedPanda for local development and testing and IBM Event Streams on OpenShift
* Postgresql
* Apicurio schema registry for local development

1. Clone the [eda-gitops-catalog repository](https://github.com/ibm-cloud-architecture/eda-gitops-catalog.git) to get most of
the dependant operators defined.

```sh
git clone https://github.com/ibm-cloud-architecture/eda-gitops-catalog.git
```

1. Get IBM product catalog added to your OpenShift cluster

```sh
# 
oc apply -k ibm-catalog -n openshift-marketplace
# If you do not see any IBM operators then install IBM Catalog definition
# In the eda-gitops-catalog project
oc apply -k ./ibm-catalog/kustomization.yaml
```

1. Obtain [IBM license entitlement key](https://github.com/IBM/cloudpak-gitops/blob/main/docs/install.md#obtain-an-entitlement-key)

1. Deploy GitOps and Pipeline Operators: See the [install the openShift GitOps Operator article](https://docs.openshift.com/container-platform/4.7/cicd/gitops/installing-openshift-gitops.html#installing-gitops-operator-in-web-console_getting-started-with-openshift-gitops) or
use the following command:

```sh
# GitOps for solution deployment
oc apply -k ./openshift-gitops/operators/overlays/stable
# and Pipeline for building solution
oc apply -k ./openshift-pipelines-operator/overlays/stable/
# To verify they are not already installed use:
oc get operators
```

1. [Update the OCP global pull secret of the `openshift-config` project](https://github.com/IBM/cloudpak-gitops/blob/main/docs/install.md#update-the-ocp-global-pull-secret)

As illustrated 
1. deploy IBM Event Streams operator

```sh
# In the eda-gitops-catalog project
oc apply -f ./cp4i-operators/common-services.yaml

oc apply -f https://raw.githubusercontent.com/ibm-cloud-architecture/eda-gitops-catalog/main/cp4i-operators/event-streams/subscription.yaml   
```


#### Operators

It will take some time get the following operators deployed.

```sh
# List existing catalog
oc get catalogsource -n openshift-marketplace
# If the IBM catalogs are not displayed add the following:
oc apply -f operators/ibm-catalog/catalog_source.yaml -n openshift-marketplace
# With this catalog we should be able to install MQ operator
oc get packagemanifests -n openshift-marketplace

# Install Strimzi Kafka Operator - It will listen to any namespaces
oc apply -f operators/strimzi-kafka/subscription.yaml
# Install Apicurio Registry Operator
oc apply -f operators/apicurio/subscription.yaml
# Install MQ Operator, which may also deploy IBM Cloud Pak foundational services 
oc apply -f operators/mq/subscription.yaml
# Verify installed operators
oc get operators

NAME                                               AGE
apicurio-registry.openshift-operators              5m34s
ibm-common-service-operator.openshift-operators    6m41s
ibm-mq.openshift-operators                         8m10s
ibm-namespace-scope-operator.ibm-common-services   4m47s
ibm-odlm.ibm-common-services                       3m27s
strimzi-kafka-operator.openshift-operators         7m38s
```

Once done we will create Kafka Cluster, a MQ broker for development, Apicurio

#### Instances

##### Kafka via Strimzi

```sh
# Create Kafka Cluster instance and a scram user and tls user
oc apply -k  instances/strimzi-kafka/kustomization.yaml 
# Verify Kafka cluster runs
oc get kafka
oc get kafkauser 
```

The SCRAM and TLS users are defined to get different ways to authenticate to Kafka. 
For detail explanations on how Kafka authentication mechanism works, I recommend [reading Rick Osowski's article](https://rosowski.medium.com/kafka-security-fundamentals-the-rosetta-stone-to-your-event-streaming-infrastructure-518f49640db4).

The installation of th Kafka Cluster has generated a set of secrets for TLS certificates, that we will need:

```sh
oc get secrets
NAME                                        TYPE     
eda-kafka-cluster-ca-cert                   Opaque
...
```

##### IBM MQ

```sh
# Create an instance named QM1
oc apply -f instances/mq/mq-qm1.yaml 
# Verify and get the Console URL
oc describe queuemanager qm1
```

## Develop the event-driven service

I will focus on the way to prepare the different elements of the service to ensure keeping the coupling to the minimum.

I will use [Quarkus](https://quarkus.io) to develop the Microprofile based services. I recommend to use the [quarkus CLI](https://quarkus.io/guides/cli-tooling)
to start your project on good foundations:

```sh
quarkus create ibm.eda.demo:kc-freezer-cmd-ms:0.0.1 -x reactive-messaging-kafka,metrics,smallrye-openapi
# Add needed extensions
quarkus ext add qpid-jms, openshift
```

### Defining the API from JAXRS Resource and OpenAPI annotation

The demo is a proof of concepts, so we will have on OrderDTO as a bean to support
getting the data about the order at the API level.

### Defining Pipeline tasks and flow

### Add webhook 

We need to add a webhook to the Git repository
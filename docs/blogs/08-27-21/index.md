# Developer experience for an event-driven microservice

In this article I will try to demonstrate a developer journey to support the implementation of an event-driven microservice
that will participate in a Command Query Responsibility Segregation pattern.

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

Finally Events will define Avro schema that will be used in the messaging layer. 

I will detail OpenAPI and AsyncAPI elements, and the different layer later in this article.

## ... To code repositories

Developer starts to create a code repository in its preferred Software Configuration Manager, 
I will use GitHub (See [this repo for the command order microservice](https://github.com/jbcodeforce/eda-order-cmd-ms)) code
and [the separate gitops repository](https://github.com/jbcodeforce/eda-order-gitops) for CI/CD 
and [this repository for environment and external service deployment](https://github.com/ibm-cloud-architecture/eda-environment) .

As presented in [this note](), CQRS is implemented in two separate code units, in our case two separate microservices. 
As the subject of this article is about starting on strong foundations for developing event-driven microservices,
I will address the Command part of the CQRS which will use Kafka Consumer, and MQ producer.

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

### Install environment

The first thing to do, is to install operators for the different services / middleware, and then create one or more
instance of those 'services'.

#### Operators

```sh
# List existing catalog
oc get catalogsource -n openshift-marketplace
# If the IBM catalogs are not displayed add the following:
oc apply -f operators/ibm-catalog/catalog_source.yaml -n openshift-marketplace
# With this catalog we should be able to install MQ operator
oc get packagemanifests -n openshift-marketplace

# Install Strimzi Kafka Operator - It will listen to any namespaces
oc apply -f operators/strimzi-kafka/subscription.yaml
# Install MQ Operator
oc apply -f operators/mq/subscription.yaml
```

#### Instances

##### Kafka via Strimzi

```sh
# Create Kafka Cluster instance and a scram user and tls user
oc apply -k  instances/strimzi-kafka 
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

## Develop the service

I will focus on the way to prepare the different elements of the service to ensure keeping the coupling to the minimum.

I will use Quarkus to develop the Microprofile based services. I recommend to use the [quarkus CLI]()

### Defining the API from JAXRS


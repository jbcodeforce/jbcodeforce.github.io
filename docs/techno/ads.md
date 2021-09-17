# Automation Decision Service

Automation Decision Services provides decision modeling capabilities that help business experts capture and automate repeatable decisions. 
Automation Decision Services comes with two main components that can be installed separately:

* **Decision Designer** to develop decision model. It is connected to Github to manage decision artifacts. It is used to build and deploy the decision runtime.
* **Decision Service**: runtime to get ruleset and executes rule engine

![](./images/ads.png)

The decision model may include call to a predictive scoring done with ML model.

## Decision model

Decision model diagrams are composed of a set of nodes that are used as building blocks to represent decisions in a graphical way:

* Decision nodes represent the end decision, that is the decision that you want to automate, and the subdecisions that the end decision depends on.
* Data nodes represent the data definition that is needed to make a decision.
* Function nodes encapsulate computations from other decision models.
* Prediction nodes encapsulate predictions that you can call directly from your decision model.
* *External libraries* contain data types and functions to be used inside the decision models

## Getting started

* [Product doc - getting started](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=resources-getting-started-tutorial) goes over a simple decision model to send a message according to some weather data.
* [ODM Docker image](https://hub.docker.com/r/ibmcom/odm)
* [ADS Compose](https://github.ibm.com/dba/ads-compose)

Launch locally ODM for older rule implementation.

```sh
docker run -e LICENSE=accept -p 9060:9060 -p 9443:9443  -m 2048M --memory-reservation 2048M -v $PWD:/config/dbdata/ -e SAMPLE=true ibmcom/odm:8.10
```

For ADS we need access to docker images with the licensed product, and then use docker-compose to run it locally.
Multiple services are running to make ADS. They use secure communication via TLS.

## Installation

Being part of Cloud Pak for Automation, we need to install it on OpenShift. The install doc is [here](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=automation-installing). 
Installation uses operator lifecycle manager (OLM).

IBM Cloud Pak for Business Automation comes with the IBM Cloud® platform automation foundation which includes:

* [Process Mining from myInvenio](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=foundation-process-mining)
* [Robotic Process Automation](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=foundation-robotic-process-automation)
* [MongoDB]()
* [Zen User Interface]()
* [Biz Automation Insight](/techno/bai) Apicurio Registry, Kafka, Flink, Elastic Search is now part of Foundation
* Common services: IAM, certificate management, User Management Services, Admin UI, license operator

Summary of installation steps:

* Get IBM license entitled registry key
* Get the storage class name to use for dynamic storage
* Prepare storage for cloud pak operator
* Download the [k8s certificates](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=cluster-setting-up-admin-script)
 and configuration to prepare the OCP cluster
* Define a project where the Cloud Pak will be installed and then modify cluster_role_binding
* Run the `cert-kubernetes/descriptors/cp4a-clusteradmin-setup.sh` script
* Define the custom resource manifest to control the product to install, use create  or `oc create -f ...`
* After the Automation Decision Services container is deployed to the cluster, you need to take [additional steps (add maven plugin)](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=tasks-completing-post-deployment-automation-decision-services) to be able to build and deploy decision services.

## Automation Foundation

IBM Automation foundation provides the user interface which IBM Cloud Paks extend. It provides an event framework based on Kafka, Flink, and Elasticsearch. 
It includes process mining and RPA.

It also provides a platform to train machine learning models, store, and manage the trained models and then serve them to derive inferences.

Each instance of IBM Automation foundation is contained within a Kubernetes namespace.

## Collaborating

To be able to support CI/CD we need to get the ADS Maven plugin. This is done by performing the [ADS post installation tasks](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=tasks-completing-post-deployment-automation-decision-services):

* Get a UMS user
* Be sure to have installed a Nexus server to OpenShift
* Authenticate to ADS_BASE_URL with the access token of the UMS user.

## Not yet there



## Useful links

* [ODM Docker image](https://hub.docker.com/r/ibmcom/odm/)
* [Eclipse Oxygen needed for Decision Designer](http://www.eclipse.org/downloads/packages/release/oxygen/3a)
* []()
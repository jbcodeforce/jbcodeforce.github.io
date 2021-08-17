# Automation Decision Service

Automation Decision Services provides decision modeling capabilities that help business experts capture and automate repeatable decisions. 
Automation Decision Services comes with two main components: a designer and a runtime that can be installed separately.

Components:

* Decision Designer to develop decision model. It is connected to Github to manage decision artifacts. It is used to build and deploy the decision runtime.
* Decision Service: runtime

![](./images/ads.png)

## Decision model

Decision model diagrams are composed of a set of nodes that are used as building blocks to represent decisions in a graphical way:

* Decision nodes represent the end decision, that is the decision that you want to automate, and the subdecisions that the end decision depends on.
* Data nodes represent the data that is needed to make a decision.
* Function nodes encapsulate computations from other decision models.
* Prediction nodes encapsulate predictions that you can call directly from your decision model.

## Getting started

* [Product doc - getting started](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=resources-getting-started-tutorial) goes over a simple decision model to send a message according to some weather data.
* [ODM Docker image](https://hub.docker.com/r/ibmcom/odm)

Launch locally ODM.

```sh
docker run -e LICENSE=accept -p 9060:9060 -p 9443:9443  -m 2048M --memory-reservation 2048M -v $PWD:/config/dbdata/ -e SAMPLE=true ibmcom/odm:8.10
```

ADS is not yet in docker image.

## Installation

Being part of Cloud Pak for Automation, we need to install it on OpenShift. The install doc is [here](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=automation-installing). 
Installation uses  operator lifecycle manager (OLM).

IBM Cloud Pak for Business Automation comes with the IBM Cloud® platform foundation which includes:

* [Process Mining from myInvenio](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=foundation-process-mining)
* [Robotic Process Automation]()
* [MongoDB]()
* [Zen User Interface]()
* For [BAI](/techno/bai) Apicurio Registry, Kafka, Flink, Elastic Search
* Common services: IAM, certificate management, Admin UI, license operator

Summary of installation steps:

* Get IBM license entitled registry key
* Get the storage class name to use for dynamic storage
* Preparing storage for cloud pak operator
* download the [k8s certificates](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=cluster-setting-up-admin-script)
) and configuration to prepare the OCP cluster
* Define a project where the Cloud Pak will be installed and then modify cluster_role_binding
* Run the `cert-kubernetes/descriptors/cp4a-clusteradmin-setup.sh` script
* install...
* After the Automation Decision Services container is deployed to the cluster, you need to take [additional steps (add maven plugin)](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=tasks-completing-post-deployment-automation-decision-services) to be able to build and deploy decision services.

## Collaborating

To be able to support CI/CD we need to get the ADS Maven plugin. This is done by performing the [ADS post installation tasks](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=tasks-completing-post-deployment-automation-decision-services):

* Get a UMS user
* Be sure to have installed a Nexus server to OpenShift
* authenticate to ADS_BASE_URL with the access token of the UMS user.

## Not yet there



## Useful links

* [ODM Docker image](https://hub.docker.com/r/ibmcom/odm/)
* [Eclipse Oxygen needed for Decision Designer](http://www.eclipse.org/downloads/packages/release/oxygen/3a)
# Cloud Pak for Automation

IBM Cloud Pak for Business Automation is a set of integrated market-leading software, running on top
of Red Hat OpenShift and therefore built for any hybrid cloud.
Support following business automation capabilities — for content, decisions, process mining,
RPA, workflows, and document processing.

![](./images/cp4ba-march.png)


Automation foundation provides common services, used by CP4I and CP4D.

As CP4BA runs on OpenShift, some considerations need to be addressed.

## Operators

The following operators are installed with Cloud Pak for Automation

* **IBM® Automation Foundation Core**: 

    * RPA-driven automation, process mining, mongoDB for Identity and Access Management (IAM), metering, OpenID,..  Zen UI and event processor.

* **Cloud Pak foundational services**: (bedrock - common services) [Product doc](https://www.ibm.com/docs/en/cpfs). It includes IAM and certificate management.
* **IBM® Automation foundation** operator installs the required dependency operators, such as the IBM Events Operator, the Elasticsearch Operator and the Event Processing Operator.
* **Cloud Pak for Business Automation** delivers an integrated and managed collection of containerized services

## Rapid deployment

For production deployment see the [product documentation](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation)

See [this repository](https://github.com/IBM/cp4ba-rapid-deployment) to setup CP4Automation for demonstration purpose.
This doc provides you step-by-step instructions to set up the needed infrastructure for the Demo deployment, this is:

* Install IBM Cloud Pak for Business Automation version 21.0.2 (enterprise deployment)
* Get the required infrastructure on IBM Cloud (OpenShift cluster, VM for LDAP and optionally VM for RPA)
* Installing all the prerequisite software of CP4BA (LDAP and DB2)

A cluster will all capabilities needs 11 nodes (see [system requirements](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=pei-system-requirements)):

* Master (3 nodes): 4 vCPU and 8 Gi memory on each node.
* Worker (8 nodes): 16 vCPU and 32 Gi memory on each node.

For ADP and deep learning processing of document, node needs to get GPU and CPU must meet TensorFlow AVX requirements.

For minimum demo purpose 3 nodes are enough. 

* Three worker nodes with 32 CPUs and 64Gi RAM (e.g., flavor c3c.32x64 on ROKS)
* One db2 worker node with 32 CPUs and 128Gi RAM (e.g., flavor b3c.32x128 on ROKS)

## Installation

### Deploying OpenLDAP

* [Article from  Garage team on how to deploy OpenLDAP server on OpenShift](https://medium.com/ibm-garage/how-to-host-and-deploy-an-openldap-sever-in-openshift-affab06a4365)
* [OpenLDAP bitmani documentation](https://docs.bitnami.com/tutorials/create-openldap-server-kubernetes/)

See [openLDAP instance configuration in ibm-cloud-architecture/dba-gitops-catalog](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/tree/main/instances/openLDAP)

### Deploy Foundation operators 

See the silent setup in [this doc](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/)

### ODM specifics

Follow [link](http://www.ibm.com/support/knowledgecenter/SSYHZ8_21.0.x/com.ibm.dba.offerings/topics/con_odm_prod.html) for details about this product.

* Need LDAP
* Need a database like Postgresql
* You do not have to integrate with the User Management Service (UMS)
* Install Rule Designer from the Eclipse Marketplace.

## Getting Started

Once installed, all the URLs, user and password information, you need will be present in the `icp4adeploy-cp4ba-access-info` config map

```sh
oc describe cm icp4adeploy-cp4ba-access-info 
```


* check the Common service operator full version and deployed namespace

```
oc get csv --all-namespaces | grep common-service-
```


## The Client Onboarding demo

* Pdf and instructions [github.com/IBM/cp4ba-labs](https://github.com/IBM/cp4ba-labs/tree/main/IBM%20Cloud%20Pak%20for%20Business%20Automation%20(End-to-End))
* repository: [dba-onboarding-automation](https://github.com/ibm-cloud-architecture/dba-onboarding-automation)

The client application includes three pages to support following use cases:

![](./images/onboarding-app.png)

The back-office workflow using the Workflow capability may involve an account manager, the client, and/or the client representative

![](./images/onboarding-back.png)

**Summary:**

* 'Client Onboarding app' is created with **Automation Application Designer**
* Workflow orchestrate back office services 
* Decision to categorize client in different segment
* Use RPA to update older applications


See this [](https://github.com/IBM/cp4ba-rapid-deployment/blob/main/cp4ba-21-0-2/00selectTemplate.md#template-for-the-client-onboarding-demo)

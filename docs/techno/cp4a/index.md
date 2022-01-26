# Cloud Pak for Automation

!!! info
    Updated 1/19/2022

IBM Cloud Pak for Business Automation is a set of integrated market-leading software, running on top
of Red Hat OpenShift and therefore built for any hybrid cloud.
Support following business automation capabilities — for content, decisions, process mining,
RPA, workflows, and document processing, but add uniform platform experience, better component reuse.

![](./images/cp4ba-march.png)

Running in containers and Kubernetes is to improve cost of operation and deployment. For example using
Liberty will reduce the packaging from multiple GB to only 800MB, start faster 10s, and simpler configuration.

Docker images help to maintain product delivery and access to iFixes from a central registry. 
Kubernetes helps to standardize on Operation and SRE skillset, innate HA, better application isolation, 
and improved portability.  

**Container Federation** is the concept to share capabilities between products:

* Task federation (PFS)
* Single UI (Navigator)
* Common content services (CPE)
* Aggregated monitoring/KPIs (BAI)
* Federated BPM Portal
* All application tier federated by default (BAW) 

Automation foundation provides common services, used by CP4I and CP4D.


## Operators

* **Operator** is a long running process to perform products (Operands) deployment and Day 2 operations, like upgrades, failover, or scaling. Operator is constantly watching your cluster’s desired state for the software installed. 
* **Operator Lifecycle Manager (OLM)**: Helps you to deploy, and update, and generally manage the lifecycle of all of the Operators (and their associated services) running across your clusters.
The operator lifecycle manager (OLM) acts as the management system for the operators on that cluster. Cluster administrators control which operators are available and who can interact with the running operators.


The following operators are installed with Cloud Pak for Automation

* **IBM® Automation Foundation Core**: 

    * RPA-driven automation, process mining, mongoDB for Identity and Access Management (IAM), metering, OpenID,..  Zen UI and event processor.

* **Cloud Pak foundational services**: (bedrock - common services) [Product doc](https://www.ibm.com/docs/en/cpfs). It includes IAM and certificate management.
* **IBM® Automation foundation** operator installs the required dependency operators, such as the IBM Events Operator, the Elasticsearch Operator and the Event Processing Operator.
* **Cloud Pak for Business Automation** includes Business Automation Studio and Business Automation Navigator to provide a unified authoring environment and an entry point to various low-code design tools with a single sign-on (SSO) experience and team management.


### Namespace

Divide workloads into dedicated namespaces for the application life cycle: dev, staging, production. **Meter** can be used to understand
the deployments against entitlements.

An administrator can configure the role and role binding resources for each application before any operator is deployed. Each application must specify a serviceAccountName in its pod spec, and the service account must be created.

### CRD

The Cloud Pak for Business Automation operator uses a custom resource definition (CRD), which describes what the operator is meant to watch.

### CRs

Then Automation is using a single CR to define the capabilities you want to deploy.

## Product installation

* [Preparing OpenShift Cluster](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.3?topic=deployment-preparing-your-cluster):
The installation needs a dynamic storage class and a block storage class. 
 If any other Cloud Pak needs to be installed in the same cluster, you must use the same choice for the namespaces because IBM Automation foundation is a shared resource between Cloud Paks.
* Get entitlement key
* Install an instance of LDAP for your intended deployment. [For dev purpose we use OpenLDAP](#deploying-openldap) and see [DBA GitOps catalog]() for that. 
For production deployment Tivoli Active Directory or Microsoft Active Directory are recommended.
* Install GitOps operators
* Install Cloud Pak Automation operators
* Install operand using Custom Resource

### Capacity

A cluster with all capabilities needs 11 nodes (see [system requirements](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=pei-system-requirements)):

* Master (3 nodes): 4 vCPU and 8 Gi memory on each node.
* Worker (8 nodes): 16 vCPU and 32 Gi memory on each node.

For ADP and deep learning processing of document, some Nodes need to get GPU and CPU must meet TensorFlow AVX requirements.

For demo purpose 3 nodes are enough. 

* Three worker nodes with 32 CPUs and 64Gi RAM (e.g., flavor c3c.32x64 on ROKS)
* One db2 worker node with 32 CPUs and 128Gi RAM (e.g., flavor b3c.32x128 on ROKS)

>>>> Before 2021.3, We can only have one instance of Cloud pak automation on one cluster

### Starter deployment for demo purpose

This section is a summary of the [product documentation](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.3?topic=openshift-installing-starter-deployments) with links to assets to deploy with CLI.

#### Preparing

* Get last compatible `kubectl` and [oc](https://mirror.openshift.com/pub/openshift-v4/clients/oc/) CLIs

    ```sh
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl" 
    ```

* Get `podman` CLI instead of the docker CLI.
* Download the [Container Application Software for Enterprises (CASE) repository](https://github.com/IBM/cloud-pak)  which includes
a zip file (cert-kubernetes) with configurations and scripts linked to the product version. The [dba-gitops-catalog repo](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/) has script to
get this CASE.

    ```sh
    git clone https://github.com/ibm-cloud-architecture/dba-gitops-catalog/
    # under dba-gitops-catalog
    # Modify the following script to specify any new product version
    code ./scripts/getCpAutomationSDK.sh
    ```

    > Inside this `ibm-cp-automation`archive, there is a script to build the CR for the CP4Automation components you want to deploy. See the [getCpAutomationSDK script](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/blob/main/scripts/getCpAutomationSDK.sh) to automate the 
download and extraction of the CASE asset.

* Get entitlement key and create a secret named `ibm-entitlement-key` and one named `admin.registrykey`.

    ```sh
    # need that if Operator is set on All namespace
    ./scripts/defineRegistrySecret.sh ibm-entitlement-key openshift-operators
    ./scripts/defineRegistrySecret.sh admin.registrykey openshift-operators
    # need this for each namespace where the product will be installed
    ./scripts/defineRegistrySecret.sh admin.registrykey cp4a
    ./scripts/defineRegistrySecret.sh ibm-entitlement-key cp4a
    ```

* Define IBM Catalog source:

    ```sh
    oc apply -f ibm-catalog/catalog_source.yaml
    oc apply -k ibm-cp4a-catalog/overlays       
    ```

* Create one namespace: `cp4a`, create one service accounts, create operator-shared pvc and log pvc.

    ```sh
    oc apply -k ./cp4ba-operator/overlays
    ```

What you should get as deployed operators (use different namespace if deploy on specific scoped ns):

    ```sh
    oc get operators -n openshift-operators

    ibm-automation-elastic.openshift-operators                26h
    ibm-automation-eventprocessing.openshift-operators        26h
    ibm-automation-flink.openshift-operators                  26h
    ibm-automation-insightsengine.openshift-operators         26h
    ibm-automation.openshift-operators                        26h
    ibm-cp4a-operator.openshift-operators                     26h
    ibm-cp4a-wfps-operator.openshift-operators                26h
    ```

* Get two storage classes: 

    > File storage keeps data as a hierarchy of files in folders (`ibmc-file-gold-gid`). Block storage chunks data into organized and evenly sized volumes (`ibmc-block-gold-gid`).

* Get role and cluster role names of the operator to give access to `cp4admin` user:

    ```sh
    oc get role -n openshift-operators | grep ibm-cp4a-operator | sort -t"t" -k1r | awk 'NR==1{print $1}'
    > ibm-cp4a-operator.v21.3.2-ibm-cp4a-operator-6667999868
    oc get clusterrole -n openshift-operators | grep ibm-cp4a-operator | sort -t"t" -k1r | awk 'NR==1{print $1}'
    
    ```

#### Installing

The "starter" deployment provisions Db2® and OpenLDAP with the default values, so you do not need to prepare them in advance

Deployment is centralized by one unique CR that specifies the capabilities to use, and to configure how to access
the external services like LDAP.

The `cert-kubernetes` folder includes the [./scripts/cp4a-deployment.sh script to build](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.3?topic=scripts-installing-capabilities-by-running-deployment-script) 
to be used to create Custom Resource.

* Create a CP4BA deployment cluster CR: See example in [BAW BAI CR](https://github.com/ibm-cloud-architecture/dba-infra-gitops/blob/main/environments/dba-dev/services/baw-bai/base/baw-bai-cr.yaml) in
a dba-infra-gitops project. Can be done manually or with the `./cert-kubernetes/scripts/cp4a-deployment.sh ` tool.


  ```sh
    # from dba-infra-gitops/    
    oc apply -f environments/dba-dev/services/baw-bai-cr.yaml
  ```

* Get the  `cp4ba-access-info` ConfigMaps for the different URLs to access the deployed capacities.

  ```sh
  oc describe cm icp4adeploy-cp4ba-access-info
  ```


* Troubleshooting: [https://www.ibm.com/support/pages/node/6426995](https://www.ibm.com/support/pages/node/6426995)

See also [the SWAT team repository](https://github.com/IBM/cp4ba-rapid-deployment) to setup CP4Automation for demonstration purpose.


This is the first step of [the bootstrap script](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/blob/main/bootstrap.sh).

This script runs `cp4a-clusteradmin-setup.sh` which deploys CP4A-operators.

### Production deployment

For production deployment see the [product documentation](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation)

#### Deploying OpenLDAP

* [Article from  Garage team on how to deploy OpenLDAP server on OpenShift](https://medium.com/ibm-garage/how-to-host-and-deploy-an-openldap-sever-in-openshift-affab06a4365)
* [OpenLDAP bitmani documentation](https://docs.bitnami.com/tutorials/create-openldap-server-kubernetes/)

See [openLDAP instance configuration in ibm-cloud-architecture/dba-gitops-catalog](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/tree/main/instances/openLDAP)

```sh
oc apply -k environments/openLDAP
# Test it:
oc rsh $(oc get po -o name -n openldap| grep ldap) -n openldap
# In pod shell
ldapsearch -x -H ldap://localhost:1389 dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w adminpassword
```

#### Deploy PostgreSQL

The postgreSQL operator defines a new Kubernetes resource called "Cluster" representing 
a PostgreSQL cluster made up of a single primary and an optional number of replicas that co-exist in a chosen Kubernetes namespace 
for High Availability and offloading of read-only queries..

#### Deploy Foundation operators 

See the silent setup script in [this doc](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/)

#### Deploying one of the Automation capability

You can then generate the custom resource (CR) file by using another script `./cp4a-deployment.sh`

This script will ask:

* deployment type (demo, enterprise)
* OpenShift deployment type (ROKS, OCP, CNCF)
* Automation capability: 
        1) FileNet Content Manager 
        2) Operational Decision Manager 
        3) Automation Decision Services 
        4) Business Automation Application 
        5) Business Automation Workflow 
        (a) Workflow Authoring 
        (b) Workflow Runtime 
        6) Automation Workstream Services 
        7) IBM Automation Document Processing 
        (a) Development Environment 
        (b) Runtime Environment 




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


See this [template-for-the-client-onboarding-demo](https://github.com/IBM/cp4ba-rapid-deployment/blob/main/cp4ba-21-0-2/00selectTemplate.md#template-for-the-client-onboarding-demo)

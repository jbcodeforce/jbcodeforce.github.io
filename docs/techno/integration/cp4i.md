# Cloud Pak for Integration

!!! info
    Updated 2/22/2022

## Addressing integration challenges

* Manual tasks requiring expert integration skills -> cp4i will bring automate integrations powered by AI
* Lack of operational visibility to improve integrations -> improve quality with continuous feedback based on real-world data
* Only one integration style -> Use varied integration methods and styles to you advantages
* Drive new engagement models and digital transformation

   * Manage APIs, define new channels
   * respond to events in real-time for engaging experiences
   * Access and move data in fast, secure way

* Accelerate integration while reducing costs

   * AI powered integration: recommend integration patterns, flow mapping, and config changes
   * Reuse integration: decompose larger integration into independant integrations. Integration asset repository.
   * Simplify operation: easy to build with CI/CD workflows. Easy to deploy to same platform, no more central ESB

* Reduce exposure to business and security risks

   * Secure access to critical assets
   * Protect transactional integrity
   * Balance workloads

## CP4I

All components of CP4I can be combined in any way as required and are deployed 100% as containers. Each capability is deployed and managed by a corresponding operator.

CP4I also provides an optional Platform Navigator, an over-arching Management UI layer that provides a common UI experience for various installed integration capabilities. Platform Navigator is not required to deploy individual CP4I capabilities, as each integration capability can be deployed independently leveraging its cloud native deployment operators.

Currently, foundational services mostly are focused on identity and access management for Platform Navigator UI, single sign-on experience for UI, license metering

## 2021.4 release

* [Event Endpoint Management](/eepm) to support buying at the API calls per month level to access kafka events or at the resource usage level.
* AI-driven API Test generation is designed to automate the process of generating these API test cases. 
Watson Insights for suggested tests are generated through analysing production OpenTracing data. 
This helps to determine distinct behaviours in an API implementation
* Support OpenShift on IBM z Integrated Facility for Linux, and on IBM Power Systems


## Installation Steps Overview

There are different sources for installing Cloud Pak for integration.

* [Product documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2021.4?topic=installing)
* [Joel Gomez's Tinkering CP4I site](https://github.ibm.com/joel-gomez/tinkering-cp4i/) where most of the yamls are also in 
the larger project: []()
* [The EDA gitops catalog](https://github.com/ibm-cloud-architecture/eda-gitops-catalog) for operators, and operand definitions. The readme for this project is kept up to date.

1. Decide if the operators are installed at namespace scope or at cluster level. 
With namespace scope, each project effectively behaves as a different tenant.
There can be one Platform Navigator installed in each namespace, and that Platform Navigator owns only the instances in that namespace.
A single instance of IBM Cloud Pak foundational services is installed in the ibm-common-services namespace.

    Here are the operators to be installed:

    * **IBM Cloud Pak for Integration**: Top level Cloud Pak for Integration operator that install all other Cloud Pak for Integration operators automatically
    * **IBM Cloud Pak for Integration Platform Navigator**: Provides a dashboard and central services
    * **IBM Automation foundation assets**: Stores, manages, retrieves and searches for integration assets
    * **IBM Cloud Pak for Integration Operations Dashboard** tracing across instances to allow troubleshooting
    * Then any product specific operator.

1. Get your **IBM Entitlement Key**: The IBM Entitlement Key is required to pull IBM Cloud Pak specific container 
images from the IBM Entitled Registry. To get an entitlement key, log in to MyIBM 
Container Software Library with an IBMid and password associated with the entitled software. See
[https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-obtaining-your-entitlement-key](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=clusters-obtaining-your-entitlement-key) 

   
1. Prepare a suitable Red Hat OpenShift cluster with suitable storage.

    [IBM Cloud storage supports](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2021.4?topic=requirements-supported-options-cloud)

1. Make the operators available to the cluster. 

    IBM Operator Catalog provides certified operators for IBM products that can be deployed using the Red Hat OpenShift Operator Hub.

1. Install the operators using the Operator Hub and Operator Lifecycle Manager.
1. Provide access to capability and runtime images.

    Add pulling image secret to the target namespace where to run cp4i: where the platform  navigator will run.

1. Deploy capabilities and runtimes using the operators.

    `Operators > OperatorHub > Integration & Delivery > IBM Cloud Pak for Integration operator`.

The first four steps are done by cluster administrator, while developer or solution
 administrator deploys operator runtimes and define operands.

If the operators are installed at namespace scope, each namespace effectively behaves as a different tenant.

All IBM Cloud Paks installed in a cluster must be installed in the same mode, we cannot mix cross namespaces or within a namespace.

When Cloud Pak for Integration is installed in the **All namespaces** (the operator is installed in `openshift-operators`), 
there can be only **one Platform Navigator** per cluster, and all Cloud Pak instances are owned by that Platform Navigator.

A single instance of IBM Cloud Pak foundational services is installed in the `ibm-common-services` namespace if the foundational services
 operator is not already installed on the cluster.

Operators need a small set of cluster level permissions to allow manipulation of resources defined at cluster scope, such as reading Custom Resource Definitions.

## Add IBM Catalog

```sh
oc apply -f https://raw.githubusercontent.com/ibm-cloud-architecture/eda-gitops-catalog/main/ibm-catalog/catalog-source.yaml
```

Here is an example of catalog source definition

```yaml
apiVersion: operators.coreos.com/v1alpha1
kind: CatalogSource
metadata:
  name: ibm-operator-catalog
  namespace: openshift-marketplace
spec:
  displayName: IBM Operator Catalog
  image: 'icr.io/cpopen/ibm-operator-catalog:latest'
  publisher: IBM
  sourceType: grpc
  updateStrategy:
    registryPoll:
      interval: 45m
```

## Install Operators

You can install any combination of operators. Any dependencies will be pulled in automatically.

See the operator and matching names in [this table](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2021.2?topic=installing-operators).

For deployment using CLI: Use the [EDA gitops catalog](https://github.com/ibm-cloud-architecture/eda-gitops-catalog.git)

* create the `cp4i` project: `oc new-project cp4i`
* Get the entitlement key and create a secret from it.
* 2021.4: Not seemt to be needed !. Add an OperatorGroup `oc apply -f cp4i-operators/operator-group.yaml`
* Add a subscription with the namespace being the one created or `openshift-operators`, to install the operator in All namespaces on the cluster.

```yaml
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: ibm-cp-integration
  namespace: cp4i
spec:
  channel: v1.3
  name: ibm-cp-integration
  source: ibm-operator-catalog
  sourceNamespace: openshift-marketplace
```

* Validate installed operators

```sh
oc get csv -n cp4i
# example
datapower-operator.v1.5.0                        IBM DataPower Gateway                 1.5.0                                                      Failed
ibm-ai-wmltraining.v1.1.0                        WML Core Training                     1.1.0                ibm-ai-wmltraining.v1.0.0             Failed
ibm-apiconnect.v2.4.0                            IBM API Connect                       2.4.0                                                      Failed
ibm-common-service-operator.v3.14.2              IBM Cloud Pak foundational services   3.14.2               ibm-common-service-operator.v3.14.1   Failed
ibm-eventstreams.v2.5.1                          IBM Event Streams                     2.5.1     
```

### Event streams example

* Deploy event streams operators for this namespace

  ```sh
  oc apply -k cp4i-operators/event-streams/operator/overlays/v2.5
  ```

* Verify operator pod is running
* Create a event streams cluster instance: can be done with the Operator UI or with CLI

  ```sh
  oc apply -k c4pi-operators/event-streams/operands/dev
  ```
  
  > this will install operators in the `ibm-common-services` project too.
  > And 3 kafka pods, 3 zookeeper pods, 1 Event Streams operator pod, cluster and entities operator pods,
  schema registry, adminapi, ui, RESTAPI, metrics pods.

### Event end point management

[Last product documentation](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2021.3?topic=runtimes-event-endpoint-management-deployment)

* API Connect requires these cluster-scoped permission

  ```
  ```

* From IBM API Connect operator add an Event Endpoint Manager instance

  ```sh
  # In eda-gitop-catalog
  oc apply -k c4pi-operators/event-endpoint/operands/dev/
  ```

To debug the installation go to the `cp4i` and the `apic-connect` pod. Postgresql pod can take time to be created.

## Other resources

* [Product documentation](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=installing-installation-options)
* [Red Hat marketplace for CP4I](https://marketplace.redhat.com/en-us/products/ibm-cloud-pak-for-integration)

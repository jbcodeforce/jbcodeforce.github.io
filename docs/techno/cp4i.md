# Cloud Pak for Integration

## Installation Summary

1. Prepare a suitable Red Hat OpenShift cluster with suitable storage.

    [IBM Cloud storage supports](https://www.ibm.com/docs/en/cloud-paks/cp-integration/2021.2?topic=requirements-supported-options-cloud)

1. Make the operators available to the cluster. 

    IBM Operator Catalog provides certified operators for IBM products that can be deployed using the Red Hat OpenShift Operator Hub.

1. Install the operators using the Operator Hub and Operator Lifecycle Manager.
1. Provide access to capability and runtime images.

    Add pulling image secret to the target namespace where to run cp4i: where the platform  navigator will run.

1. Deploy capabilities and runtimes using the operators.

    `Operators > OperatorHub > Integration & Delivery > IBM Cloud Pak for Integration operator`.

The first four steps are done by cluster administrator, while developer or solution
 administrator deploys operator runtimes.

If the operators are installed at namespace scope, each namespace effectively behaves as a different tenant.

All IBM Cloud Paks installed in a cluster must be installed in the same mode.

When Cloud Pak for Integration is installed in the **All namespaces** (the operator is installed in `openshift-operators`), there can be only **one Platform Navigator** per cluster, and all Cloud Pak instances are owned by that Platform Navigator.

A single instance of IBM Cloud Pak foundational services is installed in the ibm-common-services namespace if the foundational services operator is not already installed on the cluster.

Operators need a small set of cluster level permissions to allow manipulation of resources defined at cluster scope, such as reading Custom Resource Definitions.

## Add Catalog

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

If we need to install the components in a specific namespace then we need to

* create the project
* Add an OperatorGroup

```yaml
apiVersion: operators.coreos.com/v1
kind: OperatorGroup
metadata:
  name: ibm-integration-operatorgroup
  namespace: <namespace>
spec:
  targetNamespaces:
  - <namespace>
```

* Add a subscription with the namespace being the one created or `openshift-operators`, to install the operator in All namespaces on the cluster.

```yaml
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: ibm-cp-integration
  namespace: <namespace>
spec:
  channel: v1.3
  name: ibm-cp-integration
  source: ibm-operator-catalog
  sourceNamespace: openshift-marketplace
```

### Event streams

## Reading Sources

* [Product documentation](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=installing-installation-options)
* [Red Hat marketplace for CP4I](https://marketplace.redhat.com/en-us/products/ibm-cloud-pak-for-integration)

# Cloud Pak for Automation

A quick summary and how to.

## Operators

* IBM Cloud platform foundation: build on two modules: 

    * Core services: RPA-driven automation, process mining, mongoDB for Identity and Access Management (IAM), metering, OpenID,..  Zen UI and event processor.
    * common services: Cloud Pak foundational services: (bedrock - common services) [Product doc](https://www.ibm.com/docs/en/cpfs). It includes IAM and certificate management.

   
* [BAI](https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/21.0.x?topic=services-business-automation-insights)

## Getting Started

All the URLs, user and password information, you need will be present in the `icp4adeploy-cp4ba-access-info` config map

```sh
oc describe cm icp4adeploy-cp4ba-access-info 
```


* check the Common service operator full version and deployed namespace

```
oc get csv --all-namespaces | grep common-service-
```


## Dependencies

### Deploying OpenLDAP

* [Article from  Garage team on how to deploy OpenLDAP server on OpenShift](https://medium.com/ibm-garage/how-to-host-and-deploy-an-openldap-sever-in-openshift-affab06a4365)
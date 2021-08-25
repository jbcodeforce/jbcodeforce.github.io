# Playground

## Use IBM open labs

Connect to the IBM [open lab home page]( https://developer.ibm.com/openlabs/openshift), Select `bring your own app` to start a cluster with 2 nodes.

Login to the cloud: `ibmcloud login --sso`

Get access to a temporary access code:

Do not select a region, and do not ipdate the cli. 

Access the Openshift cluster: oc login --server  https://.....

Verify nodes and services

```sh
oc get nodes 
oc get svc,deploy,po --all-namespaces
```

## Openshift try

[Red Hat OpenShift trial](https://www.openshift.com/try). With this environment we cannot create new project, only use two predefined projects.

## Having an image registry

We can use docker hub, quay.io or define a private registry:

* [ibm cloud container registry](https://cloud.ibm.com/docs/Registry?topic=Registry-getting-started#getting-started)  provides a multi-tenant private image registry that you can use to store and share your container images with users in your IBM Cloud account
* [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) we can share container software privately within your organization or publicly worldwide for anyone to discover and download. geo-replicated for high availability and faster downloads

To move one image from one registry to another use docker tag to change the image name:

```sh
docker tag <source_image>:<tag> <region>.icr.io/<my_namespace>/<new_image_repo>:<new_tag>
```

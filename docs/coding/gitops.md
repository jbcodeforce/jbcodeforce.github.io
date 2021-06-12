# GitOps

## GitOps

Developer and operation want to:

* Audit all changes made to pipelines, infrastructure, and application configuration.
* Roll forward/back to desired state in case of issues.
* Consistently configure all environments.
* Reduce manual effort by automating application and environment setup and remediation.
* Have an easy way to manage application and infrastructure state across clusters/environments

GitOps is a natural evolution of DevOps and Infrastructure-as-Code.

### Core principles

* Git is the source of truth.
* Separate application source code (Java/Go) from deployment manifests i.e the application source code and the GitOps configuration reside in separate git repositories.
* Deployment manifests are standard Kubernetes (k8s) manifests i.e Kubernetes manifests in the GitOps repository can be simply applied with nothing more than a oc apply.
* Kustomize for defining the differences between environments i.e reusable parameters with extra resources described using kustomization.yaml.

### Concepts

* Day 1 Operations are actions that users take to bootstrap a GitOps configuration. See [this note](https://github.com/redhat-developer/kam/tree/master/docs/journey/day1) on how to set up GitOps and Sealed Secret.
* [Day 2 Operations](https://github.com/redhat-developer/kam/tree/master/docs/journey/day2) are actions that users take to change a GitOps system.

### Supporting tooling

* [kam CLI from the Red Hat team gitops](https://github.com/redhat-developer/kam)
* Tekton
* ArgoCD

From the OperatorHub and install of the GitOps operators will also install the pipelines one.

## Playground

### Use IBM open labs

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

### Openshift try

[Red Hat OpenShift trial](https://www.openshift.com/try). With this environment we cannot create new project, only use two predefined projects.

## Kam

Goal: create a gitops project for an existing application service as day 1 operation and then add more service.

* Use the following kam command:

```sh
kam bootstrap \                
--service-repo-url https://github.com/jbcodeforce/refarch-eda-store-inventory \
--gitops-repo-url  https://github.com/jbcodeforce/refarch-eda-inventory-gitops \
--image-repo image-registry.openshift-image-registry.svc:5000/ibmcase/store-aggregator \
--output refarch-eda-inventory-gitops \
--git-host-access-token <agithubtoken> \
--prefix my-inventory --push-to-git=true
```
**Kam bug:**: the application name is marching the git repo name, and there will be an issue while creating binding with a limit of 
the number of characters.

This will create a gitops project, pushed to github.com as private repo. The repo includes two main folders:

* `environment` includes two environment definitions for dev and stage. 

  ```sh
      environments
    │   ├── my-inventory-dev
    │   │   ├── apps
    │   │   │   └── app-refarch-eda-store-inventory
    │   │   │       ├── base
    │   │   │       │   └── kustomization.yaml
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── overlays
    │   │   │       │   └── kustomization.yaml
    │   │   │       └── services
    │   │   │           └── refarch-eda-store-inventory
    │   │   │               ├── base
    │   │   │               │   ├── config
    │   │   │               │   │   ├── 100-deployment.yaml
    │   │   │               │   │   ├── 200-service.yaml
    │   │   │               │   │   ├── 300-route.yaml
    │   │   │               │   │   └── kustomization.yaml
    │   │   │               │   └── kustomization.yaml
    │   │   │               ├── kustomization.yaml
    │   │   │               └── overlays
    │   │   │                   └── kustomization.yaml
    │   │   └── env
    │   │       ├── base
    │   │       │   ├── argocd-admin.yaml
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── my-inventory-dev-environment.yaml
    │   │       │   └── my-inventory-dev-rolebinding.yaml
    │   │       └── overlays
    │   │           └── kustomization.yaml
    │   └── my-inventory-stage
    │       └── env
    │           ├── base
    │           │   ├── argocd-admin.yaml
    │           │   ├── kustomization.yaml
    │           │   └── my-inventory-stage-environment.yaml
    │           └── overlays
    │               └── kustomization.yaml
  ```

* `config` define argocd and cicd project to support deployment and build pipeline

  ```sh
    ├── config
    │   ├── argocd
    │   │   ├── argo-app.yaml
    │   │   ├── cicd-app.yaml
    │   │   ├── kustomization.yaml
    │   │   ├── my-inventory-dev-app-refarch-eda-store-inventory-app.yaml
    │   │   ├── my-inventory-dev-env-app.yaml
    │   │   └── my-inventory-stage-env-app.yaml
    │   └── my-inventory-cicd
    │       ├── base
    │       │   ├── 01-namespaces
    │       │   │   ├── cicd-environment.yaml
    │       │   │   └── ibmcase-environment.yaml
    │       │   ├── 02-rolebindings
    │       │   │   ├── argocd-admin.yaml
    │       │   │   ├── internal-registry-ibmcase-binding.yaml
    │       │   │   ├── pipeline-service-account.yaml
    │       │   │   ├── pipeline-service-role.yaml
    │       │   │   ├── pipeline-service-rolebinding.yaml
    │       │   │   └── sealed-secrets-aggregate-to-admin.yaml
    │       │   ├── 03-secrets
    │       │   │   ├── docker-config.yaml
    │       │   │   ├── git-host-access-token.yaml
    │       │   │   ├── gitops-webhook-secret.yaml
    │       │   │   └── webhook-secret-my-inventory-dev-refarch-eda-store-inventory.yaml
    │       │   ├── 04-tasks
    │       │   │   ├── deploy-from-source-task.yaml
    │       │   │   └── set-commit-status-task.yaml
    │       │   ├── 05-pipelines
    │       │   │   ├── app-ci-pipeline.yaml
    │       │   │   └── ci-dryrun-from-push-pipeline.yaml
    │       │   ├── 06-bindings
    │       │   │   ├── github-push-binding.yaml
    │       │   │   └── my-inventory-dev-app-refarch-eda-store-inventory-refarch-eda-store-inventory-binding.yaml
    │       │   ├── 07-templates
    │       │   │   ├── app-ci-build-from-push-template.yaml
    │       │   │   └── ci-dryrun-from-push-template.yaml
    │       │   ├── 08-eventlisteners
    │       │   │   └── cicd-event-listener.yaml
    │       │   ├── 09-routes
    │       │   │   └── gitops-webhook-event-listener.yaml
    │       │   └── kustomization.yaml
    │       └── overlays
    │           └── kustomization.yaml
  ```

The `environment` includes folders for each app of the solution.  In an app folder the `services` defines the manifests
to configure the application. When created the image reference `nginx` we need to build the image with a pipeline with [tekton](#tekton_tutorial). 
To bring up the argocd do `oc apply -k config/argocd/` which will create:

* three projects: my-inventory-cicd, my-inventory-dev, my-inventory-stage
* a set of role bindings, secrets...

To access the argocd application use the Grid icon in OpenShift console and admin user. The secret is define in `openshift-gitops` and secret name `argocd-cluster-cluster`. 

```sh
oc get secret argocd-cluster-cluster -n openshift-gitops -ojsonpath='{.data.admin\.password}' | base64 -d
```

## Tekton tutorial

Based on [OpenShift pipeline tutorial](https://github.com/openshift/pipelines-tutorial), [Red Hat scholar - tekton tutorial](https://redhat-scholars.github.io/tekton-tutorial) and [this blog](https://www.openshift.com/blog/cloud-native-ci-cd-with-openshift-pipelines), here is a quick summary;

* Tekton is a flexible, Kubernetes-native, open-source CI/CD framework that enables automating deployments across multiple platforms (Kubernetes, serverless, VMs, etc)
* Build images with Kubernetes tools such as S2I, Buildah, Buildpacks, Kaniko,...
* Concepts

    * Task: a reusable, loosely coupled number of steps that perform a specific task. Tasks are executed/run by creating TaskRuns. A TaskRun will schedule a Pod.
    * Pipeline: the definition of the pipeline and the Tasks that it should perform


### Administration steps

Tested on RedHat OpenShit Pipelines Operator version 1.2.3  6/10/21

* Install Openshift pipelines operator from the operator hub or using oc cli with an operator subscription like in []()
* Define a service account (created automatically)
* Ensure Tekton piplines is deployed and the API is available for use

  ```sh
  kubectl api-resources --api-group='tekton.dev'
  ```

### Developer's steps:

At the high level the generic steps are:

* Create custom task or install existing reusable Tasks
* Create a Pipeline and PipelineResources to define your application's delivery pipeline
* Create a PersistentVolumeClaim to provide the volume/filesystem for pipeline execution or provide a VolumeClaimTemplate which creates a PersistentVolumeClaim
* Create a PipelineRun to instantiate and invoke the pipeline

* Define a pipeline: generic pipeline takes the source code of the application from GitHub and then builds and deploys it on OpenShift.
Pipelines abstract away the specifics of the git source repository and image to be produced as PipelineResources or Params.

* Define task

```sh  
oc apply -f scripts-openshift-tekton/application/tasks
    oc apply -f scripts-openshift-tekton/application/pipelines
    oc apply -f scripts-openshift-tekton/application/pipelineruns
```

## Argocd tutorial

See [this getting started tutorial](https://argoproj.github.io/argo-cd/getting_started/) and the [core concept](https://argoproj.github.io/argo-cd/core_concepts/)

* Install argocd: this will includes CRD, service account, RBAC policies, config maps, secret and deploy: Redis and argocd server.
```sh
oc new-project argocd
oc apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
* It can be also installed via the Red Hat OpenShift GitOps operator. After installing the OpenShift GitOps 
operator, an instance of Argo CD is installed in the `openshift-gitops` namespace which has sufficent privileges 
for managing cluster configurations.

* Install argocd CLI

On MAC: `brew install argocd`

Within the student terminal in open lab

```sh
mkdir bin
curl -sSL -o ./bin/argocd https://github.com/argoproj/argo-cd/releases/download/$VERSION/argocd-linux-amd64
chmod +x ./bin/argocd
```

By default, the Argo CD API server is not exposed with an external IP. Update the service to use load balancer: 

```sh
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

The initial password for the admin account is auto-generated and stored as clear text in the field password in a secret named argocd-initial-admin-secret 

```
oc get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo ""
```

Get the IP address of the argocd server: `oc get svc` then look at the LoadBalancer service.

`argocd login SERVERIP`  then use admin user and the password retrieved previously.

Example of app definition in ArgoCD

```sh
argocd app create guestbook --repo https://github.com/argoproj/argocd-example-apps.git --path guestbook --dest-server https://kubernetes.default.svc  --dest-namespace mysandbox
```


Access ArgoCD UI with the same IP address, admin user and password. 

On the application tile, we can use the 'SYNC' to deploy the application or use `argocd app get guestbook`.

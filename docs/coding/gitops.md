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

### Supporting tools

* [kam CLI from the Red Hat team gitops](https://github.com/redhat-developer/kam)
* [Tekton](#tekton-tutorial)
* [ArgoCD](#argocd-tutorial)

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


## Tekton tutorial

This section is a summary based on [OpenShift pipeline tutorial](https://github.com/openshift/pipelines-tutorial), [Red Hat scholar - tekton tutorial](https://redhat-scholars.github.io/tekton-tutorial) and [this blog](https://www.openshift.com/blog/cloud-native-ci-cd-with-openshift-pipelines):

* Tekton is a flexible, Kubernetes-native, open-source CI/CD framework that enables automating deployments across multiple platforms (Kubernetes, serverless, VMs, etc)
* Build images with Kubernetes tools such as S2I, Buildah, Buildpacks, Kaniko,...
* With openshift pipelines operator, CRD, service account and cluster binding are created automatically:

  * install the operator via Operator Hub or using yaml:
  * Service accounts are named `builder` and `pipeline`
* Concepts

    * **Task**: a reusable, loosely coupled number of steps that perform a specific task. Tasks are executed/run by creating TaskRuns. A TaskRun will schedule a Pod. Task definitions are reusable.
    * **Pipeline**: the definition of the pipeline and the Tasks that it should perform
    * **Resources**: build uses resources called [PipelineResource](https://github.com/tektoncd/pipeline/blob/main/docs/resources.md) that helps to configure the git repo url, the final container image name etc

 ![](./images/tekton-res.png)

The task requires an input resource of type git that defines where the source is located. The git source is cloned to a local volume at path /workspace/git-source where git-source comes from the name we gave to the resource

### Administration steps

Tested on RedHat OpenShit Pipelines Operator version 1.2.3  6/10/21

* Install Openshift pipelines operator from the operator hub or using oc cli with an operator subscription like in [EDA lab inventory openshift pipelines](https://github.com/ibm-cloud-architecture/eda-lab-inventory/tree/master/environments/openshift-pipelines)
* Define a service account (created automatically by the operator)
* Ensure Tekton pipelines is deployed and the API is availabe for use

  ```sh
  kubectl api-resources --api-group='tekton.dev'
  ```

  Results

  ```
  NAME                SHORTNAMES   APIGROUP     NAMESPACED   KIND
  clustertasks                     tekton.dev   false        ClusterTask
  conditions                       tekton.dev   true         Condition
  pipelineresources                tekton.dev   true         PipelineResource
  pipelineruns        pr,prs       tekton.dev   true         PipelineRun
  pipelines                        tekton.dev   true         Pipeline
  runs                             tekton.dev   true         Run
  taskruns            tr,trs       tekton.dev   true         TaskRun
  tasks                            tekton.dev   true         Task
  ```

### Developer's steps:

At the high level the generic steps are:

* Create custom task or install existing reusable Tasks
* Create a Pipeline and PipelineResources to define your application's delivery pipeline
* Create a PersistentVolumeClaim to provide the volume/filesystem for the pipeline execution or provide a VolumeClaimTemplate which creates a PersistentVolumeClaim
* Create a PipelineRun to instantiate and invoke the pipeline

#### Define task

We need to have task to build the application executable, to build the docker image, push to the image registry and
potentially deploy to the target runtime project. This last task is in fact done with ArgoCD.

* first task is to clone a repo. In the [Tekton hub](https://hub.tekton.dev/) we can find the yaml for this task. But with the OpenShift pipeline operator, it is part of the clustertask:

  ```sh
  tkn  clustertask describe git-clone
  ```
  So we do not need to redefine this task. If we really need to get the last release of a task we can use a command like:

  ```sh
  kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/git-clone/0.3/git-clone.yaml
  ```

  The **workspace** directory is where your Task/Pipeline sources/build artifacts will be cloned and generated. 
  
  See next pipeline section to see how to configure this git-clone.

* Define a Task to build a quarkus app: this is done by using the maven clustertask: `tkn  clustertask describe maven `


The **source** is a sub-path, under which Tekton cloned the application sources

* Other task example to apply kubernetes manifests ([apply-manifests](https://raw.githubusercontent.com/openshift/pipelines-tutorial/pipelines-1.4/01_pipeline/01_apply_manifest_task.yaml)) to deploy an image.

* or [update-deployment](https://raw.githubusercontent.com/openshift/pipelines-tutorial/pipelines-1.4/01_pipeline/02_update_deployment_task.yaml) task to path the application deployment with a new `image name:tag`.

The tasks are by default tied to namespace. **ClusterTask** makes the task available in all namespaces

* list task: 

```sh
tkn task list
``` 

and use next command to list the Operator-installed additional cluster tasks such as buildah

```sh
tkn clustertasks list
``` 

* [Tekton Hub where to find reusable tasks and pipelines](https://hub.tekton.dev/)

  * [git-clone](https://hub.tekton.dev/tekton/task/git-clone) has url as input and a workspace to clone code to.

#### Create pipelines

A Pipeline is a collection of Tasks that you define and arrange in a specific order of execution as part of your continuous integration flow
Generic pipeline takes the source code of the application from GitHub and then builds jar and docker image and deploys it on OpenShift. The deployment can also being done with ArgoCD.

A Pipeline requires PipelineResources to provide inputs and store outputs for the Tasks that comprise it.

* Declare the pipeline in a yaml file like [tutorial build and deploy](https://raw.githubusercontent.com/openshift/pipelines-tutorial/pipelines-1.4/01_pipeline/04_pipeline.yaml)
* Example of git clone task declared in a pipeline. It uses the pipeline parameters to get URL and revision.

  ```yaml
  tasks:
    - name: fetch-source
      taskRef:
        name: git-clone
      workspaces:
      - name: output
        workspace: build-ws
      params:
      - name: url
        value: $(params.repo-url)
      - name: revision
        value: $(params.revision)
  ```

  it has to specify a `workspace` as target for the clone. This workspace is declare in the pipeline, and the names must match

  ```yaml
  spec:
  params:
  - name: repo-url
    type: string
    description: The git repository URL to clone from.
  - name: revision
    type: string
    description: The git tag to clone.
  workspaces:
    - name: build-ws
  ```

  This workspace will be specified in the pipelinerun (as well as url and revision):

  ```yaml
  apiVersion: tekton.dev/v1beta1
  kind: PipelineRun
  metadata:
    generateName: build-quarkus-app-result-
  spec:
    pipelineRef:
      name: build-quarkus-app
    workspaces:
    - name: build-ws
      emptyDir: {}
  ```

* Execute it

```sh
tkn pipeline start build-and-deploy \
    -w name=shared-workspace,volumeClaimTemplateFile=https://raw.githubusercontent.com/openshift/pipelines-tutorial/pipelines-1.4/01_pipeline/03_persistent_volume_claim.yaml \
    -p deployment-name=pipelines-vote-api \
    -p git-url=https://github.com/openshift/pipelines-vote-api.git \
    -p IMAGE=image-registry.openshift-image-registry.svc:5000/pipelines-tutorial/pipelines-vote-api
```

* List pipeline runs

```sh
tkn pipelinerun list
```

```sh  
oc apply -f scripts-openshift-tekton/application/tasks
    oc apply -f scripts-openshift-tekton/application/pipelines
    oc apply -f scripts-openshift-tekton/application/pipelineruns
```

* Define a pipeline: 

#### Some potential errors

* Build faild to access internal registry with `x509: certificate signed by unknown authority`. 
We may need to do not verify TLS while pushing image to the internal docker registry or use a public registry

### Other readings

* [Tekton dev documentation](https://tekton.dev/docs/)
* [Deploy a Knative application using Tekton Pipelines](https://developer.ibm.com/tutorials/knative-build-app-development-with-tekton/)


## ArgoCD tutorial

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
the number of characters. kam boostrap need a --service-name argument.

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
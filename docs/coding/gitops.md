# GitOps

[Gitops](https://www.gitops.tech/)  is a way of implementing Continuous Deployment for cloud native applications.

The core idea of GitOps is having a Git repository that always contains declarative descriptions 
of the infrastructure currently desired in the production environment and an automated process 
to make the production environment match the described state in the repository.

From the infrastructure point of view, we want to control the governance of the infrastructure and be 
sure that what is expected, is what happened.

## Needs

Developer and operation teams want to:

* Audit all changes made to pipelines, infrastructure, and application configuration.
* Roll forward/back to desired state in case of issues.
* Consistently configure all environments.
* Reduce manual effort by automating application and environment setup and remediation.
* Have an easy way to manage application and infrastructure state across clusters/environments

GitOps is a natural evolution of DevOps and Infrastructure-as-Code.

## Core principles

* Git is the source of truth for both application code, application configuration, dependant service/product deployments, infrastructure config and deployment.
* Separate application source code (Java/Go) from deployment manifests i.e the application source code and the GitOps configuration reside in separate git repositories.
* Deployment manifests are standard Kubernetes (k8s) manifests i.e Kubernetes manifests in the GitOps repository can be simply applied with nothing more than a `oc apply`.
* [Kustomize.io](https://kustomize.io/) for defining the differences between environments i.e reusable parameters with extra resources described using `kustomization.yaml`.
* Minimize yaml duplication - no copy/paste
* Support two axis of configuration: clusters and environments: prod, test, dev. Accept separating production repo if organization is willing to do so.
* Prefer a multi-folder and/or multi-repo structure over multi-branch. Avoid dev or test configuration in different branches. In a microservices world, a one branch per environment will quickly lead to an explosion of branches which again becomes difficult and cumbersome to maintain.
* Minimize specific gitops tool dependencies: (Try to converge like to Tekton and ArgoCD)
* Do not put independent applications or applications managed by different teams in the same repo. 

## Concepts

* [Day 1 Operations](https://github.com/redhat-developer/kam/tree/master/docs/journey/day1) are actions that users take to bootstrap a GitOps configuration and on how to set up GitOps and Sealed Secret.
* [Day 2 Operations](https://github.com/redhat-developer/kam/tree/master/docs/journey/day2) are actions that users take to change a GitOps system.

Using continuous delivery approach and tool like ArgoCD, the deployment of all the components is controlled by the tool from the Gitops repositories

## Supporting tools

* [kam CLI from the Red Hat gitops team ](https://github.com/redhat-developer/kam)
* [Tekton](#tekton-tutorial) for continuous integration and even deployment
* [ArgoCD](#argocd-tutorial) for continuous deployment
* [Kustomize.io](https://kustomize.io/)

## Proposed project structure

Use a three level structure, that will match team structure and git repo structure:

* application: deployment.yaml, config map... for each application, 
* shared services like Kafka, Database, LDAP,... as reusable services between environments
* Cluster and infrastructure: network, cluster, storage, policies...

So for each "solution" those three levels will be separate repository:

* <solution_name>-gitops-apps
* <solution_name>-gitops-services
* <solution_name>-gitops-infra

Now the different deployment environments can be using different k8s clusters or the same cluster with different namespaces.

With the adoption of ArgoCD we can have one bootstrap app that start apps to monitor each of those layers.

### Services 

For the Service level, try to adopt catalog repositories to hold common elements that will be re-used across teams and other repositories. See example in [Red Hat Canada Catalog git repo](https://github.com/redhat-canada-gitops/catalog)

Use Kustomization to reference remote repositories as a base or resource and then patch it as needed to meet your specific requirements.

Reference the common repository via a tag or commit ID.

In many organizations we may have few different common repositories maintained by different teams: operation with cluster configuration,
services like Nexus, Sonarqube, argo... from devops team, and then apps team.

### Application

For Application repositories, align your repositories along application and team boundaries: one gitops
repo per application, different folders for microservices and deployable components. 

Use bootstrap folder to load the application components into the cluster: this could be an ArdoCD app.

Namespaces should be created in environment or cluster folders.

Use Overlay for the different app configuration depending of the target environment.

Dedicated a folder (tekton) for pipelines, tasks.

If you find you are duplicating argoCD manifests in the bootstrap folder, then create a separate high 
level `argocd` folder.

* [Cluster Configuration](https://github.com/gnunn-gitops/cluster-config). This repo shows how Gerald Nunn configures OpenShift clusters using GitOps with ArgoCD.
* [Product Catalog](https://github.com/gnunn-gitops/product-catalog) example of a 3 tier app with ArgoCD, tekton and kustomize. (From Gerald Nunn )
* [real time inventory demo gitops](https://github.com/ibm-cloud-architecture/eda-lab-inventory) my own demo gitops

### Process

A key question in any gitops scenario is how to manage promotion of changes in manifests between different environments and clusters. 

Some principles to observe:

* Every change in the manifests needs to flow through the environments in hierarchical order, i.e. (dev > test > prod)
* We do not want a change to a base flowing to all environments simultaneously
* Tie specific environments to specific revisions so that changes in the repo can be promoted in a controlled manner
We can manage the revision in the gitops tools or in kustomize or both.


## OpenShift Pipelines

OpenShift Pipelines is a Continuous Integration / Continuous Delivery (CI/CD) solution based on the open source Tekton project. 
The key objective of Tekton is to enable development teams to quickly create pipelines of activity from simple, repeatable steps.
A unique characteristic of Tekton that differentiates it from previous CI/CD solutions is that Tekton steps execute within
 a container that is specifically created just for that task.

Users can interact with OpenShift Pipelines using the web user interface, command line interface, and via a Visual Studio Code editor plugin. 
The command line access is a mixture of the OpenShift `oc` command line utility 
and the `tkn` command line for specific Tekton commands. 
The `tkn` and `oc` command line utilities can be downloaded from the OpenShift console web user interface. 
To do this, simply press the white circle containing a black question mark near your name on the top right 
corner and then select Command Line Tools:

![CLI tools](./images/clitools.jpg)

## Kustomize and gitops

There are at least two repositories: the **application** repository and the **environment configuration** repository.

There are two ways to implement the deployment strategy for GitOps: 

* **Push-based:** use CI/CD tools like jenkins, travis... to define a pipeline, triggered when application code source is updated, to build the container image and deploy the modified yaml files to the environment repo. Changes to the environment configuration repository trigger the deployment pipeline. It has to be used for running an automated provisioning of cloud infrastructure. See also [this tutorial](https://cloud.google.com/kubernetes-engine/docs/tutorials/gitops-cloud-build).
* **Pull-based:** An operator takes over the role of the pipeline by continuously comparing the desired state in the environment repository with the actual state in the deployed infrastructure.

A CICD based on git action will build the image and edit Kustomize patch to bump the expected container tag using the new docker image tag, then commit this changes to the gitops repo.

[Kustomize](https://kustomize.io/) is used to simplify the configuration of application and environment. Kustomize traverses a Kubernetes manifest to add, remove or update configuration options without forking. It is available both as a standalone binary and as a native feature of Kubectl. A [lot of examples here.](https://github.com/kubernetes-sigs/kustomize/tree/master/examples).

The simple way to organize the configuration is to use one `kustomize` folder, then one folder per component, then one overlay folder in which environment folder include `kustomization.yaml` file with patches.

```
└── postgres
    ├── base
    │   ├── configmap.yaml
    │   ├── kustomization.yaml
    │   ├── pvc.yaml
    │   ├── secret.yaml
    │   ├── service-account.yaml
    │   ├── statefulset.yaml
    │   ├── svc-headless.yaml
    │   └── svc.yaml
    ├── kustomization.yaml
    └── overlays
        └── dev
            ├── kustomization.yaml
            └── secret.yaml
```

Here is an example of `kustomization.yaml`:

```
bases:
  - ../../base
patchesStrategicMerge:
  - ./secret.yaml
```

The `patchesStrategicMerge` lists the resource configuration YAML files that you want to merge to the base kustomization. You must also add these files to the same repo as the kustomization file, such as `overlay/dev`. These resource configuration files can contain small changes that are merged to the base configuration files of the same name as a patch.


In GitOps, the pipeline does not finish with something like `oc apply..`. but it’s an external tool (Argo CD or Flux) that detects the drift in the Git repository and will run these commands.

Here is a command to install ArgoCD on k8s, see [details here](https://argoproj.github.io/argo-cd/getting_started/).

```
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

For OpenShift:

* create an `argocd` project
* use operator hub, and install the operator in this project. Nothing to change in the default configuration
* deploy one instance of ArgoCD with the following customization:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ArgoCD
metadata:
  name: argocd
  namespace: argocd
spec:
  server:
    ingress:
      enabled: true
    route: 
      enabled: true
  dex:
    openShiftOAuth: true
    image: quay.io/ablock/dex
    version: openshift-connector
  rbac:
    policy: |
      g, system:cluster-admins, role:admin
```


An example of gitops with kustomize is in this [vaccine-gitops repo](https://github.com/ibm-cloud-architecture/vaccine-gitops)

### Future readings

* [GitOps - Operations by Pull Request](https://www.weave.works/blog/gitops-operations-by-pull-request)

## KAM - Gitops Application Manager

[KAM](https://github.com/redhat-developer/kam)'s goal: Help to create a gitops project for an existing application service as 
[day 1 operations](https://github.com/redhat-developer/kam/tree/master/docs/journey/day1) and then add more services as part of day 2.

* To install download the last release from github: [https://github.com/redhat-developer/kam/releases/latest](https://github.com/redhat-developer/kam/releases/latest). Rename the download file, and move it to `/usr/local/bin`.

### Creating a gitops project for a given solution

Use the following kam command to create a gitops repository with multiple argocd applications. To run successfully, we need to be connected
to OpenShift cluster with Sealed Secret GitOps and Pipelines operators deployed, get SSH key from github if private repositories are used

```sh
# list the  options
kam bootstrap -- 
# create a gitops 
kam bootstrap \
--service-repo-url https://github.com/jbcodeforce/refarch-eda-store-inventory \
--gitops-repo-url  https://github.com/jbcodeforce/rt-inventory-gitops \
--image-repo image-registry.openshift-image-registry.svc:5000/ibmcase/store-aggregator \
--output refarch-eda-inventory-gitops \
--git-host-access-token <agithubtoken> \
--prefix rt-inventory --push-to-git=true
```

To retrieve [the github access token](https://github.com/redhat-developer/kam/blob/master/docs/journey/day1/prerequisites/github_access_token_steps.md).

**Kam bug:**: the application name is matching the git repo name, and there will be an issue while creating binding with a limit of 
the number of characters. kam boostrap need a --service-name argument.

This will create a gitops project, pushed to github.com as private repo. The repo includes two main folders and a 
`pipelines.yaml` describing your first application, and configuration for a complete CI pipeline and deployments from Argo CD

### What is inside

#### Config

`config` define argocd and cicd Argo application to support deployment and build pipeline

  ```sh
    ├── config
    │   ├── argocd
    │   │   ├── argo-app.yaml
    │   │   ├── cicd-app.yaml
    │   │   ├── kustomization.yaml
    │   │   ├── rt-inventory-dev-app-refarch-eda-store-inventory-app.yaml
    │   │   ├── rt-inventory-dev-env-app.yaml
    │   │   └── rt-inventory-stage-env-app.yaml
    │   └── rt-inventory-cicd
    │       ├── base
    │       │   ├── 01-namespaces
    │       │   │   └── cicd-environment.yaml
    │       │   ├── 02-rolebindings
    │       │   │   ├── argocd-admin.yaml
    │       │   │   ├── pipeline-service-account.yaml
    │       │   │   ├── pipeline-service-role.yaml
    │       │   │   └── pipeline-service-rolebinding.yaml
    │       │   ├── 03-tasks
    │       │   │   ├── deploy-from-source-task.yaml
    │       │   │   └── set-commit-status-task.yaml
    │       │   ├── 04-pipelines
    │       │   │   ├── app-ci-pipeline.yaml
    │       │   │   └── ci-dryrun-from-push-pipeline.yaml
    │       │   ├── 05-bindings
    │       │   │   ├── github-push-binding.yaml
    │       │   │   └── rt-inventory-dev-app-refarch-eda-store-simulator-refarch-eda-store-simulator-binding.yaml
    │       │   ├── 06-templates
    │       │   │   ├── app-ci-build-from-push-template.yaml
    │       │   │   └── ci-dryrun-from-push-template.yaml
    │       │   ├── 07-eventlisteners
    │       │   │   └── cicd-event-listener.yaml
    │       │   ├── 08-routes
    │       │   │   └── gitops-webhook-event-listener.yaml
    │       │   └── kustomization.yaml
    │       └── overlays
    │           └── kustomization.yaml
  ```

So major elements of this configuration:

* **argo-app**: root application to manage the other applications: It points to the kustomization.yaml under `config/argocd` so when adding new microservice to the solution using `kam cli` then this kustomize will be updated triggering a new argo app to be created  
    - argo-app.yaml
    - cicd-app.yaml
    - rt-inventory-dev-app-refarch-eda-store-simulator-app.yaml
    - rt-inventory-dev-env-app.yaml
    - rt-inventory-stage-env-app.yaml
* **cicd-app**: Argo app to monitor `config/rt-inventory-cicd/overlays` which defines `-cicd` namespace, `pipeline` service account, then role bindings. 
And it also defines Tekton tasks, pipelines, triggers... 
* **rt-inventory-dev-env-app**: Argo app to monitor `environments/rt-inventory-dev/env/overlays` which defines the NameSpace, Service Account, RoleBindings, for a `dev` environment. 
* **rt-inventory-dev-app-refarch-eda-store-simulator**: Argo app to monitor `environments/rt-inventory-dev/apps/app-refarch-eda-store-simulator/overlays`

#### Environment

`environment` includes two environment definitions for dev and stage. For each environment the `apps` folder includes
the deployment of all the apps part of the solution and then a `env` folder to define the dev namespace, role bindings... 

  ```sh
      environments
    │   ├── rt-inventory-dev
    │   │   ├── apps
    │   │   │   └── app-refarch-eda-store-inventory
                  ..... SEE BELOW
    │   │   └── env
    │   │       ├── base
    │   │       │   ├── argocd-admin.yaml
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── my-inventory-dev-environment.yaml
    │   │       │   └── my-inventory-dev-rolebinding.yaml
    │   │       └── overlays
    │   │           └── kustomization.yaml
    │   └── rt-inventory-stage
    │       └── env
    │           ├── base
    │           │   ├── argocd-admin.yaml
    │           │   ├── kustomization.yaml
    │           │   ├── rt-inventory-stage-environment.yaml
    │           │   
    │           └── overlays
    │               └── kustomization.yaml
  ```

In an `app` folder the `services/.../base/config` defines the manifests to configure the application. This is where we can put
the app specific.

```
│   ├── rt-inventory-dev
│   │   ├── apps
│   │   │   └── app-refarch-eda-store-simulator
│   │   │       ├── base
│   │   │       │   └── kustomization.yaml
│   │   │       ├── kustomization.yaml
│   │   │       ├── overlays
│   │   │       │   └── kustomization.yaml
│   │   │       └── services
│   │   │           └── refarch-eda-store-simulator
│   │   │               ├── base
│   │   │               │   ├── config
│   │   │               │   │   ├── 100-deployment.yaml
│   │   │               │   │   ├── 200-service.yaml
│   │   │               │   │   ├── 300-route.yaml
│   │   │               │   │   └── kustomization.yaml
│   │   │               │   └── kustomization.yaml
│   │   │               ├── kustomization.yaml
│   │   │               └── overlays
│   │   │                   └── kustomization.yaml

```

### secrets

At the same level as the gitops folder there is a secrets folder to be used to managed secrets without getting them into git.

The approach is to us [Bitmani Sealed Secret](https://engineering.bitnami.com/articles/sealed-secrets.html):

*Sealed Secrets are a "one-way" encrypted Secret that can be created by anyone, but can only be decrypted by the controller running in the target cluster.*


* Install the Sealed Secret Operator in `sealed-secrets` project
* Create a Sealed secret controller for ex named: `sealedsecretcontroller`
* Then for each secrets in `secrets` folder do something

```sh
cat gitops-webhook-secret.yaml| kubeseal --controller-namespace sealed-secrets \
--controller-name sealedsecretcontroller-sealed-secrets --format yaml >gitops-webhook-sealedsecret.yaml

```

Each sealed secret can be in github, and applied to k8s to <> namespace.

```sh

```

### What to do from there

1. Change the `environments/<>-dev/apps/app-<appname>/services/<appname>/base/config` withe th kustomization of your microservice.
2. To bring up the argocd do `oc apply -k config/argocd/` which will create:

    * three Argo applications to monitor CI/CD, Dev and Staging environments: rt-inventory-cicd, rt-inventory-dev, rt-inventory-stage
    * One Argo Application per services to deploy: the following figure has only one of such service.
    ![](./images/argo-rt-inv.png)
    * Three OpensShift projects: one for cicd, one per target 'environments' (dev, stage)

3. Part of the configuration bootstraps a simple `OpenShift Pipelines` pipeline for building code when a pull-request is opened.

## Some notes to integrate

Install Sealed Secrets operator
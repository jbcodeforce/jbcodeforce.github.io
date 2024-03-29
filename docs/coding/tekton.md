# Tekton tutorial

This article is a summary based on [OpenShift pipeline tutorial](https://github.com/OpenShift/pipelines-tutorial), [Red Hat scholar - tekton tutorial](https://redhat-scholars.github.io/tekton-tutorial), [this blog](https://cloud.redhat.com/blog/cloud-native-ci-cd-with-openshift-pipelines) and
a log of painful experiences.

* Tekton is a flexible, Kubernetes-native, open-source CI/CD framework that enables automating deployments across multiple platforms (Kubernetes, serverless, VMs, etc)
* Build images with Kubernetes tools such as S2I, Buildah, Buildpacks, Kaniko,...
* With [OpenShift Pipelines](https://docs.openshift.com/container-platform/4.8/cicd/pipelines/creating-applications-with-cicd-pipelines.html) operator, CRD, service account and cluster binding are created automatically.

## Concepts

* **Task**: is a reusable, loosely coupled number of steps that perform a specific ci or cd task. 
Tasks are executed by creating TaskRuns. A TaskRun will schedule a Pod. Each step 
can contain elements such as command, script, volumeMounts, workingDir, parameters, resources, workspace, or image. 
* **Pipeline**: is the definition of the chaining of tasks to perform
* **Resources**: build uses resources called [PipelineResource](https://github.com/tektoncd/pipeline/blob/main/docs/resources.md) to help configuring the source git repo url,
 the final container image name.

 ![Tekton elements](./images/tekton-res.png)

Task requires an input resource of type `git` which defines where the source is located. 
The git source is cloned to a local volume at path `/workspace/source` where `source` comes
from the name we gave to the resource.

In Pipeline, the Tasks are arranged in a specific order of execution as part of our continuous integration flow:

![TektonRR](./images/tektonresourcerelationship-13.jpg)

The <em>pipelineRun</em> invokes the pipeline. 

The pipelines can be triggered by events coming from GitHub. To do so Tekton defines the following constructs:

* **Triggers** help to hook our Pipelines to respond to external github (or other csm tools) events. 
Trigger combines TriggerTemplate, TriggerBindings and interceptors. They are used as reference inside the EventListener.
* **TriggerTemplate** is a resource which have parameters that can be substituted anywhere 
within the resources of template. It is mapped to a PipelineRun.
* **TriggerBindings** is a map to capture fields from an github events, store them 
as parameters, and replace them in TriggerTemplate whenever an event occurs. Here is an extract of
such trigger binding definition:

```yaml
apiVersion: triggers.tekton.dev/v1alpha1
kind: TriggerBinding
metadata:
  creationTimestamp: null
  name: github-push-binding
  namespace: risk-scoring-cicd
spec:
  params:
  - name: gitrepositoryurl
    value: $(body.repository.clone_url)
  - name: fullname
    value: $(body.repository.full_name)
```


* **[Event Listener](https://tekton.dev/vault/triggers-v0.6.1/eventlisteners/)** sets up a Service and listens for events in JSON format.
It connects a TriggerTemplate to a TriggerBinding, into an addressable endpoint. Each EventListener can consist of one or more triggers.
The `triggers.bingings` section list the bindings to use and the name of `TriggerTemplate` to use.
Bindings may have `interceptors` to modify payload or behavior on the events:

```yaml
    interceptors:
    - github:
        secretRef:
          secretKey: webhook-secret-key
          secretName: gitops-webhook-secret
    - cel:
        filter: (header.match('X-GitHub-Event', 'push') && body.repository.full_name
          == 'jbcodeforce/ads-risk-scoring-gitops')
        overlays:
        - expression: body.ref.split('/')[2]
          key: ref
```

`GitHub Interceptors` contain logic to validate and filter webhook events that come from GitHub. 
To use this Interceptor as a filter, add the event types you would like to accept to the eventTypes field.

For example, the CEL interceptors above is used to get only push events from a specif repo.

To use those triggers, we need to define a webhook in the source git repository (using Settings > Webhooks > Add webhook), so `push` events can be sent
to the event listener. The Webhook URL end point is retrieved by getting the route of the event listener for the cicd project:

```sh
oc get route -n solution-cicd
```

Here is a diagram to represent the relationship between all those elements:

![](./images/tekton-elements.png)

* Event Listener is exposed via a route so the Github webhook for the application source repository can send push events to the listener
* Most likely the event listener may use secret to avoid having any repo using the pipelines. The secret may be defined
in OpenShift and then added to the webhook definition or defined in the git repo and added as secret and then
defined in the event listener:

   ```yaml
   github:
        secretRef:
          secretKey: webhook-secret-key
          secretName: gitops-webhook-secret
   ```
* The event listener links template and triggers.
* Triggers defines the binding and interceptors that will process the HTTP POST request coming from github. 
* Trigger template defines pipeline run
* PipelineRun reference pipeline definition and optionally resources.

As `PipelineRun` are defined inside the `TriggerTemplate`, they are specifics to each application to build. 

## Installation

* Install the operator via OpenShift Operator Hub (Search pipeline) or using yaml: 
  
  ```sh
    # under https://github.com/jbcodeforce/eda-gitops-catalog
    oc apply -k openshift-pipelines-operator/overlays/stable
  ```

  Attention not all versions are compatible between OpenShift version.

* Define a service account `pipeline` (created automatically by the OpenShift Pipeline Operator)
* Ensure Tekton pipelines is deployed and the API is available for use

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

* Install the [tkn CLI](https://docs.openshift.com/container-platform/4.7/cli_reference/tkn_cli/installing-tkn.html)

> 09/30/2021 There is an issue on IBM ROKS as of now where the the buildah task to build docker image container needs to
run with privileged. So we need to add security constraint to the `pipeline` service account. 
Normally the command: 

>   ```sh
>   oc adm policy add-scc-to-user privileged -z pipeline
>   ```

> performed under the cicd project, should add the user to the `privileged` security constraint. It may not work on OCP 4.7+ so
> we need to add it manually (see line 12 in screen shot below):

>  ![](./images/scc-privileged.png)

## Developer's steps:

At the high level, the generic steps to perform for a given application are:

* [Create custom task](#define-tasks) to define how to build your app or install existing reusable Tasks.
* Create [PipelineResources](#define-resources) to specify the github source repository and the docker image name to create.
* Create a [Pipeline](#create-pipeline) to define your application's delivery pipeline. If the pipeline uses different resources,
use a workspace with PVC to share data between tasks.
* Create a PersistentVolumeClaim to provide the volume/filesystem for the pipeline execution or provide a VolumeClaimTemplate which creates a PersistentVolumeClaim
* Create a PipelineRun to instantiate and invoke the pipeline
* Add triggers to capture events in the source repository that are propagated by webhook.

### Define tasks

Task contains at least one step to be executed to perform a useful function. TaskRuns are docker containers,
running in one pod.
Tasks execute steps in the order in which they are written, with each step completing before the next step starts. While `Pipelines` execute tasks
 in parallel unless a task is directed to run after the completion of another task. This facilitates parallel execution of build / test / deploy 
 activities and is a useful characteristic that guides the user in the grouping of steps within tasks.

Tekton can also being used to deploy images freshly built. But  with the adoption of GitOps
practices, this deployment task is in fact done with ArgoCD applications.

* A first task is to clone a repo. In the [Tekton hub](https://hub.tekton.dev/) we can find the yaml 
for this task. But with the OpenShift Pipeline operator, it is part of the clustertask:

  ```sh
  # List predefined task at the 'cluster level'
  tkn clustertask list
  # See a particular task like git-clone
  tkn  clustertask describe git-clone
  ```
  
  So we do not need to redefine this task. If we really need to get the last release of a task we can use a command like:

  ```sh
  oc apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/git-clone/0.3/git-clone.yaml
  ```

  Here is an example of using this task in a pipeline

  ```yaml
  tasks:
    - name: fetch-source
      taskRef:
        name: git-clone
        kind: ClusterTask
      workspaces:
      - name: output
        workspace: build-ws
      params:
      - name: url
        value: $(params.repo-url)
      - name: revision
        value: $(params.revision)
  ```

  The **workspace** is where our Task/Pipeline sources/build artifacts will be cloned and generated. 
  
  See [next pipeline section](#create-pipeline) for how to configure the `git-clone` task.

  **Remarks:** when using resource of type git then a clone will be done implicitly, therefore this task is not needed.

* Define a Task to build a quarkus app: this is done by using the maven task: `tkn task describe maven` or by using
custom task based on the maven docker image. 

To use the Tekton predefined [maven task](https://hub.tekton.dev/tekton/task/maven), do:

  ```sh
  oc  apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/maven/0.2/maven.yaml
  ```

  There is an alternative: define the image to use for a step of the task.

The **source** is a sub-path, under which Tekton cloned the application sources.

* Other task example to apply Kubernetes manifests ([apply-manifests](https://raw.githubusercontent.com/OpenShift/pipelines-tutorial/pipelines-1.4/01_pipeline/01_apply_manifest_task.yaml)) to deploy an image.
or [update-deployment](https://raw.githubusercontent.com/OpenShift/pipelines-tutorial/pipelines-1.4/01_pipeline/02_update_deployment_task.yaml) task to path the application deployment with a new `image name:tag`.

The tasks are by default tied to a namespace. **ClusterTask** makes the task available in all namespaces.

* list the tasks defined in current project: 

```sh
tkn task list
``` 

and use next command to list the Operator-installed additional cluster tasks such as `buildah`...

```sh
tkn clustertasks list
``` 

* In [Tekton Hub we may find reusable tasks and pipelines](https://hub.tekton.dev/) like:

  * [git-clone](https://hub.tekton.dev/tekton/task/git-clone) has url as input and a workspace to clone code to.
  * [maven](https://hub.tekton.dev/tekton/task/maven)
  * [buildah](https://hub.tekton.dev/tekton/task/buildah) builds source into a container image and then pushes it to a container registry

  ```sh
  tkn clustertask describe buildah
  ```

#### Define custom buildah task

The buildah wants to run with privileged access, so we need a custom task to use security constraint.

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: build-dr-image
spec:
   ....
  steps:
    - name: build-image
      image: quay.io/buildah/stable:v1.15.0
      securityContext:
        privileged: true
      ...

```

Be sure the `pipeline` service account is part of the scc named `privileged`, see the SCC declaration presented in a section above.

### Define resources

A reference to the resource is declared within the task and then the steps use the resources in the commands. 
A resource can be used as an output in a step within the task.

In Tekton, there is no explicit Git pull command. Simply including a Git resource in a task definition will result 
in a Git pull action taking place, before any steps execute, which will pull the content of the Git repository 
to a location of `/workspace/<git-resource-name>`. 
In the example below the Git repository content is pulled to the implicit folder: `/workspace/source`.

```yaml
kind: Task
 resources:
   inputs:
     - name: source
       type: git
   outputs:
     - name: intermediate-image
       type: image
 steps :
   - name: build
```

PipelineResource defines resources to be used as input or output to task and pipeline, they are reusable. 

*It looks it is still in alpha release as of sept 2021.*

Example of PipelineResource for git repo:

```yaml
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: item-inventory-source
spec:
  type: git
  params:
    - name: url
      value: https://github.com/ibm-cloud-architecture/refarch-eda-item-inventory
    - name: revision
      value: master
```

See [other resource definitions](https://github.com/ibm-cloud-architecture/refarch-eda-item-inventory/tree/master/build/resources.yaml) like docker image names.

* get list of resources defined in the project:

 ```sh
 tkn res ls
 ```

### Create pipeline

Generic pipeline takes the source code of the application from GitHub and then builds jar and docker image, and deploys image to OpenShift. 
The deployment part of the pipeline definition could also being done with ArgoCD application.

* `volumeMounts` allows us to add storage to a step. Since each step runs in an isolated container, 
any data that is created by a step for use by another step must be stored. 
If the data is accessed by a subsequent step within the same task then it is possible to use the `/workspace` directory
 to hold any created files and directories. 
A further option for steps within the same task is to use an emptyDir storage mechanism which can be useful for separating 
out different data content for ease of use. If file is to be accessed by a subsequent step that is in a 
different task then a Kubernetes persistent volume claim is required to be used. 

> Note that volumes are defined in a section of the task outside the scope of any steps, and then each step that needs the volume will mount it. 

* The `workingDir` element refers to the path within the container that should be the current working directory when the command is executed.
* `parameters`: As with volumeMounts, parameters are defined outside the scope of any step within a task and then they are referenced from within the step. 
Parameters, in this case, refer to any information in text form required by a step such as a path, a name of an object, a username etc.  

* A `workspace` is similar to a volume in that it provides storage that can be shared across multiple tasks. 
A persistent volume claim 
is required and then the volume is declared within the pipeline and task before mapping the 
workspace into an individual step. Workspaces and volumes are similar in behavior but are defined in
 slightly different places.

* `Image`: Since each Tekton step runs within its own image, the image must be referenced as shown in the example below:

  ```yaml
  steps :
    - name: build
      command:
        - buildah
        - bud
        - '-t'
        - $(resources.outputs.intermediate-image.url)
      image: registry.redhat.io/rhel8/buildah
  ```

A Pipeline requires PipelineResources to provide inputs and store outputs for the Tasks that comprise it.

* Declare the pipeline in a yaml file like [tutorial build and deploy](https://raw.githubusercontent.com/OpenShift/pipelines-tutorial/pipelines-1.4/01_pipeline/04_pipeline.yaml) 
or the [item inventory aggregator pipeline in rt-inventory-gitops](https://github.com/jbcodeforce/rt-inventory-gitops/blob/main/config/rt-inventory-cicd/base/04-pipelines/quarkus-pipeline.yaml)
* In previous section there is an example of git clone task declared in a pipeline. It uses the pipeline parameters to get URL and revision and output to the workspace.

The workspace is declared in the pipeline, and the names must match

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

The mechanism for adding storage to a step is called a <em>volumeMount</em>, as described further below. 

In our case, a persistent volume claim called <em>pipeline-storage-claim</em> is mounted into the step at a specific path. 
Other steps within the task and within other tasks of the pipeline can also mount this volume and reuse any data placed there by this step. 
Note that the path used is where the Buildah command expects to find a local image repository. 
As a result any steps that invoke a Buildah command will mount this volume at this location.

> We need to use persistence storage when our data must still be available, even if the container, the worker node, or the cluster is removed. 
We should use persistent storage in the following scenarios:

>  * Stateful apps
>  * Core business data
>  * Data that must be available due to legal requirements, such as a defined retention period
>  * Auditing
>  * Data that must be accessed and shared across app instances. For example: 
>
>       - <b>Access across pods</b>: When we use Kubernetes persistent volumes to access our storage, we can determine the number of pods that can mount the volume at the same time. Some storage solutions, such as block storage, can be accessed by one pod at a time only. With other storage solutions, we can share volume across multiple pods.
>       - <b>Access across zones and regions</b>: we might require our data to be accessible across zones or regions. Some storage solutions, such as file and block storage, are data center-specific and cannot be shared across zones in a multizone cluster setup.


* Execute it using a pipeline run

 ```sh
 oc create -f build/pipelinerun.yaml
 ```
* Or using `tkn` pipeline start:

```sh
tkn pipeline start 
```

* List pipeline runs

```sh
tkn pipelinerun list
```

### Buildah

[Buildah](https://github.com/containers/buildah) is a tool that facilitates building Open Container Initiative (OCI) container images. 
It provides a command line tool that can be used to create a container from scratch or using an image as a starting point. It can use existing Dockerfile
and so instead of `docker build ....`, we use `buildah bud ...`

But it can also replace docker file by doing a script to build the image, commit any step the process when needed..

It can use `mountpoint` to expose the root folder of the container within the Host filesystem. This is valuable to use host command instead of installing
them in each docker image.

See [this getting started blog](https://www.redhat.com/sysadmin/getting-started-buildah).

As this is a for Linux tool, it can run on mac via a docker image. 

```sh
docker run -ti quay.io/buildah/stable:v1.15.0 bash
```

### Troubleshooting

* Not able to clone git with error like: `translating TaskSpec to Pod: secrets "regcred" not found.`. 
Need to create a secret named `regcred` using the kam generated secrets and using sealed secret mechanism.
* Build failed to access internal registry with `x509: certificate signed by unknown authority`. 
We may need to do not verify TLS while pushing image to the internal docker registry or use a public registry

* Github events not propagated or accepted

    * First verify the webhook settings, it needs to include `http` URL, uses application/json  and reference a git secret 
  which includes the password of the webhook secret defined for this application in the `-cicd` project. 
    * Go to the event listener pod in the `-cicd` project to assess the log
    * `interceptor stopped trigger processing: rpc error: code = FailedPrecondition desc = no X-Hub-Signature header set` looks to be linked to secret not sent wrong. 
    To verify if the secret is sent, see the request in github:

    ```sh
    Request URL: http://gitops-webhook-event-listener-route-rt-inventory-cicd.ac-dal10-b3c-4x16-1e3af63cfd19e855098d645120e18baf-0000.us-south.containers.appdomain.cloud/
    Request method: POST
    Accept: */*
    content-type: application/json
    User-Agent: GitHub-Hookshot/2d9cb65
    X-GitHub-Delivery: c82ac020-1ffb-11ec-8eb9-f5811b108768
    X-GitHub-Event: push
    X-GitHub-Hook-ID: 320462617
    X-GitHub-Hook-Installation-Target-ID: 375430795
    X-GitHub-Hook-Installation-Target-Type: repository
    X-Hub-Signature: sha1=.....secretkeyt
    X-Hub-Signature-256: sha256=....secretkey-inanotherformat
    ```

    * `interceptor stopped trigger processing: rpc error: code = FailedPrecondition desc = payload signature check failed` looks to be also a wrong secret. 
    Try to use the webhook secret defined by KAM with name like `webhook-secret-rt-inventory-dev-item-inventory.yaml` and
    use the decoding like: `oc get secret webhook-secret-rt-inventory-dev-item-inventory -o jsonpath='{.data.webhook-secret-key}' | base64 && echo`
    There is bug open as the HTTP return code should be 401 and not 202. 
    * Verify the secret used in the event-listener declaration. 
    
Set debug level via the configmap `config-logging-triggers`

```sh
oc patch cm config-logging-triggers -p '{"data": {"loglevel.eventlistener": "debug"}}'
# Back to info
oc patch cm config-logging-triggers -p '{"data": {"loglevel.eventlistener": "info"}}'
```

### Enhancing your solution

We can use nexus to keep the maven downloaded jars. 

```sh
oc apply -f https://raw.githubusercontent.com/redhat-scholars/tekton-tutorial/master/install/utils/nexus.yaml
oc expose svc nexus
```

## Other readings

* [Tekton dev documentation](https://tekton.dev/docs/)
* [OpenShift Pipelines](https://docs.openshift.com/container-platform/4.8/cicd/pipelines/creating-applications-with-cicd-pipelines.html)
* [Red Hat Scholars - Tekton tutorial](https://redhat-scholars.github.io/tekton-tutorial/tekton-tutorial/)
* [OpenShift Pipelines tutorial](https://github.com/openshift/pipelines-tutorial/tree/pipelines-1.5)
* [TaskRun description](https://github.com/tektoncd/pipeline/blob/main/docs/taskruns.md)
* [Deploy a Knative application using Tekton Pipelines](https://developer.ibm.com/tutorials/knative-build-app-development-with-tekton/)
* [IBM Tekton tasks](https://github.com/IBM/ibm-garage-tekton-tasks)

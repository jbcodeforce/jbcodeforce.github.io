# Serverless

Serverless represents stateless containers that are event-triggered, ephemeral (may only last for one invocation), and fully managed by a third party (most likely a cloud provider). We can find BaaS (Backend as service like [Auth0](https://auth0.com/) cloud service) or FaaS (Function as a Service). Serverless Backend as a Service, is based on the premise that entire application components can be commodified.

Fundamentally, FaaS is about running backend code without managing your own server systems or your own long-lived server applications.

* There is no main method. The function is a message listener. The rest of the code stays the same.
* Only upload code to the FaaS provider.
* Horizontal scaling is completely automatic, elastic, and managed by the provider. The vendor handles all underlying resource provisioning and allocation.
* Can be triggered as a response to inbound HTTP requests using an API gateway as intermediate.
*Recall that we use the definition that: An API gateway is an HTTP server where routes and endpoints are defined in configuration, and each route is associated with a resource to handle that route*
* FaaS functions are typically limited in how long each invocation is allowed to run.
* State needs to be persisted outside of the function instance.
* Initialization of a function will either be a “warm start”—reusing an instance of the function and its host container from a previous event—or a “cold start” —creating a new container instance, starting the function host process.

New user interface implementations can leverage FaaS for authentication, read database for reference data, use API gateway and Functions for transactional data, or heavy computational logic.

It is an approach to build software too.

### Architecture patterns

WebApp single page application directly connected to function, using JSONP, event driven backend.
### PaaS vs FaaS
Most PaaS applications are not geared towards bringing entire applications up and down in response to an even. The key operational difference between FaaS and PaaS is transparent **scaling**. With container it adds fine grained scaling. With container you still have to manage the size and shape of your clusters.

FaaS is seen as a better choice for an event-driven style with few event types per application component, and containers are seen as a better choice for synchronous-request–driven components with many entry points

### Thing to consider:

* What is the maximum execution duration?
* What is the startup latency?
* What is the cross-function limits?
* Do we want to consider parallel solutions from different vendors in case one becomes unavailable?
* How do applications gracefully degrade in the case of a partial outage?
* How do we logically aggregate logging for a hybrid architecture of FaaS, BaaS, and traditional servers?

### Benefits

* No server to manage
* Continuous scaling: runs code in parallel in response to trigger
* Charged at usage

### Drawbacks

* Give control of our application components to 3nd party vendor exposing us to system downtime, unexpected limits, cost changes, loss of functionality, forced API upgrades,..
* Vendor lock-in: FaaS interfaces are differents, vendors BaaS... You may need to move much more than the function itself.
* Security question to address:
  * Control secret to access a BaaS from a web app or mobile app.
  * Access control at the function level brings configuration dependent to vendor.
* Repeat logic accross client: With a “full” BaaS architecture no custom logic is written on the server side—it’s all in the client.
* Loss of server optimization
* No in-server state: ou should not assume that state from one invocation of a function will be available to another invocation. Still a function instance may stay for few hours if called once every few minutes, in memory or /tmp data can be used for caching. Ot use a low-latency external cache like Redis.
* Integration tests are more complex and may cost more. May be, use different FaaS provider's account.
* No Debugging capability
* Service discovery for new version. Functions are more event consumers.
* Monitoring is a tricky area for FaaS because of the ephemeral nature of containers. It will be based on providers specifics.
* API gateway implementing domain specific logic. This logic is typically hard to test, version control, and, sometimes, define.

### Use cases

* real-time file processing: process data immediately after an upload
* real-time stream processing
* ETL: perform data validation, filtering, sorting, or other transformations
* IoT or Mobile Backends

## IBM Cloud Function

IBM Function is the serverless computing capability on public cloud. Cloud Functions is billed per second per gigabyte of memory. 
You create action from UI or CLI, then you can get nodejs, swift, php, and python generated code from the user interface. An action performs work when invoked from your code via REST API.

<img src="assets/docs/studies/serverless/if-create.png" width="100%" style="padding:20px;"></img>

For java, and other language packaged as docker image, you need to use the CLI.

Here is what is generated.
```
/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {
	return { message: 'Hello World' };
}

```

The parameter tab can help define the schema of the param json document.

The end point gives the URL to do a POST request to invoke the action.

A sequence is a chain of actions, invoked in order, where the output of one becomes the input to the next. You can add your own action to a sequence or use public ones:

<img src="assets/docs/studies/serverless/if-public-actions.png" width="100%" style="padding:20px;"></img>

## OpenWhisk

[OpenWhisk](https://openwhisk.apache.org/) is a distributed Serverless platform that executes functions (Fx) in response to events at any scale. OpenWhisk manages the infrastructure, servers and scaling using Docker container.
It can run locally using docker-compose or on kubernetes or mesos orchestrators.

## Kubeless

Serverless framework to deploy functions in kubernetes cluster. It adds a new custom resource: a function, and a controller to allocate function to the cluster and expose HTTP end point or pub/sub mechanism.

* [Installation instructions](https://kubeless.io/docs/quick-start/)


## Knative

See [IBM tutorial](https://cloud.ibm.com/docs/containers?topic=containers-knative_tutorial#knative_tutorial) to run Knative app on IKS. See also the [101 workshop](https://github.com/IBM/knative101/). 

The main [Knative](http://github.com/knative) web site.

Knative comes with 3 key components, or primitives, that help you to build, deploy, and manage your serverless apps in your Kubernetes cluster:
* **build**: Reproducible builds, turns into serving URL (templates). Manage code and config revisions. 
* **serving**: autoscaling capability from 0 instance. The measure to scale is # of request / s or CPU usage per default. Can be consfigured to limit # req/s per pod. 
* **eventing**: orchestrates on/off cluster event sources (triggers, channels, targets). The approach is to abstract 

Istio with Knative version 3 is now a plugin, so it is no more mandatory.

Motivations:

* k8s is not for developers, more for ops. 
* For 12 factors modern app
* Provides building blocks for OSS serverless stack
* Language agnostic, the unit of deployment is a container. 
* All the metrics are in Promotehus 
* Traffic splitting between revisions - blue green release

Here are a set of commands to assess knative deployment:

```shell
$ kubectl get pods --namespace knative-serving
activator-84b4c76cf8-d26hh    2/2       Running   0          5d
autoscaler-675667db66-phknk   2/2       Running   0          5d
controller-b49b984c9-pq8p6    1/1       Running   0          5d
webhook-c74c6675d-bdhk8       1/1       Running   0          5d

$ kubectl get pods --namespace knative-build
build-controller-7cd859b86d-66v9w   1/1       Running   0          5d
build-webhook-d9c7d4595-pfl6s       1/1       Running   0          5d

$ kubectl get pods --namespace knative-eventing
eventing-controller-b8cbcb6cb-m5748             1/1       Running   0          5d
in-memory-channel-controller-6f7bc7bf6c-4m896   1/1       Running   0          5d
in-memory-channel-dispatcher-68fcbc897b-t5n9k   1/1       Running   0          5d
webhook-86f7656d69-fthcg                        1/1       Running   0          5d

$ kubectl get pods --namespace knative-sources
controller-manager-0   1/1       Running   0          5d

$ kubectl get pods --namespace knative-monitoring
elasticsearch-logging-0               1/1       Running   0          5d
elasticsearch-logging-1               1/1       Running   0          5d
grafana-5fcd9d579b-d24jb              1/1       Running   0          5d
kibana-logging-c58c89fcd-8hmsj        1/1       Running   0          5d
kube-state-metrics-7fb8df6f76-wnnsx   4/4       Running   0          5d
```

Example of deployment ymal and code: Code/Studies/fib-knative. 

### Getting started

To get knative to work do at least:

* Have a knctl tool
* Define a private image registry.
* Set up some required credentials that the Knative build process will use to have access to push to your container registry
    * Get user credentials for accessing to the registry, for the user `token`.
    * `ibmcloud cr token-list` to get the list of existing tokens. There should be one of the private registry. The name for example is: 
    * Get the token from a secret:  `ibmcloud cr token-get cce5....`
    * Encrypt the token in base64 (for mac) `echo -n "eyJhb...RYek" | base64 -b0`
    * Modify the secret yaml and use the command to create the basic user secret: `kubectl apply --filename docker-secret.yaml -n browncompute`
    * View the secret for the basic user: `kubectl get secret basic-user-pass -o yaml -n browncompute`
    * Define a service account to link the build process for Knative to the secrets of the basic user. The service account is used to get an identity for process running in a Pod. `kubectl apply --filename service-account.yaml -n browncompute` and then be sure it is created: ` kubectl get serviceaccount build-bot -n browncompute`.
* Verify Knative is installed in k8s: `kubectl get namespace`

### Deploy an application from an existing image

* Create a service definition for your application and then apply it: `kubectl apply --filename fib-service.yaml -n browncompute`
```
apiVersion: serving.knative.dev/v1alpha1
kind: Service
metadata:
  name: fib-knative
  namespace: browncompute
spec:
  runLatest:
    configuration:
      revisionTemplate:
        spec:
          container:
            image: docker.io/ibmcom/fib-knative
```
* Get the external IP address of the ISTIO ingress gateway: `kubectl get svc istio-ingressgateway --namespace istio-system` 
* Get the domain name that Knative assigned to the Service we just deployed: `kubectl get ksvc fib-knative -n browncompute` 
* Call the service `curl -H "Host: fib-knative.browncompute.example.com" http://publicipaddress/5`

The name of the Knative serving routes is {appname}.{namespace}.{default-domain}. The default domain can be changed.

* First get the ingress sub domain for our cluster: `ibmcloud ks cluster-get fabio-wdc-07`.  This Ingress Subdomain is an externally available and public URL providing access to your cluster.
* Update the default mapping of 'example.com' to the domain URL by updating the configuration: `kubectl edit cm config-domain --namespace knative-serving`
* To be able to reuse this sub domain set: `export MYINGRESS=fabio-wdc-07.us-east.containers.appdomain.cloud` 
* Define a new Ingress rule so the URL of the application is forwarded to the knative ingress gateway:

```yaml
spec:
  rules:
    - host: fib-knative.browncompute.fabio-wdc-07.us-east.containers.appdomain.cloud
      http:
        paths:
          - path: /
            backend:
              serviceName: istio-ingressgateway
              servicePort: 80
```

and create the ingress rules:  `kubectl apply --filename forward-ingress.yaml`
* Test it with: `curl fib-knative.browncompute.$MYINGRESS/5`

See the following image to see the routing path:

<img src="assets/docs/studies/serverless/knativeappdiagram.png" width="100%" style="padding:20px;"></img>


### Build and deploy from source code

Using the Build & Serving components of Knative, we can build the image and push it to a private container registry on IBM Cloud, and then ultimately get a URL to access our application. The approach is to use [Kaniko](https://github.com/GoogleContainerTools/kaniko) to build container images from a Dockerfile, inside a container or Kubernetes cluster.

If not already done install [Kaniko](https://github.com/GoogleContainerTools/kaniko) to your k8s cluster: 

```
$ kubectl apply --filename https://raw.githubusercontent.com/knative/build-templates/master/kaniko/kaniko.yaml

$  kubectl get BuildTemplate kaniko -o yaml
```

To build the application from source code the service.yaml needs to define where to get the code and what private registry to use:

```yaml
apiVersion: serving.knative.dev/v1alpha1
kind: Service
metadata:
  name: fib-knative
  namespace: browncompute
spec:
  runLatest:
    configuration:
      build:
        apiVersion: build.knative.dev/v1alpha1
        kind: Build
        spec:
          serviceAccountName: build-bot
          source:
            git:
              url: https://github.com/IBM/fib-knative.git
              revision: master
          template:
            name: kaniko
            arguments:
            - name: IMAGE
              value: us.icr.io/ibmcaseeda/fib-knative:latest
      revisionTemplate:
        spec:
          serviceAccountName: build-bot
          container:
            image: us.icr.io/ibmcaseeda/fib-knative:latest
            imagePullPolicy: Always
```

Another way to build and deploy the app is to use the knctl command, which will tell Knative to go out to github, find the code, build it into a container, and push that container to the IBM Container Registry

```shell
$ knctl deploy --service fib-native --git-url https://github.com/IBM/fib-knative  --git-revision vnext  --service-account build-bot --image us.icr.io/ibmcaseeda/fib-knative:vnext --managed-route=false

$ knctl revisions list
```

### A/B testing with Knative

Check the current route percentages:

```
knctl route list
```

Send 50% of the traffic to the latest revision, and 50% to the previous revision. 

```
knctl rollout --route fib-knative -p fib-knative:latest=50% -p fib-knative:previous=50%
```


## Design and implementation considerations

* Separate event handler (which is a function) to the domain business logic which may stay as containerized microservice. It is applying the DDD [Anti Corruption Layer]() pattern, which means to link two bounded contexts and ensure that any data which is only important to a service layer do not leak into the other microservices. So this layer delivers the data model for the client more stable than the underlying back end services. This pattern helps to support evolvability. 
* Deployment to cloud provider, use declarative deployment with tool like Terraform automatic scripting
* Start by integration test when using function as another approach for TDD. In fact the mantra is a little bit different than traditional cicle: Start by integration test build it, secure it and run it. 
* Using staging, may be limited to two stages: dev and prod. Protect stage with different account or space. Use suffix in the function name to specify the stage.
* Prefer language that starts quickly like nodejs or python to improve cold start response time. Design with latency in mind, and prefer asynchronous invocation. 
* Remember that during scaling of service, new functions will do cold start and so will impact latency. Cold start will happen once for each concurrent execution of your function.
* Put in place continuous performance measurement of your function.
* Control the number of function to scale as it may impact downstream back end like a DAL service.
* The more function you have the more you are exposed to security attack, you also lose control of your univers.  
* But serverless is good for security as there is no server, and patch. 
* Every function should have its own security policy. 
* Be sure to security scan your function with its dependencies. See tool like [snyk](https://snyk.io).
* Never trust your client. Expect any event generator to be malicious: protect your schema with strict schema definition. In Js use [joi](https://github.com/hapijs/joi)
* Three possible patterns:
  * **One function with dispatching** to backend monolytic app. Nice for starting to transition to lambda, but not that flexible and keep resource high as the back end is not yet splitted. The security has to be supported by the function 
  * **Multi functions sharing code**: Keep the same backend but each service operation is facaded by a function. 
  * **Multi functions sharing nothing**: Each service operation is not a separate function with its own code and deployment. 
* Designing distributed application is hard.
* Always assess what need to be crashed, but doing monkey testing of all the functions of your organization. See [Netflix Janitor monkey](https://github.com/Netflix/SimianArmy/wiki/Janitor-Home) which works on AWS to chase unused resources.

## Other FaaS
* [AWS Lambda](https://aws.amazon.com/lambda/) Trigger can be document in S3, message in Kinesis, dynamoDB, cloud watch...
* [IBM Cloud function](https://console.bluemix.net/openwhisk/learn/concepts)
* [Azure function](https://azure.microsoft.com/en-us/services/functions/)

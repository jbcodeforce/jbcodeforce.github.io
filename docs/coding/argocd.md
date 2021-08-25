# ArgoCD tutorial

To implement our GitOps workflow, we used Argo CD, the GitOps continuous delivery tool for Kubernetes. 
Argo CD models a collection of applications as a project and uses a Git repository to store the application's desired state (a gitops repo). 
Argo CD compares the actual state of the application in the cluster with the desired state defined in Git and
determines if they are out of sync. When it detects the environment is out of sync, Argo CD can be configured
to either send out a notification to kick off a separate reconciliation process or Argo CD can automatically synchronize the environments to ensure they match.

ArgoCD is deployed with OpenShift GitOps operator. 

If you go to the Developer's Perspective, you can see a topology:

![ArgoCD](./images/argocd.jpg)


><b>OpenShift GitOps</b> is an OpenShift add-on which provides Argo CD and other tooling to enable teams to implement GitOps workflows for cluster configuration and application delivery. 


Clicking the Argo Server node that contains the URL takes you to the Argo login page.

See [this getting started tutorial](https://argoproj.github.io/argo-cd/getting_started/) and the [core concept](https://argoproj.github.io/argo-cd/core_concepts/)

* Install argocd: this will includes CRD, service account, RBAC policies, config maps, secret and deploy: Redis and argocd server. It makes sense to have
one ArgoCD instance deploy per cluster. It can manage projects and within project, applications.

```sh
oc new-project argocd
oc apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

* It can be also installed via the Red Hat OpenShift GitOps operator. After installing the OpenShift GitOps 
operator, an instance of Argo CD is installed in the `openshift-gitops` namespace which has sufficent privileges 
for managing cluster configurations.

* Finally, you can declare the operator yaml and service account and role binding as part of your gitops. See [sample in this folder](https://github.com/ibm-cloud-architecture/eda-lab-inventory/tree/master/environments/openshift-gitops).

Once installed the following pods run:

 ```sh
 argocd-application-controller-0                                   1/1     Running     0          20h
 argocd-dex-server-9dc558f5-4dw4q                                  1/1     Running     2          20h
 argocd-redis-759b6bc7f4-g2jbj                                     1/1     Running     0          20h
 argocd-repo-server-5fbf484547-6x4rj                               1/1     Running     0          20h
 argocd-server-6d4678f7f6-vqs64  
 ```

* Install argocd CLI

On MAC: `brew install argocd`

* Expose the API server: By default, the Argo CD API server is not exposed with an external IP. Update the service to use load balancer: 

```sh
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

The initial password for the admin account is auto-generated and stored as clear text in the field password in a secret named `argocd-initial-admin-secret` 

```sh
oc get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo ""
```

Get the IP address of the argocd server: `oc get svc` then look at the LoadBalancer service (argocd-server) external-IP.

`argocd login SERVERIP`  then use admin user and password. 
You can also access the ArgoCD UI using the load balancer IP address, admin user and password. 

* Define application: this is the deployable unit, which is map to a k8s deployment that references the image built during the CI pipeline.
The approach is to use one git repository to represent the solution to deploy. Each component, microservice or app is defined in
its own folder and can use Helm or Kustomize to define the deployment, service, configmap... 

You use one application per target environment.

Here is an example of argoCD app:

```yaml
```

On the application tile, we can use the 'SYNC' to deploy the application or use `argocd app get <appname>`.


### Connect pipeline to deployment

Once the manifests for a given app are defined in the gitops repository, we need to have the pipeline being able to update the deployment
descriptor with the image reference and tag defined as part of the build pipeline.

The pipeline needs to have the git credentials to be able to write to the gitops repository. Credentials are saved in a secret and a configmap
define github host, user.

### More reading

* [ArgoCD documentation](https://argo-cd.readthedocs.io/en/stable/)

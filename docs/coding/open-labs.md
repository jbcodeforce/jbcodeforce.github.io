# Use IBM open labs

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

## Argocd tutorial

See [this getting started tutorial](https://argoproj.github.io/argo-cd/getting_started/) and the [core concept](https://argoproj.github.io/argo-cd/core_concepts/)

* Install argocd: this will includes CRD, service account, RBAC policies, config maps, secret and deploy: Redis and argocd server.
```sh
oc new-project argocd
oc apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

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

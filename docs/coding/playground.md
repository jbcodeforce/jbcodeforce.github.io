# Playground

This is section is notes on my different environments.

## Isolated development using a container

Using the Dev-Dockerfile to build a container to do isolated development activities. 

* Build a dev image

```sh
docker build -f Dev-Dockerfile -t j9r/dev-env .
```

* Run it to access to git client

```sh
docker run -ti -v $(pwd):/home/me j9r/dev-env bash
```

* Use it for git commands.

```sh
git config --global user.email "..."
git config --global user.name jbcodeforce
```


## VSCode

* [Product doc](https://code.visualstudio.com/docs)
* [Beginner guide]()
* [Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

* Ctrl+shift P to open command palette 
* Ctrl K + ctrl T for changing the theme for all windows

Settings are at user level, so for all workspace and windows, or at workspace level.

* [Command short cut sheet Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)  [mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)
* [Article on theme customization per workspace](https://medium.com/@juris.savos/setting-a-per-project-colour-scheme-in-vscode-89cc5836b1de) and [theme color](https://code.visualstudio.com/api/references/theme-color)

Assess heme like atom light and icon theme like material icon.


## Important linux command

```sh
uname -a
# 
hostname
ip addr
nslookup
```

## Ubuntu machine


```sh
ssh jerome@ubuntu1
# assess if minikube runs
sudo systemctl status minikube
minikube status
minikube version
# to start with podman driver
minikube start
# Deploy the k8s dashboard
minikube dashboard --url
```

See [this note](../techno/minikube.md) to access Dashboard from remote host.

### Kubectl basic

```sh
minikube kubectl cluster-info
```

To make it simple: `alias k="minikube kubectl"`

```sh
k describe node
```

### Catalog of what could be installed

| Image | Command |
| --- | --- |
| Kafka | helm install bitmani/kafka | 
| Strimzi | helm repo add strimzi https://strimzi.io/charts/  && helm install strimzi-kafka strimzi/strimzi-kafka-operator  | 

## Minkube as a local k8s

[See minikube dedicated notes](../techno/minikube.md)

## WSL2 tricks

### Networking

To access a web app running in WSL2 from an external computer, we can port forward the desired ports in WSL 2 NAT. This is because WSL 2 creates a virtualized Ethernet adapter with its own IP address, which creates a NAT between the WSL instance and the Windows host computer.

```sh
# get ip address of WSL@ machine
ip a
# configure windows to have a port proxy
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=192.168.85.149
# Add a rule in he Windows firewall to authorize access to port 3000
```

## Local Image Registry

Under the `tools/local-registry` there is a docker compose to start a local registry to be able to test helm on k8s.

The URL is [http://localhost:5002/v2/_catalog](http://localhost:5002/v2/_catalog).

An example of using this registry (docker compose in athena-owl-core/deployment/local):

```yaml
services:
  owl-backend:
    hostname: owl-backend
    image: localhost:5002/athena-owl-backend:1.0.0
    container_name: owl-backend
    build:
      context: ../../owl-agent-backend/src
```

```sh
docker compose build
docker compose push
```

## Getting a k8s deployment.yaml from docker compose using Kompose

```sh
# Build image
docker build -t kompose https://github.com/kubernetes/kompose.git\#main
# run within a folder with a docker compose file
docker run --rm -it -v $PWD:/opt kompose sh -c "cd /opt && kompose convert"
```

## Docker Desktop with kubernetes

See interesting [Blog on How Kubernetes works under the hood with Docker Desktop.](https://www.docker.com/blog/how-kubernetes-works-under-the-hood-with-docker-desktop/), which we get the following important concepts:

* Docker Desktop automatically generates server and client certificates for key internal services, including kubelet (node manager), service account management, frontproxy, API server, and etcd components.
* The global endpoint of the cluster is using the DNS name [https://kubernetes.docker.internal:6443](https://kubernetes.docker.internal:6443).
* For bootup, the life cycle runs `kubeadm init` to initialize the cluster and then start the kubelet process
* Services of type LoadBalancer are exposed outside the Kubernetes cluster.
* **Vpnkit-controller** is a port forwarding service which opens ports on the host and forwards connections to the pods inside the VM.
* Docker Desktop uses  [dockershim](https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/#role-of-dockershim) to share the image cache between the Docker engine and Kubernetes. Kubernetes can create containers from images stored in the Docker Engine image cache. Be sure to have a policy to ****IfNotPresent**
* The tutorial yaml is in tools folder.


Important commands to verify major control plane components:

```sh
# Set a context to a cluster
kubectl config  --kubeconfig=/home/jbcodeforce/.kube/config  use-context athena-demo
# Get exposed services
kubectl get svc
kubectl get pods -n kube-system
```

See later section to install helm. Once installed test by deploying nginx as an ingress controller:

```sh
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install my-ingress-nginx ingress-nginx/ingress-nginx
kubectl get service --namespace default my-ingress-nginx-controller --output wide --watch
kubectl get svc -n default

```

And use this kind of ingress declaration

```
apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: example
    namespace: foo
  spec:
    ingressClassName: nginx
    rules:
      - host: www.example.com
        http:
          paths:
            - pathType: Prefix
              backend:
                service:
                  name: exampleService
                  port:
                    number: 80
              path: /
              ``
```



## Using [Helm](https://helm.sh/docs/intro/using_helm/)

* Install Helm 

```sh
curl https://get.helm.sh/helm-v3.16.0-rc.1-linux-amd64.tar.gz -o helm-v3.16.0-rc.1-linux-amd64.tar.gz
tar -xzvf helm-v3.16.0-rc.1-linux-amd64.tar.gz
mv linux-amd64/helm bin
rm helm-v3.16.0-rc.1-linux-amd64.tar.gz
```

* Main concepts

    * A **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster.
    * A **Repository** is the place where charts can be collected and shared. Bitnami is a very useful repository.
    * A **Release** is an instance of a chart running in a Kubernetes cluster

* Useful commands

```sh
helm search hub
# 
helm repo add bitnami https://charts.bitnami.com/bitnami
# install an image (kafka with kraft)
helm install my-kafka bitnami/kafka 
# list release
helm list
# install a release
helm uninstall kafka-1725727453
# To see what options are configurable on a chart
helm show values bitnami/kafka
# You can then override any of these settings in a YAML formatted file,
helm install -f values.yaml my-kafka bitnami/kafka 
# Upgrade an existing release
helm upgrade -f new-value.yaml my-kafka bitnami/kafka 
# Upgrade an existing release, and in a specific context
helm upgrade  owl-backend owl-backend
helm upgrade  --kube-context athena-demo owl-backend owl-backend
#  roll back to a previous release 
helm rollback my-kafka 1
```

The IBM helm repository:

```sh
helm repo add ibmcharts https://raw.githubusercontent.com/IBM/charts/master/repo/ibm-helm
helm repo update
```

### Developing our [charts](https://helm.sh/docs/topics/charts/)

[See the summary of the commands](https://helm.sh/docs/intro/cheatsheet/#chart-management)

```sh
helm create <chart_name>
```

* Update charts.yaml, values.yaml and may be some other templates.

???+ info "From docker-compose to kubernetes"
    The Kompose.io tool can hel creating k8s manifests from a docker compose. Once done deployment and service can be added to the values and template of helm.

    ```sh
    docker run --rm -it -v $PWD:/opt kompose sh -c "cd /opt && kompose convert"
    ```

* Package and validation

```sh
helm package <chart_name>
helm lint <chart_name>
helm install owl-backend --dry-run owl-backend
```

* Tar file could be updloaded to s3, and the s3 bucket exposed as HTTP web server to be used as repository. 

???- question "Configure volumes"
    1. Create a config map from a yaml file

      ```sh
      kubectl create configmap --dry-run=client somename --from-file=./src/athena/config/config.yaml --output yaml
      ```

    2. Add in the Values.yaml of the chart the volume and volume mount

      ```yaml
      volumes: 
       - name: app-config-vol
         configMap:
          name: app-config-cm

      volumeMounts:
        - name: app-config-vol
          mountPath: /app/config
      ``` 
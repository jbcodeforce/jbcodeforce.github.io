# Minikube how to

???- warning "Update"
    Created 2023 - Update 11/2024 consolidate notes

    **Under construction**

Minikube is officially backed by the Kubernetes project. It supports different backend drivers like KVM, Docker, Podman.

## Concepts

### Profile 

Minikube can be used with profile. Profile is a way to manage multiple Minikube clusters with different configurations (driver, k8s version, memory, cpu, addson, ...) on the same machine. Think of it like having separate, isolated Kubernetes environments.
Profile may be used for isolating development environments for different projects or for testing multi-node setups.

```sh
minikube profile list
```

### Tunnel

Minikube tunnel creates a network route between your host machine and the Minikube cluster, specifically to enable LoadBalancer services to work as expected. `minikube tunnel` runs as a process on your host machine, which creates a network tunnel using your host as a network gateway, then it assigns real external IPs to LoadBalancer services to handle routing traffic from your host to these services.

Must keep running in a separate terminal while you need LoadBalancer access.

## Getting started

[Official getting started](https://minikube.sigs.k8s.io/docs/start/), and interesting article [Using minikube as Docker Desktop Replacement](https://minikube.sigs.k8s.io/docs/tutorials/docker_desktop_replacement/)

### Minikube on local home network

We have multiple choices: 

1. A remote dedicated Ubuntu workstation, with  minikube installed, podman and then remote ssh to the Ubuntu machine.
2. Use WSL2 on Windows or directly installed on MacOS

[Consult minikube FAQ](https://minikube.sigs.k8s.io/docs/faq/)

### Install on Ubuntu

* Install docker podman

```sh
# Ubuntu
sudo apt install podman
# Fedora
sudo dnf install podman
```

* Verify system resources

```sh
lscpu
```

* modify /etc/sudoers by adding `jerome ALL=(ALL) NOPASSWD: /usr/bin/podman`

```sh
sudo vi /etc/sudoers
```

* verify user can see the podman version

```sh
sudo -n -k podman version
```

* Installation minikube

```sh
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

#### Remote access to Ubuntu computer on local LAN

* Start ssh server within the ubuntu host, get the ip address and use ssh client

```sh
sudo apt install openssh-server
ip a
```

#### Remote access to Fedora computer on local LAN

* Start ssh server:

```sh
sudo dnf install openssh-server
sudo systemctl start sshd
sudo systemctl enable sshd
ip a
```

* Verify potential firewall setting

```sh
sudo firewall-cmd --list-all
# To allow SSH through the firewall:
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

* To avoid Fedora laptop sleep while on power supply

```sh
sudo -u gdm dbus-run-session gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout 0
```

* On remote host to Fedora do

```sh
ssh jeromeboyer@10.0.0.192
```

### Install on Mac

There are different passes. The podman desktop or the cli:

* Intel Mac

```sh
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
rm minikube-darwin-amd64
```

* Apple Silicon Mac (arm64 architecture)

```sh
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-arm64
sudo install minikube-darwin-armd64 /usr/local/bin/minikube
rm minikube-darwin-arm64
```


* For Podman Desktop see [this documentation for installation](https://podman-desktop.io/) then this one [for minikube](https://podman-desktop.io/docs/minikube). It is possible to start minikube with the cli and the Podman Desktop will see it, and its resources.

### WSL2 and minikube

* Update Ubuntu

```sh
sudo apt update && sudo apt upgrade -y
# and install important tools
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```

* Add repository to access docker engine

```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# 
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update -y
```

* Install docker engine

```sh
sudo apt-get install -y docker-ce
# Update user to be a docker group member
sudo usermod -aG docker $USER && newgrp docker
```

* Configure minikube to use docker engine

```
minikube config set driver docker
minikube start
# get information about 
minikube profile list
```

### Update existing Minikube version

```sh
minikube update-check
```

### Add any needed addons

```sh
minikube addons list
minikube addons enable metrics-server
minikube addons enable ingress
minikube addons enable registry
```


## Run a cluster



### With docker driver

In WSL2 on Windows and Docker Desktop installed on Windows, it is possible to share the docker driver with WSL2.

```sh
# use default profile called minikube
minikube start
# ip address
minikube ip
# 192.168.49.2
# Start with enough resources:
minikube start --cpus 3 --memory 3072
# Verify the state
minikube status
```

To point the docker CLI to minikube docker environment: When we run Docker commands on our local machine, by default they interact with our local Docker daemon. However, Minikube runs its own Docker daemon inside its VM/container environment. Therefore images we build locally aren't automatically available to Minikube's Kubernetes cluster. When you define Kubernetes resources that reference Docker images, Minikube will look for them in its own Docker registry.

```sh
eval $(minikube -p <profile> docker-env)
```

Switch the Docker CLI to communicate with Minikube's Docker daemon instead of the local one. This avoids having to push images to an external registry just to test them in Minikube.

### With podman driver

To be able to run minikube with a `podman` driver, the user needs to be a sudoers [see this note](../coding/playground.md#install-minikube-on-ubuntu):

```sh
minikube start --cpus 6 --memory 18g  --driver=podman
```

Personal script is `~/bin/ministart`, may take some time as it may download new VM image.

In case of problem delete the vm with `minikube delete`


### Kubectl: some commands


* If kubectl is not install on the host, we can alias it to the minikube:

```sh
alias k="minikube kubectl -- "
alias kubectl="minikube kubectl -- "
```

* Retrieve all Kubernetes context (they are saved in `~/bin/.kube/config`)

```sh
kubectl config get-contexts
```

* Change kubectl context between openshift and minikube:

```sh
kubectl config use-context minikube
kubectl config use-context default/c1....com:31580/IAM#<email>
# same with
kubectx minikube
```

* Retrieve the  nodes: 

```sh
kubectl get nodes
```

### User interface and networking

* Dashboard UI

```sh
minikube dashboard
```

Then click to the URL constructed using the proxy, to access from the minikube host machine. To access remotly from another computer using a static port, we need a proxy to access it from a static port.

* Start a kubernetes proxy so the Kubernetes APIs are served through port 8001

```sh
kubectl proxy 
```

* So the dashboard is accessible remotely, using  SSH to the server, using -L option. (ubuntu1 was added to local `/etc/hosts`)

```sh
ssh -L 12345:localhost:8001 jerome@ubuntu1
```

Now the Kubernetes Dashboard is accessible remotly at [http://localhost:12345/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy](http://localhost:12345/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy)

## Application deployments

### Use docker CLI to build image

Be sure to have enabled registry addon. 

???- question "How to enable docker local daemon to push images to minikube registry?"
    Enable docker local daemon to push images to minikube registry to simplify the image management within the minikube cluster. First enable the registry service:

    ```sh
    minikube addons enable registry
    ```

[Product doc](https://minikube.sigs.k8s.io/docs/commands/image/) which can be summarized as:

```sh
# with a local Dockerfile and local context
minikube image build -t localhost:5000/jbcodeforce/something .
# or
minikube image build -f path/dockerfile -t jbcodeforce/something context_path
# if docker cli is installed and connected to docker daemon of minikube via the eval $(minikube -p <profile> docker-env)
docker images
# works and returns the same results as
minikube image list
# So docker build, creates image inside minikube registry
```

???- issue "Image eviction"
    It is possible that once the image is built, it is visible in the list of images for a very short time. It because of kubelet evicting not used images. These eviction thresholds are fully managed by Kubelet k8s node agent, cleaning uncertain images and containers according to the parameters(flags) propagated in kubelet [configuration file](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/).

???- question "Cannot connect to docker daemon"
    Expose the Docker daemon from minikube to the local terminal environment. (A typical issue is 'Cannot connect to docker daemon at unix ...')

    ```sh
    eval $(minikube docker-env)
    ```



* When the registry is enable the image management  is done with minikube mostly the same way as with docker

```sh
# to get an image from docker hub to be loaded to internal registry so deployment can find image
minikube image load <dockerhub>imagename  
```

* The `imagePullPolicy` and image `tag` (:latest or :1.0.0) affect when Minikube attempts to pull the specified image. `imagePullPolicy` is automatically set to `Always`. The control can be done via parameter

```sh
kubectl run acontainer --image=theimage --image-pull-policy=Never --restart=Never
```

### Build a quarkus app and deploy it to minikube

```sh
mvn verify -Dquarkus.kubernetes.deploy=true
```

* Get the service and app url:

```sh
kubectl get svc
minikube service quarkus-reactive-kafka-producer --url
```

* Deploy an existing app

```sh
kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.4
kubectl expose deployment hello-minikube --type=NodePort --port=8080
```


### Deploy nginx from the studies/minikube folder

The Service is of type loadbalancer.

```sh
k create -f nginx-svc.yaml

k create -f nginx-deploy.yaml
# tunnel between Ubuntu and minikube 
minikube service nginx-service
# Alternatively, use kubectl to forward the port:

kubectl port-forward service/nginx-service 8083:80
```

### Install Prometheus

Install the Kube Prometheus stack

```sh
helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts

helm upgrade --install \
  -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/main/docs/src/samples/monitoring/kube-stack-config.yaml \
  prometheus-community \
  prometheus-community/kube-prometheus-stack
```

After completion, you will have Prometheus, Grafana and Alert Manager installed with values from the kube-stack-config.yaml file. From the Prometheus installation, you will have the Prometheus Operator watching for any PodMonitor. The Grafana installation will be watching for a Grafana dashboard ConfigMap.

To access Prometheus, port-forward the Prometheus service:

```sh
kubectl port-forward svc/prometheus-community-kube-prometheus 9090
```

### Deploy postgres

Two options to deploy Postgresql one with helm images and one with Postgresql Operator

#### Helm deployment

As postgres needs to persist data to file system, we need to define PV and PVC.

1. Create a local directory on the host machine to keep data (e.g. /etc/data/postgres-dbs), depending of the context of the application or tests
1. Create persistence volume to use manual storage class and using hostPath. (use absolute path to the created folder). Apply the configuration to the cluster.

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
        name: postgres-pv
        labels:
            type: local
    spec:
        storageClassName: manual
        capacity:
            storage: 2Gi
        accessModes:
            - ReadWriteOnce
        hostPath:
            path: "/etc/data/postgres-dbs"
    ```

1. Create a PVC for postgres

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
        name: postgres-pvc
    spec:
        storageClassName: manual
        accessModes:
            - ReadWriteOnce
        resources:
            requests:
            storage: 2Gi
      ```

1. Download the Helm chart, for example the bitmani one, and modify any parameters in the values.yaml file.

    ```sh
    helm pull bitnami/postgresql
    tar -xvf postgresql-{version}.tgz
    ```

[See this article](https://facelessnomad.medium.com/deploying-your-app-and-database-with-helm-on-kubernetes-8ba20733eea9) for postgresql and a python app deployments with helm.


#### Operator deployment

Use [CloudNative Postgres Operator](https://github.com/cloudnative-pg/cloudnative-pg) and [installation instructions](https://github.com/cloudnative-pg/cloudnative-pg/blob/main/docs/src/installation_upgrade.md).

```sh
kubectl apply --server-side -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.24/releases/cnpg-1.24.1.yaml
# Verify operator
kubectl get deployment -n cnpg-system cnpg-controller-manager
```

Then deploy a DB cluster. See [the CRD definition](https://github.com/cloudnative-pg/cloudnative-pg/blob/main/docs/src/cloudnative-pg.v1.md).

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: pg-cluster
spec:
  instances: 1

  storage:
    size: 1Gi
```

Define Prometheus rules to 

```
kubectl apply -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/main/docs/src/samples/monitoring/prometheusrule.yaml
```

* Define a Grafana Dashboard to monitor PostgresSQL, by uploading the `studies/minikube/postgresql/pg-grafana-dashboard.yaml`

* To define table, open a session as the postgres superuser. By default, CloudNativePG creates a user called `app`, and a database owned by it, also called `app`.

```sh
kubectl exec -ti cluster-example-1 -- psql app
```

[See psql commands](https://www.postgresql.org/docs/current/app-psql.html) and [postgresql study notes.](https://jbcodeforce.github.io/db-play/postgres/)

## Troubleshooting


* Clean all at the docker engine level

```sh
docker system prune -a --volume -f
```

* Error starting minikube: Error validating CNI config file /etc/cni/net.d/minikube.conflist


* Removing the failed install of minikube cant hurt: `minikube delete --all`
* Check your package version of containernetworking-plugins:`apt show containernetworking-plugins`

Go to http://archive.ubuntu.com/ubuntu/pool/universe/g/golang-github-containernetworking-plugins/ and download an up to date version

Install: `sudo dpkg -i containernetworking-plugins_1.1.1+ds1-3_amd64.deb`

```
minikube start
```

* [Using a Local Registry running on Host with Minikube](https://gist.github.com/trisberg/37c97b6cc53def9a3e38be6143786589): the registry runs on host development machine at registry.dev.svc.cluster.local:5000 and images are shared between host an any pods running inside Minikube.
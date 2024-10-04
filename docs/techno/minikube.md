# Minikube how to

???- warning "Update"
    Created 2023 - Update 9/2024 consolidate notes

    **Under construction**

Minikube is officially backed by the Kubernetes project. It supports different backend drivers like KVM, Docker, Podman.

## Getting started

[Official getting started](https://minikube.sigs.k8s.io/docs/start/)

### Minikube on local home network

We have ultiple choices: 

1. A remote dedicated Ubuntu workstation, install minikube, podman and then remote ssh to the Ubuntu machine.
2. Use WSL2 on Windows or directly install on MacOS

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

* Start ssh server within the ubuntu host:

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

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
rm minikube-darwin-amd64
```

### Update existing Minikube 

```sh
minikube update-check
```

## Run a cluster

### With docker driver

In WSL2 on Windows and Docker Desktop installed on Windows it is possible to share the docker driver with WSL2.


```sh
minikube start
# ip address
minikube ip
# 192.168.49.2
# Start with enough resources:
minikube start --cpus 3 --memory 3072
# Verify the state
minikube status
```

To point the docker CLI to minikube docker environment: 

```sh
eval $(minikube -p <profile> docker-env)
```

### With podman driver

To be able to run minikube with a `podman` driver, the user needs to be a sudoers [see this note](../coding/playground.md#install-minikube-on-ubuntu):

```sh
minikube start --driver=podman
```

Personal script is `~/bin/ministart`, may take some time as it may download new VM image.

* In case of problem delete the vm with `minikube delete`

## Add any needed addons

```sh
minikube addons list
minikube addons enable metrics-server
minikube addons enable ingress
```


## Kubectl


* If kubectl is not install on the host, we can alias it to the minikube:

```sh
alias k="minikube kubectl"
alias kubectl="minikube kubectl"
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

* List existing addons

Addons are built-in list of applications and services

```sh
minikube addons list

# enabling
minikube addons enable <name>
```

## User interface and networking

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


## Use docker CLI to build image

* Install docker CLI

```
brew install docker
```

* Expose the Docker daemon from minikube to the local terminal environment.

```sh
eval $(minikube docker-env)
```

* Enable docker local daemon to push images to minikube registry

```sh
minikube addons enable registry
```

* Build a quarkus app and deploy it to minikube

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


* Deploy nginx from studies/minikube

```sh
k create -f nginx-svc.yaml

k create -f nginx-deploy.yaml
# tunnel between Ubuntu and minikube 
minikube service nginx-service
# Alternatively, use kubectl to forward the port:

kubectl port-forward service/nginx-service 8083:80
```

* Build docker image

```
```

# Troubleshooting


* Clean all at the docker engine level

```sh
docker system prune -a --volume -f
```

* Error starting minikube: Error validating CNI config file /etc/cni/net.d/minikube.conflist

```
Removing the failed install of minikube cant hurt: `minikube delete --all`
Check your package version of containernetworking-plugins:`apt show containernetworking-plugins`

Go to http://archive.ubuntu.com/ubuntu/pool/universe/g/golang-github-containernetworking-plugins/ and download an up to date version

Install: `sudo dpkg -i containernetworking-plugins_1.1.1+ds1-3_amd64.deb`

`minikube start`
```

* 
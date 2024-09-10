# Playground

## Different development CLI

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

## Networking

To access a web app running in WSL2 from an external computer, you can port forward the desired ports in WSL 2 NAT. This is because WSL 2 creates a virtualized Ethernet adapter with its own IP address, which creates a NAT between the WSL instance and the Windows host computer.

```sh
# get ip address of WSL@ machine
ip a
# configura windows to have a port proxy
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=192.168.85.149
# Add a rule in he Windows firewall to authorize access to port 3000
```

## Important linux command

```sh
uname -a
```

## Minikube on local home network

### Minikube on WSL2 Ubuntu

* Installation

```sh
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

* Start a simple cluster with one node

```sh
minikube start
# ip address
minikube ip
# 192.168.49.2
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
### Remote access to Ubuntu computer on local LAN

* Start ssh server:

```sh
sudo apt install openssh-server
ip a
```

### Remote access to Fedora computer on local LAN

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

### Install minikube on Ubuntu

* Install docker podman

```sh
sudo apt install podman
```

* modify /etc/sudoers by adding `jerome ALL=(ALL) NOPASSWD: /usr/bin/podman`

```sh
sudo vi /etc/sudoers
```

* verify user can see the podman version

```sh
sudo -n -k prodman version
```

* Installation minikube

```sh
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

* Start minikube

```sh
minikube start --driver=podman
```

* Add any needed addons

```sh
minikube addons enable metrics-server
```
* Start a  kubernetes proxy so the Kubernetes APIs are served through port 8001

```sh
kubectl proxy 
```

* Start the Dashboard

```sh
minikube dashboard
```

* To access it remotely, using  SSH to your server, using -L option. (ubuntu1 was added to local `/etc/hosts`)

```sh
ssh -L 12345:localhost:8001 jerome@ubuntu1
```

Now the Kubernetes Dashboard is accessible remotly at [http://localhost:12345/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy](http://localhost:12345/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy)

### Install minikube on Fedora

* Install docker podman

```sh
sudo dnf install podman
```

* Install minikube [using instructions](https://minikube.sigs.k8s.io/docs/start)
* Verify system resources

```sh
lscpu
```

* Start a new VM

```sh
minikube config set rootless true
minikube config set driver podman
minikube start --cpus=2 --memory=4096
```

* In case of problem delete the vm with `minikube delete`

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
```

* Tar file could be updloaded to s3, and the s3 bucket exposed as HTTP web server to be used as repository. 
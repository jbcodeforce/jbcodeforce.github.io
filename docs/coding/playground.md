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

## Minkube as a local k8s

[See minikube dedicated notes](../techno/minikube.md)

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
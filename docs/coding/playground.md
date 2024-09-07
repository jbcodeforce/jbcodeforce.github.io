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

### Install minikube on fedora

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
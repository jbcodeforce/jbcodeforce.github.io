# Minikube how to

[Official getting started](https://minikube.sigs.k8s.io/docs/start/)

```sh
minikube update-check
# install new version
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
```

Personal script is `~/bin/ministart`, amy take some time if it downloads new VM image.

* Retrieve all Kubernetes context (they are saved in `~/bin/.kube/config`)

```sh
kubectl config get-contexts
```

* Change kubectl context between openshift and minikube:

```sh
kubectl config use-context minikube
kubectl config use-context default/c117-e-us-south-containers-cloud-ibm-com:31580/IAM#boyerje@us.ibm.com
# same with
kubectx minikube
```

* Retrieve the  nodes: 

```sh
kubectl get nodes
```

* Add the metric server to the minikube cluster

```sh
minikube addons enable metrics-server
```

* Dashboard UI

```sh
minikube dashboard
```

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


* Build docker image

```
```
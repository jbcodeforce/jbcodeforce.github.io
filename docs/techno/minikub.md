# Minikube how to

[Official getting started](https://minikube.sigs.k8s.io/docs/start/)

Personal script is ~/bin/ministart

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

* Expose the Docker daemon from minikube to the local terminal environment.

```sh
eval $(minikube -p minikube docker-env)
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
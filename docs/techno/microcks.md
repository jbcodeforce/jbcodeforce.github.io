# [Microcks.io](https://microcks.io/)

The Open source Kubernetes Native tool for API Mocking and Testing. 

## Value propositions

* One tool for all your APIs, events and WS
* Experiment with new APIs using the Backend as a Service feature, play and iterate before creating your API contract
* Mock and test continuously: Integrate seemlessly in your continuous build or pipelines
* Microcks can be deployed on any cloud provider on in-house infrastructure using Kube.


## Installation

### Local

See getting started doc [here:](https://microcks.io/documentation/getting-started/)

```sh
# ~/Code/Studies/microcks/install/docker-compose
docker compose up -d
```

### Kube

* install operator

```sh
kubectl apply -f https://microcks.io/operator/operator-latest.yaml
```

* Define a deployment

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: eda-microcks
  namespace: edademo-dev
spec:
  name: eda-microcks
  version: 1.4.1
  microcks:
    replicas: 1
  postman:
    replicas: 1
  keycloak:
    install: true
    persistent: true
    volumeSize: 1Gi
  mongodb:
    install: true
    persistent: true
    volumeSize: 2Gi
```

* install operand

```sh
# from project 
oc apply -k environments/edademo-dev/apps/services/microcks
```

Get pods:

```sh
oc get pods | grep microcks                                
eda-microcks-76f78d67dd-zxh6x                       1/1     Running   0          6m17s
eda-microcks-keycloak-7978fc6675-m2v56              1/1     Running   0          7m38s
eda-microcks-keycloak-postgresql-644d9554c4-hvgwj   1/1     Running   0          9m23s
eda-microcks-mongodb-b787c7ddd-p97vn                1/1     Running   0          10m
eda-microcks-postman-runtime-788f4f8f4c-kdkbz       1/1     Running   0          5m35s
microcks-ansible-operator-56cc794cd5-9vqr5          1/1     Running   0          31m
```

* Add user to microcks

Access KeyCloack secrets `eda-microcks-keycloak-admin` for username and password to 
access KeyCloack Administration UI

rNOvqKAqcVLVyQAGCKhihZkISxpTfdXe  adminuOLFM
Then from the exposed route, go to the UI and login to the admin console, then
Manage > Users > Add user
Add user johndoe and as an admin role: Role Mapping
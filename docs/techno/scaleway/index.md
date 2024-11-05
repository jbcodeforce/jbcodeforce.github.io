# Summary of [Scaleway cloud](https://www.scaleway.com/en/)

Scaleway is a cloud provider in Europe.

## Compute

It supports VM or Bare metal machines, see [offerings](https://www.scaleway.com/en/docs/compute/instances/reference-content/choosing-instance-type/), with [pricing information.](https://www.scaleway.com/en/pricing/)

There is a [scaleway CLI](https://github.com/scaleway/scaleway-cli) which can run in a docker image:

```sh
docker run -i --rm scaleway/cli:latest bash
```

## Container

### Container Registry

A fully-managed mutualize container registry. It uses the concept of namespace for isolation per region. A namespace can either be public or private. Anyone will be able to pull container images from a public namespace. Privacy policies may be set at image level.

The command to push image from local computer.

```sh
docker login rg.fr-par.scw.cloud/mynamespace -u nologin -p [SCW_SECRET_KEY]
# Push 
docker tag my_new_image:latest rg.fr-par.scw.cloud/mynamespace/my_new_image:latest
docker push rg.fr-par.scw.cloud/mynamespace/my_new_image:latest
```

### Serverless container

[Documentation](https://www.scaleway.com/en/docs/serverless/containers/quickstart/).

### Kubernetes

For K8s, the service to manage clusters is called **Kapsule**. See [Kubernetes doc](https://www.scaleway.com/en/docs/containers/kubernetes/). But to create clusters including instances from external cloud providers, the product is Kubernetes Kosmos.

To access to a kubernetes cluster we need a config to set `kubectl` context.

#### Setting specific kubectl context
 
Once the kubernetes cluster is provisioned and helm is installed, set the kubectl context in the /kube/config or in a separate file that define the config. The cluster has a name, the kubelet API endpoint,  and the TLS public certificate.

```yaml
apiVersion: v1
kind: Config
preferences: {}

# Define the cluster
clusters:
- name: athena-demo-cluster
  cluster:
    certificate-authority-data: LS0...=
    server: https://....4.api.k8s.fr-par.scw.cloud:6443
users:
- name: admin-user
  user:
    token: ey....Ag

# Define the context: linking a user to a cluster
contexts:
- context:
    cluster: athena-demo-cluster
    namespace: ibu
    user: admin-user
  name: athena-demo

# Define current context
current-context: athena-demo
```


if we need to push images to private Scaleway registry, we need to `docker login` with  a given access key

```
 $ docker login rg.fr-par.scw.cloud/athena-demo -u nologin --password ...
Login Succeeded

$docker push rg.fr-par.scw.cloud/athena-demo/owl-backend:latest
```

To be continued...
# Summary of [Scaleway cloud](https://www.scaleway.com/en/)

Cloud provider in Europe

## Compute

VM or Bare metal, see [offerings](https://www.scaleway.com/en/docs/compute/instances/reference-content/choosing-instance-type/), with [pricing information.](https://www.scaleway.com/en/pricing/)

There is a [scaleway CLI](https://github.com/scaleway/scaleway-cli) which can run in a docker image

```sh
docker run -i --rm scaleway/cli:latest
```

## Container

### Container Registry

A fully-managed mutualized container registry. It uses the concept of namespace for isolation per region. A namespace can either be public or private. Anyone will be able to pull container images from a public namespace. Privacy policies may be set at image level.

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
For K8s the service to manage clusters is Kapsule. See [Kubernetes doc](https://www.scaleway.com/en/docs/containers/kubernetes/). But to create clusters including Instances from external cloud providers, the product is Kubernetes Kosmos.
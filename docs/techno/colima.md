# Colima 

[Colima](https://github.com/abiosoft/colima) is container runtimes on macOS and Linux.

## Usage

```
colima start --kubernetes --cpu 4 --memory 16
```

See [flink studies](https://github.com/jbcodeforce/flink-studies/tree/master/e2e-demos/flink-to-sink-postgresql) for e2e demo which uses colima with flinl, kafka and postgresql operators.

The docker engine is exposed as docker context named colima.

```sh
docker context use colima
```

It is then possible to use docker compose and docker cli.

## Postgresql Operator

[Cloud Native Postgresql K8S operator.](https://cloudnative-pg.io/) to deploy Posgresql using CRD. [Quickstart](https://github.com/cloudnative-pg/cloudnative-pg/blob/main/docs/src/quickstart.md) and [installation](https://github.com/cloudnative-pg/cloudnative-pg/blob/main/docs/src/installation_upgrade.md).

Define a PG cluster, see [pg-cluster](https://github.com/jbcodeforce/flink-studies/blob/master/e2e-demos/flink-to-sink-postgresql/k8s/pg-cluster.yaml).
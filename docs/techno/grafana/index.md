# Grafana

Present data to human. Cloud SaaS model, or containerized deployment.

## Important links

* [Tutorials](https://grafana.com/tutorials)
* [OSS Getting started](https://grafana.com/docs/grafana/latest/getting-started/)
* [Git repo](https://github.com/grafana/grafana)
* [Installation for local playground](https://grafana.com/docs/grafana/latest/setup-grafana/installation/):

    * Grafana requires a database to store its configuration data, such as users, data sources, and dashboards
    * By default, Grafana uses an embedded SQLite version 3 database

* [Docker install](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/): OSS image is `grafana/grafana-oss` or free etp version: `grafana/grafana-enterprise`
* [Kubernetes deployment](https://grafana.com/docs/grafana/latest/setup-grafana/installation/kubernetes/)
* [Supported Datasources](https://grafana.com/docs/grafana/latest/datasources/) with one of the most used data sources: [Prometheus](https://grafana.com/docs/grafana/latest/datasources/prometheus/)
* [Grafana plugins page](https://grafana.com/grafana/plugins/)

## Concepts

* Data sources can be SQL database, Grafana Loki, Grafana Mimir, or a JSON-based API

<figure  markdown="span">
![](https://grafana.com/media/docs/grafana/dashboards-overview/dashboard-component-architecture.png){ width=600 }
<figcaption>The Dashboard component architecture</figcaption>
</figure>
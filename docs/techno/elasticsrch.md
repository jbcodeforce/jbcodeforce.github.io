# Elastic Search

Open source project to offer RESTful search and analytics engine for all types of data including textual, numerical, geospatial, structured or unstructured.


## Value proposition

* Add search capability to a web or mobile app
* Supports NoSQL query and build indexes
* Keep index in shards distributed over a cluster. Expose federated indexing and search capabilities across all servers within the cluster.
Cluster can be extended by adding new node.
* Near real time between when indexing a document until it becomes searchable.
* Combined with Kibana to present data, build dashboards and manage ES. Even supports some machine learning execution.
* Store a vast volume of data

### Use cases

* Time series data like logs. ELK stack. IT operations
* Search on unstructured data: webiste search, URL search, ride data
* Analytics: maketing insights, customer sentiment, fraud detection, anomaly detection.
* Data sources for Data scientists

## Getting started

See docker compose under `studies/elasticsearch` folder and [this note](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html).

Assess the node: `curl -X GET "localhost:9200/_cat/nodes?v&pretty"`.

Access to Kibana: [http://localhost:5601/app/home](http://localhost:5601/app/home)

Use Kibana dev tools console to put documents and do query.

From first experience with Kibana, use the `Sample eCommerce orders` from Analytics > Overview > Add data menu. See [this kibana tutorial](https://www.elastic.co/guide/en/kibana/7.x/get-started.html).

See [Quarkus elasticsearch guide](https://quarkus.io/guides/elasticsearch) for simple CRUD of java bean to json doc into ES.

## Deploying on OpenShift

Use operator hub and elasticsearch operator.

See [the ECK quickstart](https://www.elastic.co/guide/en/cloud-on-k8s/1.6/k8s-quickstart.html).

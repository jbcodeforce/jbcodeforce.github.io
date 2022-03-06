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
* Search on unstructured data: website search, URL search, ride data
* Analytics: maketing insights, customer sentiment, fraud detection, anomaly detection.
* Data sources for Data scientists

## Architecture

* Start as a scalable Lucene, to be an horizontal scalable search engine
* This is a server to return json payload.
* Kibana is the Web UI for searching and visualizing with complex analytics, graphs...
* Can be use to aggregate logs.
* Logstash and Beats feed data into elasticsearch, but not jsut Log files
* X-Pack: to add securty, alerting, monitoring, reporting, machine learning and Graph exploration

## Concepts:

* **Documents**: things we are searching for, text or Json. Every document has a unique ID and a type
* **Indices**: supports search into all documents within a collection of types. Indices contain *inverted indices* that let us search across 
everything within them at once. *Mappings* define schema for the data within.
* TF-IDF: Term Frequency (how often a term appears in a given document) * Inverse Document Frequency (term appears in all document). TF/ DF measures the *relevance* of a term in a document.
* Use REST API to search and post document.
* An index is split into Shards. Documents are hashed to particular shard. 
* An index has two primary shards and two replicas. 
* Write requests are routed to the primary shard then replicated
* Read request are routed to the primary or any replica
* number of primary shards can not be changed later

## Getting started

See docker compose under `studies/elasticsearch` folder and [this note](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html) or the [rt-inventory gitops]() repo for a local run.

Assess the node: `curl -X GET "localhost:9200/_cat/nodes?v&pretty"`.

Access to Kibana: [http://localhost:5601/app/home](http://localhost:5601/app/home)

Use Kibana dev tools console to put documents and do query.

From first experience with Kibana, use the `Sample eCommerce orders` from Analytics > Overview > Add data menu. See [this kibana tutorial](https://www.elastic.co/guide/en/kibana/7.x/get-started.html).


### Movie rating

The files are in this projectL `studies/elasticsearch/ml-latest-small` folder.

* Upload a movie:

```sh
curl -X PUT localhost:9200/movies/_doc/109487 -H 'content-type: application/json' -d '
{
    "genre": ["IMAX", "Sci-Fi"], "title": "Interstellar", "year": 2024
}
'
```

The ouput is 
```
{"_index":"movies","_id":"109487","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"_seq_no":0,"_primary_term":1}
```

* Upload the movies:

```sh
curl -X PUT localhost:9200/movies -H 'content-type: application/json' -d'@movies.csv'
```

To specify a date mapping do

```sh
curl -X PUT localhost:9200/movies -H 'content-type: application/json' -d '
{
    "mappings": {
        "properties": {
            "year" : { "type": "date" }
        }
    }
}
'
# Verify

curl -X GET localhost:9200/movies/_mapping
```

* Some other commong mappings: 

    * Not analyzing a field for search
    ```json
    "properties": {
            "genre" : { "index": "not_analyzed" }
        }
    ```

    * Field analyzer: to do character filters, tokenizer, and token filter
    ```json
    "properties": {
            "description" : { "analyzer": "english" }
        }
    ```

## Deploying on OpenShift

Use OpenShift Operator Hub and elasticsearch community operator.

See [the ECK quickstart](https://www.elastic.co/guide/en/cloud-on-k8s/1.6/k8s-quickstart.html).

## Connect Kafka Sink connector to Elasticsearch

* Here a json to send to distributed kafka connector:

```json
{
    "name": "elastic-sink",
    "config":
    {
        "connector.class": "com.ibm.eventstreams.connect.elasticsink.ElasticSinkConnector",
        "tasks.max": "1",
        "topics": "store.inventory,item.inventory",
        "es.connection": "elastic:9200",
        "es.document.builder": "com.ibm.eventstreams.connect.elasticsink.builders.JsonDocumentBuilder",
        "es.index.builder": "com.ibm.eventstreams.connect.elasticsink.builders.DefaultIndexBuilder",
        "es.identifier.builder": "com.ibm.eventstreams.connect.elasticsink.builders.DefaultIdentifierBuilder",
        "key.converter": "org.apache.kafka.connect.storage.StringConverter",
        "value.converter": "org.apache.kafka.connect.json.JsonConverter",
        "value.converter.schemas.enable": "false"
    }
}
```

* Command is in [the sendESSinkConfig script here](https://github.com/ibm-cloud-architecture/eda-rt-inventory-gitops/blob/main/local-demo/kstreams/sendESSinkConfig.sh)

```
curl -X POST  -w "%{http_code}" -H 'content-type: application/json' -d@"../kconnect/elastic-sink.json" http://$1/connectors
```

## Tutorial

* [Sundog material from the Udimy training](https://sundog-education.com/elasticsearch/)
* [Quarkus elasticsearch guide](https://quarkus.io/guides/elasticsearch) for simple CRUD of java bean to json doc into ES.

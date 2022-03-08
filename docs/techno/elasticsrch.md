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

* **Documents**: things we are searching for, text or Json. Every document has a unique ID and a type. They are immutable and has a `_version` field which is increase at each update. Old document is marked for deletion.
* **Indices**: supports search into all documents within a collection of types. Indices contain *inverted indices* that let us search across 
everything within them at once. *Mappings* define schema for the data within.
* TF-IDF: Term Frequency (how often a term appears in a given document) * Inverse Document Frequency (term appears in all document). TF/ DF measures the *relevance* of a term in a document.
* Use REST API to search and post document.
* An index is split into Shards. Documents are hashed to particular shard. 
* An index has two primary shards and two replicas. 
* Write requests are routed to the primary shard then replicated
* Read request are routed to the primary or any replica
* Number of primary shards can not be changed later
* As a fully distributed solution, two clients can try to update at the same time. So Elasticsearch uses the "Optimistic Consurrency Control", by adding `_seq_no` and `_primary_term` fields to each document. With those fields a second update will generate an error. 

## Getting started

See docker compose under `studies/elasticsearch` folder and [this note](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html) or the [rt-inventory gitops]() repo for a local run.

Assess the node: `curl -X GET "localhost:9200/_cat/nodes?v&pretty"`.

Access to Kibana: [http://localhost:5601/app/home](http://localhost:5601/app/home)

Use Kibana dev tools console to put documents and do query.

From first experience with Kibana, use the `Sample eCommerce orders` from Analytics > Overview > Add data menu. See [this kibana tutorial](https://www.elastic.co/guide/en/kibana/7.x/get-started.html).


### Some examples / playground

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

* Upload movies using bulk

```sh
curl -X POST localhost:9200/movies/_bulk -H 'content-type: application/json' -d'@movies.json'
```

* Upload a new collection

```sh
 curl -X PUT localhost:9200/_bulk  -H 'content-type: application/json' --data-binary @series.json
```

[Bulk API documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)

* To specify a date mapping do

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

* Search using [Lucene query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

```sh
# with ID
curl -X GET "localhost:9200/movies/_doc/58559?pretty"

# with query
curl -X GET "localhost:9200/movies/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "title": "Star Trek"  
    }
  }
}
'
```
The results will include records wil Star or Trek or both in the title. It will add a confident `_score`.

```json
  "max_score" : 2.4749136,
  "hits" : [
      {
        "_index" : "movies",
        "_id" : "135569",
        "_score" : 2.4749136,
        "_source" : {
          "id" : "135569",
          "title" : "Star Trek Beyond",
          "year" : 2016,
          "genre" : [
            "Action",
            "Adventure",
            "Sci-Fi"
          ]
        }
      },
      {
        "_index" : "movies",
        "_id" : "122886",
        "_score" : 0.6511494,
        "_source" : {
          "id" : "122886",
          "title" : "Star Wars: Episode VII - The Force Awakens",
          "year" : 2015,
          "genre" : [
            "Action",
            "Adventure",
            "Fantasy",
            "Sci-Fi",
            "IMAX"
          ]
        }
      }
```

* **Update:** can be done with a PUT and the full document as payload or use a partial update with a POST.

```sh
curl -X PUT  -H 'content-type: application/json'  localhost:9200/movies/_doc/109487  -d '\n{\n    "genre": ["IMAX", "Sci-Fi"], "title": "Interstellar", "year": 2024\n}\n'
# OR Partial update
curl -X POST  -H 'content-type: application/json'  localhost:9200/movies/_doc/109487/_update -d '{"title": "Interstellar 2"}'
# Partial update with retry conflict
curl -X POST  -H 'content-type: application/json'  localhost:9200/movies/_doc/109487/_update?retry_on_conflict=5 -d '{"doc": {"title": "Interstellar 2"}}'
```

### Searching

To search on exact word , for example on some enumerated value, use a mapping for the enumerated field to be of type `keyword`.

### Data Modeling

Recall that, **normalized** data is used to reduce storage space, and it makes easy to change one field in one of the aggregated records. But it requires two queries to get the full expected data: the movie title and the rating.

For parent-child relationship we can create series by joining two collections. This is done by defining a mappings of type `join`.

```sh
curl -X PUT localhost:9200/series -H 'content-type: application/json' -d '
{
    "mappings": {
        "properties": {
            "film_to_franchise" : {
                "type": "join",
                "relations": {"franchise": "film" }
            }
        }
    }
}'
# results
{"acknowledged":true,"shards_acknowledged":true,"index":"series"}
```
* Get default mappings for an index

```sh
curl -XGET "http://127.0.0.1:9200/demo-default/_mapping?pretty=true"
```
* Upload data: (see folde/studies/elasticsearch/ml-latest-small)

```sh
curl -X PUT localhost:9200/_bulk  -H 'content-type: application/json' --data-binary @series.json
```

* Search using the parent - child relationship
```json
{ 
    "query": { 
        "has_parent": { 
            "parent_type": "franchise", 
            "query": {
                "match": { 
                    "title": "Star Wars"}
            }
        }
    }
}
```
Should return the films from Start Wars franchise.

or

```json
{ 
    "query": { 
        "has_child": { 
            "type": "film", 
            "query": {
                "match": { 
                    "title": "The Force Awakens"}
            }
        }
    }
}
```

Should return "Star Wars" franchise.

## Flattened Datatype

To control the explosion of mappings, when the data model is hierarchy, ElasticSearch uses the concepts of flattened datatype. The host content is flattened:

```
curl -XPUT "http://127.0.0.1:9200/demo-flattened/_mapping" -d'{
  "properties": {
    "host": {
      "type": "flattened"
    }
  }
}'
```

No tokenizer or analyzer will be used in flattened. 

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


## Kibana


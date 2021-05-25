# Apache Atlas

[Apache Atlas](https://atlas.apache.org/index.html#/) is a data governance tool which facilitates gathering, processing, and maintaining metadata.

The architecture illustrates that Atlas expose APIs to add and query elements of the repository, but also is integrated with Kafka for asynchronous communication.

 ![](https://atlas.apache.org/public/images/twiki/architecture.png)

The Core framework includes a graph database based on [JanusGraph](https://janusgraph.org/).

## Key features

* Centralized metadata management platform
* Data classification based on rules and regex. Identify the incoming data and filter them out based on those classifications.
* Data lineage: shows the origin, movement, transformation and destination of data.

## Concepts

Some important concepts to know:

* a `Type` in Atlas is a definition of how particular types of metadata objects are stored and accessed. 
A type represents one or a collection of attributes that define the properties for the metadata object.
* An `Entity` is an instance of a Type
* A type has a metatype. Atlas has the following metatypes:

    * Primitive metatypes: boolean, byte, short, int, long, float, double, biginteger, bigdecimal, string, date
    * Enum metatypes
    * Collection metatypes: array, map
    * Composite metatypes: Entity, Struct, Classification, Relationship
* Atlas comes with a few pre-defined system types: Referenceable, Asset, Infrastructure, DataSet, Process. The ones very interesting are:

    * **Infrastructure** extends Asset and may be used for cluster, host,...
    * **DataSet** extends Referenceable, represents an type that stores data. Expected to have a Schema to define attributes
    * **Process** extends Asset represents any data transformation operation.

* We can define `Classification` by defining new type: 

```json
 {
    "category": "CLASSIFICATION",
    "name": "customer_PII",
    "description": "Used for classifying a data which contains customer personal information, hence indicating confidential private",
    "typeVersion": "1.0",
    "attributeDefs": [],
    "superTypes": []
}
```

* A type can extend another type: A `kafka_topic_schema` is an array of `kafka_message_schema`:

```json
{
        "superTypes" : [ "kafka_topic" ],
        "category" : "ENTITY",
        "name" : "kafka_topic_and_schema",
        "attributeDefs" : [
          {
            "name" : "value_schema",
            "typeName" : "array<kafka_message_schema>",
            "isOptional" : true,
            "cardinality" : "SINGLE",
            "valuesMinCount" : 1,
            "valuesMaxCount" : 1,
            "isUnique" : false,
            "isIndexable" : false
          },
        ]
}
```

## Useful documentation

* [REST API v2](https://atlas.apache.org/api/v2/index.html)

## Getting started

* Start with docker:

```sh
docker run -d -p 21000:21000 -p 21443:21443 --name atlas sburn/apache-atlas /opt/apache-atlas-2.1.0/bin/atlas_start.py
```

Login in as `admin/admin`.

* Start with a docker compose:

```yaml
services:
  atlas:
    container_name: atlas
    hostname: atlas
    image: sburn/apache-atlas
    ports:
      - 21000:21000 
      - 21443:21443
    environment:
      MANAGE_LOCAL_HBASE: "true"
      MANAGE_LOCAL_SOLR: "false"
    command:
      /opt/apache-atlas-2.1.0/bin/atlas_start.py
    volumes:
      - $PWD/environment/atlas/data:/tmp/data/
```


* Define new types See project [eda-governance](): 

example define a Kafka_Cluster type to be an Infrastructure

```json
"entityDefs": [
    {
      "superTypes": [
        "Infrastructure"
      ],
      "category": "ENTITY",
      "name": "eda_kafka_cluster",
      "description": "a Kafka Cluster groups multiple Kafka Brokers and manage topics",
      "typeVersion": "1.0",
      "attributeDefs": [
        {
          "name": "cluster.name",
          "typeName": "string",
          "isOptional": false,
          "cardinality": "SINGLE",
          "valuesMinCount": 1,
          "valuesMaxCount": 1,
          "isUnique": true,
          "isIndexable": true
        }, 
        ....
```

* Define dataset entities

```json
"entities": [
    {
      "typeName": "eda_kafka_cluster",
      "createdBy": "maas_service",
      "attributes": {
        "qualifiedName": "assets-arch-eda.eda-dev",
        "cluster.name": "eda-dev",
        "description": "EDA team's event streams 2020 cluster",
        ...
```

* Define process entities


## Continuous visibility of flows


## Source of readings

* [Model governance with Atlas - part 1](https://community.cloudera.com/t5/Community-Articles/Customizing-Atlas-Part1-Model-governance-traceability-and/ta-p/249250)
* [Model governance with Atlas - part 2](https://community.cloudera.com/t5/Community-Articles/Customizing-Atlas-Part2-Deep-source-metadata-embedded/ta-p/249377)
* [Model governance with Atlas - part 3](https://community.cloudera.com/t5/Community-Articles/Customizing-Atlas-Part3-Lineage-beyond-Hadoop-including/ta-p/249318)

* [Atlas Helm Chart with Solr and cassandra](https://github.com/manjitsin/atlas-helm-chart)
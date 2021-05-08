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

* a `Type` in Atlas is a definition of how particular types of metadata objects are stored and accessed. A type represents one or a collection of attributes that define the properties for the metadata object.
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

* We can define Classification for defining new type: 

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
* A type can extend another type:

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

* Define new types
* Define dataset entities
* Define process entities


## Continuous visibility of flows


# Apicurio

[Apicurio](https://www.apicur.io) includes a registry to manage Avro, json, protobuf schemas, and an API registry to manage OpenApi and AsynchAPI.

It is a Cloud-native Quarkus Java runtime for low memory footprint and fast deployment times. It supports [different persistences](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/getting-started/assembly-intro-to-the-registry.html#registry-distros) like Kafka and Postgresql and different deployment models.

## Registry

Apicurio Registry is a datastore for sharing standard event schemas and API designs across API and event-driven architectures.
In the messaging and event streaming world, data that are published to topics and queues often must be serialized or validated using a Schema.

The registry supports adding, removing, and updating the following types of artifacts: OpenAPI, AsyncAPI, GraphQL, Apache Avro, Google protocol buffers, JSON Schema, Kafka Connect schema, WSDL, XML Schema (XSD).

It includes configurable rules to control the validity and compatibility.

The registry can be configured to store data in various back-end storage systems, depending on use-case, including Kafka, PostgreSQL, and Infinispan.

Client applications can dynamically push or pull the latest schema updates to or from Apicurio Registry at runtime without needing to redeploy.

Full Apache Kafka schema registry API support, including integration with Kafka Connect for external systems. Compatibility with existing Confluent schema registry client applications.

It includes client serializers/deserializers (Serdes) to validate Kafka and other message types at runtime.

## Avro

Quick [getting started on Avro with Java](https://avro.apache.org/docs/current/gettingstartedjava.html). We need:

* Define .avsc file (JSON doc) for each type. Schemas are composed of primitive types (null, boolean, int, long, float, double, bytes, and string) and complex types (record, enum, array, map, union, and fixed).
* Use Avro Maven plugin to generate Java beans from the schema definition

To access avro classes:

```
<dependency>
  <groupId>org.apache.avro</groupId>
  <artifactId>avro</artifactId>
  <version>1.10.1</version>
</dependency>
```

### From schema to beans

Define one to many `.avcs` file in the `src/main/avro` folder. Then to generate java beans from those schema definitions use the avro maven plugin. The order of schema processing is important to build the dependencies before the records using them (see imports statement below):

```xml
<plugin>
        <groupId>org.apache.avro</groupId>
        <artifactId>avro-maven-plugin</artifactId>
        <version>${avro.version}</version>
        <executions>
          <execution>
            <phase>generate-sources</phase>
            <goals>
              <goal>schema</goal>
            </goals>
            <configuration>
              <sourceDirectory>src/main/avro/</sourceDirectory>
              <outputDirectory>src/main/java/</outputDirectory>
              <!-- need to specify order for dependencies -->
              <imports>
                <import>src/main/avro/Address.avsc</import>
                <import>src/main/avro/OrderCreatedEvent.avsc</import>
              </imports>
              <stringType>String</stringType>
            </configuration>
          </execution>
        </executions>
      </plugin>
```

The beans created will be in the Java package as defined in the namespace attribute:

```json

    "namespace": "ibm.eda.demo.app.infrastructure.events",
    "type": "record",
    "name": "OrderEvent",
    "fields": []
```

See the project template [quarkus-kafka-producer](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-kafka-producer) for example of order events Avro Schema with bean generation.

### From beans to schema

The [Jackson parser](https://github.com/FasterXML/jackson-dataformats-binary/tree/master/avro#generating-avro-schema-from-pojo-definition) offers such capability, so you can add a small program to create a schema from your beans.

## Install on OpenShift with Kafka as persistence storage

See the [notes here](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/getting-started/assembly-installing-registry-storage-openshift.htm)

* Install Strimzi operator - create a Strimzi cluster (See [vaccine-gitops strimzi env](https://github.com/ibm-cloud-architecture/vaccine-gitops/tree/main/environments/strimzi))
* Install Apicurio operator (search from registry in Operator Hub) - define one registry instance.
* Get Kafka bootstrap internal listener address
* Create the `storage-topic` and `global-id-topic` topic
* Create the Apicurio instance using the bootstrap URL, see this example of yaml (See [vaccine-gitops Apicurio env](https://github.com/ibm-cloud-architecture/vaccine-gitops/tree/main/environments/apicurio))

```yaml
apiVersion: apicur.io/v1alpha1
kind: ApicurioRegistry
metadata:
  name: eda-apicurioregistry
spec:
  configuration:
    persistence: "streams"
    streams:
      bootstrapServers: "vaccine-kafka-kafka-bootstrap.vaccine-order.svc:9092"
```

## Manage artifacts with Maven

You can use the Apicurio Registry Maven plug-in to upload or download registry artifacts as part of your development build. The plugin is:

```xml
<plugin>
  <groupId>io.apicurio</groupId>
  <artifactId>apicurio-registry-maven-plugin</artifactId>
  <version>${registry.version}</version>
  <executions>
    <execution>
      <phase>generate-sources</phase>
      <goals>
        <goal>register</goal>
      </goals>
      <configuration>
        <registryUrl>http://localhost:8090/api</registryUrl>
        <artifactType>AVRO</artifactType>
        <artifacts>
          <!-- the name of the tag will be the id of the schema
          
          -->
          <order-schema1>src/main/avro/Address.avsc</order-schema1>
          <order-schema2>src/main/avro/OrderCreatedEvent.avsc</order-schema2>
          <order-schema3>src/main/avro/OrderEvent.avsc</order-schema3>
        </artifacts>
      </configuration>
    </execution>
  </executions>
</plugin>
```

## Manage artifacts with REST api

Use the [Registry REST API](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/getting-started/assembly-managing-registry-artifacts-api.html) with curl to upload schema definition, artifactType and  ArtifactId in header to send metadata about the schema:

```shell
curl -X POST -H "Content-type: application/json; artifactType=AVRO" -H "X-Registry-ArtifactId: share-price" --data '{"type":"record","name":"price","namespace":"com.example","fields":[{"name":"symbol","type":"string"},{"name":"price","type":"string"}]}' http://MY-REGISTRY-HOST/api/artifacts
```


## Kafka de/serializer

To configure the producer we need:

* URL of Apicurio Registry
* Apicurio Registry serializer to use with the messages

The we have to add properties to the Kafka producer as:

```java
// Define serializers
props.putIfAbsent(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.putIfAbsent(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, AvroKafkaSerializer.class.getName());
 // Configure Service Registry location and ID strategies
props.putIfAbsent(AbstractKafkaSerDe.REGISTRY_URL_CONFIG_PARAM, "http://localhost:8090/api");
```

* Define the `strategy` to map the Kafka message to an artifact ID in Apicurio Registry
* Define the `Strategy` to look up or register the schema used for serialization in Apicurio Registry

```java
props.putIfAbsent(AbstractKafkaSerializer.REGISTRY_ARTIFACT_ID_STRATEGY_CONFIG_PARAM,
            SimpleTopicIdStrategy.class.getName());
props.putIfAbsent(AbstractKafkaSerializer.REGISTRY_GLOBAL_ID_STRATEGY_CONFIG_PARAM,
            FindBySchemaIdStrategy.class.getName());
```

* Define the schema via code

```java
private static void createSchemaInServiceRegistry(String artifactId, String schema) throws Exception {
      try {
          RegistryRestClient client = RegistryRestClientFactory.create(REGISTRY_URL);
          ByteArrayInputStream content = new ByteArrayInputStream(schema.getBytes(StandardCharsets.UTF_8));
          ArtifactMetaData metaData = client.createArtifact(artifactId, ArtifactType.AVRO, IfExistsType.RETURN, content);
          LOGGER.info("=====> Successfully created Avro Schema artifact in Service Registry: " + metaData);
      } catch (Exception t) {
          throw t;
      }
  }
```

Example of output:

```shell
Successfully created Avro Schema artifact in Service Registry: ArtifactMetaData{name='BasicMessage', description='null', labels='[]', createdBy='null', createdOn=1615340019637, modifiedBy='null', modifiedOn=1615340019637, id='test', version=1, type=AVRO, globalId=18, state=ENABLED, properties={}}
```

See simplest code in the `apicurio` folder of [Kafka Studies](https://github.com/jbcodeforce/kafka-studies/)

## Useful links

[Apicurio Registry Operator community in GitHub](https://github.com/Apicurio/apicurio-registry-operator)
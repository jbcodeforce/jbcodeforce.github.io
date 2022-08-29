# Apicurio

[Apicur.io](https://www.apicur.io) includes a [schema registry](https://www.apicur.io/registry/docs/apicurio-registry/2.1.x/index.html) to store schema definitions. 
It supports Avro, json, protobuf schemas, and an API registry to manage OpenApi and AsynchAPI definitions.

It is a Cloud-native Quarkus Java runtime for low memory footprint and fast deployment times. It supports [different persistences](https://www.apicur.io/registry/docs/apicurio-registry/2.1.x/getting-started/assembly-intro-to-the-registry.html#registry-storage_registry)
like Kafka, Postgresql, Infinispan and supports different deployment models.

## Registry Characteristics

* Apicurio Registry is a datastore for sharing standard event schemas and API designs across API and event-driven architectures.
In the messaging and event streaming world, data that are published to topics and queues often must be serialized or validated using a Schema.
* The registry supports adding, removing, and updating the following types of artifacts: OpenAPI, AsyncAPI, GraphQL, Apache Avro, Google protocol buffers, JSON Schema, Kafka Connect schema, WSDL, XML Schema (XSD).
* Schema can be created via Web Console, core REST API or Maven plugin
* It includes configurable rules to control the validity and compatibility.
* Client applications can dynamically push or pull the latest schema updates to or from Apicurio Registry at runtime.
Apicurio is compatible with existing Confluent schema registry client applications.
* It includes client serializers/deserializers (Serdes) to validate Kafka and other message types at runtime.
* Operator-based installation of Apicurio Registry on OpenShift
* Use the concept of artifact group to collect schema and APIs logically related.
* Support search for artifacts by label, name, group, and description

When using Kafka as persistence, special Kafka topic `<kafkastore.topic>` (default `_schemas`), with a single partition, is used as a highly available write ahead log. 
All schemas, subject/version and ID metadata, and compatibility settings are appended as messages to this log. 
A Schema Registry instance therefore both produces and consumes messages under the `_schemas` topic. 
It produces messages to the log when, for example, new schemas are registered under a subject, or when updates to 
compatibility settings are registered. Schema Registry consumes from the `_schemas` log in a background thread, and updates its local 
caches on consumption of each new `_schemas` message to reflect the newly added schema or compatibility setting. 
Updating local state from the Kafka log in this manner ensures durability, ordering, and easy recoverability.

## Apicurio Studio

[The apicurio studio project](https://github.com/apicurio/apicurio-studio) is a standalone API design studio that can be used to create new or edit existing API designs.

There are three runtime components in Apicurio and one Keycloak authentication server:

* **apicurio-studio-api** - the RESTful API backend for the user interface.
* **apicurio-studio-ws** - a WebSocket based API used only by the Apicurio Editor to provide real-time collaboration with other users.
* **apicurio-studio-ui** - the Angular 5+ based user interface.

To run a light version of Studio use Apicurito (edit locally OpenAPI doc):

```sh
docker run -it -p 8080:8080 -p 8443:8443 apicurio/apicurio-studio-ui:latest-release
```

## V1.3.x

As of Event Streams version 10.5, the schema registry was based on Apicur.io 1.3.x.

[Product documentation](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/index.html).

The docker compose in [EDA quickstarts environment: kafka-2.8-apicurio-1.3](https://github.com/ibm-cloud-architecture/eda-quickstarts/blob/main/environment/local/strimzi/kafka-2.8-apicurio-1.3.yaml) uses 1.3.2 in-memory image for development purpose.

Access the user interface with: http://localhost:8091/ui

REST, maven or Java API can  be used to upload schemas.

* Add maven dependencies for rest client
* URL is with `/api/artifacts`

### Manage artifacts with REST api

Use the [Registry REST API](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/getting-started/assembly-managing-registry-artifacts-api.html) with curl to upload schema definition, 
artifactType and ArtifactId in HTTP header to send the metadata about the schema:

```shell
curl -X POST -H "Content-type: application/json; artifactType=AVRO" -H "X-Registry-ArtifactId: share-price" --data '{"type":"record","name":"price","namespace":"com.example","fields":[{"name":"symbol","type":"string"},{"name":"price","type":"string"}]}' http://localhost:9081/api/artifacts
```

When a schema is uploaded, you may configure content rules for schema validity and compatibility checks.


### Kafka de/serializer

To configure the producer we need:

* URL of Apicurio Registry
* Apicurio Registry serializer to use with the messages (AvroKafkaSerializer)
* Strategies to map kafka message to artifact ID and to look up or register the schema used for serialization.

Then we have to add the following properties to the Kafka producer:

```java
// Define serializers
props.putIfAbsent(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.putIfAbsent(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, io.apicurio.registry.utils.serde.AvroKafkaSerializer.class.getName());
 // Configure Service Registry location and ID strategies
props.putIfAbsent(AbstractKafkaSerDe.REGISTRY_URL_CONFIG_PARAM, "http://localhost:8091/api");
```

* Define the `strategy` to map the Kafka message to an artifact ID in Apicurio Registry
* Define the `Strategy` to look up or register the schema used for serialization in Apicurio Registry

```java
props.putIfAbsent(AbstractKafkaSerializer.REGISTRY_ARTIFACT_ID_STRATEGY_CONFIG_PARAM,
            SimpleTopicIdStrategy.class.getName());
props.putIfAbsent(AbstractKafkaSerializer.REGISTRY_GLOBAL_ID_STRATEGY_CONFIG_PARAM,
            FindBySchemaIdStrategy.class.getName());
```

* Create the schema within the registry using REST API client:

```java
private static void createSchemaInServiceRegistry(String artifactId, String schema) throws Exception {
    try {
          ArtifactMetaData metaData = registryClient.getArtifactMetaData(getConfiguration().getArtifactId());
          logger.info("Schema already in registry: " + metaData.toString());
      } catch (WebApplicationException e) {
          InputStream content = new ByteArrayInputStream(avroSchema.toString().getBytes(StandardCharsets.UTF_8));
          ArtifactMetaData metaData = 
            registryClient.createArtifact(getConfiguration().getArtifactId(), ArtifactType.AVRO, IfExistsType.RETURN, content);
          logger.info("Schema created in registry:" + metaData.toString());
      }
}
```

Example of output:

```sh
Successfully created Avro Schema artifact in Service Registry: 
ArtifactMetaData{name='BasicMessage', description='null', labels='[]', createdBy='null', createdOn=1615340019637, modifiedBy='null', modifiedOn=1615340019637, id='test', version=1, type=AVRO, globalId=18, state=ENABLED, properties={}}
```

See simplest code in the `apicurio` folder of [Kafka Studies](https://github.com/jbcodeforce/kafka-studies/)

Or Kafka producer code template in [Kafka with API and apicur.io](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-kafka-producer)
and consumer.

## Apicur.io 2.2.x

Event Streams [version 11.0.x uses Apicur.io 2.2.x](https://ibm.github.io/event-streams/schemas/overview/#schema-registry). This version is using different APIs and rest client code.

It supports OpenAPI, AsyncAPI, GraphQL, Apache Avro, Google protocol buffers, JSON Schema, Kafka Connect schema, WSDL, XML Schema (XSD)

The registry can be configured to store data in various back-end storage systems depending on use-case, including Kafka, PostgreSQL, and Infinispan.

Quarkus dev mode with the extension: `quarkus-apicurio-registry-avro` start apicurio 2.x container,
and reactive messaging with the `io.apicurio.registry.serde.avro.AvroKafkaSerializer` serializer create schema definition directly to the registry.

See [Quarkus apicur.io dev mode guide](https://quarkus.io/guides/apicurio-registry-dev-services) and the [kafka - apicur.io guide](https://quarkus.io/guides/kafka-schema-registry-avro).

### Installation in the context of event streams

* For Event Streams - schema registry deployment the installation is done by adding the following element into the kafka cluster definition (see [this deployment](https://github.com/ibm-cloud-architecture/eda-rt-inventory-gitops/blob/main/environments/rt-inventory-dev/services/ibm-eventstreams/base/eventstreams-dev.yaml)):

```yaml
  apicurioRegistry:
    livenessProbe:
      initialDelaySeconds: 120
```

The Event Stream UI includes a way to manage schema by human. For code based management we need to have a user with ACL to create schema.

* We can install a standalone Apicur.io registry outside of IBM Event Streams, which may make sense when we need to manage multiple Kafka clusters.

Via OpenShift Operator hub or via subscription.yaml see [eda-gitops-catalog/apicurio/operator](https://github.com/ibm-cloud-architecture/eda-gitops-catalog/tree/main/apicurio)

For application code that uses version 2.x [quarkus-reactive-kafka-producer template](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-reactive-kafka-producer) or [the order demo app (producer)](https://github.com/jbcodeforce/eda-demo-order-ms) and the [simplest string consumer](https://repo1.maven.org/maven2/com/ibm/mq/com.ibm.mq.allclient).

### Installing standalone in OCP

* Install Apicurio operator (search from registry in Operator Hub for `Apicurio Registry Operator`)
* Get Kafka bootstrap internal listener address
* Define one registry instance

```yaml
```

* Create the `storage-topic` and `global-id-topic` topics

### Reactive messaging

For the Microprofile Reactive messaging configuration consider the following:

* Set at least the value serializer to use AvroKafkaSerializer so it can transparently manage auto registry of 
the schema. (example for the `orders` channel). NOT needed any more with quarkus that will use as the `apicurio.avro` extension is in the libraries. 

```sh
mp.messaging.outgoing.orders.key.serializer=org.apache.kafka.common.serialization.StringSerializer
mp.messaging.outgoing.orders.value.serializer=io.apicurio.registry.serde.avro.AvroKafkaSerializer
mp.messaging.outgoing.orders.apicurio.registry.auto-register=true
mp.messaging.outgoing.orders.apicurio.registry.artifact-id=io.apicurio.registry.utils.serde.strategy.SimpleTopicIdStrategy
mp.messaging.outgoing.orders.apicurio.registry.global-id=io.apicurio.registry.utils.serde.strategy.GetOrCreateIdStrategy
```

if you want to configure cross channels then move the declaration at kafka level:

```sh
kafka.apicurio.registry.auto-register=true
kafka.apicurio.registry.url=http://localhost:8081/apis/registry/v2
```

* For securized connection, add TLS and authentication

```sh
# Use same schema registry server cross channel
%prod.kafka.apicurio.registry.url=${ES_APICURIO_URL}
# Or by using a per channel setting
%prod.mp.messaging.outgoing.orders.apicurio.registry.url=${ES_APICURIO_URL}
```

Be sure the URL finishes with `/apis/registry/v2`. URL may be set in a config map, as in the 
[eda-demo-order-gitops app-eda-demo-order-ms](https://raw.githubusercontent.com/jbcodeforce/eda-demo-order-gitops/main/environments/edademo-dev/apps/app-eda-demo-order-ms/base/configmap.yaml) project.

In the Quarkus guide in quarkus-quickstarts, running in `quarkus dev`, we need to look at the trace to get the apicurio URL, then we can use the api to search for the movies schema already created. The id of the schema is the topic name + `-value`.

```sh
http://localhost:61272/apis/registry/v2/search/artifacts
```
For mTLS authentication to schema registry see the [Store simulator project](https://github.com/ibm-cloud-architecture/refarch-eda-store-simulator).

For order consumer with schema registry see the [eda-demo-order-mp-consumer](https://github.com/jbcodeforce/eda-demo-order-mp-consumer) project.

## Developer experience

* Define your microservice with JAXRS and Swagger annotation. Here is a [guide for quarkus openapi and swagger-ui](https://quarkus.io/guides/openapi-swaggerui) for details.
Below is an example of properties to add to a quarkus `application.properties` file:

  ```sh
  mp.openapi.extensions.smallrye.info.title=Example API
  mp.openapi.extensions.smallrye.info.version=1.0.0
  mp.openapi.extensions.smallrye.info.description=Just an example service
  mp.openapi.extensions.smallrye.info.termsOfService=Your terms here
  mp.openapi.extensions.smallrye.info.contact.email=techsupport@example.com
  mp.openapi.extensions.smallrye.info.contact.name=API Support
  mp.openapi.extensions.smallrye.info.contact.url=http://exampleurl.com/contact
  mp.openapi.extensions.smallrye.info.license.name=Apache 2.0
  mp.openapi.extensions.smallrye.info.license.url=https://www.apache.org/licenses/LICENSE-2.0.html
  ```
  
* When starting from the openAPI document, we can push the api as file to 
the `META-INF/openapi.yaml` or as a `.json`
* Get the OpenAPI definition using curl [http://localhost:8080/q/openapi](http://localhost:8080/q/openapi)
* Define an artifact group to group elements inside Apicurio Registry - can be by environment or can be line of business 
or any thing to group elements.
* Decide if you want to use Avro or JSON Schema - Apicurio has both serdes to integrate into you code:

### Producer

Define AsyncAPI.

### Consumer

The consumer uses the GenericRecord class

```java
    @Incoming("shipments")
    @Outgoing("internal-plan-stream")                             
    @Broadcast                                              
    @Acknowledgment(Acknowledgment.Strategy.POST_PROCESSING)
    public Uni<ShipmentPlans> process(GenericRecord spse){  
        //GenericRecord spse = evt.getPayload();
        int idx = 0;
        logger.info(spse);
        CloudEvent ce = jsonb.fromJson(spse.toString(), CloudEvent.class);
        for (ShipmentPlanEvent spe : ce.data.Shipments) {
            ShipmentPlan plan = ShipmentPlan.from(spe);
            logger.info(plan.toString());
            plans.put("SHIP_" + idx,plan);
            idx++;s
        }
        ShipmentPlans shipmentPlans = new ShipmentPlans();
        shipmentPlans.plans = new ArrayList<ShipmentPlan>(this.plans.values());
        return Uni.createFrom().item(shipmentPlans);
    }
```

### Read more

* [Official demo](https://github.com/Apicurio/apicurio-registry-demo)
* [Using Debezium With the Apicurio API and Schema Registry](https://debezium.io/blog/2020/04/09/using-debezium-with-apicurio-api-schema-registry/)
* [Quarkus apicur.io dev mode guide](https://quarkus.io/guides/apicurio-registry-dev-services)
* [kafka - apicur.io Quarkus guide](https://quarkus.io/guides/kafka-schema-registry-avro).
* [Clement Escoffier's blog](https://quarkus.io/blog/kafka-avro/)
* [Kafka Quarkus reference guide](https://quarkus.io/guides/kafka)

## Avro

Quick [getting started on Avro with Java](https://avro.apache.org/docs/current/gettingstartedjava.html). We need to:

* Define .avsc file (JSON doc) for each type. Schemas are composed of primitive types (null, boolean, int, long, float, double, bytes, and string) 
and complex types (record, enum, array, map, union, and fixed).
* Use Avro Maven plugin to generate Java beans from the schema definition

To access avro classes directly add this dependencies:

```xml
<dependency>
  <groupId>org.apache.avro</groupId>
  <artifactId>avro</artifactId>
  <version>1.10.1</version>
</dependency>
```

### From schema to beans

!!! News
    With Quarkus 2.x the extension `apicurio-registry-avro` auto generates the java classes from .avcs declaration in `src/main/avro`. 
    The `.avsc` file needs to be an union of schema definitions. See [this quarkus guide](https://quarkus.io/guides/kafka-schema-registry-avro), 
    [quarkus dev and apicurio](https://quarkus.io/guides/apicurio-registry-dev-services) 
    and [this reactive messaging project](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-reactive-kafka-producer)
    See [Clement Escoffier's blog](https://quarkus.io/blog/kafka-avro/)

Define one to many `.avcs` file in the `src/main/avro` folder. 

See note above, the following is for older quarkus version or pure java: to generate java beans from those schema 
definitions, use the [avro maven plugin](https://mvnrepository.com/artifact/org.apache.avro/avro-maven-plugin). The order of schema processing is important to build the dependencies
 before the records using them (see imports statement below):

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
          <import>src/main/avro/OrderEvent.avsc</import>
        </imports>
        <stringType>String</stringType>
      </configuration>
    </execution>
  </executions>
</plugin>
```

The beans created will be in the Java package as defined by the `namespace attribute`:

```json
  "namespace": "ibm.eda.demo.app.infrastructure.events",
  "type": "record",
  "name": "OrderEvent",
  "fields": []
```

### CloudEvent and Avro

Need to get the following maven dependencies

```xml
    <dependency>
      <groupId>io.cloudevents</groupId>
      <artifactId>cloudevents-kafka</artifactId>
      <version>2.3.0</version>
    </dependency>
    <dependency>
      <groupId>io.quarkus</groupId>
      <artifactId>quarkus-apicurio-registry-avro</artifactId>
    </dependency>
```

With `quarkus-apicurio-registry-avro` a set of beans are created under target/generated-source/avsc

```java
     CloudEventBuilder ceb = CloudEventBuilder.v1().withSource(URI.create("https://github.com/jbcodeforce/eda-demo-order-count-kstream/"))
        .withType("OrderEvent");
        Address address = Address.newBuilder()
            .setStreet("mission street")
            .setCity("San Francisco")
            .setState("CA")
            .setCountry("USA")
            .setZipcode("94000")
            .build();
        OrderEvent oe = OrderEvent.newBuilder()
        .setOrderID("O01")
        .setCustomerID("C01")
        .setProductID("P01")
        .setQuantity(10)
        .setStatus("Pending")
        .setCreationDate("2022-03-10")
        .setUpdateDate("2022-03-15")
        .setEventType("OrderCreated")
        .setShippingAddress(address)
        .build();
        System.out.println(oe.toString());
        String id = UUID.randomUUID().toString();
        ByteBuffer bb = OrderEvent.getEncoder().encode(oe);
        System.out.println(bb.toString());
        byte[] data = new byte[bb.remaining()];
        bb.get(data, 0, data.length);
        CloudEvent ce = ceb.newBuilder().withId(id).withData("application/avro",  data).build();
        System.out.println(ce.toString());
```

### From beans to schema

The [Jackson parser](https://github.com/FasterXML/jackson-dataformats-binary/tree/master/avro#generating-avro-schema-from-pojo-definition) offers such 
capability, so you can add a small program to create a schema from your beans, using 
the AvroFactory, SchemaGenerator...

Add this to your pom:

```xml
 <dependency>
    <groupId>io.apicurio</groupId>
    <artifactId>apicurio-registry-utils-converter</artifactId>
    <version>${apicurio.registry.version}</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-avro</artifactId>
    <version>${jackson2-version}</version>
</dependency>
```

Here how to get the `RootType.class` schema definition using Avro API:

```java
ObjectMapper mapper = new ObjectMapper(new AvroFactory());
AvroSchemaGenerator gen = new AvroSchemaGenerator();
mapper.acceptJsonFormatVisitor(RootType.class, gen);
AvroSchema schemaWrapper = gen.getGeneratedSchema();

org.apache.avro.Schema avroSchema = schemaWrapper.getAvroSchema();
String asJson = avroSchema.toString(true);
```

## Install on OpenShift with Kafka as persistence storage

See the [notes here](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/getting-started/assembly-installing-registry-storage-openshift.htm) which can be summarized as:

* Install Strimzi operator - create a Strimzi cluster (See [vaccine-gitops strimzi env](https://github.com/ibm-cloud-architecture/vaccine-gitops/tree/main/environments/strimzi))
* Install Apicurio operator (search from registry in Operator Hub) - define one registry instance.
* Get Kafka bootstrap internal listener address
* Create the `storage-topic` and `global-id-topic` topics
* Create the Apicurio instance using the bootstrap URL. Below is an example of registry definition using Kafka as persistence. 
(See the [vaccine-gitops Apicurio env](https://github.com/ibm-cloud-architecture/vaccine-gitops/tree/main/environments/apicurio))

```yaml
apiVersion: registry.apicur.io/v1
kind: ApicurioRegistry
metadata:
  name: eda-apicurioregistry
spec:
  configuration:
    persistence: kafkasql
    kafkasql:
      bootstrapServers: "vaccine-kafka-kafka-bootstrap.vaccine-order.svc:9092"
      security:
        tls:
          keystoreSecretName: tls-user
          truststoreSecretName: kafka-cluster-ca-cert
```

## Manage artifacts with Maven

You can use the Apicurio Registry Maven plug-in to upload or download registry artifacts as part of your development build process. The plugin is:

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

but it is recommended to put this plugin in a special maven profile if you do not have connection to an apicurio server while building apps.




## Code using Apicurio

* [Quarkus kafka producer template](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-kafka-producer)
* [Postgresql, Debezium Outbox Quarkus plugin and Debezium change data capture with Kafka Connect](https://github.com/ibm-cloud-architecture/vaccine-order-mgr-pg)
* [Freezer service](https://github.com/ibm-cloud-architecture/vaccine-freezer-mgr)

## Useful links

* [Apicurio Registry Operator community in GitHub](https://github.com/Apicurio/apicurio-registry-operator)
* [Integrating Spring boot app with Apicurio](https://developers.redhat.com/blog/2021/02/15/integrating-spring-boot-with-red-hat-integration-service-registry/)
* [Apicurio user interface demo](https://developers.redhat.com/blog/2020/06/11/first-look-at-the-new-apicurio-registry-ui-and-operator/)
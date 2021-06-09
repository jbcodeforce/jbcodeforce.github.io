# Apicurio

[Apicurio](https://www.apicur.io) includes a registry to manage Avro, json, protobuf schemas, and an API registry to manage OpenApi and AsynchAPI.

It is a Cloud-native Quarkus Java runtime for low memory footprint and fast deployment times. It supports [different persistences](https://www.apicur.io/registry/docs/apicurio-registry/2.0.0.Final/getting-started/assembly-intro-to-the-registry.html#registry-distros) like Kafka, Postgresql, Infinispan and supports different deployment models.

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

## Apicurio Studio

The [The apicurio studio project](https://github.com/apicurio/apicurio-studio) is a standalone API design studio that can be used to create new or edit existing API designs.

There are three runtime components in Apicurio and one Keycloak authentication server:

* **apicurio-studio-api** - the RESTful API backend for the user interface.
* **apicurio-studio-ws** - a WebSocket based API used only by the Apicurio Editor to provide real-time collaboration with other users.
* **apicurio-studio-ui** - the Angular 5+ based user interface.

## Developer experience

* Define your microservice with JAXRS and Swagger annotation. Here is a [guide for quarkus openapi and swagger-ui](https://quarkus.io/guides/openapi-swaggerui) for details.
Below is an example of properties to add to a quarkus `application.properties` file:

  ```
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
  
* For top down approach, starting from the API openAPI document, we can push the api as file to 
the `META-INF/openapi.yaml` or as a `.json`
* Get the OpenAPI definition using curl [http://localhost:8080/q/openapi](http://localhost:8080/q/openapi)
* Define an artifact group to group elements inside Apicurio Registry - can be by environment or can be line of business 
or any thing to group elements.
* Decide if Avro is used or just JSON Schema - Apicurio has both serdes to integrate into you code:

```xml
 <dependency>
      <groupId>io.apicurio</groupId>
      <artifactId>apicurio-registry-serdes-avro-serde</artifactId>
      <version>2.0.0.Final</version>
      <exclusions>
        <exclusion>
          <groupId>org.jboss.spec.javax.interceptor</groupId>
          <artifactId>jboss-interceptors-api_1.2_spec</artifactId>
        </exclusion>
      </exclusions>
  </dependency>
```

### Read more

* [Official demo](https://github.com/Apicurio/apicurio-registry-demo)
* [Using Debezium With the Apicurio API and Schema Registry](https://debezium.io/blog/2020/04/09/using-debezium-with-apicurio-api-schema-registry/)

## Avro

Quick [getting started on Avro with Java](https://avro.apache.org/docs/current/gettingstartedjava.html). We need to:

* Define .avsc file (JSON doc) for each type. Schemas are composed of primitive types (null, boolean, int, long, float, double, bytes, and string) 
and complex types (record, enum, array, map, union, and fixed).
* Use Avro Maven plugin to generate Java beans from the schema definition

To access avro classes directly add this dependencies:

```
<dependency>
  <groupId>org.apache.avro</groupId>
  <artifactId>avro</artifactId>
  <version>1.10.1</version>
</dependency>
```

### From schema to beans

Define one to many `.avcs` file in the `src/main/avro` folder. To generate java beans from those schema 
definitions, use the avro maven plugin. The order of schema processing is important to build the dependencies
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
                <import>src/main/avro/OrderCreatedEvent.avsc</import>
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

See the project template [quarkus-kafka-producer](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-kafka-producer) for example of order events Avro Schema with bean generation.

### From beans to schema

The [Jackson parser](https://github.com/FasterXML/jackson-dataformats-binary/tree/master/avro#generating-avro-schema-from-pojo-definition) offers such capability, so you can add a small program to create a schema from your beans, using the AvroFactory, SchemaGenerator...

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

Here how to get the `RootType.class` schema definition:

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

## Manage artifacts with REST api

Use the [Registry REST API](https://www.apicur.io/registry/docs/apicurio-registry/1.3.3.Final/getting-started/assembly-managing-registry-artifacts-api.html) with curl to upload schema definition, artifactType and ArtifactId in HTTP header to send the metadata about the schema:

```shell
curl -X POST -H "Content-type: application/json; artifactType=AVRO" -H "X-Registry-ArtifactId: share-price" --data '{"type":"record","name":"price","namespace":"com.example","fields":[{"name":"symbol","type":"string"},{"name":"price","type":"string"}]}' http://MY-REGISTRY-HOST/api/artifacts
```

## Kafka de/serializer

To configure the producer we need:

* URL of Apicurio Registry
* Apicurio Registry serializer to use with the messages

Then we have to add the following properties to the Kafka producer:

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

* Create the schema within the registry using REST API client:

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

```s
Successfully created Avro Schema artifact in Service Registry: 
ArtifactMetaData{name='BasicMessage', description='null', labels='[]', createdBy='null', createdOn=1615340019637, modifiedBy='null', modifiedOn=1615340019637, id='test', version=1, type=AVRO, globalId=18, state=ENABLED, properties={}}
```

See simplest code in the `apicurio` folder of [Kafka Studies](https://github.com/jbcodeforce/kafka-studies/)

## Consumer

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

## Code using Apicurio

* [Quarkus kafka producer template](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/quarkus-kafka-producer)
* [Postgresql, Debezium Outbox Quarkus plugin and Debezium change data capture with Kafka Conncet](https://github.com/ibm-cloud-architecture/vaccine-order-mgr-pg)
* [Freezer service](https://github.com/ibm-cloud-architecture/vaccine-freezer-mgr)

## Useful links

* [Apicurio Registry Operator community in GitHub](https://github.com/Apicurio/apicurio-registry-operator)
* [Integrating Spring boot app with Apicurio](https://developers.redhat.com/blog/2021/02/15/integrating-spring-boot-with-red-hat-integration-service-registry/)
* [Apicurio user interface demo](https://developers.redhat.com/blog/2020/06/11/first-look-at-the-new-apicurio-registry-ui-and-operator/)
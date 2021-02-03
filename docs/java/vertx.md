# Vert.x

A polyglot library to develop event driven non blocking apps. The main website [vertx.io/](https://vertx.io/) has a lot of examples to get started.

## Concepts

* Vert.x is not a restrictive framework, and don't force the correct way to write an application.
* It uses an event loop thread to process requests with non blocking IO, and dispatch to event handlers. 
* Verticles are pieces of code that Vert.x engine executes
* An application would typically be composed of multiple verticles running in the same Vert.x instance and communicate with each other using events via the event bus
* In Quarkus every IO interaction passes through the non-blocking and reactive Vert.x engine
* Verticles remain dormant until they receive a message or event.
* Message handling is ideally asynchronous, messages are queued to the event bus, and control is returned to the sender
* Vert.x offers an  event bus  allowing the different components of an application to interact using  messages. Messages are sent to  addresses and have a set of  headers  and a  body.
* By starting a Vert.x application in cluster  mode, nodes are connected to enable shared data structure, hard-stop failure detection, and load-balancing group communication. Vert.x uses [Hazelcast](https://vertx.io/docs/vertx-hazelcast/java/) by default to support the cluster management.

## Get started

Use the [app generator](https://start.vertx.io/) to get starting code and pom.xml or Quarkus app generator as it has a Vert.x engine embedded inside it.

See all the [vert.x samples here](https://github.com/vert-x3/vertx-examples/tree/4.x).

  * [Simple http server with vertx router](https://github.com/vert-x3/vertx-examples/blob/3.x/openshift3-examples/vertx-openshift-applications/vertx-greeting-application/src/main/java/io/vertx/example/openshift/greeting/MyGreetingApp.java). To run it: ` mvn  exec:java -Dexec.mainClass=io.vertx.example.openshift.grting.MyGreetingApp`
  * [A verticle to call a service via http](https://github.com/vert-x3/vertx-examples/blob/4.x/core-examples/src/main/java/io/vertx/example/core/http/simple/Client.java)
  * [Clustered http server to deploy on openshift](https://github.com/vert-x3/vertx-examples/blob/3.x/openshift3-examples/vertx-openshift-applications/vertx-clustered-application/clustered-application-http/src/main/java/io/vertx/examples/openshift/MyHttpVerticle.java)
  * [Event bus point to point](https://github.com/vert-x3/vertx-examples/tree/4.x/core-examples#point-to-point)
  * [Event bus pub/sub](https://github.com/vert-x3/vertx-examples/tree/4.x/core-examples#publish--subscribe)
  * [Circuit breaker](#circuit-breaker)
  * [Kafka consumer and producer](#kafka-and-vertx)

vertx has a CLI to run verticle, to bypass maven or graddle.


* Start a http server with vertx: `vertx run io.vertx.examples.openshift.MyHttpVerticle -cp target/clustered-application-http-3.9.0.jar `

## Event bus

Event bus is used by different verticles to communicate through asynchronous message passing  (JSON). 

A receiver on a point to point

```java
public void start() throws Exception {

    EventBus eb = vertx.eventBus();

    eb.consumer("ping-address", message -> {

      System.out.println("Received message: " + message.body());
      // Now send back reply
      message.reply("pong!");
    });

    System.out.println("Receiver ready!");
  }
```

Start with cluster option so Hazelcast will manage the verticles and netty will support the TCP connection
A sender 

```java
public void start() throws Exception {
    EventBus eb = vertx.eventBus();

    // Send a message every second

    vertx.setPeriodic(1000, v -> {

      eb.request("ping-address", "ping!", reply -> {
        if (reply.succeeded()) {
          System.out.println("Received reply " + reply.result().body());
        } else {
          System.out.println("No reply");
        }
      });

    });
  }
```


## Run with docker

Using [vert.x with docker](https://vertx.io/docs/vertx-docker/) to get a Java environment with Vert.x jars ready to go. 

To run a Verticle:

```shell
docker run -i -t -p 8080:8080 \
    -v $PWD:/verticles vertx/vertx3-exec \
    run io.vertx.sample.RandomGeneratorVerticle \
    -cp /verticles/MY_VERTICLE.jar
```

## Deploy existing application with a dockerfile

```shel
oc new-build --binary --name=vertx-greeting-application -l app=vertx-greeting-application
mvn dependency:copy-dependencies compile
oc start-build vertx-greeting-application --from-dir=. --follow
oc new-app vertx-greeting-application -l app=vertx-greeting-application
oc expose service vertx-greeting-application
```

Access to external url and call one endpoint

```shell
export URL=http://$(oc get routes vertx-greeting-application -o  yaml| yq .spec.host |sed 's/"//g')
curl $URL
```

## Circuit breaker

 ![Example of circuit breaker](https://github.com/vert-x3/vertx-examples/tree/4.x/circuit-breaker-examples)

To use the circuit breaker you need to:
* Create a circuit breaker, with the configuration you want (timeout, number of failure before opening the circuit)
* Execute some code using the breaker

`vertx run io.vertx.example.circuit.breaker.Client -cp target/circuit-breaker-exales-3.9.0.jar `

Operations guarded by a circuit breaker are intended to by non-blocking and asynchronous in order to benefits from the Vert.x execution mode

## Kafka and vert.x

The [Kafka consumer and producer sample](https://github.com/vert-x3/vertx-examples/tree/4.x/kafka-examples) is an interesting example where a kafka broker (from debezium) is started within a main verticle. Start the broker, producers and consumer to see the real time updated dashboard: `vertx run io.vertx.example.kafka.dashboard.MainVerticle -cp target/kafka-examples-3.9.0-fat.jar`

For Producer the code is a simple AbstractVerticle

```java
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.KafkaWriteStream;
import org.apache.kafka.clients.producer.ProducerRecord;

  private KafkaWriteStream<String, JsonObject> producer;
 
  public void start() throws Exception {
    // Get the kafka producer config
    JsonObject config = config();
    // Create the producer, ith key as string and value as jsonObject
    producer = KafkaWriteStream.create(vertx, config.getMap(), String.class, JsonObject.class);
    // get messages and write:
    producer.write(new ProducerRecord<>("the_topic", new JsonObject().put(key, payload)));
  }

   public void stop() throws Exception {
    if (producer != null) {
      producer.close();
    }
  }
```

On the consumer side the same approach is used, get the kafka config and then create consumer:

```java
JsonObject config = config();

KafkaReadStream<String, JsonObject> consumer = KafkaReadStream.create(vertx, config.getMap(), String.class, JsonObject.class);

    consumer.handler(record -> {
      JsonObject obj = record.value();
      // process the received record 
      });

    // Subscribe to Kafka
    consumer.subscribe(Collections.singleton("the_topic"));
```

## Quarkus Vert.x reactive app

Quarkus HTTP support is based on a non-blocking and reactive engine (Eclipse Vert.x and Netty). All the HTTP requests, your application receives, are handled by event loops (IO Thread) and then are routed towards the code that manages the request. 
Depending on the destination, it can invoke the code managing the request on a worker thread (Servlet, Jax-RS) or use the IO Thread (reactive route). Quarkus also integrates smoothly with the Vert.x event bus (to enable asynchronous messaging passing between application components) and some reactive clients.

See [this guide to get started with quarkus and vert.x](https://quarkus.io/guides/vertx).

Use the following extensions: 

```shell
mvn io.quarkus:quarkus-maven-plugin:1.9.1.Final:create \
    -DprojectGroupId=jbcodeforce \
    -DprojectArtifactId=getting-started-reactive \
    -DclassName="jbcodeforce.gs.ReactiveGreetingResource" \
    -Dpath="/hello" \
    -Dextensions="resteasy-mutiny, vertx, resteasy-jsonb"
# Or using the add extension
mvn quarkus:add-extension -Dextension=resteasy-mutiny 
```

 ![](https://quarkus.io/guides/images/http-architecture.png)

Get access to Vert.x via injection in any beans (different Vertx classes are available depending of the api to use for reactive programming): 

```java
@Inject io.vertx.mutiny.core.Vertx vertx;
```

To asynchronously handle the HTTP request, the endpoint method must return a `java.util.concurrent.CompletionStage` or an `io.smallrye.mutiny.Uni` or `Multi`:

```java
@GET
@Produces(MediaType.TEXT_PLAIN)
public Uni<String> doSomethingAsync() {
    // Mimic an asynchronous computation.
    return Uni.createFrom()
            .item(() -> "Hello!")
            .onItem().delayIt().by(Duration.ofMillis(10));
    }
```

You can deploy verticles in Quarkus. It supports:

* bare verticle - Java classes extending `io.vertx.core.AbstractVerticle`
* Mutiny verticle - Java classes extending `io.smallrye.mutiny.vertx.core.AbstractVerticle`

Verticles are not beans, but adding @ApplicationScoped, can be used to access injection.

Here is an example on how to deploy a verticle from another application scoped bean, when the application starts. 

```java
public void init(@Observes StartupEvent e, Vertx vertx, MyBeanVerticle verticle) {
         vertx.deployVerticle(verticle).await().indefinitely();
    }
```

For reactive routes, we need to add vertx-web. And then add  @Route annotation on method to indicate it is a reactive route. The method gets a `RoutingContext` as a parameter from which we can get the HTTP request and response objects. You can also register your route directly on the HTTP routing layer by registering routes directly on the Vert.x Router object. A reactive route must be non-blocking.

```java
```

Reactive route and JaxRS resource can be combined. Every operations which may take long processing time can be asynchronous with callback.

## Vertx reactive with database

Get a service loading entity from postgresql using reactive client.

```java
public static Uni<Fruit> findById(PgPool client, Long id) {
        return client.preparedQuery("SELECT id, name FROM fruits WHERE id = $1").execute(Tuple.of(id))
                .onItem().apply(RowSet::iterator)
                .onItem().apply(iterator -> iterator.hasNext() ? from(iterator.next()) : null);
    }
```



## Vert.x body of knowledge

* [Grace Jansen's Getting started with Reactive Systems](https://developer.ibm.com/technologies/java/articles/reactive-systems-getting-started/)
* [Building reactive microservice in java - Clement Escoffier]
* [baeldung Vertx](https://www.baeldung.com/vertx)
* [Quarkus using Eclipse Vert.x](https://quarkus.io/guides/vertx)
* [Hazelcast and Vert.x](https://vertx.io/docs/vertx-hazelcast/java/)
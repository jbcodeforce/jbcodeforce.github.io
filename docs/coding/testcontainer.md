# Testcontainers

[Testcontainers](https://www.testcontainers.org/) is a Java library that supports JUnit tests, providing lightweight, throwaway instances that can run in Docker.

The product quickstart documentation explains the basic practices. Below are some practices for the components I am using often.

## Test container with Kafka

The [Kafka test container](https://www.testcontainers.org/modules/kafka/) uses Confluent image. 

The following code includes a StrimziKafka test container [maas kafka backend](https://github.ibm.com/boyerje/maas-kafka-backend). The approach is to 
use a BasicIT test class that uses the Strimzi container. As the exposed port is mapped to a port dynamically allocated by docker, we can get
the bootstrap address and expose it via system variable:

```java
public abstract class BasicIT {
    
    @ClassRule
    public static StrimziContainer kafkaContainerForTest = new StrimziContainer()
            .withNetwork(network)
            .withNetworkAliases("kafka")
            .withExposedPorts(9092);

    @BeforeAll
    public static void startAll() {
        kafkaContainerForTest.start();
        System.setProperty("KAFKA_BOOTSTRAP_SERVERS", kafkaContainer.getBootstrapServers());
    }

    @AfterAll
    public static void stopAll() {
        kafkaContainerForTest.stop();
       
    }
}
```


Then each test extends this class and can access the bootstrap URL

```java
 clusterInfo.adminURL = kafkaContainerForTest.getBootstrapServers();
```

Or in the case of quarkus test, we need to specify in the application.properties what to get while using the test profile

```sh
%test.kafka.bootstrap.servers=${KAFKA_BOOTSTRAP_SERVERS}
```

Which means a test at the API level will work fine (extracted from the [store simulator project](https://github.com/ibm-cloud-architecture/refarch-eda-store-simulator)):

```java
    @Test
    public void shouldStartSendingOneMessageToKafka(){
        System.out.println(System.getProperty("KAFKA_BOOTSTRAP_SERVERS"));
        given().when().post("/start/kafka/1").then().statusCode(200);
    }
```



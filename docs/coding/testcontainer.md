# Testcontainers

[Testcontainers](https://www.testcontainers.org/) is a Java library that supports JUnit tests, providing lightweight, throwaway instances that can run in Docker.

The product quickstart explains the basic practices.

## Test container with Kafka

The [Kafka test container](https://www.testcontainers.org/modules/kafka/) uses Confluent image. 

The following code includes a StrimziKafka test container [maas kafka backend](https://github.ibm.com/boyerje/maas-kafka-backend). The approach is to 
use a BasicIT test class that uses the Strimzi container:

```java
public abstract class BasicIT {
    
    @ClassRule
    public static StrimziContainer kafkaContainerForTest = new StrimziContainer();

    @BeforeAll
    public static void startAll() {
        kafkaContainerForTest.start();
       
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

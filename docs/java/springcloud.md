# Spring Cloud 

This note is to summarize the techno, from an older springframework (2003) dev. 

[Spring Cloud](https://spring.io/projects/spring-cloud) is based on Spring boot programming model but focusing on cloud native deployment and distributed computing. As other spring boot app it includes jetty or tomcat, health checks, metrics... It supports the following patterns:

* Distributed/versioned [configuration](https://spring.io/projects/spring-cloud-config): externalize config in distributed system with config server.
* Service registration and discovery: uses Netflix Eureka, Apache Zookeeper or Consul to keep service information. 
* Routing: supports HTTP (Open Feign or  Netflix Ribbon for load balancing) and messaging (RabbitMQ and Kafka)
* Service-to-service calls: Sptring Cloud Gateway and Netflix Zuul is used
* Load balancing
* Circuit Breakers: based on Netflix Hystrix: if the request fails for n time, the circuit open.   
* Global locks
* Leadership election and cluster state
* Distributed messaging

Also add pipelines for ci/cd and contract testing. 

## Getting started:

Use [start.spring.io](https://start.spring.io/) to create the application starting code or add the Spring Cloud BOM to your maven `pom.xml` file. See [the Adding Spring Cloud To An Existing Spring Boot Application section.](https://spring.io/projects/spring-cloud)

As most of the microservices expose REST resource, we may need to add the starter web:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

We also need to install the [Spring Cloud CLI](https://cloud.spring.io/spring-cloud-cli/).

Then add the Spring cloud starter as dependencies. When using config server, we need to add the config client. 

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-conflig-client</artifactId>
</dependency>
```

For centralized tracing uses, starter-sleuth, and zipkin.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
</dependency>
```

For service discovery add netflix-eureka-client.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>
```


Using the [Cloud CLI]() we can get the service registry, config server, central tracing started in one command:

```shell
spring cloud eureka configserver zipkin
```

## Spring Cloud config

Use the concept of Config Server you have a central place to manage external properties for applications across all environments.  As an application moves through the deployment pipeline from dev to test and into production you can manage the configuration between those environments and be certain that applications have everything they need to run when they migrate. 

```java
  @Value("${config.in.topic}")
  String topicName = "orders";
```

The value of the `config.in.topic` comes from local configuration or remote config server. The config server will serve content from a git. See [this sample](https://github.com/spring-cloud-samples/configserver) for such server.

## Spring Cloud Stream

[Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) is a framework for building highly scalable event-driven microservices connected with shared messaging systems. It unifies lots of popular messaging platforms behind one easy to use API including RabbitMQ, Apache Kafka, Amazon Kinesis, Google PubSub, Solace PubSub+, Azure Event Hubs, and Apache RocketMQ. 
It uses destination binders (integration with messaging systems), destination bindings (bridge code to external systems) and message (canonical data model to communicate between producer and consumer)

The approach is to develop the following:

* A spring boot application, with REST spring web starter
* Define a resource and a controller.
* Define inbound and/or outbound channels to communicate to Kafka using properties
* Add method to process incoming message, taking into account the underlying middleware. For example with Kafka, most of the consumers may not auto commit the read offset but control the commit by using manual commit. 
* Add logic to produce message using middleware 

[Spring Cloud Stream Applications](https://spring.io/projects/spring-cloud-stream-applications) are standalone executable applications that communicate over messaging middleware such as Apache Kafka and RabbitMQ. The app is using uber-jars to get the minimal required library and code.


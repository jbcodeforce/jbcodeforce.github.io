# Apache Kafka

I am using [Apache Kafka](https://kafka.apache.org/intro) in different projects as a messaging hub for its pub/sub model, persistence capability to support event-sourcing and to build real-time data pipelines and streaming apps. I described Kafka guidances in this [article](https://github.com/ibm-cloud-architecture/refarch-eda/blob/master/docs/kafka/readme.md) and include architecture considerations. 

I have detailed [producer best practices](https://github.com/ibm-cloud-architecture/refarch-eda/blob/master/docs/kafka/producers.md) and [producer code](https://github.com/ibm-cloud-architecture/refarch-kc-ms/tree/master/fleet-ms/src/main/java/ibm/labs/kc/app/kafka) and [consumer best practices](https://github.com/ibm-cloud-architecture/refarch-eda/blob/master/docs/kafka/consumers.md) and [consumer code](https://github.com/ibm-cloud-architecture/refarch-kc-ms/tree/master/fleet-ms/src/main/java/util) 

## Code examples

The [Container Shipment project](https://github.com/ibm-cloud-architecture/refarch-kc) uses Kafka for pub/sub model, microservice asynch communication, SQRS, event sourcing patterns and event analytics.


The [Manufacturing asset analytics project](https://github.com/ibm-cloud-architecture/refarch-asset-analytics) uses Kafka for pub/sub model and event analytics.

My own kafka studies and nodejs kafka samples in [github](https://github.com/jbcodeforce/nodejs-kafka)

In python kafka in my [github repo](https://github.com/jbcodeforce/python-code/tree/master/kafka) or as an [integration tests](https://github.com/ibm-cloud-architecture/refarch-kc/tree/master/itg-tests) for container shipment. 

## Compendium

### Getting started

* [Start by reading kafka introduction from apache web site](https://kafka.apache.org/intro/)
* [Another introduction from the main kafka contributors: Confluent](http://www.confluent.io/blog/introducing-kafka-streams-stream-processing-made-simple)
* [Event streams documentation](https://ibm.github.io/event-streams/)
* [Note on installing Event Streams on ICP](https://github.com/ibm-cloud-architecture/refarch-eda/tree/master/docs/deployments/eventstreams)

### Streams programming

* [Develop Stream Application using Kafka](https://kafka.apache.org/11/documentation/streams/)
* [Validating the Stream deployment](https://developer.ibm.com/messaging/event-streams/docs/validating-the-deployment/)

### Implementation patterns supported by Kafka

* [Event sourcing, CQRS, stream processing and Apache Kafka: What’s the connection?](https://www.confluent.io/blog/event-sourcing-cqrs-stream-processing-apache-kafka-whats-connection/)
* [My implementation using KStreams](https://ibm-cloud-architecture.github.io/refarch-kc-container-ms/kstreams/)
* [Testing event sourcing for order management](https://ibm-cloud-architecture.github.io/refarch-kc/itg-tests/)

### Deployments

* [Kafka on kubernetes using stateful sets](https://github.com/kubernetes/contrib/tree/master/statefulsets/kafka)

* [IBM Event Streams product based on Kafka delivered in ICP catalog](https://developer.ibm.com/messaging/event-streams/)
* [IBM Developer works article](https://developer.ibm.com/messaging/event-streams/docs/learn-about-kafka/)
* [Install Event Streams on ICP](https://developer.ibm.com/messaging/event-streams/docs/install-guide/)
* [Spark and Kafka with direct stream, and persistence considerations and best practices](http://aseigneurin.github.io/2016/05/07/spark-kafka-achieving-zero-data-loss.html)
* [Example in scala for processing Tweets with Kafka Streams](https://www.madewithtea.com/processing-tweets-with-kafka-streams.html)
* [Stack overflow tag](https://stackoverflow.com/search?q=eventstreams)
* [Processing trillions of events per day with Apache Kafka on Azure](https://azure.microsoft.com/en-us/blog/processing-trillions-of-events-per-day-with-apache-kafka-on-azure/)
* [Why run Kafka on Kubernetes?](https://www.confluent.io/blog/apache-kafka-kubernetes-could-you-should-you)
* [Okay to store data in kafka](https://www.confluent.io/blog/okay-store-data-apache-kafka/)
* [Kafka Python](https://github.com/confluentinc/confluent-kafka-python)
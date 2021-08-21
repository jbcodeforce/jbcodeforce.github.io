# IBM MQ compendium

## Key Concepts

* **Messages**: packages of data produced and consumed by applications.
* **Queues**: addressable locations to deliver messages to and store them reliably until they need to be consumed.
* **Queue managers**: actual MQ engines, the servers that host the queues
* **Channels**: the way queue managers communicate with each other and with the applications.
* **MQ networks**: loose collections of interconnected queue managers, all working together to deliver messages between applications and locations
* **MQ clusters**: tight couplings of queue managers, enabling higher levels of scaling and availability.
* **Point to point** for a single consumer. Senders produce messages to a queue, and receivers asynchronously consume messages from that queue. With multiple receivers, each message is only consumed by one receiver, distributing the workload across them all.
* **Publish/subscribe** copies of messages will be delivered to all interested consuming applications. Subscribers create a subscription to topic when they want to receive messages.

## MQ value proposition

* No data loss, no duplicate
* Integrate with transaction
* Scale horizontally: add more queue managers to share tasks and distribute the messages across them. MQ Clusters will even intelligently route messages to where they’re needed. The world is full of horizontally scaled MQ systems that handle billions of messages a day.
* High availability

## Product documentation

* [Release 9.2](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.2.0/com.ibm.mq.pro.doc/q001020_.htm)
* [Developer IBM articles - query](https://developer.ibm.com/?q=MQ)
* [Getting started with MQ](https://developer.ibm.com/gettingstarted/ibm-mq/)
* [Run IBM® MQ in a container](https://github.com/ibm-messaging/mq-container) with relevant [developer article.](https://developer.ibm.com/tutorials/mq-connect-app-queue-manager-containers/)

## Interesting Articles 

* [My own MQ summary in EDA refarch](https://ibm-cloud-architecture.github.io/refarch-eda/technology/mq/)
* [Learning MQ](http://ibm.biz/learn-mq) 
* [MQ fundamentals](https://developer.ibm.com/articles/mq-fundamentals/): nice set of diagrams and explanation of queues, MQ managers... 
With links to supporting programming languages.
* [MQ Essentials- Getting started with IBM MQ](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/getting-started-mq/)
* [MQ Cheat sheet](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/dev-cheat-sheet/)
* [High availability](https://pages.github.ibm.com/cloudpakbringup/mq-deployment-guide/high-availability/intro/)

## Enablement

* [IBM MQ Developer Essentials Badge](https://developer.ibm.com/series/badge-ibm-mq-developer-essentials/)
* [Administering a queue manager using IBM MQ Console - IBM Cloud](https://cloud.ibm.com/docs/mqcloud?topic=mqcloud-mqoc_admin_mqweb)
* [First demo on docker](https://developer.ibm.com/tutorials/mq-connect-app-queue-manager-windows/#docker)
* [Develop a JMS point to point application](https://developer.ibm.com/tutorials/mq-develop-mq-jms/) The code of this IBM tutorial is also in this repository under the `democlient/MQJMSClient` folder so we can test the configuration.

### Comparing MQ Pub/Sub and Event Streams

Assess the following characteristics:

* **Event History**: does the solution need to be able to retrieve historical events either during normal and/or failure situations? If so for how long and how much data?
* **Fined Grained Subscriptions:** Should applications receive all event types from a topic? (Even events that are irrelevant to them ) With MQ topics, they are hierarchical, so it is possible for consumer apps to subscribe to different level of the topic. With Kafka topics 
are partitioned and consumers get all the events from one to many partition.
* **Scalable Consumption:** if 100 consumers subscribe to all events on a topic, IBM MQ will create 100 messages for each published event (with the exception of multicast Pub/Sub). Each of event will be stored and, 
if required, persisted to disk using system resources.
* **Transactional Behavior:** With pub/sub thee tx requirement is less critical, than in queues

## My own studies

* [My own MQ summary in EDA refarch](https://ibm-cloud-architecture.github.io/refarch-eda/technology/mq/)

### MQ messaging coding challenge

See [this note](/java/mqChallenge) in this repository.

Some comments:

* When a publisher publishes a message to a topic string, one or more subscribers for that topic string receives the publication message
* A JMS application can use the JMS destination object which maps to a topic in the same way as it would use 
the destination to map to a queue, in a point to point scenario. For the publication to reach the subscriber 
successfully, both the publisher and the subscriber must match same topic string. The subscriber will get 
publications only from the time they subscribe to a topic.
* If a publication is sent before the subscription by a specific application is created, that application will not get it.
* Request response or request reply is an integration or messaging pattern where the application that sends a message to another application, requires a reply of some sort from the receiving application.
* This is often based on the point to point messaging style and can be synchronous (the sending application waits for the response before it times out) and asynchronous (also called request/callback, where the sending application disconnects but sets up a callback to handle a reply).
* The sending application usually sets a reply-to-destination and a correlation-id so that a response can get back to the right sender application.
* For the event booking service the reply-to destination has been defined administratively on the queue manager. However, the requester could dynamically create a temporary destination from its JMS session to complete the exchange.

JMS topic subscription code is in [TicketSubscriber.java]()

## Code repo

* [refarch-eda-store-simulator](https://github.com/ibm-cloud-architecture/refarch-eda-store-simulator) a quarkus app with JMS producer
to MQ
* [eda-lab-mq-to-kafka](https://github.com/ibm-cloud-architecture/eda-lab-mq-to-kafka): A hands-on lab series to demonstrate end-to-end integration between a JMS application using JMS to MQ and then Kafka Connect and Kafka topics, sending sold item data from different stores to MQ and Kafka using an MQ Kafka connectors.
* [refarch-container-inventory](https://github.com/ibm-cloud-architecture/refarch-container-inventory) older JEE app still need work
* [refarch-mq-messaging](https://github.com/ibm-cloud-architecture/refarch-mq-messaging), need a deep refresh.
* [mqChallenges in Java Studies repo](https://github.com/jbcodeforce/java-studies) with the challenge code and other quarkus - mq one.
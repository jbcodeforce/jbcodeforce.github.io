# IBM MQ compendium

MQ is the queue solution for cloud native applications that are aiming to be loosely coupled.

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
* Scale horizontally: add more queue managers to share tasks and distribute the messages across them. 
MQ Clusters will even intelligently route messages to where they’re needed. 
The world is full of horizontally scaled MQ systems that handle billions of messages a day.
* High availability with replicated Queue managers. Active/active horizontal scaling for always on systems
* Lightweight and scale to run in any size

## Product documentation

* [Release 9.2](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_9.2.0/com.ibm.mq.pro.doc/q001020_.htm)
* [Developer IBM articles - query](https://developer.ibm.com/?q=MQ)
* [Getting started with MQ](https://developer.ibm.com/gettingstarted/ibm-mq/)
* [Run IBM® MQ in a container](https://github.com/ibm-messaging/mq-container) with relevant [developer article.](https://developer.ibm.com/tutorials/mq-connect-app-queue-manager-containers/)

## Important features

### Replicated Data Queue Managers

MQ Advanced supports synchronous replication and fast quorum based take over for HA scenarios, recovery in seconds. 
It also supports asynchronous replication between quorum groups to support long distance DR deployments.

All nodes support concurrently running multiple different active queue managers with bidirectional asynchronous replication,
supporting active/active HA and DR topologies.

Use queue manager leader and two replicas. So messages are replicated in three locations. 
Those are exact replicas, maintaining configuration, message order, transactional state.
Quorum ensures consistency and rapid failure (within a second) and recovery.

The  MQ operator helps to deploy MQ manager with declarative manifest, with native HA, cross availability zones,
with all the networking services, and storage needed. Applications connected to MQ manager do not know
how many queue managers are behind their request.

### Always on MQ

MQ provides a **uniform cluster** consisting of multiple active queue managers acting as a single messaging service.
Each Queue manager has the same resource, queues, channels...

### Supports

* REST
* MQTT
* JMS
* AMQP
* Qpid
* MQI

### AMQP

* Good article ["Developing JMS apps with Quarkus and GraalVM"](https://developer.ibm.com/tutorials/mq-running-ibm-mq-apps-on-quarkus-and-graalvm-using-qpid-amqp-jms-classes/)
* [Building an image with custom MQSC and INI files, using the Red Hat OpenShift CLI](https://www.ibm.com/docs/en/ibm-mq/9.2?topic=dcqmumo-building-image-custom-mqsc-ini-files-using-red-hat-openshift-cli)

Here are the step to build a custom image for MQ

* clone https://github.com/ibm-messaging/mq-container.git
* download last MQ release tar file from ibm support or ppa
* copy the tar to mq-container/downloads
* Edit the `install-mq.sh` file and change the var

    ```sh
    export genmqpkg_incamqp=1
    ```
* Set up AMQP authority, channel, and service properties by adding the contents of the `add-dev.mqsc.tpl` file 
to the bottom of the `/incubating/mqadvanced-server-dev/10-dev.mqsc.tpl` file in your cloned repository

* Start the build

  ```sh
  MQ_ARCHIVE=IBM_MQ_9.2.0.4_LINUX_X86-64.tar.gz MQ_VERSION=9.2.0.4 LTS=true make build-advancedserver
  ```

### Insight to your data

**Stream MQ** data by adding a new queue and specify the original queue the  name of the streaming queue

### Central web console

9.2.3 supports a central unique Web Console to manage multiple queue managers cross environments, of any time.

## Interesting Articles 

* [My own MQ summary in EDA refarch](https://ibm-cloud-architecture.github.io/refarch-eda/technology/mq/)
* [Learning MQ](http://ibm.biz/learn-mq) 
* [MQ download](http://ibm.biz/mq-downloads) 
* [MQ fundamentals](https://developer.ibm.com/articles/mq-fundamentals/): nice set of diagrams and explanation of queues, MQ managers... 
With links to supporting programming languages.
* [MQ Essentials- Getting started with IBM MQ](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/getting-started-mq/)
* [MQ Cheat sheet](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/dev-cheat-sheet/)
* [High availability](https://pages.github.ibm.com/cloudpakbringup/mq-deployment-guide/high-availability/intro/)
* [IBM MQ samples and patterns](http://ibm.biz/mq-dev-patterns)
* [AsyncAPI MQ Bindings](https://github.com/asyncapi/bindings/tree/master/ibmmq)

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
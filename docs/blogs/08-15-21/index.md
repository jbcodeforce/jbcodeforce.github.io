# New messaging reference architecture

It is interesting how quickly we can enter in 'save my church' discussion and argumentation, and completely do not see the elephant in the room.
Since three years I spend time to design event-driven architecture for customers and develop best practices around it. One of church battle was the messaging versus eventing, or queueing versus pub/sub, Kakfa versus MQ.
I hve to listen and sometime to agree with Architects who want to go full kafka, or the marketing messaging that claim queue is old stuff.

But this is completely wrong. 

Really at the core principle what we need to support are:

- get visibility of the new data created by existing and old application in real time to get better insights and propose new business to the customers.
- integrate with transactional systems, and continue to do transaction
- move to asynchronous communication between serverless and microservices, so really adopting the reactive manifesto
- get loosely coupled but still understand the API contracts. API being synchronous (RES, SOAP) or asynch (queue and topic).
- get clear visibility of data governance, who access what, securely, and to do what.

Now we can write. at least 600 pages book to propose some solution. As books are mostly obsolete, only blogs and you tube channels are seen as valuable those days, let start small
and let define a new messaging or reactive reference architecture.

I will take our current EDA reference diagram, and extend it to support the previous principles:

![](./images/new-mda.png)

First I will kill this pseudo semantic classification of "events versus messaging": at the end of the day, applications are exchanging array of bytes, representing messages sent to other(s). 
What is really important, is to consider two requirements:

* send asynchronously messages to an other app to expect it to send a response back, or to perform an action. 
* send asynchronously messages to say to the world about its data changes. This represents fact about its data, which in DDD are events.

In both case applications are sending messages as bytes, over the network and persisted in a messaging middleware.

Now the processing of those messages are different and this is why you need two products or two type of features within the same product:

* support point-to-point communication, with queue to persist the messages. Messages in the queue are removed once consumed: this is perfect to support
request/response communication. We do that since 40 years of implementing business applications.
* support pub/sub communication, with topics to persist the messages: now there is a temporal decoupling, and what Kafka added to the 
classical JMS topic based middleware, is the fact that messages can be persisted for a long time period, and are not removed by the middleware
once they are consumed by all subscribers. The message are ordered by key and timestamp. Applications can do data streaming, continuously
consuming message, processing them and publish new ones to different topic. Those new capabilities offer new real time processing on data in motion.

So the reference architecture illustrates that we need both queues and topics based middleware. 

Let continue exploring all of the elements of this reference architecture:

On the queue side, we need to have modern microservices or function as service being able to write and read to/from queues. This has to be
the way to code asynchronous request / response communication. I defended CQRS and Saga to be very important design patterns in modern microservice solution, 
but those patterns need to be implemented with queues, a mix of queue and topic and not just topic. 
IBM MQ middleware product supports XA transactions, and it is key to keep this semantic in any modern architecture: we want to publish messages while writing to database in the same transaction.
Also mainframes are still excellent citizens in any hybrid cloud architecture. They support the transactional processing, and most of the time at a lower total cost of ownership then distributed. 
But I do not want to argument around that. Most mainframes are integrated with MQ to support asynchronous request / response communication.

Now to address data visibility, it makes a lot of sense to get data replicated in queues and then injected from queue to Kafka topic. This is the arrow
between MQ and Kafka and the Kafka connector framework is used to support this injection.

On the microservice side, developers need to adopt domain-driven design to better identify bounded contexts, events and commands to
be developed in the microservice context. Commands are most of the time, vers defined in the OpenAPI contract. 
But they may be asynchronous to adopt loosely coupling between components. In DDD, events
are immutable facts so discovered events are good candidates for messages in topics. Which means, most likely, reactive microservice, which
by the reactive manifesto principles, are message driven will have to integrate with Kafka.

![](./images/reactive-manifesto.png)

To keep the best practices of contract testing and contract management, AsyncAPI specification helps developers
to define the schema structure of the messages to exchange between components. 

OpenAPI can be developed top down, or bottom up by using microprofile openApi component inside your Java app. When adopting API management
this openAPI definition is also deployed in an API gateway to control the traffic and security access. HTTP communication between RESTful end point are going
 to the API gateway. Now when communication is via queue or topic, AsyncAPI definitions are used and can be defined in event gateway which
 acts as a middle man between message producer and consumer. We are at the beginning of such technologies adoption but it will help
 on the traffic monitoring and application governance.
  
Still part of the component portfolio is the Schema registry, which is a major element to to maintain efficient schema management and versioning between Kafka based apps.

Cloud native developers need to consider microprofile messaging, knative eventing or any actor framework (like [IBM KAR](https://github.com/IBM/kar))
to support the implementation of their service. The following diagram presents a potential structure for such service: JAX-RS
resources are defined with [microprofile OpenAPI]()https://github.com/eclipse/microprofile-open-api annotations, which can then
be exported to an API management product.

![](./images/reactive-app.png)

The business logic is in its own layer with DDD aggregate concepts, ubiquitous language, service, business rules,... 
Repository supports persisting those aggregates to external database, document oriented or SQL based. 
Then as those microservice are message driven, [microprofile reactive messaging](https://download.eclipse.org/microprofile/microprofile-reactive-messaging-1.0/microprofile-reactive-messaging-spec.pdf) can be used to define the different publishing channels, being queue, or topic or both.
From the JSON or Avro schema defining the messages or events, developers can build an asyncAPI specification which can also being
management by an API product (IBM API Connect for example).

We have addressed the top part of the architecture diagram. 

On the left we can see difference source of data to be injected to Kafka so data can be visible to any consumers. 
Different solution can be used to inject such data, and Change Data Capture technologies should be considered to
address non-green field apps. 

On the right side, there is a very important element, is the data lake. This where big data processing is done, AI models are built,
and all the featuring engineering occur. This is an highly scalable environment, supporting large amount of data, structured or unstructured.
Event backbones, like Kafka, are used as data injection to data lake, but also to apply real-time analytics on the data stream.

This is the lower row of the architecture diagram: AI mode, predictive scoring developed on the big data can be used to score
data in real time. Different technologies can be used, we are using Apache Flink and Spark to support this analytics and sometime
Kafka Streams. Finally there are also new set of applications that can be integrated to support complex event processing. Apache Flink has
a [CEP engine](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/libs/cep/), but other could be considered. The main point is to be able to work on event sequencing logic and derive new synthetic events or to trigger business actions. 


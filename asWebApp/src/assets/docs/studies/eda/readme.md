# Event Driven Architecture

From the data point of view there are two problems in business application to address: 

* What is the state of the world? and the solution is to persist last data state in database
* What is happening in the world now? The current approach is to use messaging, RPC, ETL,... 

Messagings are fast and have low latency, but they lack persistence and no replay capability. ETL is batch oriented so cost time and money and focus on stored records.

Event streaming rethink data as not stored records or transient messages but instead as a continually updating stream of events.

## Events

Events are notifications of change of state. It refers to something that happens.  Notifications are published and interested parties may subscribe and take action on the events.  Typicaly there is no connection with the issuer of the notification for what the action taken is and
no corresponding feedback that it has been processed

* Events are notifications of change of state.
* Typically, it’s the change of state of something of interest to the business.
* They are a record of something which has happened.
* They can not be changed, that is they are immutable ( we can't change something which has happened)

## Event Driven Architecture

This is an IT architecture which has the following important capabilities:

* Being able to communicate and persist events.
* Being able to take direct action on events.
* Processing streams of events to derive real time insight/intelligence.
* Providing communication between event driven microservices.
* With an event backbone providing the connectivity between the capabilities, we can visualize a reference Event Driven Architecture as below.

<img src="assets/docs/studies/eda/hl-arch.png" width="100%"></img>

## Event Streams

An Event stream is a continuous un-bounded series of events.

* The start of the stream may have occurred before we started to process the stream
* The end of the stream is at some unknown point in the future
* Events are ordered by the point in time at which each event occurred.

Some clear examples of industry in need for event streaming:

<img src="assets/docs/studies/eda/es-industry-usercases.png" width="100%">

When developing event driven solutions we will typically see two types of Event Stream,

* Ones where we have defined the events and published them into the stream as part of our solution
* Ones where we connect to a real time event stream, eg from an IOT device, a Voice Stream from a telephone system, a Video stream, Ship/Plane locations from global positioning systems.

## Commands

A *command*, is an *instruction to do something*. Typically commands are directed to a particular consumer which will run the required command/process, and pass back a confirmation to the issuer that it has been processed.

## Loose coupling
Loose coupling is one of the main benefits of event-driven processing. It allows event producers to emit events without any knowledge about who is going to consume those events. Likewise, event consumers do not have to be aware of the event emitters. Because of this, event consuming modules and event producer modules can be implemented in different languages or use technologies that are different and appropriate for specific jobs. Loosely coupled modules are better suited to evolve independently and, when implemented right, result in a significant decrease in system complexity.

Loose coupling, however, does not mean “no coupling”. An event consumer consumes events that are useful in achieving its goals and in doing so establishes what data it needs and the type and format of that data. The event producer emits events that it hopes will be understood and useful to consumers thus establishing an implicit contract with potential consumers. For example, an event notification in XML format must conform to a certain schema that must be known by both the consumer and the producer.  One of the most important things that you can do to reduce coupling in an event-driven system is to reduce the number of distinct event types that flow between modules. To do this you have pay attention to the cohesiveness of those modules.

## Cohesion
Cohesion is the degree to which related things are encapsulated together in the same software module. At this point, for the purposes of our EDA discussion, we define module as an independently deployable software unit that has high cohesion.  Cohesion is strongly related to coupling in the sense that a highly cohesive module communicates less with other modules, thus reducing the number of events, but most importantly, the number of event types in the system. The less modules interact with each other, the less coupled they are.
Achieving cohesion in software while at the same time optimizing module size for flexibility and adaptability is hard but it is something that should be aimed for. Designing for cohesion starts with a holistic understanding of the problem domain and good analysis work. Sometimes it must also take into account the constraints of the supporting software environment. Monolithic implementations should be avoided, as should implementations that are excessively fine-grained.


Deploying EDA on top of SOA or microservices architecture is not complex and with very little disruption to the existing architecture. EDA becomes a natural extension of SOA.

In a microservice context, as each service has its own database, there are some business transactions that span multiple service so you need a mechanism to ensure data consistency across services. Two phase commit is no more an option. Consistency occurs using the following pattern: each service publishes an event whenever it update its data. Other service subscribe to events. When an event is received, a service updates its data.

## EDA microservice patterns
I move the content for event sourcing, CQRS in [this note](https://github.com/ibm-cloud-architecture/refarch-eda/blob/master/docs/evt-microservices/ED-patterns.md)


### Saga Pattern

As some business transactions may span multiple services, we need a mechanism to ensure data consistency accross services. The ACID transaction is not supported cross microservices or if so at an important performance impact. A saga is a sequence of local transactions. Each local transaction updates the database and publishes an event to trigger the next local transaction in the saga. If a local transaction fails because it violates a business rule then the saga executes a series of compensating transactions that undo the changes that were made by the preceding local transactions. Two coordination mechanisms involved:
* choreography: transaction published events consumed by other service to triger local transaction
* orchestration: one mediator drives each participant to execute the transaction.

See my [summary here](https://ibm-cloud-architecture.github.io/refarch-eda/evt-microservices/ED-patterns/#saga-pattern)

The tricky part is to be able to save data and emit events in the same transaction. Which is not supported by all the messaging event bus. 

See [Pattern in microservices.io](https://microservices.io/patterns/data/saga.html)

## Repositories
* [CASE root repo on EDA](https://github.com/ibm-cloud-architecture/refarch-eda)
* [Kafka nodejs samples](https://github.com/jbcodeforce/nodejs-kafka)
* [Where I test event sourcing]()


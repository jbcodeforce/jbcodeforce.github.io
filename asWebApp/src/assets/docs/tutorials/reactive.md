# Why reactive?

We are now deploying application on thousand of nodes and running on petabytes of data. The problem to address is to support modern users come to rely on software for their own workflow so expectations are high to get quick response and not down time. The primary goal of reactive architecture is to provide an experience that is responsive under all conditions

Goals:
* scale from 10 to 10 millions users
* consume only resource necessary to support current load
* handle failure with little to no effect one the user
* distributed across ten, 100 or thousand of machines
* maintain responsiveness and quality

Reactive architecture is founded on what we call the Reactive Principles as defined in the [reactive manifesto](http://reactivemanifesto.org):
* Responsive in a timely fashion (responsive)
* remain responsive event when failure occur (resilience): This is achieved through a number of techniques including replication, isolation, containment and delegation.
* remains responsive despite changes to the system load (elastic). It implies zero contention and no central
bottlenecks.
* build foundation of async, non-blocking messages (message driven). It delivers loose coupling, isolation and
location transparency.

If a system is responsive it builds user confidence.

Some definitions
* **Replication** means we have multiple copies.
* **Isolation** means that services can function on their own, they don't have external dependencies.
* **Containment** is a consequence of isolation: it means that if there is a failure it doesn't
propagate to another service because it is isolated.
* **Delegation means that recovery is managed by an external component.

## Reactive Programming
Reactive systems apply the Reactive Principles at the architectural level. micro-services represent Reactive Systems. Inside a micro service you can use techniques like RxJs, RxJava, RxScala, which are reactive programming, to implement the service.
Reactive Programming doesn't mean you have created a Reactive System. In a reactive architecture microservices will be interacting with each other in a Reactive way. They are going to follow the principles of being message driven. They are going to also make sure that they are elastic, and resilient, and responsive.  
Reactive programming takes a problem and breaks it up into small discrete steps. Those individual steps are then executed in an asynchronous non-blocking fashion, usually through some sort of callback mechanism.

How would you build a system using Reactive Programming techniques that was not Reactive? All you have to do is build that system and deploy it onto one node: you are not resilient. When using a local cache, you could not be elastic if there's no way to keep that local cache in sync with multiple nodes. as when you scale it up you now have a cache consistency problem.

You have to build with Reactive Architecture in mind.

## The Actor Model

The actor model is a programming paradigm that supports the construction of reactive systems. It is message driven.  It also provides abstractions that give us elasticity and resilience, with capabilities like location transparency.
[Akka](https://akka.io/) is an actor model implementation,  is supporting all the reactive principles.

So the important concepts:
* all computation occurs inside an actor.
* A system will have multiple actors
* Each actor is addressable  
* The only communicate thru asynchronous messages
* Router manages the routing messages between actors. The sender has no knowledge of where the actors are, local, remote.
* Local calls look like remote call.
The actor model can be reactive at the level of actors and actors are within a microservice. You can have many actors within a single microservice.

## Building without actors

We can implement reactive systems with load balancer with some service registry: producer talking to load balancer does not know the amount of services behind it. It ensure location transparency. We add a message bus to support asynchronous non-blocking messaging, with resiliency and elasticity. But this system will be reactive at the microservice level and not within the service itself.

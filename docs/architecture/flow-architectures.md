# Flow architecture

From the [James Urquhart's book](https://learning.oreilly.com/library/view/flow-architectures).

As more and more of our businesses “go digital”, the groundwork is in place to fundamentally
 change how real-time data is exchanged across organization boundaries. Data from different sources
 can be combined to create a holistic view of a business situation.

**Flow** is networked software integration that is event-driven, loosely coupled, and highly adaptable and extensible.

Value is created by interacting with the flow, and not just the data movement.

Since the beginning of IT as an industry, we are digitizing and automating the exchanges of value, and we spend
a lot of time and money to execute key transactions with less human intervention.
However, most of the integrations we execute across organizational boundaries today are not
in real time. Today, most—perhaps all—digital financial transactions in the world economy
 still rely on batch processing at some point in the course of settlement.

There is no consistent and agreed-upon mechanism for exchanging signals for immediate action across companies or industries.

It is still extremely rare for a company to make real-time data available for 
unknown consumers to process at will.

This is why modern event-driven architecture (EDA) will enable profound changes in 
the way companies integrate. EDAs are highly decoupled architectures, meaning there 
are very few mutual dependencies between the parties at both ends of the exchange.


## Flow characteristics

* Consumers requests data streams through self-service interfaces, and get the data continuously.
* Producers maintain control of relevant information to transmit and when.
* **Event** packages information of data state changes, with timestamp and unique ID. 
The context included with the transmitted data allows the consumer to better understand the nature of that data.
* The transmission of a series of events between two parties is called an **event stream**.

The more streams there are from more sources, the more flow consumers will be drawn to 
those streams and the more experimentation there will be. Over time, organizations will find new ways to tie 
activities together to generate new value.

**Composable architectures** allow the developer to assemble fine grained parts using 
consistent mechanisms for both inputting data and consuming the output.
In **contextual architectures**, the environment provides specific contexts in 
which integration can happen. Developer must know a lot about the data that is available,
 the mechanism by which the data will be passed, the rules for coding and deploying 
 the software.

EDA provides a much more composable and evolutionary approach to building event and data streams

## Business cases

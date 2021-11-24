# Flow architecture

From the [James Urquhart's book](https://www.amazon.com/Flow-Architectures-Streaming-Event-Driven-Integration/dp/1492075892/ref=sr_1_1?keywords=flow+architectures&qid=1637675009&sr=8-1).

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


## 1- Flow characteristics

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

## 2- Business motivations

* do digital transformation to improve customer experiences. Customers expect their data to 
be used in a way that is valuable to them, not just to the vendors. Sharing data between organizations
 can lead to new business opportunities.
* improve process automation, to drive efficiencies and profitability. The most limiting constraint in the 
process hides any improvements made to other steps. Finding constraints is where [value stream mapping](https://tkmg.com/books/value-stream-mapping/) shines:
it uses lead time (queue time) and actual time to do the work. EDA will help to get time stamp and data 
for steps in the process that are not completely in scope of a business process: may be cross business boundaries.
* extract innovative value from data streams. Innovation as better solution for existing problem, or as new
solution to emerging problems.

To improve process time, software needs accurate data at the time to process the work. As business evolve,
having a rigid protocol to get the data impact process time. A business will need to experiment with new data sources
 when they are available and potentially relevant to their business.
 **Stream processing improves interoperability (exchange data)**

Innovation is not adaptation.Companies must adapt constantly just to survive, like adding features on a product
to pace with competition. Digital transformation aimed at avoiding competitive disruption is not innovation.

As the number of stream options grows, more and more business capabilities will be 
defined in terms of stream processing. This will drive developers to find easier ways 
to discover, connect to, and process streams.

### Enabler for flow adoption

* lowering the cost of stream processing: Integration costs dominate modern IT budgets.
For many integrations, the cost of creating interaction between systems is simply too high for what little value is gained.
With common interfaces and protocols that enable flows, the integration cost will be lower
and people will find new uses for streaming that will boost the overall demand for streaming technologies. The [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox) at work
* increasing the flexibility in composing data flows: "pipe" data streams from one processing 
system to another through common interfaces and protocols.
* creating and utilizing a rich market ecosystem around key streams. The equities markets have all moved entirely to electronic forms of executing their marketplaces.
Health-care data streams for building services around patient data. Refrigerators streaming data to grocery
delivery services. 

Flow must be secure (producers maintain control over who can access their events), 
agile (change schema definitions), 
timely (Data must arrive in a time frame that is appropriate for the context to which it is being applied), 
manageable and retain a memory of its past. 

Serverless, stream processing, machine learning, will create alternative to batch processing.

## 3- Value chain

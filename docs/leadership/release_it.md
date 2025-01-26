# Release IT

Summary from Michael Nygard's book
https://pragprog.com/book/mnee/release-it

Enterprise-class simply means that the software must be available, or the company loses money.

In one year the difference between 98% uptime and 99.99% uptime adds up to more than $ 17 million.

Software design should address things systems should not do. 
Passing QA tells little about the system’s suitability for the next three to ten years of life.

During project the tendency is to optimize development cost at the expense of operational cost. But systems will spend most of their time in operation. Failure will cost millions.
Architecture and design decisions must be made with an eye toward their implementation cost as well as their downstream costs.

Agile puts emphasis on early delivery and incremental improvements, meaning software gets into production quickly. Since production is the only place to learn how the software will respond to real-world stimuli. Learn as early as possible.

Pragmatic architect
The pragmatic architect is also coding, more likely to discuss issues such as memory usage, CPU requirements, bandwidth needs, choose technology for their purpose and added value. He constantly thinks about the dynamics of change. He selects good enough solution for the current stresses— and he knows which ones need to be replaced depending on how the stress factors change over time.
Pragmatic architect ask good questions
- What metrics do we need to collect, and how will we analyze them ?
- What part of the system needs improvement the most?

Incident Management.
In any incident, the priority should always be to restore service. Restoring service takes precedence over investigation. Fortunately, the team had created scripts long ago to take thread dumps of all the Java applications and snapshots of the databases. 

Data to collect. 
From the application servers, you need log files, thread dumps, and configuration files. From the database servers, you need configuration files for the databases and the cluster servers. Compare the current configuration files to those from the nightly backup.
 
Common problems with clusters: 
- not enough heartbeats , 
- heartbeats going through switches that carry production traffic, 
- servers set to use physical IP addresses instead of the virtual address, 
- bad dependencies among managed packages,

once you know where to look, it’s simple to make a test that finds it. 
“How do we prevent bugs in one system from affecting everything else?” Inside every enterprise today is a mesh of interconnected, interdependent systems. They cannot— must not— allow bugs to cause a chain of failures.

A transaction is an abstract unit of work processed by the system. This is not the same as a database transaction. A single unit of work might encompass many database transactions. "Customer places an order" is a transaction. A single system can process just one type of transaction, making it a dedicated system . A mixed workload is a combination of different transaction types processed by a system.
A system might be as small as a single application, or it might be a sprawling, multitier network of applications and servers.

Stability: 
A resilient system keeps processing transactions, even when there are transient impulses, persistent stresses, or component failures disrupting normal processing.
A highly stable design usually costs the same to implement as an unstable one.

A system with longevity keeps processing transactions for a long time. What is a long time? It depends. A useful working definition of a long time is the time between code deployments.

The major dangers to your system’s longevity are memory leaks and data growth. Both kinds of struggle will kill your system in production. Both are rarely caught during testing.
How long do you usually keep an application server running in your development environment?

Self protection against system cracks: for example In case of jdbc cx when the pool was configured to block requesting threads when no resources were available, it eventually tied up all request-handling threads. (This happened independently in each application server instance.) The pool could have been configured to create more connections if it was exhausted. It could also have been configured to block callers for a limited time, instead of blocking forever when all connections were checked out. Either of these would have stopped the crack from propagating.
The more tightly coupled the architecture greater the chance a coding error can propagate. Conversely, the less coupled architectures act as shock absorbers, diminishing the effects of the error.

Chain of Failure: Underneath every system outage, there is a chain of events.
As soon as code needs to do I/O or remote calls, assess the following:
- What if I can’t make the initial connection?
-  What if it takes ten minutes to make the connection? 
- What if I can make the connection and then it gets disconnected?
-  What if I can make the connection and I just can’t get any response from the other end? 
- What if it takes two minutes to respond to my query? 
- What if 10,000 requests come in at the same time? 
- What if my disk is full when I try to log the error message

tight coupling can appear within application code, in calls between systems, or anyplace a resource has multiple consumers.

Stability anti patterns
big systems fail faster than small systems. Things will break.
Tight coupling allows cracks in one part of the system to propagate themselves— or multiply themselves— across layer or system boundaries.
Integration points are the number-one killer of systems. Every single one of those feeds presents a stability risk.
Slow failures, such as a dropped ACK, let threads block for minutes before throwing exceptions. The blocked thread can’t process other transactions, so overall capacity is reduced.

Whether for problem diagnosis or performance tuning, packet capture tools are the only way to understand what is really happening on the network. Use tcpdump. Remember socket connections are an abstraction. They exist only as objects in the memory of the computers at the endpoints . Once established, a TCP connection can exist for days without a single packet being sent by either side. 
A firewall is nothing but a specialized router. It routes packets from one set of physical ports to another. Inside each firewall, a set of access control lists define the rules about which connections it will allow. The rules say such things as “connections originating from 192.0.2.0/ 24 to 192.168.1.199 port 80 are allowed. It keeps live connection information into a table. Therefore, it does not allow infinite duration connections, even though TCP itself does allow them. Along with the endpoints of the connection, the firewall also keeps a “last packet” time. If too much time elapses without a packet on a connection, the firewall assumes that the endpoints are dead or gone. It just drops the connection from its table. With TCP and infinite connection, the endpoints assume their connection is valid for an indefinite length of time, even if no packets are crossing the wire. the TCP/ IP stack sends the packet, waits for an ACK, doesn’t get one, and retransmits.


Countering Integration Point Problems 
 What can you do to make integration points safer? The most effective patterns to combat integration point failures are Circuit Breaker and Decoupling Middleware.
- Beware this necessary evil: Every integration point will eventually fail in some way, and you need to be prepared for that failure. 
- Prepare for the many forms of failure: Integration point failures take several forms , ranging from various network errors to semantic errors. You will not get nice error responses delivered through the defined protocol; instead , you’ll see some kind of protocol violation, slow response, or outright hang. 
- Know when to open up abstractions: Debugging integration point failures usually requires peeling back a layer of abstraction . Failures are often difficult to debug at the application layer, because most of them violate the high-level protocols. Packet sniffers and other network diagnostics can help.
-  Failures propagate quickly: Failure in a remote system quickly becomes your problem, usually as a cascading failure when your code isn’t defensive enough.
-  Apply patterns to avert Integration Points problems: Defensive programming via Circuit Breaker, Timeouts, Decoupling Middleware, and Handshaking will all help you avoid the dangers of Integration Points.

Chain reactions
If your system scales horizontally, then you will have load-balanced farms or clusters where each server runs the same applications. The multiplicity of machines provides you with fault tolerance through redundancy.
When one node in a load-balanced group fails, the other nodes must pick up the slack.
When the first server failed because of some load-related condition, such as a memory leak or intermittent race condition, the surviving nodes become more likely to fail. 
A chain reaction occurs when there is some defect in an application— usually a resource leak or a load-related crash.
Chain reactions are sometimes caused by blocked threads. This happens when all the request-handling threads in an application get blocked and that application stops responding. Incoming requests will then get distributed out to the applications on other servers in the same layer, increasing their chance of failure.
- One server down jeopardizes the rest.
- Search for memory leaks
- Search for timing issue
-  Partitioning servers, with Bulkheads, can prevent Chain Reactions from taking out the entire service

Cascading failure
A cascading failure occurs when problems in one layer cause problems in callers. 
Cascading failures often result from resource pools that get drained because of a failure in a lower layer. Integration Points without Timeouts is a surefire way to create Cascading Failures.
- Stop cracks from jumping the gap
- Scrutinize resource pools
- Defend with Timeouts and Circuit Breaker A cascading failure happens after something else has already gone wrong. Circuit Breaker protects your system by avoiding calls out to the troubled integration point. Using Timeouts ensures that you can come back from a call out to the troubled one.

Blocking threads
- The Blocked Threads antipattern is the proximate cause of most failures. 
- Scrutinize resource pools: Like Cascading Failures, the Blocked Threads antipattern usually happens around resource pools, particularly database connection pools.
- Use proven api/ primitives
- Protection with timeouts
- Take care of invisible code. Test them.

Attacks of Self-Denial
 Self-denial is only occasionally a virtue in people and never in systems. A self-denial attack describes any situation in which the system— or the extended system that includes humans— conspires against itself.
- Keep the lines of communication open with teams who can generate aosd
- Protect shared resources: Programming errors, unexpected scaling effects, and shared resources all create risks when traffic surges.
- 
Scaling effect
We run into scaling effects all the time. Anytime you have a “many-to-one” or “many-to-few” relationship, you can be hit by scaling effects when one side increases. 
Point to point communication: The total number of connections goes up as the square of the number of instances.
Shared resources: When the shared resource saturates, you get a connection backlog. When the backlog exceeds the listen queue , you get failed transactions.

Stability Patterns
Eight healthy patterns provide architecture and design guidance to reduce, eliminate, or mitigate the effects of cracks in the system.
Use timeouts
Any physical or logical components of a connection can fail. Well-placed timeouts provide fault isolation; a problem in some other systems. Vendor-provided client libraries are notoriously devoid of timeouts.

Timeouts can also be relevant within a single application. Any resource pool can be exhausted. For long running interaction try to encapsulate into queryobject, and gateway pattern as template of connection handling, error management, query execution and result processing. 
The Timeouts pattern prevents calls to Integration Points from becoming Blocked Threads. Thus, they avert Cascading Failures.

Retries: in network issue fast retries are very likely to fail again. Queuing the work for a slow retry later is a very good thing, making the system much more robust. queue-and-retry ensures that once the remote server is healthy again, the overall system will recover.

For a website using service-oriented architectures, “fast enough” is probably anything less than 250 milliseconds.

Fail Fast is useful when you need to report why you won’t be able to process some transaction.

Circuit breakers 










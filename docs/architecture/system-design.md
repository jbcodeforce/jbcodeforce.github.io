# Conduct system design

* Verify the goals

    * Why we are doing this application / solution
    * Who is the end user
    * How they will use the system and for what
    * What are the expected outcome and inputs
    * How to measure success?

* Establish scope

    * list some potential features
    * Are we looking at end to end experience or API design
    * type of client applications or device
    * Do we require authentication? Analytics? Integrating with existing systems?

* Design according to scale

    * What is the expected read-to-write ratio?
    * How many concurrent requests should we expect?
    * What’s the average expected response time?
    * What’s the limit of the data we allow users to provide?
    * De we need to expose read data in different geographys?

* From high level to drill down

    * Cover end to end process
    * Go when necessary to detail of an API, data stores,..
    * look at potential performance bottle neck

* Review data structure and algorithms to support distributed system and scaling

* Be able to argument around

    * What type of database would you use and why?
    * What caching solutions are out there? Which would you choose and why?
    * What frameworks can we use as infrastructure in your ecosystem of choice?

## Scalability

### Single server design

* Unique server with HTTP and Database on a unique server. But single point of failure: impact is to change DNS routing with new server. Get backup
* Separate out the DB help to scale DB and server independently. 

### Vertical scaling

Use bigger server. Get a limit by hardware size. Still single point of failure.
Pros is the limited number of things to maintain.

### Horizontal scaling

Load balancer sends traffic to a farm of servers.
This is easier if your web server is stateless, that means we do not keep state of the conversation. Any server can get request at any time.

Serverless solution from AWS, Lambda, kinesis, athena

## Failover

### Cold standby

* periodic backup
* restore backup on DR site
* reconnect front end server to new DB server
* Data done after the database backup is lost
* Take time to get the new server up and running.

###  Warm Standby

* Continuous replicated: the DB is ready to get connected
* Tiny window to get data loss
* Vertical scaling still

### Hot Standby

* Write to both servers simultanuously 
* can distribute the read

## Sharding database

* Horizontal partition of the database
* Each shard has its own replicated backup
* Hashcode is used to allocate data to shard
* Combining data from shards is more complex. So need to minimize joins and complex SQL
* Organize data in key value, to easy the hashing. 
* Value can be an object and let the client being able to interpret.

For example MongoDB uses mongos on each app server to distribute the data among a replica sets. Replica sets are managed by primary server and secondary servers to manage shards.
In case of primary server, the secondary servers will elect a new primary. Primary looks like SPOF, but the recover quickly via the secondary taking the lead. Need at least 3 servers to elect a primary.
Traffic is partitioning according to a scheme, which is saved in a config servers. 

Cassandra uses node rings, a shard is replicated multiple times to other nodes, but each node is a primary of a shard. So
data needs to be fully replicated, and eventually will be consistent. 

Resharding is a challenge for the database.

NoSQL really means sharded database, as some DB can support most of SQL operations.  

**Need to address how to partition the raw data for best performance**. For example organize the bucket or folder structure
to simplify future queries: organize them by date, or entity key...
### Denormalizing

We normalize the data to use less storage and updates in one place. But need more lookups.

Denormalize duplicates data, use more storage, one lookup to get the data, and updates are hard.

To assess what is a better fit, Start with normalize, we need to think about the customer experience, depending of the type of queries.

## Data lake

Throw data into text files (json, csv...) into big distributed storage system like S3. Which his named data lake. It is used in common problem like Big Data and unstructured data. 

We can also query those data by adding an intermediate components to create schema from the data and support queries. (Amazon Glue like a schema discovery) and Amazon Athena to support queries and Redshift to do distributed warehouse with spectrum to query on top of s3.

| Product | Description |
| ---- | ---- |
| AWS S3 | [Service](https://s3.console.aws.amazon.com/s3/). [data lake with s3](https://aws.amazon.com/big-data/datalakes-and-analytics/) |
| Google Cloud Storage | [introduction](https://cloud.google.com/storage/docs/introduction). Use hierarchy like: organization -> project -> bucket -> object. [Tutorial](https://cloud.google.com/architecture?text=Cloud%20Storage)|
| IBM Cloud Object Storage | [doc](https://www.ibm.com/cloud/object-storage)| 
| Azure Blob | [doc](https://azure.microsoft.com/en-us/services/storage/blobs/) | 

## CAP & ACID

* **Atomicity**: either the entire transaction succeeds or the entire thing fails
* **Consistency**: All database rules are enforced, or the entire tx is rolled back. Consistency outside of ACID is really to address how quickly we get the data eventually consistent after a write. 
* **Isolation**: no tx is affected by any other tx that is still in progress.
* **Durability**: once a tx is committed, it stays, event if the system crashes.

**CAP theorem**: We can have only 2 of the 3: Consistency, Availability and Partition tolerance.
With enhanced progress CAP is becoming weaker, but still applies. A is really looking at single point of failure when something going down. So MongoDB for example may loose A for a few seconds maximum (find a new primary leader), which may be fine.

    * AC: is supported by classical DBs like mySQL
    * AP: Cassandra: C is lost because of the time to replicate
    * CP: Mongodb, HBASE, dynamoDB

## Caching

Goal: limit to access disk to get data, or go over the network.
Solution is to add a cachine layer in front of the DB to keep the most asked data, or the most recent... Caching services can be used to be able to scale horizontally.

Every cache server is managing a partition of the data, using hashing.

Approriate for applications with more reads than writes. Expiration policies dictate how long data stays in cache. Avoid data go stale.

The hotspot may bring challenge for cache efficiency, need to cache also on load distribution and not just on hash. Finally starting the cache is also a challenge, as all requests will go to the DB.

Different eviction policies can be done:

* LRU: least recently used. HashMap for key and then doubly linked-list, head points to MRU and tail points to the LRU
* LFU: least frequently used
* FIFO

Redis, Memcached, ehcache. AWS Elasticache
### Content Delivery Networks

Distribute read data geographically (css, images, js, html...), can event apply to ML model execution.


## Zookeeper review
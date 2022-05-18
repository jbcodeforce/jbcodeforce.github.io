# [Red Panda](https://redpanda.com/)

Redpanda is a new storage engine, optimized for streaming data, using a thread-per-core architecture focused on delivering stable tail-latencies

## Value Propositions

* Kafka compatible cluster. C++ engine.
* Single binary to deploy. No more zookeeper. It uses the Raft consensus algorithm internally.
* Up to 10x lower tail latencies and 6x faster Kafka transactions on fewer resources.
* Zero data loss by default, highly available and predictable performance at scale
* Limitless processing of both real-time and historical data through a single API.
* Redpanda Keeper (RPK) automatically tunes your kernel to yield the optimal settings for your hardware
* Transform data with our WebAssembly-based engine.

With [cloud offering](https://redpanda.com/cloud/)

* Automated backups to S3/GCS

### EDA positioning

* Many of the benefits of an event-processing system can be found in a simple **pub/sub** process or database that collects events from application components and makes them available to other components.
* Data as a product: you transform your event stream from individual actions into a warehouse of information about everything that happens in your application

### Kafka counters

* Kafka’s default configuration may acknowledge writes before fsync. This might allow Kafka to lose messages when nodes fail.

### Performance

* uses DMA (Direct Memory Access) for all its disk IO
* place the data directory (/var/lib/redpanda/data) on an XFS partition in a local NVMe SSD
* automatically chooses the best setting to drive high throughput traffic to the machine.
* everage `cgroups` to isolate the Redpanda processes
* leverage `systemd` slices, to strongly prefer evicting other processes before evicting RedPanda process’ memory and to reserve IO quotas and CPU time
* CPU is configured for predictable latency at all times

### Tiered Storage

Tiered Storage allows you to save storage costs by offloading log segments to cloud storage. You can specify the amount of local storage that you want to provision and configure Tiered Storage to move the rest to Amazon S3 or Google Cloud Storage.

Redpanda Tiered Storage works behind the scenes to index where data is offloaded so that it can retrieve the data when you need it.

You can enable Tiered Storage for a cluster or for a topic.

Remote write is the process that constantly uploads log segments to cloud storage. The process is created for each partition and runs on the leader node of the partition.

## Architecture

![](./images/redpanda-arch.png)

## Getting started

See [Platform to get the product](https://redpanda.com/platform/), or docker

```sh
docker run -d --pull=always --name=redpanda-1 --rm \
-p 8081:8081 \
-p 8082:8082 \
-p 9092:9092 \
-p 9644:9644 \
docker.redpanda.com/vectorized/redpanda:latest redpanda start --overprovisioned \
--smp 1  --memory 1G --reserve-memory 0M --node-id 0 --check=false
# Start a shell
docker exec -ti redpanda-1 bash
# use rpk commands
```

See also the docker compose under [studies/redpanda](./studies/redpanda) folder.

### [rpk common commands](https://docs.redpanda.com/docs/reference/rpk-commands/)

```sh
# on macos directly
rpk container start
# cluster
rpk cluster info --brokers ....
# Topic
rpk topic create twitch_chat --brokers=localhost:9092
# produce text message like kafka-console-producer
rpk topic produce twitch_chat --brokers=localhost:9092
# Consume
rpk topic consume twitch_chat --brokers=localhost:9092
# Edit cluster config
rpk cluster config edit
```

## Data transformation with WebAssembly 


## Scenario

Inject [flights data to RedPanda then to Pinot](https://redpanda.com/blog/streaming-data-apache-pinot-kafka-connect-redpanda/).

* [flights-schema.json] to define the flights table in Pinot

* Create topic in redpanda:

```sh
docker exec -ti redpanda-1 bash
rpk topic create flights
```

* Create table in Pino

```sh
docker exec -ti pinot-controller bash
./bin/pinot-admin.sh AddTable     -schemaFile /tmp/panda_airlines/flights-schema.json     -tableConfigFile /tmp/panda_airlines/flights-table-realtime.json     -exec
```

* Produce message to the `flights` topic

```sh
rpk topic produce flights < /tmp/panda_airlines/flights-data.json
```

* Connect to the pinot web console 

```sh
chrome localhost:9001
```

* Execute the following query in the `Query Console` to verify the connection to Kafka has worked and the table in Pinot is loaded with records from `flights` topic:

```sql
select * from flights limit 10
```

* Then execute the following SQL to address the analyst's request: *Find the number of flights that occurred in January 2014 that have air time of more than 300 minutes and that are from any airport in the state of California to JFK airport.*

```sql
select count(*) from flights
where Dest='JFK'
  and AirTime > 300
  and OriginStateName='California'
  and Month=1
  and Year=2014
```

???- "Read more"
    * [Raft consensus algorithm](http://thesecretlivesofdata.com/raft/)

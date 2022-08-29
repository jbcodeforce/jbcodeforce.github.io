# MQ Challenges

## Getting started with MQ docker image

See the docker compose file in the [Java Studies mqChallenges folder](https://github.com/jbcodeforce/java-studies/tree/master/mqChallenges). Once the mqserver is running, open a bash:  `docker exec -ti mqserver bash`

[See this last mq connect app to qm in container article](https://developer.ibm.com/tutorials/mq-connect-app-queue-manager-containers/)

* Display the MQ server information by exec in the container and use command `dspmqver`.

```shell
bash-4.4$ dspmqver
Name:        IBM MQ
Version:     9.1.5.0
Level:       p915-ifix-L200325.DE
BuildType:   IKAP - (Production)
Platform:    IBM MQ for Linux (x86-64 platform)
Mode:        64-bit
O/S:         Linux 4.19.76-linuxkit
O/S Details: Red Hat Enterprise Linux 8.1 (Ootpa)
InstName:    Installation1
InstDesc:    IBM MQ V9.1.5.0 (Unzipped)
Primary:     N/A
InstPath:    /opt/mqm
DataPath:    /mnt/mqm/data
MaxCmdLevel: 915
LicenseType: Developer
```

* Display your running queue managers: `dspmq`

```shell
QMNAME(QM1)                                               STATUS(Running)
```

The default configuration is:

```properties
Queue manager QM1
Queue DEV.QUEUE.1
Channel DEV.APP.SVRCONN
Listener DEV.LISTENER.TCP on port 1414
```

The queue that you will be using, DEV.QUEUE.1, “lives” on the queue manager QM1. The queue manager also has a listener that 
listens for incoming connections, for example, on port 1414. Client applications can connect to the queue manager 
and can open, put, and get messages, and close the queue.

Applications use an MQ channel to connect to the queue manager. Access to these three objects is restricted in different ways. 
For example, user “app”, who is a member of the group “mqclient” is permitted to use the channel DEV.APP.SVRCONN to connect 
to the queue manager QM1 and is authorized to put and get messages to and from the queue DEV.QUEUE.1.

## Demo app

Client applications connect to the queue manager and can open, put, and get messages, and close the queue.
Applications use an MQ channel to connect to the queue manager. The following demo 
opens a queue, puts messages to it and then gets messages from the same queue. The app demonstrates point-to-point style of messaging.

```shell
curl https://raw.githubusercontent.com/ibm-messaging/mq-dev-samples/master/gettingStarted/mq-demo-client-application/Dockerfile
# Build
docker build -t mq-demo .
# Run
docker run -ti mq-demo
```

Then answer the questions, using the name of `mqserver` for the hostname, as it is the name defined in the docker compose, and the password is the one defined in `MQ_APP_PASSWORD`.

```
|  \/  |/ _ \  |   \ ___ _ __  ___
| |\/| | (_) | | |) / -_) '  \/ _ \
|_|  |_|\__\_\ |___/\___|_|_|_\___/

Welcome to this demo application for IBM MQ!
The app will allow you to connect to a queue manager and start sending and receiving messages.

Type the name of your queue manager (leave blank for 'QM1'):
Type the host name or IP address for your queue manager:
mqserver
Type the listener port of your queue manager (leave blank for '1414'):
Type the name of the client connection channel (leave blank for 'DEV.APP.SVRCONN'):
Type the name of the queue (leave blank for 'DEV.QUEUE.1'):
Type the application user name (leave blank for 'app'):

Connecting to queue manager 'QM1'
at address 'mqserver(1414)'
through channel 'DEV.APP.SVRCONN'
...
Connected!

*** YOU ARE NOW CONNECTED TO THE QUEUE MANAGER! ***

Type PUT [number] to put a given number of messages to the queue
Type GET [number] to get a given number of messages from the queue
Type AUTO [seconds] to put and get messages automatically for a given number of seconds
Type EXIT to quit
Type HELP to display this message
```

Play with PUT and GET.

## Access to MQ Console

`https://localhost:9443/ibmmq/console`  admin / passw0rd

![](./images/mq-main-page.png)

## MQ concepts

See [my notes](../techno/integration/mq.md)

Configure MQ Qmgr with config map. See [this real time inventory gitops repo](https://github.com/ibm-cloud-architecture/store-mq-gitops/blob/main/environments/smq-dev/apps/services/mq/base/qmgr.yaml)

Example of config map

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mq-mqsc-config
data:
  example.mqsc: |
    DEFINE QLOCAL('ITEMS') REPLACE
    DEFINE CHANNEL('DEV.ADMIN.SVRCONN') CHLTYPE(SVRCONN) REPLACE
    DEFINE QLOCAL('DEV.DEAD.LETTER.QUEUE') REPLACE
    ALTER QMGR DEADQ('DEV.DEAD.LETTER.QUEUE')
    DEFINE CHANNEL(DEV.APP.SVRCONN) CHLTYPE(SVRCONN) 
    ALTER QMGR CHLAUTH (DISABLED)
    REFRESH SECURITY TYPE(CONNAUTH)
```

???+ Tutorials
    * [Developer.ibm](https://developer.ibm.com/components/ibm-mq/tutorials/)

## Basic JMS 2.0 client

The code under JMSMQclient is an adaption of [the develop MQ client tutorial](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/develop-mq-jms/). The differences are:

* use quarkus to package as webapp.
* Offer API to start the sending of n messages.
* Offer API to get the consumed message.
* Inject configuration from properties file.
* Expose API via swagger.

### Send Text message and use correlationID to be used as key

See the code in the store simulator [MQItemGenerator class](https://github.com/ibm-cloud-architecture/refarch-eda-store-simulator/blob/master/backend/src/main/java/ibm/gse/eda/stores/infra/mq/MQItemGenerator.java):

```java
private void sendToMQ(Item item) {
      try { 
        String msg = parser.toJson(item);
        TextMessage message = jmsContext.createTextMessage(msg);
        message.setJMSCorrelationID(item.storeName);
        producer.send(destination, message);
        logger.info("sent to MQ:" + msg);
      } catch( Exception e) {
        e.printStackTrace();
      }   
}
```

And the corresponding kafka connector configuration in [mq-source.properties](https://github.com/ibm-cloud-architecture/eda-rt-inventory-gitops/blob/main/local-demo/kconnect/mq-source.properties):

```properties
 mq.connection.mode=client
 key.converter=org.apache.kafka.connect.storage.StringConverter
 mq.message.body.jms=true
 value.converter=org.apache.kafka.connect.storage.StringConverter
 mq.record.builder=com.ibm.eventstreams.connect.mqsource.builders.DefaultRecordBuilder
 mq.record.builder.key.header=JMSCorrelationID
```

## Publisher / Subscribe on MQ

This is the implementation of [the MQ developer tutorial](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/mq-dev-challenge/) and supports the implementation of the following solution:

![](https://developer.ibm.com/messaging/wp-content/uploads/sites/18/2018/08/LearnMQbadgeDiag1.png)

The conference event system and reseller applications are loosely coupled. Asynchronous messaging allows us to integrate these components and build in a buffer, or shock absorber. Should either component lose connectivity, fail or experience fluctuations in throughput, the messaging layer will deal with any instability.

## The Event Booking

This is the implementation of [the MQ developer tutorial](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/mq-dev-challenge/) and supports the implementation of the following solution:

![](./images/mq-arch-ticketing.png)

The conference event system and reseller applications are loosely coupled. Asynchronous messaging allows us to integrate
 these components and build in a buffer, or shock absorber. Should either component lose connectivity, fail or experience 
 fluctuations in throughput, the messaging layer will deal with any instability.

The event booking system runs in a container and holds an event publisher, MQ server hosting newTickets topic and purchase 
and confirmation queues. The code is in `java-studies/mqChallenges/MQTicketService` folder.

`newTicket` messages are sent every 30 s to the `newTickets` topic. The message payload contains an EventId and the number of available tickets.
The Reseller application uses the received payload to construct a request message to buy some tickets.

The application uses JMS to send to queue or topic.

See instructions in the [readme] to build and run the solution locally with docker.

For any app we need the JMS api jar and the MQ all client code. Here are the two curl to use

```sh
curl -o com.ibm.mq.allclient-9.2.0.0.jar https://repo1.maven.org/maven2/com/ibm/mq/com.ibm.mq.allclient/9.2.0.0/com.ibm.mq.allclient-9.2.0.0.jar
curl -o javax.jms-api-2.0.1.jar https://repo1.maven.org/maven2/javax/jms/javax.jms-api/2.0.1/javax.jms-api-2.0.1.jar
```


## The reseller app

The Reseller application provides the prompt to ask the user how many of the available tickets they want to purchase.
The conference event booking system will process the request message and provide a response. 
The Reseller application will print the outcome to stdout.

Build with the shell `./TicketSeller/build.sh` (be sure to use jdk 1.8) and run it with:

```shell
# use jdk 1.8
sdk use java 8.0.292.j9-adpt
# build
./build.sh
# run it
./runReseller.sh
# And buy ticket as they are published
```
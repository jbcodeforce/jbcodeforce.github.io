# Event Driven Architecture

!!! info
    Updated 7/7/2022
* [Main EDA reference implementation](https://ibm-cloud-architecture.github.io/refarch-kc)
* [Vaccine reference implementation](https://ibm-cloud-architecture.github.io/vaccine-solution)
* [Kafka notes](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-overview/)
* [Kafka Streams](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-streams/)
* [Kafka Connect](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-connect/) with hand-on lab
* [Mirror maker 2](https://ibm-cloud-architecture.github.io/refarch-eda/use-cases/kafka-mm2/)
* [Consumer group](https://ibm-cloud-architecture.github.io/refarch-eda/technology/event-streams/consumergrp/)

## Labs

* [Event Streams on Cloud lab](https://ibm-cloud-architecture.github.io/refarch-eda/technology/event-streams/es-cloud/)
* [Security and access control with IBM Cloud lab](https://ibm-cloud-architecture.github.io/refarch-eda/technology/event-streams/security/)
* [Real time inventory management with kafka streams and kafka connect](https://ibm-cloud-architecture.github.io/refarch-eda/scenarios/realtime-inventory/):


## demos

* Real-time inventory with flink, elasticsearch, kafka, cloud object storage

| App   | Type  | Build | Registry | Git workflow | Local | OCP |
| ----- | ----- | ----- | -------- | ------------ | ----- | --- |
| [Store sale event producer simulator]() | Quarkus 2.7.1 | ok | quay.io/ibmcase/eda-store-simulator  | ko | ok | gitops ok | 
| [store-inventory](https://github.com/ibm-cloud-architecture/refarch-eda-store-inventory) | Quarkus 2.7.1  | test ko | quay.io/ibmcase/store-aggregator | ok | ok |
| [item-inventory](https://github.com/ibm-cloud-architecture/refarch-eda-item-inventory) | Quarkus 2.7.1  | test ko | quay.io/ibmcase/item-aggregator | ok | ok |

* [GitOps eda-rt-inventory-gitops](https://github.com/ibm-cloud-architecture/eda-rt-inventory-gitops) includes the deployment of the 3 apps + kafka connectors and docker-compose to run the solution local.
* Demo scripts in: [refarch-eda/scenarios/realtime-inventory](https://ibm-cloud-architecture.github.io/refarch-eda/scenarios/realtime-inventory/#demonstration-script-for-the-solution)

* Order demos based on developer experience article:

    * [Order demo gitops](https://github.com/jbcodeforce/eda-demo-order-gitops)  The readme is up to date
    * [Order producer](https://github.com/jbcodeforce/eda-demo-order-ms)
    * [Order consumer]()

* [Angular app with nodejs BFF](https://github.com/jbcodeforce/refarch-kc-ui) to present the container shipment demonstration
* [A fleet simulator microservice](https://github.com/jbcodeforce/refarch-kc-ms)
* [Real time analytics](https://github.com/jbcodeforce/refarch-kc-streams) as streaming application demonstrates real time event processing applied to inputs from the ships and containers used in the K Container Shipment Use Case
* [Event sourcing and CQRS pattern illustrated](https://github.com/jbcodeforce/refarch-kc-order-ms)
* [Event Streams Samples for IBM messaging github](https://github.com/ibm-messaging/event-streams-samples)


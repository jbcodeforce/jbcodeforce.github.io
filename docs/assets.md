# Assets developed

This is the list of assets, I developed or co-developed over the years.

## Methodology

* [Event storming workshop](https://ibm-cloud-architecture.github.io/refarch-eda/methodology/event-storming/)
* [Domain Driven Design](https://ibm-cloud-architecture.github.io/refarch-eda/methodology/domain-driven-design/) 
* [Develop data intensive app](https://ibm-cloud-architecture.github.io/refarch-eda/methodology/data-intensive)
* [Agile business rules development](https://ibm-cloud-architecture.github.io/refarch-dba/methodology/abrd/)

## EDA

### Architecture

* [Global EDA site](https://ibm-cloud-architecture.github.io/refarch-eda/) - started in 10/2018 - continuously updated
* [Reefer Container shipment EDA solution implementation](https://ibm-cloud-architecture.github.io/refarch-kc/) - started 10/2018
* [Reference Architecture and integration with analytics and machine learning](https://ibm-cloud-architecture.github.io/refarch-eda/introduction/reference-architecture/#integration-with-analytics-and-machine-learning)
* [Advantages of Event-Driven Reference Architectures - Microservice decoupling](https://ibm-cloud-architecture.github.io/refarch-eda/advantages/microservice)
* [Advantages of Event-Driven Reference Architectures - Reactive systems](https://ibm-cloud-architecture.github.io/refarch-eda/advantages/reactive) 
* [Advantages of Event-Driven Reference Architectures- Resiliency](https://ibm-cloud-architecture.github.io/refarch-eda/advantages/resiliency/) 
* [Strangler design pattern in the context of EDA](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/intro/#strangler-pattern)
* [CQRS pattern discussion](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/cqrs/) - documented 01/2019 - updated 04/2020
* [Event sourcing design pattern](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/event-sourcing/) 01/2019
* [Dead letter queue design pattern](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/dlq/) -1/2020
* [SAGA design pattern](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/saga/)- 01/2019, updated Q1 - 2020
* [SAGA orchestration with MQ - producer app](https://github.com/ibm-cloud-architecture/eda-kc-order-cmd-mq)
* [SAGA orchestration with MQ - mq consumer app (voyage)](https://github.com/ibm-cloud-architecture/eda-kc-voyage-ms-mq)
* [SAGA orchestration with MQ - knative mq consumer app (reefer)](https://github.com/ibm-cloud-architecture/eda-kc-reefer-kn-mq)
* [Modern data lake: point of view](https://ibm-cloud-architecture.github.io/refarch-eda/introduction/reference-architecture/#modern-data-lake) - Q2 2020
* [Legacy integration](https://ibm-cloud-architecture.github.io/refarch-eda/introduction/reference-architecture/#legacy-integration) - Q1 2020 / Updated Q3 2020
* [Business Automation products on top of EDA](https://ibm-cloud-architecture.github.io/refarch-eda/introduction/reference-architecture/#integrating-with-ibm-automation-products)
* [integration with a potential MQ transactional framework with kafka / life insurance demo](https://github.com/jbcodeforce/life-insurance-demo/)
* [EDA governance with Apache Atlas](https://github.com/jbcodeforce/eda-governance)

### Development practices

* [Different Data Models](https://ibm-cloud-architecture.github.io/refarch-dba/methodology/model/)
* [CQRS pattern implementation](https://github.com/ibm-cloud-architecture/refarch-kc-order-ms) query and command are part of two separate folders. - started in dec 2018 - updated Q1 2020 with new integration tests.
* [Topic replication with mirror maker 2](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/topic-replication/) Q2 2020 - updated 09/2020
* [Mirror Maker 2  Studies](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-mirrormaker/)  04/2020
* [Mirror maker 2 labs](https://ibm-cloud-architecture.github.io/refarch-eda/use-cases/kafka-mm2/) - Q2 2020 - updated 09/2020
* [Event Streams on Cloud hands on lab](https://ibm-cloud-architecture.github.io/refarch-eda/technology/event-streams/es-cloud/) introductory hands-on lab on IBM Event Streams on Cloud with topic creation. It was done in the context of customer's Kafka bootcamp. 
* [Store item sale simulator to produce messages to Rabbit MQ, IBM MQ or Kafka backends](https://github.com/ibm-cloud-architecture/refarch-eda-store-simulator) 10/2020
* [Realtime Analytics pattern](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/realtime-analytics/). Created for EDA
* [Reefer simulator in python](https://github.com/ibm-cloud-architecture/vaccine-reefer-simulator) - updated 02/2021
* [Reefer Container Shipment Container Management](https://github.com/ibm-cloud-architecture/refarch-kc-container-ms) springboot
* [Container inventory management - legacy mockup](https://github.com/ibm-cloud-architecture/refarch-container-inventory)
* [Gitops with kustomize for Vaccine solution](https://github.com/ibm-cloud-architecture/vaccine-gitops) - 03/2021
* [Spring cloud stream project template with apicurio](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/spring-cloud-stream). 05/2021
* [EDA quickstart code templates](https://github.com/ibm-cloud-architecture/eda-quickstarts)
* [IBM Tech academy](https://ibm-cloud-architecture.github.io/eda-tech-academy)

### Technology

* [Kafka Summary](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-overview/)
* [Kafka Producers & Consumers best practices](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-producers-consumers/)
* [Kafka Streams Summary](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-streams/)
* [Kafka Streams lab 3](https://ibm-cloud-architecture.github.io/refarch-eda/use-cases/kafka-streams/lab-3/) - 09/2020 - Q4 2020
* [Inventory view with Kafka Streams, interactive queries, and quarkus](https://github.com/ibm-cloud-architecture/refarch-eda-item-inventory)
* [Kafka Connect](https://ibm-cloud-architecture.github.io/refarch-eda/technology/kafka-connect/)
* [Kafka connect with Cloud Object storage](https://ibm-cloud-architecture.github.io/refarch-eda/use-cases/connect-cos/)
* [IBM MQ in the context of EDA](https://ibm-cloud-architecture.github.io/refarch-eda/technology/mq/) started 09/2020
* [Event Streams on Cloud - security with IAM - labs](https://ibm-cloud-architecture.github.io/refarch-eda/technology/event-streams/security/) Q1 2020
* [Event Streams on Cloud - Consumer group lab](https://ibm-cloud-architecture.github.io/refarch-eda/technology/event-streams/consumergrp/) Q1 -2020
* [Event Streams on Cloud - monitoring](https://ibm-cloud-architecture.github.io/refarch-eda/use-cases/monitoring-on-cloud/)  Q1 -2020
* [Flink studies](http://github.com/jbcodeforce/flink_studies)

## Integration

* [Hybrid Integration Reference Architecture](https://github.com/ibm-cloud-architecture/refarch-integration) q3 2019
* [Inventory API with API management](https://github.com/ibm-cloud-architecture/refarch-integration-api)
* [Inventory Data Access Layer](https://github.com/ibm-cloud-architecture/refarch-integration-inventory-dal)
* [DB2 Inventory Database](https://github.com/ibm-cloud-architecture/refarch-integration-inventory-db2) 04/2017
* [MQ Messaging Solution](https://github.com/ibm-cloud-architecture/refarch-mq-messaging)
* [Customer management microservice](https://github.com/ibm-cloud-architecture/refarch-integration-services)
* [Inventory Flow - Integration Bus](https://github.com/ibm-cloud-architecture/refarch-integration-esb) The goal of this project is to demonstrate how an IBM Integration Bus runtime can be deployed on premise or on IBM Cloud Private, running gateway flows to expose REST api from SOAP back end services.

## AI - Data

* [Cognitive Reference Architecture](https://github.com/ibm-cloud-architecture/refarch-cognitive)
* [Data and AI Reference Architecture](https://github.com/ibm-cloud-architecture/refarch-data-ai-analytics)
* [Reefer Predictive Maintenance Solution](https://github.com/ibm-cloud-architecture/refarch-reefer-ml)
* [Vaccine Cold Chain Monitoring - solution](https://github.com/ibm-cloud-architecture/vaccine-solution-main) - 07/2020
* [Vaccine Order Manager event-driven microservice](https://github.com/ibm-cloud-architecture/vaccine-order-mgr) - 07/ 2020
* [Vaccine Order & Reefer Optimization](https://github.com/ibm-cloud-architecture/vaccine-order-optimizer) python flask app to integrate with cplex to build a model
* [Watson Discovery enablement](https://www.ibm.com/cloud/architecture/tutorials/cognitive-discovery-advanced)
* [Watson discovery broker app](https://github.com/ibm-cloud-architecture/refarch-cognitive-discovery-broke)
* [Watson conversation training](https://www.ibm.com/cloud/architecture/tutorials/watson_conversation_support)
* [Watson conversation broker](https://github.com/ibm-cloud-architecture/refarch-cognitive-conversation-broker)
* [Context Driven Dialog](https://github.com/ibm-cloud-architecture/context-driven-dialog)
* [Product Recommendations with Watson Assistant and Decision Management](https://github.com/ibm-cloud-architecture/refarch-cognitive-prod-recommendations) - 12/2018
* [Cognitive Architecture: Supplier On Boarding Business Process](https://github.com/ibm-cloud-architecture/refarch-cognitive-supplier-process)
* [Customer analysis with cognitive and analytics in hybrid cloud](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics)

## Business process automation

* [Digital Business Automation site](https://ibm-cloud-architecture.github.io/refarch-dba)
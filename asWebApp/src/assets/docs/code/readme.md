

### Hybrid Cloud Solution Implementation

* **[Hybrid cloud integration reference implementation](https://github.com/ibm-cloud-architecture/refarch-integration)** This is a huge piece of work to present hybrid integration, private and public cloud solution covering SOA, micro service, nodejs, angular 4, API Connect, Integration Bus, DB2 and java WS.
* **[Customer analysis with cognitive and analytics in hybrid cloud](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics)** The goal of this implementation is to deliver a reference implementation for data management and service integration to consume structured and unstructured data to assess customer attrition.
* **[Dynamic Dialog with rule engine](https://github.com/jbcodeforce/context-driven-dialog)** This application demonstrates how to combine IBM Watson™ Natural Language Classifier with a rule-based system (ODM Bluemix Business Rules Service) to offer a context driven conversation solution, full flexibility in terms of code change, empowering the business user to change the conversation flow and recommendations.
* **[Angular 5 web app integrating some TDD practices with Jasmine](https://github.com/ibm-cloud-architecture/refarch-caseportal-app)** and to deploy on IBM Cloud Private.
* **[Product recommendation in the context of user moving in different location](https://github.com/ibm-cloud-architecture/refarch-cognitive-prod-recommendations)**
This project demonstrates how to leverage Watson Assistant to gather information about the customer intent, and propose the best product recommendations from his profile and the set of answers / facts gathered during the conversation.
* **[Customer Management Microservice](https://github.com/ibm-cloud-architecture/refarch-integration-services)** The goal of this project is to implement a set of RESTful services to manage customer, account, owned products and purchase order. The data persisted in DB2 include around 3500 fake customer records to serve as a training and test sets for churn risk scoring model.
* Business process management and **[Supplier On Boarding Business Process](https://github.com/ibm-cloud-architecture/refarch-cognitive-supplier-process)** which illustrates how to integrate Watson Discovery inside of a human centric process, how to start a process from a chatbot, and how to call a chatbot in the context of a BPM coach / user interface.

### Cognitive, Analytics and Machine Learning

* **[The cognitive reference architecture supporting implementation for Watson Assistant or Discovery broker codes](https://github.com/ibm-cloud-architecture/refarch-cognitive)** I present here two brokers to front end Watson Assistant and Watson Discovery as well as developing Watson Conversation tutorial and Watson Discovery tutorials
* **[Data analytics](https://github.com/ibm-cloud-architecture/refarch-analytics)** support the Data analytics reference architecture with solution covering machine learning, data governance and hybrid integration. This asset was presented at IBM Think conference 2018. The related assets are:
<ul>
 * [Customer Churn Analysis Jupyter notebook](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics/blob/master/docs/ml/CustomerChurnAnalysisDSXICP.md) and [Python notebook codes](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics/blob/master/src/dsx)
 * [Churn demo webapp with a chatbot user interface](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics/tree/master/src/client)
 * [BFF microservice in nodejs to support watson conversation, tone analysis, customer microservice proxy..](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics/tree/master/src/server)
 * [Watson Conversation workspace for the demonstration](https://github.com/ibm-cloud-architecture/refarch-cognitive-analytics/tree/master/src/wcs)
 * [Customer management microservice in JAXRS and Liberty](https://github.com/ibm-cloud-architecture/refarch-integration-services)
 * [Data Science Experience installation on ICP](https://github.com/ibm-cloud-architecture/refarch-analytics/tree/master/docs/DSX)
</ul>
* **[Watson Discovery broker](https://github.com/jbcodeforce/refarch-cognitive-discovery-broker)** A microservice to front end Watson Discovery and do integration with other services.
* **[Manufacturing Asset Analytics to predict maintenance](https://github.com/ibm-cloud-architecture/refarch-asset-analytics)** This solution presents an end to end implementation to enable predictive maintenance capabilities on manufacturing assets using event streaming with Kafka, Cassandra, Data Science Experience, ICP for Data.
The subprojects are:
<ul>
    * [Kafka consumers and data injector to Cassandra](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/asset-consumer
    * [Kafka producer to simulate new asset event and measurement event](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/asset-event-producer)
    *  [Angular 6 based dashboard](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/asset-dashboard-ui) with real time websocket to push events coming from Kafka
    * [Springboot Backend For Frontend](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/asset-dashboard-bff) to support UI REST verbs.
    * [Asset manager microservice to expose RESTful Asset CRUD APIs](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/asset-mgr-ms) on top of Cassandra, using Springboot Reactive Cassandra Data template
    * [Cassandra kubernetes deployment files](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/deployments/cassandra)
    * [Kafka kubernetes deployment files](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/deployments/kafka)
    * [Zookeeper kubernetes deployment files](https://github.com/ibm-cloud-architecture/refarch-asset-analytics/tree/master/deployments/zookeeper)

</ul>

### Personal Studies


* [How to do event sourcing pattern using kafka, nodejs and expressjs](https://github.com/jbcodeforce/nodejs-kafka)
* [Machine learning in python](https://github.com/jbcodeforce/ml-basics)

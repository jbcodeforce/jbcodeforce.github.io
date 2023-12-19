# Cloud Object Storage

IBM Cloud Object Storage is a highly scalable cloud storage service, designed for high durability, resiliency and security. Store, manage and access your data via our self-service portal and RESTful APIs.

Comparable to [AWS S3](https://jbcodeforce.github.io/aws-studies/infra/storage/#s3-simple-storage-service) service

## Benefits

* Reduce storage costs
* Reduce downtime
* Simple access via REST APIs with object based access for developer
* Secure data using automatic server-side encryption and get encryption options with keys managed by IBM Key Protect key management system, or encryption with keys that you manage.

## Use cases

* [Backup and recovery](https://www.ibm.com/cloud/object-storage/backup-and-recovery)
* [Data archiving](https://www.ibm.com/cloud/object-storage/data-archiving)
* [cloud native app](https://www.ibm.com/cloud/object-storage/cloud-native-app-data-storage): store large amounts of unstructured IoT data or mobile data
* [AI and big data analytics](https://www.ibm.com/cloud/object-storage/ai-big-data-analytics): build data lake for analytics

## Getting started

[Product documentation](https://cloud.ibm.com/docs/cloud-object-storage/getting-started.html) to learn how to create bucket and access it via [API](https://cloud.ibm.com/docs/cloud-object-storage/api-reference?topic=cloud-object-storage-compatibility-api)

## Analytics

* **Query data in place**: IBM Cloud SQL Query is a fully managed service that lets developers analyze and transform data stored across multiple files in various formats using ANSI SQL statements. 
* Perform Apache Spark analytics
* Perform intelligent data discover using Watson Knowledge Catalog

## Code

A demo of loud object storage as Sink of Kafka topic. [cos tutorial](https://github.com/ibm-cloud-architecture/eda-quickstarts/tree/main/cos-tutorial)
and this [demo gitops](https://github.com/jbcodeforce/eda-demo-order-gitops) to deploy Kafka connector
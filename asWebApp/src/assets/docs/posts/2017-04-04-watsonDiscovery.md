---
layout: post
title:  "How to start with Watson Discovery"
date:   2017-04-04 18:00:00 -0700
categories: cognitive
---
Watson Discovery is used to analyze and gain insights from enormous collections of unstructured data. Its general availability in IBM Bluemix was early February 2017. Developers could add a cognitive, search and content analytics engine to their business application to identify patterns, trends and insights that drive better business decision making. It embeds different algorithms to enrich your documents with the power of natural language understanding, and advanced ingestion capabilities allowing easy analysis of HTML, PDF, and MS Word documents.

There are some good tutorials available in Bluemix but I always feel the need to complement as 90% of the cases I failed on implementing the tutorial, there is always something wrong.

### Development Steps
So this blog is a summary of what needs to be done to set Watson Discovery.

1. If you do not have a [Bluemix](https://console.ng.bluemix.net/) account create one.
2. Create a Watson Discovery Service using the [catalog](https://console.ng.bluemix.net/catalog/?category=watson)
3. Launch WDS tool: The Discovery service includes a complete set of online tools —the Discovery Tooling —to help you quickly setup an instance of the service and populate it with data. By default the service includes a curated collection of documents coming from different public news.
4.
![Watson Discovery Tool]({{site.url}}/assets/posts/images/DiscoveryTool.png)  
4. As news are not enough most of the case we will have to inject existing documents to build a corpus of knowledge with searchable content. In the Discovery service, the content that you upload is stored in a **collection** that is part of your environment. So create an environment and then a collection. We need to keep information for the collection_id and environment_id
![]({{site.url}}/assets/posts/images/DiscoveryCollection.png)
5. In the service credentials in bluemix service select the credentials link and not the userid and password. All those information are important for using the API.
6. Upload documents in html format, Word or pdf. In this order of preference. It is important to study the document content before uploading it within a collection, to remove unnecessary content, and assess the best way to separate content. By default the header metadata will be used to separate content. This is the mostly the same mechanism used by Watson Document Conversation which build answer units from heading separate content. The collection configuration is used to control the transformation.

### A broker code
As illustrated in the [Cognitive Discovery reference architecture](https://www.ibm.com/devops/method/content/architecture/cognitiveArchitecture#discoveryDomain) (I participate on this one :-)) for any Cognitive service there is a need to facade it with some microservice component as a broker. You will find in this Git repository a broker code we have developed with one of my colleague (Tyloor Reeves) to give you starting code and with a simple user interface developed in Angular 2 to demonstrate the capabilities. The git repository is [here](https://github.com/jbcodeforce/refarch-cognitive-discovery-broker) and a running [demo on bluemix] (https://refarch-wds-broker.mybluemix.net/)  



### The Query Language

### References
* [WDS Product Documentation:](https://www.ibm.com/watson/developercloud/doc/discovery/)
* [Waston API](https://www.ibm.com/watson/developercloud/discovery/api/v1/#introduction)
* [Understand WDS](https://www.ibm.com/blogs/watson/2016/12/watson-discovery-service-understand-data-scale-less-effort/)
* [Deep dive into WDS video](https://www.youtube.com/watch?v=FikHwoJ6_FE)

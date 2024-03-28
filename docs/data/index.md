# Data Management Studies

There is perhaps nothing more valuable to an organization than its data. 
In the ever-evolving landscape of digital transformation and customer empowerment, data serves for informed decision-making and propels businesses towards success.

Organizations must be able to generate real-time insights based on accurate and high-quality data.


In this chapter, we delve into the fundamental importance of leveraging data as a strategic asset. 

## Business cases

In today's data-driven world, organizations must address the following key objectives:

* Ensure that data is accessible to the individuals and teams who need it, empowering them to make informed decisions and drive innovation. Consider Data as an organizational asset.
* Leverage advanced analytics and machine learning techniques to extract meaningful insights from data, to improve operational efficiencies and to discover new business opportunities.

* Implementing a data strategy centered around data lakes provides a scalable solution for ingesting, persisting, and consuming data, achieving an optimal price-performance ratio. It encompasses various components, including:

    * Non-relational databases
    * Big Data Analytics
    * Relational database
    * Machine learning
    * Data Catalog and Governance
    * Data warehousing
    * Logs analytics

    ![](./diagrams/data-strategy.drawio.png)

* To gain a deeper understanding of how to put your data to work effectively. read the [AWS presentation: Put your data to work with data lake.](https://pages.awscloud.com/Put-Your-Data-to-Work-with-the-Best-of-Both-Data-Lakes-and-Purpose-Built-Data-Stores_2021_0925-ABD_OD.html)

## Important concepts

### Big Data and the 5 V's

When discussing **Big Data**, it refers to data that is rapidly generated from diverse sources, characterized by its massive volume, complexity, and the challenges organizations face in securing, analyzing, and extracting valuable insights from it.

Traditional database and processing solutions are inadequate for addressing Big Data challenges. The concept of the **"5 V's"** encapsulates the key characteristics of Big Data:

1. **Volume:** Big Data involves extremely large amounts of data, ranging from terabytes to petabytes, and even exabytes. The size of data stored by organizations continues to grow exponentially, with global data creation projected to reach 180 zettabytes by 2025.

1. **Variety:** Big Data encompasses a wide range of data types and formats, including structured, semi-structured, and unstructured data. It includes text, images, videos, sensor data, social media posts, and more.

1. **Velocity:** Big Data is generated at a high velocity, often in real-time or near real-time. The speed at which data is produced and needs to be processed poses significant challenges for organizations.

1. **Veracity:** Veracity refers to the trustworthiness and reliability of the data. Data integrity plays a crucial role in establishing the veracity of data. Ensuring data integrity is essential at every stage of the data lifecycle, including data creation, aggregation, storage, access, sharing, and archiving.

1. **Value:** The ultimate goal of dealing with Big Data is to extract value and gain meaningful insights from it. By effectively analyzing and interpreting Big Data, organizations can derive valuable insights that lead to informed decision-making, innovation, and competitive advantage.


### Data Lake

A data lake serves as a powerful platform for unlocking the potential of big data and enabling AI and analytics capabilities.

In the 1990s, enterprise data warehouses were commonly used as a means to support analytics and business intelligence. However, they often required significant upfront investments and were limited in their ability to handle the scale and variety of modern big data.

In the mid-2000s, the emergence of technologies like Hadoop and ELK stacks revolutionized the concept of data lakes. These open-source frameworks embraced the use of open data formats and horizontal scaling, enabling organizations to ingest, process, and analyze massive amounts of data in a cost-effective manner.

In the 2020s, data lakes have further evolved with the advent of cloud computing. Cloud-based data lakes offer numerous advantages, including pay-per-job pricing models, elastic scaling, and the ability to store data in object stores like Amazon S3 or Azure Blob Storage. 

Organizations are now leveraging streaming technologies and real-time data processing frameworks like Apache Kafka or Apache Flink to ingest and process data in near real-time before moving it to data lake.

### Data topology

A *data topology* is an approach to classify, structure and manage real-world data scenarios. Data topology is an important consideration in designing and managing data architectures and systems. See [separate note](data-topology.md).

### Data gravity

**Data gravity** refers to the concept that as data accumulates and grows in size, it becomes increasingly difficult and costly to move that data to other locations or platforms.  The larger the volume of data and the more interconnected it becomes with applications and services, the more difficult it is to move data from its current location.

Organizations can minimize the latency, costs, and complexities associated with data movement. **Leverage data where it is**. Organizations are encouraged to consider the location and distribution of their data when designing systems and workflows. They should consider edge processing and distributed processing.

#### Data Management Requirements and Context

The requirements and context surrounding data management are influenced by various factors, including the distributed nature of data, the challenges introduced by hybrid cloud deployments, the impact of data gravity, and the need for efficient data preparation for analytics and AI.

Let's explore these requirements and the broader context in more detail:

1. **Accessibility of Data:** Data is distributed across various sources such as applications, data repositories, data centers, and the cloud. Ensuring easy access to data regardless of its location is crucial for effective data management.

1. **Complexity of Hybrid Cloud Deployments:** With hybrid cloud architectures, where analytics workloads may be in a dedicated environment separate from the data, complexities arise in integrating and managing data across different environments.

1. **Challenges of Data Transfer and Copying:** Extensive copying and transferring of data can lead to performance issues, security vulnerabilities, governance concerns, data quality problems, and increased operational costs.

1. **Data Lake as a Gravity Force:** Data lakes, due to their ability to store diverse and large datasets, act as a gravitational force that attracts data and applications. Leveraging the data within a data lake is an essential aspect of data management.

1. **Inefficiency of Moving Massive Datasets:** Moving massive datasets into analytics clusters can be inefficient, expensive, and complex. Cloud technology provides scalable processing capabilities closer to the data, addressing some of those challenges.

1. **Data as the Foundation of Digital Business Transformation:** Data plays a crucial role in digital business transformation initiatives, for developing new products, improving services, and driving innovation.

1. **Real-Time Insights and Operational Processes:** Organizations aim to derive real-time insights from data to enable immediate use in business and operational processes. Low-latency data processing is a key requirement to achieve this objective.

1. **Data Preparation Challenges:** Data preparation for analytics and AI poses several challenges. These include managing latency (time from which a transaction occurs to the time when the data is available for query) to ensure insights are available when needed, ensuring data security and quality, addressing data integration complexities, and automating manual data integration processes.

1. **Ethical and Regulatory Considerations:** Organizations face ethical and regulatory challenges related to deploying AI models into production. Compliance with data governance, privacy regulations, and ethical considerations surrounding AI usage are significant concerns.

#### Recommendations

Based on the requirements and context outlined, here are some recommendations for effective data management:

* Implement real-time analytics capabilities that process and derive insights from data streams at the source. This approach reduces the need for data movement and enables faster and more immediate decision-making.
* When adopting hybrid cloud deployments, consider the data gravity concept. Design a strategy that minimizes data movement and remote processing to reduce security risks and optimize performance.
* Whenever data needs to be migrated, assess the impact on data movement, performance, and associated costs.
* Consider implementing data virtualization technologies that allow for unified access to data across distributed sources. Data virtualization can help minimize data movement and simplify data integration processes.

???- info "Data Virtualization"
    Data Virtualization provides a unified and integrated view of data, regardless of its physical location or underlying data storage systems. Data sources may include databases, data warehouses, cloud storage, APIs, web services.  The data virtualization platform catalogs and indexes the metadata of the available data sources. Metadata includes information about the data structures, schemas, relationships, and access methods of the underlying data. This is an abstraction layer to hide the complexities of the physical data storage. The platform intelligently distributes the **query processing** across the relevant data sources, executing portions of the query **where the data resides**. The query result is presenting the data as if it were coming from a single data source. It allows real-time access to data, providing users with up-to-date information from the underlying sources. The platform ensures data confidentiality, integrity, and access control. Some open source projects that may help building a Data Virtualization platform: [Apache Drill](https://drill.apache.org/) to query NoSQL DB, [Apache Calcite](https://calcite.apache.org/) to address SQL query optimization on any dat, anywhere. [Apache Kafka]() is also considered as a virtualization platform. 

* Leverage machine learning algorithms and models at the transactional processing platform. This approach can assist with data aggregation, summarization, integration, and transformation, enabling faster analysis and reducing the need for extensive data transfers.
* Leverage data topology methodologies to identify data sources, understand data semantics, and establish relationships between data producers and consumers. This helps in comprehending data flow and optimizing data management strategies.

By implementing these recommendations, organizations can enhance their data management practices, reduce data movement complexities, optimize performance, improve security, and unlock the full potential of their data assets for analytics and AI initiatives.

#### Sources

* [Forester paper on data gravity](https://www.ibm.com/downloads/cas/ZEOENRB1)
* [Talend: Data Gravity: What it Means for Your Data](https://www.talend.com/resources/what-is-data-gravity/)

## Data Mesh

Data mesh is an architecture style that revolves around four key principles::

* Domain-oriented **Decentralization of Data Ownership** and architecture: Distribute data ownership to individual domains within an organization. Each domain takes ownership of its data and treats it as a valuable product.
* Domain-oriented **Data served as a Product**: teams are responsible for the quality, availability, and usability of their data products.
* **Self-serve data infrastructure** as a platform: to enable autonomous, domain-oriented data teams, to independently manage their data products.
* **Federated governance** to enable ecosystems and interoperability: enables collaboration and interoperability across domains. Data products are discoverable, addressable, and adhere to common standards and harmonization rules.

Implementing a data mesh architecture requires not only the use of suitable tools but also organizational restructuring. One important aspect is introducing a data product role within each domain. Domains own and share their analytical data as products.

Data mesh represents a paradigm shift from traditional approaches like data lakes, data warehouses, and business intelligence. It aligns with the third generation of data platforms, which are built on the Kappa architecture pattern, leverage real-time data processing, and utilize cloud-based object storage.

In complex enterprise environments with diverse domains, numerous data sources, and multiple consumers, a centralized data platform often leads to adoption and usage challenges.

When considering data mesh, it's essential to evaluate the size of the domain and the growth of data sources within its bounded context. Ingesting and storing data in a single place may hinder the easy addition of new data sources. 

A big data platform can inhibit the test and learn innovation cycle. On the other hand, siloed domain-oriented data is not a viable solution either. Some architectures organize data pipelines based on team capacity and skill, leading to processing feature requests without sufficient business knowledge of the source team and the consumers team.

It is recommended to adopt the following practices within a data mesh architecture:

* Domains should host and serve their domain datasets in an easily consumable manner. Ownership and content of the data remain within the domain that generates them. This may involve duplicating data across different domains as it is transformed into a shape suitable for each specific domain.
* Shift from an ETL push and ingest model to a "pull model" that leverages event streams for serving data. This promotes real-time data access and agility.
* Consider the domain as the architecture quantum instead of focusing on specific pipeline stages. This ensures that data management aligns with the domain boundaries and requirements.
* Source domain datasets should represent the facts and reality of the business. These facts, often referred to as "truths of the business domains," can be stored and served as append logs with immutable, time-stamped records.
* Domains should provide business aggregates that are easy to consume. For example, the "account opened per month" aggregate can be available within the account domain.
* New data domains can be created by joining and correlating data from existing domains. This enables the creation of richer and more comprehensive datasets.
* Distinguish between physical system datasets and domain datasets. Physical system datasets are specific to the underlying systems and differ from domain datasets, which are larger in volume, have timed records, and change less frequently.
* Some domains align closely with specific consumption patterns and have different characteristics compared to source domains. They transform source domain events into aggregate views and structures that fit a particular access model.
* Data pipeline activities such as cleansing, preparation, aggregation, and data serving remain important but should stay within the domain boundaries.
* Adopt a product thinking approach for data assets, treating them as products and considering data scientists and data engineers as the customers of these products.

![](./images/data-product.png)

* Establish a data catalog that provides metadata such as ownership, source of origin, structure, and samples for each data product. Each data product should register with the catalog to ensure discoverability.
* Ensure each data product has a unique address per storage format, making it easily accessible and addressable.
* Provide service level objectives (SLOs) that ensure data truthfulness. Data provenance and data lineage associated with each data product enhance consumer confidence.
* Foster interoperability by following standards and harmonization rules when correlating data across domains.
* Apply secure access controls to datasets at the time of access for each data product.
* Implement a common data infrastructure as a self-serving platform combined with global governance to ensure interoperability and consistency across the data mesh ecosystem.

#### Sources

 * [How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh](https://martinfowler.com/articles/data-monolith-to-mesh.html)
 * [The Data Dichotomy: Rethinking the Way We Treat Data and Services](https://www.confluent.io/blog/data-dichotomy-rethinking-the-way-we-treat-data-and-services)
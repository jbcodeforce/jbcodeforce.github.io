# Data studies

There is perhaps nothing more valuable to an organization than its data. In the age of digital transformation and the empowered customer, organizations must be able to generate real-time insights based on accurate and high-quality data.

I try to regroup a set of studies and analysis under the data file.

## Important concepts

### Data topology

A *data topology* is an approach for classifying and managing real-world data scenarios. See [separate note](data-topology.md).

### Data gravity

The continual expansion has given rise to the phenomenon known as `data gravity`: the ability of bodies of data to attract applications, services, and other data. **Leverage data where it is**.

#### Requirements and context

* Get data more accessible: data is distributed between apps, data repository, data center, in the cloud, at the edges. 
* Hybrid cloud deployment introduces complexities, where analytic workload is in dedicated environment instead to close to the data.
* Extensive copying and transfer of data creates the potential for performance, security, governance, and quality issues.
* Data lake is a gravity force, it attracts because of the diversity of the data and the size of data set.
* IT spends too much time and effort readying their data for analytic and AI work. Moving massive datasets into analytic clusters is an ineffective — not to mention expensive — process.
* Cloud technology has allowed for massive expansion of data bodies, which has served to increase data gravity rather than diffuse it. Or it allows scalable processing close to the data too.
* Data should be the first job to digital business transformation
* Strategy based on developing new and improved products and services based on data and analytics 
* Organizations have big plans for data, analytics, and AI, and real-time insights: input data is processed within milliseconds so that it is available virtually immediately for use in business and operational processes.
* Preparing data for analytics and AI is challenging:

    * **Latency** (time from which a transaction occurs to the time when the data is available for query) is a major challenge: getting insights where and when they are needed
    * **Preparation**: Keeping data secure and of high quality: concerns around data transfer and data governance.
    * **Automation**: Still a lot of manual steps when integrating data for analytics and AI: difficulty integrating data from multiple sources is the number one technical challenge
    * Ethical and regulatory issues keep them from deploying AI models into production

#### Recommendations:

* Analytics and insights are best done where the data lies: Example is to implement real time analytics in data streams.
* Hybrid cloud initiatives require a data gravity strategy
* With data gravity strategy you minimize data movement and remote processing, so reducing the security risk.
* Data gravity has to be taken into account any time the data needs to be migrated
* Consider data virtualization technology.
* Push AI/ML scoring to the transactional processing platform. Leveraging ML algorithms and models at source systems can help with aggregation, summarization, integration, and transformation for data to support quicker analysis.

Data topology is a good methodology to identify data source and semantics, consumer and producer of the data. It does not directly enforces Data Gravity.

#### Sources:

* [Forester paper on data gravity](https://www.ibm.com/downloads/cas/ZEOENRB1)
* [Talend: Data Gravity: What it Means for Your Data](https://www.talend.com/resources/what-is-data-gravity/)
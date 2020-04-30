# Streams Analytics Summary

To get an understanding of the technology and concepts read [this quick start](https://developer.ibm.com/streamsdev/docs/streams-quick-start-guide/).
IBM® Streams is an advanced analytic platform that allows user-developed applications to quickly ingest, analyze and correlate information as it arrives from thousands of real-time sources, high volume data, low latency. It supports a simple programming model using sources, operators, streams and sinks.
It delivers a set of predefined connectors. It provides a rich set of advanced analytics like geospatial and time series analysis

Four programming languages: Streams Processing Language (SPL), Java, Python, Scala.

## Concepts

The entry point of a Streams application is a **main composite**.  A **composite** operator is a **graph** of operators.  A main composite is a special composite operator that has no input port and output port.

A graph clause is a section in the composite that describes a list of operators in the graph, how the operators are connected, and what data is sent between the operators.

 The **logic** clause is called each time the operator receives a tuple.

 Operators: 
 * read data from a file, you need to add the FileSource operator

```
(stream<rstring ticker, rstring date, rstring time, float64 askprice> TradeQuotes) as TradeQuoteSrc = FileSource()
         {
             param
                 file:  getApplicationDir() + "/data/trades.csv";
                 format: csv;
         }
```
* **Filer** produces the same type of stream but with filtered tuples as defined  by its parameter section:
```
stream<Quote> FilteredQuotes = Filter(Quotes)
		{
			param
				filter : askprice > 0.0 ; 
		}
```

* **Aggregate** operator operates on a window of data. Windows are partitioned by attribute.
```
(stream<rstring ticker, float64 min, float64 max, float64 average>
			TradesSummary) as AggregateTrades = Aggregate(FilteredTradeQuotes as
			inPort0Alias)
		{
			window
				inPort0Alias : tumbling, count(5), partitioned ;
			param
				partitionBy : ticker ;
			output
				TradesSummary : average = Average(askprice), min = Min(askprice), max =
					Max(askprice) ;
		}
```
The SPL language has two kinds of windows, tumbling and sliding. They both store tuples while they preserve the order of arrival, but differ in how they handle tuple evictions. **Tumbling** windows are emptied once the trigger policy is met. Sliding windows operate in an incremental fashion. When a sliding window fills up, the future tuple insertions result in evicting the oldest tuples in the window. 


See the list of operators [in product documentation.](https://www.ibm.com/support/knowledgecenter/en/SSCRJU_4.3.0/com.ibm.streams.ref.doc/doc/operatordefn.html)

* To run your application in distributed mode, you need a Streams **Domain** and a Streams **Instance**.  A **domain** is a logical grouping of resources (or containers) in a network for common management and administration.  It can contain one or more instances that share a security model, and a set of domain services. An **instance** is the Streams distributed runtime environment, responsible to execute streaming apps. 

Below is an example of instance running. 


<img src="assets/docs/studies/streamsa/stream-console.png" width="100%" style="padding:20px;"></img>

## Getting started

* Create a Streaming analytics service in IBM Cloud [catalog.](https://cloud.ibm.com/catalog/services/streaming-analytics/)
* Download a docker based development environment for v2 plan from [here.](https://www-01.ibm.com/marketing/iwm/iwm/web/download.do?source=swg-ibmistvi&S_TACT=000019OO&pageType=urx&S_PKG=ov14959&lang=en_US&dlmethod=http)
* Use [IBM Streams - VS Code extension](https://marketplace.visualstudio.com/items?itemName=IBM.ibm-streams) to develop and deploy / run SPL code.

## Application pattern

Most applications follow the pattern:

<img src="assets/docs/studies/streamsa/appPattern2.gif" width="100%" style="padding:20px;"></img>

When deployed on a production environment, also called distributed environment, the application is built into a bundle with .sab extension. The application bundle contains all file resources, libraries and dependencies required for running the application. 

## Code samples

* [My studies and notes](https://github.com/jbcodeforce/StreamingAnalyticsStudies)
* [All the samples hub]()
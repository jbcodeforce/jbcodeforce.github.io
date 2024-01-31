# Online analytical processing

## Concepts

* performing multidimensional analysis at high speeds on large volumes of data from a data warehouse, data mart, or some other unified, centralized data store
* Need to support multiple dimensions: sales figures might have several dimensions related to location (region, country, state/province, store), time (year, month, week, day), product (clothing, men/women/children, brand, type), and more.
* OLAP extracts data from multiple relational data sets and reorganizes it into a multidimensional format that enables very fast processing and very insightful analysis. 
* OLAP cube is an array-based multidimensional database. The top layer of the cube might organize sales by region; additional layers could be country, state/province, city and even specific store.
* The **drill-down** operation converts less-detailed data into more-detailed data through one of two methods—moving down in the concept hierarchy or adding a new dimension to the cube.
* **Roll up** aggregates data on an OLAP cube by moving up in the concept hierarchy or by reducing the number of dimensions. 
* The **slice** operation creates a sub-cube by selecting a single dimension from the main OLAP cube (time dimension). 
* The **dice** operation isolates a sub-cube by selecting several dimensions within the main OLAP cube.
* The **pivot** function rotates the current cube view to display a new representation of the data—enabling dynamic multidimensional views of data.
* OLAP tools are designed for multidimensional analysis of data in a data warehouse, which contains both transactional and historical data.
* OLTP is designed to support transaction-oriented applications by processing recent transactions as quickly and accurately as possible.

## Problems

* SQL and relational database reporting tools can certainly query, report on, and analyze multidimensional data stored in tables, but performance slows down as the data volumes increase.

## Resources

* [IBM article on OLAP](https://www.ibm.com/cloud/learn/olap)


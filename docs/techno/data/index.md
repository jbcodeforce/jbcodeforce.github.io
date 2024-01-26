# Data related technologies

## [Apache Iceberg](https://iceberg.apache.org/docs/latest/)

Apache Iceberg is an open table format for huge analytic datasets. 

* adds tables to compute engines including Spark, Trino, PrestoDB, Flink, Hive and Impala.
* works just like a SQL table
* solves correctness problems in eventually-consistent cloud object stores.
* supports ten of petabytes of data
* supports schema changes: column add, drop, rename, update, reorder, and certain data types upgrades.
* supports 'time travel' to go back to older version of the data.

    ```sql
    SELECT * FROM iceberg_taxi_parquet
    FOR SYSTEM_TIME AS OF (current_timestamp — interval ‘1’ hour)
    ```

Iceberg has several catalog back-ends that can be used to track tables, like JDBC, Hive MetaStore and Amazon Glue.

There’re 3 layers for Iceberg:

1. **Catalog** layer: Hive or Path based catalogs. 
1. **Metadata** layer: Each CRUD operation will generate a new metadata file which contains all the metadata info of table, including the schema of table, all the historical snapshots until now. Each version of snapshot has one manifest list file. Manifest file can be shared cross snapshot files and contains a collection of data files which store the table data.
1. **Data** Layer: parquet files which contain all the historical data, including newly added records, updated record and deleted records.

* When a table is created, Iceberg creates a directory with the name of the table, and then it creates a metadata folder which contains all the metadata info. 
* When records are added to the table, Iceberg creates one parquet file for each record. A new version of metadata file is created with information about a manifest list file (in avro format), which itself points to one manifest file which points to the parquet files.
* Updating record, Iceberg creates snapshot to keep information of the new manifest file created for the update. The previous record is mark as deleted.
* We can query the history table of the database main table to see the different snapshots.

### Interresting content

* [Getting started](https://iceberg.apache.org/docs/latest/getting-started/)
* [Icebert and Spark quickstart with local docker compose](https://iceberg.apache.org/spark-quickstart/)
* [PyIceberg](https://py.iceberg.apache.org/)
* [Medium article to use Iceberg with AWS Glue, and Athena.](https://medium.com/snowflake/creating-and-managing-apache-iceberg-tables-using-serverless-features-and-without-coding-14d2198cf5b5)


## [MinIO](https://min.io/hybrid-multi-cloud-storage#overview)

A Hybrid/Multi-Cloud Object Storage on top of existing data storage like AWS S3, or local file systems, to provides storage consistency across every public cloud providers. MinIO is purpose-built to take full advantage of the Kubernetes architecture. Every new application is written for the AWS S3 API.

## [Apache Zeppelin](https://zeppelin.apache.org/)

Web-based notebook that enables data-driven, interactive data analytics and collaborative documents with SQL, Scala, Python, R, and any language / data processing backend...

```sh
docker run -u $(id -u) -p 8080:8080 --rm -v $PWD/logs:/logs -v $PWD/notebook:/notebook -e ZEPPELIN_LOG_DIR='/logs' -e ZEPPELIN_NOTEBOOK_DIR='/notebook'  -v $HOME/Code/Studies/spark-3.5.0-bin-hadoop:/opt/spark -e SPARK_HOME=/opt/spark --name zeppelin apache/zeppelin:0.10.0
```

Then open [http://localhost:8080](http://localhost:8080). Zeppelin is shipped with some built-in tutorials.

See `startZeppelin.sh` in studies folder.

### Concepts

* Cell can have different interpreter configured with `%<interpreter-name>`. It tells Zeppelin which langage/backend to use to run the cell. (`%sh %python %sql %spark %pyspark`)
* Zeppelin has a Spark Context created, accessible via a session from the `spark` variable.

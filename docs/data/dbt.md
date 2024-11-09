# Data Build Tool or Dbt

[Dbt](https://github.com/dbt-labs/dbt-core) is part of the Transformation in ELT or ETL, to transform data in data warehouse or lake house. 

## Value propositions

* It is an open-source and also offered as a cloud managed service. 
* Use SQL
* Supported by the big players of lake house like Snowflake, Databricks
* Built in features like version control, automated testing, document generation, and data lineage visualization
* Integrated platform for developers and data engineers

## Import concepts

dbt uses a template mechanism, functions and a set of features to organize SQL and cross reference them.

* Two standard constructs that can be created by dbt: Views and Tables. The table lists when to use them:

|  | View | Table|
| --- | --- | --- |
| **Purpose** | Use for minor transformation | For intensive transformation |
| **Execution** | At runtime and when referenced | Pre-executed, with the results saved in tables |
| **Storage** | None | Need Storage space for materialized tables |
| **Performance** | Lot of steps leads to slower performance | Chained processes get improved perf. | 

Always need to assess the balance between storage and performance.


## Installation

* Need Python, and dbt should be installed in a virtual environment. [See installation instructions](https://docs.getdbt.com/docs/core/installation-overview)

* Create a $HOME/.dbt folder to let dbt persist the dbt-profile.yaml file to keep user and DB credentials. Also create a dbt project

* `dbt init` under the project folder. This command creates some folders to organize work inside the project.

| Folder | Description |
| --- | --- |
| models | includes the models to execute with dbt |

### Using dbt with postgresql

* Install Kubernetes Postgresql operator, then a postgres cluster and PGadmin webapp. See the minikube/posgresql folder 
* Do port forwarding for both Postgresql server and pgadmin webapp

    ```sh
    kubectl port-forward service/pg-cluster 5432:5432
    kubectl port-forward service/pgadmin-service 8080:80 
    ```

* get user, database name , password and URI from the postgresql secrets (see Makefile)
* Create customers and orders tables, insert some records
* Define the connection to the database in the `.dbt/profiles.yaml` 
* Validate with the connection `dbt debug`
* Write some sql scripts in the `models` folder, then use `dbt run` and it will create new views in the `default` schema and one table. Example of join

    ```sql

    ```

* The results can be also seen by querying the newly created views or tables.

    ```sql
    select * from "default".customerorders;
    ```


## Sources

* [Youtube tutorial](https://www.youtube.com/watch?v=cW7KFaos2cw)
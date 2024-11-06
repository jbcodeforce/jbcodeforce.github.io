# Data build tool or Dbt

[Dbt](https://github.com/dbt-labs/dbt-core) is part of the Transformation in ELT or ETL, to transform data in data warehouse or lake house. 

## Value propositions

* It is an open-source and also offered as a cloud managed service. 
* Use SQL
* Supported by the big players of lake house like Snowflake, Databricks
* Built in features like version control, automated testing, document generation, and data lineage visualization
* Integrated platform for developers and data engineers

## Installation

* Need Python, and dbt should be installed in a virtual environment. [See installation instructions](https://docs.getdbt.com/docs/core/installation-overview)

* Create a $HOME/.dbt folder to let dbt persist the dbt-profile.yaml file to keep user and DB credentials. Also create a dbt project

* `dbt init` under the project folder. This command creates some folders to organize work inside the project.

| Folder | Description |
| --- | --- |
| 

### Using dbt with postgresql

Install Kubernetes Postgresql operator, then a postgres cluster and PGadmin webapp.


# Terraform

Tool to support infrastructure as code cross cloud providers. Can be used for Docker too. 

[Getting started on AWS](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-build). 

[Installation](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).

## Concepts

The [product documentation link](https://developer.hashicorp.com/terraform/).

* A **provider** is an important library to access a cloud provider.
* A **resource** represents something to provision with a target state.
* Data is like a query to access  values of resources already provisioned. 
* Variables are used to change configurations. 
* Module is a package of collected components, and can be use to templatize configuration
* Output returns information we want to share with user of terraform configuration
* There are different steps to perform

    * Create a main config file
    * init
    * plan
    * apply configuration: Terraform manages and maintains the infrastructure.
    * destroy


## Hands-on





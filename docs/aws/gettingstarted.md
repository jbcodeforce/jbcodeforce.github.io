# Getting started

General [AWS console](https://us-west-1.console.aws.amazon.com/) from which we can login as root usr or as
an IAM user.

Or the one for my account alias `jbcodeforce`: [https://jbcodeforce.signin.aws.amazon.com/console](https://jbcodeforce.signin.aws.amazon.com/console)
and user jerome

The credentials and API key are in `~/.aws/credentials`

* Select a region to create your resources: N California
* Look at the services

## Defined users and groups with IAM

[my summary on IAM](/aws/#iam-identity-and-access-management)

* Search for IAM and then...
* login to the account https://jbcodeforce.signin.aws.amazon.com/console with admin user `jerome`
* Create groups (Developers), define basic policies.
* Add users (mathieu) assign him to a group

## Define policies

Attached to the group level.


## Create a EC2 instance with Terraform

* Build a main.tf (/Code/Studies/terraform/learn-terraform-aws-instance/main.tf) like below, which uses the aws provider
to provision a micro EC2 instance:

    ```json
    terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 3.27"
        }
    }

    required_version = ">= 0.14.9"
    }

    provider "aws" {
    profile = "default"
    region  = "us-west-2"
    }

    resource "aws_instance" "app_server" {
    ami           = "ami-830c94e3"
    instance_type = "t2.micro"

    tags = {
        Name = "ExampleAppServerInstance"
    }
    }

    ```

    Resource blocks contain arguments which you use to configure the resource. 
    Arguments can include things like machine sizes, disk image names, or VPC IDs.

```sh
terraform apply
# inspect state
terraform show
```
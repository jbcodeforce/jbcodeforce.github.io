# IBM Public Cloud

Really same approach as AWS and GCP. 

## ibmcloud CLI summary

```shell
# login with sso
ibmcloud login --sso
```

## VPC - Virtual Private Cloud

[Virtual Private Cloud (VPC)](https://www.ibm.com/cloud/learn/vpc) lets an enterprise establishes its own private cloud-like computing environment on shared public cloud infrastructure.

A VPC’s logical isolation is implemented using virtual network functions and security features that give an enterprise customer
 granular control over which IP addresses.

The resources can be compute (virtual server or vCPU), storage (block storage quota per account) and networking with public 
gateways, load balancers, routers, direct or dedicated links.

See [this tutorial](https://cloud.ibm.com/docs/vpc?topic=vpc-creating-a-vpc-using-the-ibm-cloud-console) to understand how VPCs are created.
By default three subnets are created, and admin user needs to configure ACL to limit inbound and outbound traffic to the subnet.
ACL can be setup to authorize TCP traffic on port 80 on any IP, deny all other protocol on any IP and any port...

Once done we can add virtual server instance. A boot volume is allocated, ssh key needs to be created and different linux images are supported.
A VSI is attached to a subnet via its network interface. We can also select which security groups to attach to each interface.
Block storage can be added as volume and added to a VSI. We can configure the security group to define the inbound and outbound traffic that is allowed for the instance.

If we want your instance to be reachable from the internet, we need to get floating IP address. 

A typical 3 tiers application can have each tier allocated on its own subnet, with its own IP range.

### VPE Virtual Private Endpoints

VPEs are virtual IP interfaces that are bound to an endpoint gateway created on a per service, or service instance.

VPE has multiple benefits like:

* Public connectivity is not required and has no public data egress charges.
* Reaches IBM Cloud assets through a private service provider.
* A VPE lives in your network address space, extending your private and multicloud into the IBM Cloud.
* You can apply security through Network Access Control Lists (NACLs).
* The endpoint IP deploys in a customer-defined, virtual network.

[Tutorial: Leveraging Virtual Private Endpoint in IBM Cloud VPC to Connect IBM Cloud Object Storage](https://developer.ibm.com/recipes/tutorials/leveraging-virtual-private-endpoint-in-ibm-cloud-vpc-to-connect-ibm-cloud-object-storage/)
to present how to share the data across availability zones in VPC and DR site using IBM Cloud object storage.
The buckets are mounted inside VSIs from source site to DR AZ:

![](./images/vpe-cos.png)


## Cloud Object Storage

Very similar AWS S3 service. [The product doc](https://cloud.ibm.com/docs/services/cloud-object-storage/about-cos.html#about-ibm-cloud-object-storage).

* Create a COS service to keep n buckets. 
* IBM Cloud Object Storage is a multi-tenant system, and all instances of Object Storage share physical infrastructure
* Bucket is like a unique folder to content files
* Stores encrypted and dispersed data across multiple geographic locations
* Different level of resiliency. Resiliency refers to the scope and scale of the geographic area across which your data is distributed.

    * **Cross Region** resiliency spreads your data across several metropolitan areas
    * **Regional** resiliency spreads data across a single metropolitan area.
    * A **Single** Data Center distributes data across devices within a single site only.

* Billing based on storage class, which reflect how to read and write data. We can transition from any of the storage tiers (Standard, Vault, Cold Vault and Flex) to long-term offline archive.
* Different roles can be used to access the object.
* SQL Query can be used on top of COS objects

### Use cases

* as part of a data lake to keep a lot of data
* serving static websites


## [IBM Cloud for VMware](https://cloud.ibm.com/infrastructure/vmware-solutions/console)

Two models to bring your own VMs.

* Shared: Pay per use. Mostly used Development and DR
* Dedicated

Use cases:

* cost take our and quick consolidation: maximize existing licensing, immediate ROI versus running on premise and other clouds (37% TCO saving)
* DR, automated Dev+Test pipeline on a consistent VMware hypervisor platform, spin-up hourly on demand for resiliency
* Regulators mount up: FS cloud

## Satellite

The goal for [Satellite](https://cloud.ibm.com/satellite/overview) is to run workloads where it makes the most sense. Based on kubernetes, it is a API driven cloud services to achieve consistent application deployment and performance across any environments (own data center, cloud or edge location).

Based on the concept of location that groups your data center and IBM cloud. Manage all the locations from the IBM console UI (Single glass management)

Challenges to address:

* Latency: data processing close to te data
* Data residency: stay in country
* Lack of agility: app run across many locations
* Lack of visibility: ops operate 5 to 8 clouds and need visibility for platform and apps
* Local management
* Lack of version control
* Inconsistent talent availability
* Inability to instantly customize

![](./images/satellite.png)

K8s: maintenance is quickly becoming difficult.

## Function As A Service

[Function as Service](https://cloud.ibm.com/functions/learn/concepts) is the current service for 'serverless'.

* pay for the time code actually runs, which means no excess capacity or idle time. 
* scales to fit exact demand, from once a day to thousands of parallel requests per second
* use the concept of **namespace** to group related functions
* **Actions** are function as code to perform a task. You provide your action to Cloud Functions either as source code or a Docker image.
* A **sequence** is a chain of actions, invoked in order, where the output of one becomes the input to the next. This allows you to combine existing actions together for quick and easy re-use. A sequence can then be invoked just like an action, through a REST API or automated in a rule.
* A **trigger** is a declaration that you want to react to a certain type of event, whether from a user or by an event source. Triggers fire when they receive an event. Events are always occurring, and it's your choice on how to respond to them.

[Nice tutorial](https://pages.github.ibm.com/lab-in-a-box/tutorials-to-gitbook/serverless-api-webapp/) for a static web app accessing FaaS and Cloudant. 

 ![Web App with FaaS](./images/ic/faas-ex-1.png)

 * Deploy a Cloudant database
 * Define actions and sequences of actions in the Function as service:
 * Define APIs and API gateway to expose the action sequences as external public route
 * Deploy static web page with HTML et js to access the exposed APIs
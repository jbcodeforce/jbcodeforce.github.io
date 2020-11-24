# Amazon Web Service studies

## Organization

24 regions -> 2 to 6 availability zones per region: us-west-1-2a  [Global infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)
AZ is one or more DC with redundant power, networking and connectivity. Isolated from disasters. Interconnected with low latency. 

* EC2 is a regional service.
* IAM is a global service

## IAM Identity and Access Management

* Definer user (physical person), group and roles, and permissions
* One role per application
* Users are defined as global service encompasses all regions
* Policies are written in JSON, to define permissions for user and group and role
* Least privilege permission: Give user the minimal amount of permissions they need to do their job
* Assign users to groups and assign policies to groups and not to individual user.
* For identity federation SAML standard is used

## EC2

* Renting machine EC2
* Storing data on virtual drives EBS
* Distribute load across machines ELB
* Auto scale the service ASG

Amazon Machine Image: AMI, image for OS and preinstalled soft. Amazon Linux 2

 ![0](./images/EC2-instance.png)

When creating an instance, we can select the VPC and the AZ subnet, and the storage (EBS) for root folder to get OS. The security group helps to isolate the instance for example authorizing ssh on port 22.
Get the public ssh key, and once instance started: `ssh -i EC2key.pem  ec2-user@ec2-52-8-75-8.us-west-1.compute.amazonaws.com `
Can use **EC2 Instance Connect** to open a terminal in the web browser. Need to get SSH port open.

EC2 has a section to add `User data`, which could be used to define a bash script to install dependent software and start some services.

EC2 instance types see [ec2instances.info](https://www.ec2instances.info)

* R: applications that needs a lot of RAM – in-memory caches
* C: applications that needs good CPU – compute / databases
* M: applications that are balanced (think “medium”) – general / web app
* I: applications that need good local I/O (instance storage) – databases
* G: applications that need a GPU –
* T2/T3 for burstable instance: When the machine needs to process something unexpected (a spike in
load for example), it can burst. Use burst credits to control CPU usage.

### Launch types

* **On demand**: short workload, predictable pricing, pay per second after first minute
* **Reserved** for at least for one year, used for long workloads like database. Get discounted rate from on-demand.
* **Convertible reserved** instance for changing resource capacity
* **Scheduled reserved** instance for job based workload for example
* **Spot instance** for very short - 90% discount on on-demand - used for work resilient to failure like batch job, data analysis, image processing,..
    * Define a max spot price and get the instance while the current spot price < max. The hourly spot price varies base on offer and capacity. 
    * if the current spot price > max, then instance will be stopped
    * with spot block we can a time frame without interruptions.
    * The expected state is defined in a 'spot request' which can be cancelled. one time or persistent request types are supported. Cancel a spot request does not terminate instances, but need to be the first thing to do and then terminate the instances.
    * Spot fleets allow to automatically request spot instance with the lowest price.    
* Dedicated instance not shared with other
* **Dedicated hosts** to book entire physical server and control instance placement. # years. BYOL. 

Use **EC2 launch templates** to automate instance launches, simplify permission policies, and enforce best practices across your organization. (Look very similar than docker image)

### AMI

Bring your own image. Shareable on amazon marketplace. Can be saved on S3 storage. By default, your AMIs are private, and locked for your account / region.

AMI are built for a specific AWS region. But they can be copied and shared [See AWS doc - copying an AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html).

### EC2 Hibernate

The in memory state is preserved, persisted to a file in the root EBS volume. It helps to make the start quicker. The root EBS volume is encrypted.
Constrained by 150GB RAM. No more than 60 days. 

## Security group

Define inbound and outbound security rules.  They regulate access to ports, authorized IP ranges, control inbound and outbound network. By default all inbound traffic is denied and outbound authorized.

* can be attached to multiple EC2 instances and to load balancers
* locked down to a region / VPC combination
* Live outside of the EC2
* Define one security group for SSH access
* application not accessible is a security group
* connect refused in an application error or is not launched
* Instances with the same security group can access each other
* Security group can reference other security groups, IP address, CIDR but no DNS server

 ![2](./images/security-group.png)

## Networking

IPv4 allows 3.7 billions of different addresses. Private IP @ is for private network connections. Internet gateway has public and private connections. Public IP can be geo-located. When connected to an EC2 the prompt lists the private IP (`ec2-user@ip-172-31-18-48`). Private IP stays stable on instance restart, while public may change.

With Elastic IP address we can mask an EC2 instance failure by rapidly remapping the address to another instance. But better to use DNS.

### Playing with Apache HTTP

```shell
# Swap to roo
sudo su
# update OS
yum update -y
# Get Apache HTTPd
yum install -y httpd.x86_64
# Start the service
systemctl start httpd.service
# Enable it cross restart
systemctl enable httpd.service
> Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service
# Change the home page by changing /var/www/html/index.html
echo "Hello World from $(hostname -f)" > /var/www/html/index.html
```

This script can be added as User Data (Under Advanced Details while configuring new instance) so when the instance starts it executes this code.

### Elastic Network Instances

ENI is a logical component in a VPC that represents a virtual network card. It has the following attributes:

* Primary private IPv4, one or more secondary IPv4
* One Elastic IP (IPv4) per private IPv4
* One Public IPv4
* One or more security groups
* A MAC address
* You can create ENI independently and attach them on the fly (move them) on EC2 instances for failover 
* Bound to a specific availability zone (AZ)

[New ENI doc.](https://aws.amazon.com/blogs/aws/new-elastic-network-interfaces-in-the-virtual-private-cloud/)

## Placement groups

Define strategy to place EC2 instances:

* **Cluster**: groups instances into a low-latency group in a single Availability Zone

    * highest performance while talking to each other as you're performing big data analysis
* **Spread**: groups across underlying hardware (max 7 instances per group per AZ)
    * Reduced risk is simultaneous failure
    * EC2 Instances are on different physical hardware
    * Application that needs to maximize high availability
    * Critical Applications where each instance must be isolated from failure from each other
* **Partition**: spreads instances across many different partitions (which rely on different sets of racks) within an AZ.
    * Partition is a set of racks
    * Up to 100s of EC2 instances
    * The instances in a partition do not share racks with the instances in the other partitions
    * A partition failure can affect many EC2 but won’t affect other partitions
    * EC2 instances get access to the partition information as metadata
    * HDFS, HBase, Cassandra, Kafka

Access from network and policies menu, define the group with expected strategy, and then it is used when creating the EC2 instance by adding the instance to a placement group.

## Load balancer

Route traffic into the different EC2 instances. It also exposes a single point of access (DNS) to the deployed application. In case of failure, it can route to a new instance, transparently and cross multiple AZ. It uses health check (/health on the app called the `ping path`) to asses instance availability. It provides SSL termination. It supports to separate private (internal) to public (external) traffic.

 ![1](./images/EC2-AZ.png)

ELB: EC2 load balancer is the managed service by Amazon. Three types supported:

* Classic load balancer: older generation. For each instance created, update the load balancer configuration so it can route the traffic.
* **Application load balancer**: HTTP, HTTPS (layer 7), Web Socket. 
    * It specifies availability zones: it routes traffic to the targets in these Availability Zones. Each AZ has one subnet. To increase availability, we need at least two AZs.
    * It uses target groups, to group applications
    * route on URL, hostname and query string
    * Get a fixed hostname
    * the application do not see the IP address of the client directly (ELB does a connection termination), but ELB put it in the header `X-Forwarded-For`, `X-Forwarded-Port` and `X-Forwarded-Proto`.
* **Network load balancer**: TCP, UDP (layer 4), TLS
    * handle millions request/s
    * use to get a public static IP address

To control that only the load balancer is sending traffic to the application, we need to set up an application security group on HTTP, and HTTPS with the source behind the security group id of the ELB. LBs can scale but need to engage AWS operational team.

HTTP 503 means LB is at capacity or not register target. Verify security group in case of no communication between LB and app.

Target group defines protocol to use, health check checking and what applications to reach (instance, IP or lambda). 

Example of listener rule for an ALB:

 ![3](./images/ALB-listener-rules.png)

### Load balancer stickiness

Used when the same client needs to interact with the same backend instance. A cookie, with expiration date, is used to identify the client. The classical or ALB manage the routing. This could lead to inbalance traffic so overloading one instance. 
With ALB it is configured in the target group properties.

### Cross Zone Load Balancing

Each load balancer instance distributes traffic evenly across all registered instances in all availability zones. This is the default setting for ALB and free of charge. It is disabled by default for NLB.

### TLS - Transport Layer Security,

An SSL/TLS Certificate allows traffic between your clients and your load balancer to be encrypted in transit (in-flight encryption).

* Load balancer uses an X.509 certificate (SSL/TLS server certificate). 
* Manage certificates using ACM (AWS Certificate Manager)
* When defining a HTTPS listener in a LB, we must specify a default certificate for the HTTPS protocol, while defining the routing rule to a given target group. Need multiple certs to support multiple domains. 
* Clients can use SNI (Server Name Indication) to specify the hostname they reach. The ALB or NLB will get the certificate for this host to support the TLS handshake. 

### Connection draining

This is a setting to control connection timeout and reconnect when an instance is not responding. It is to set up the time to complete “in-flight requests”. When an instance is "draining", ELB stops sending new requests to the instance. THe time out can be adjusted, depending of the application, from 1 to 3600 seconds, default is 300
seconds, or disabled (set value to 0).

### Auto Scaling Group (ASG)

The goal of an ASG is to scale out (add EC2 instances) to match an increased load, or scale in (remove EC2 instances) to match a decreased load. It helps to provision and balance capacity across Availability Zones to optimize availability.
It can also ensure we have a minimum and a maximum number of machines running. It detects when an instance is unhealthy. 

Automatically Register new instances to a load balancer.

[ASG](https://us-west-1.console.aws.amazon.com/ec2autoscaling/home?region=us-west-1#/) has the following attributes:

* AMI + Instance Type with EC2 User Data (Can use template to define instances)
* EBS Volumes
* Security Groups
* SSH Key Pair
* Min Size / Max Size / Initial Capacity to control number of instances 
* Network + Subnets Information to specify where to run the EC2 instances.
* Load Balancer Information, with target groups to be used as a grouping of the newly created instances
* Scaling Policies help to define rules to manage instance life cycle, based for example on CPU usage or network bandwidth used. 

 ![4](images/ASG-1.png)

* when creating scaling policies, **CloudWatch** alarms are created. Ex: "Create an alarm if: CPUUtilization < 36 for 15 datapoints within 15 minutes".
* ASG tries the balance the number of instances across AZ by default, and then delete based on the age of the launch configuration
* The capacity of your ASG cannot go over the maximum capacity you have allocated during scale out events
* when an ALB validate an health check issue it terminate the EC2 instance.
# AWS Well Architectured

The [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) helps you understand the pros and cons of decisions you make while building systems on AWS.

## Quick notes

Those are the questions to ask for designing a cloud native solution by understanding the potential impact . All hardware are becoming software.

**Workload** represents interrelated applications, infrastructure, policies, governance and operations. 
### Six pilards

When architecting technology solutions, never neglect the six pillars of:

* Operational Excellence
* Security
* Reliability
* Performance Efficiency
* Cost Optimization
* Sustainability 

### Design Principles

* **Stop guessing your capacity needs**: use as much or as little capacity as you need, and scale up and down automatically.
* **Test systems at production scale**, then decommission the resources. 
* **Automate to make architectural experimentation easier**.
* **Allow for evolutionary architectures**: the capability to automate and test on demand lowers the risk of impact from design changes. This allows systems to evolve over time so that businesses can take advantage of innovations as a standard practice.
* **Drive architectures using data**: In the cloud, you can collect data on how your architectural choices affect the behavior of your workload. This lets you make fact-based decisions on how to improve your workload.
* **Improve through game days** to simulate events in production. This will help you understand where improvements can be made and can help develop organizational experience in dealing with events.

### Operational Excellence

Support development and run workloads effectively, gain insight into their operations, and to continuously improve supporting processes and procedures. 

Four area of focus:

* Organization: define clear responsabilities, roles, and success interdependencies
* Prepare: design telemetry (logs, metrics...), improve flow, mitigate deployment risks, understand operational readiness
* Operate: understand workload health, operation health, achievement of business outcome. Runbooks and playbooks should define escalation process, and define owneship for each action
* Evolve: learn from experience, make improvements, share with teams

**Design principles:**

* Perform operations as code
* Make frequent, small, reversible changes
* Refine operations procedures frequently. Set up regular game days to review and validate that all procedures are effective.
* Anticipate failure: Perform “pre-mortem” exercises to identify potential sources of failure so that they can be removed or mitigated. 
* Learn from all operational failures

Use established runbooks for well-understood events, and use playbooks to aid in investigation and resolution of issues. 

CloudWatch is used to aggregate and present business, workload, and operations level views of operations activities.

| Questions to assess|
| --- |
| How do you determine what your priorities are? |
| How do you structure your organization to support your business outcomes? | 
| How does your organizational culture support your business outcomes? |
| How do you design your workload so that you can understand its state? | 
| How do you reduce defects, ease remediation, and improve flow into production? |
| How do you mitigate deployment risks? |
| How do you know that you are ready to support a workload? |
| How do you understand the health of your workload? |
| How do you understand the health of your operations? |
| How do you manage workload and operations events? |
| How do you evolve operations? |

### Security

* Design principles

    * Apply security at all layers
    * Automate security best practices
    * Protect data in transit and at rest

| Questions to assess|
| --- |
| How do you manage identities for people and machines? |
| How do you manage permissions for people and machines? |
| How do you detect and investigate security events? |
| How do you protect your network resources? | 
| How do you protect your compute resources? |
| How do you classify your data? |
| How do you protect your data at rest? |
| How do you protect your data in transit? |
|  How do you anticipate, respond to, and recover from incidents? |

CloudTrail logs, AWS API calls, and CloudWatch provide monitoring of metrics with alarming, and AWS Config provides configuration history. 

Ensure that you have a way to quickly grant access for your security team, and automate the isolation of instances as well as the capturing of data and state for forensics.

### Reliability

The ability of a workload to perform its intended function correctly and *consistently*.

* Design principles:

    * Automatically recover from failure
    * Test recovery procedures
    * Scale horizontally to increase aggregate workload availability
    * Stop guessing capacity: monitor demand and workload utilization, and automate the addition or removal of resources to maintain the optimal level to satisfy demand without over- or under-provisioning
    * Manage change in automation

Before architecting any system, foundational requirements that influence reliability should be in place.

| Questions to assess|
| --- |
| How do you manage service quotas and constraints? |
| How do you plan your network topology? |
| How do you design your workload service architecture? |
| How do you design interactions in a distributed system to prevent failures? |
| How do you design interactions in a distributed system to mitigate or withstand failures? | 
| |

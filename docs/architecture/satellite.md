# IBM Cloud Satellite

Quick [Product Overview](https://cloud.ibm.com/satellite/overview).

## Goal 

* Expend the reach of IBM Cloud (management of services, and use experience) to infrastructure outside of IBM data centers.
* Bring the cloud services to your data center
* Bring consistency of services and content, and security: bring you TLS certificates
* Use control plane on IBM Cloud data center. run day 2 tasks on the same tools on IBM Cloud. 
* Consider them as mini ibm cloud regions
* It gives us a central view of all our k8s / OCP clusters

## Features


* Use a single API to create a Satellite location and add host machines from your on-prem data center, edge devices, or other cloud providers. Then, the hosts power IBM Cloud services, such as IBM Cloud Databases or OpenShift clusters, anywhere you need them.
* Consistent app deployments: Create, version control, update, and review your app configurations across all your OpenShift clusters from a single pane.
* Control and audit the network traffic and communication flow between your OpenShift clusters with a built-in, application-level firewall, and use IBM Cloud monitoring and logging services to consolidate your logs, metrics, and alerts

## Use cases:

* consume cloud services butt use your data locally
* location to install small box, considered as hosts
* flexible infrastructure
* as a service consumption: Cloud database, openshift, CP4Data 
* do not need to manage those services

## Installation on Azure

Provision enough nodes at the start.

1. **Create a location**: Get minimum 9 MultiZone nodes: 3 control plane, 6 worker nodes 
1. **Create a cluster**: For example OCP 4.7 with three 16x64 work. 
1. **Update Azure**: Add public IP to one or more VMs. Create disk volumes for each worker done. Attach to the nodes
1. **Install OpenShift Data Foundation** from CLI. See [Satellite doc on setting up storage](https://cloud.ibm.com/docs/satellite?topic=satellite-sat-storage-template-ov)
1. **Install as usual**

* [Video from support and training: "How to configure log-in to a Satellite Cluster"](https://www.youtube.com/watch?v=ENiNS1kYzUQ)
* [Video from support and training: "How to configure storage for a Satellite Cluster"](https://www.youtube.com/watch?v=FeE051uE4-s)
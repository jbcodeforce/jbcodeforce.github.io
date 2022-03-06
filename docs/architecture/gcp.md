# Google cloud platform

 [https://cloud.google.com/](https://cloud.google.com/) - 24 regions, 73 zones - 200 countries.

Ex: europe-west is a region, europe-west2-a, europe-west2-b, europe-west2-c are zones around london, so 3 data centers.

Each data center is connected with fiber optical network and a private network on the same subnet. G. connects its network to the rest of the internet via Point of Presence.

[Cloud console](https://console.cloud.google.com/home/dashboard)

A project is also used as a billing entity. You can define alerting rules as part of a budget on an account.

* VMs are compute engine
* Cloud run is for deploying containerized app.
* Function for event-driven serverless

## Tools

* Google cloud shell - it is a small VM with 5G disk. 
* [gcloud CLI](https://cloud.google.com/sdk/gcloud/reference/) to interact with the G. Cloud. (installed under ~/google-cloud-sdk). See [install doc](https://cloud.google.com/sdk/gcloud/#download_and_install_the). 
* `gcloud components list`
* `gcloud components install componentid` for example 
* [SDK getting started](https://cloud.google.com/sdk/docs/quickstarts)

## Identify & Access Management

control who has access to what.

* Members (who): google account, group, service account for app and machine, GSuite domain, allAuthenticatedUsers (google accounts holders), allUsers (anyone on the internet)
* Roles (what): give access to things. PredefinedRoles, PrimitiveRoles, CustomRoles.
* Permissions
* IAM Policy hierarchy: define policy at the different level of the hierarchy: organization -> project -> resources. Resources are compute engine, app engine, cloud storage, pub/sub,...

We can create custom role, to define specific, reusable, permissions.

## Compute engine

Some interesting characteristics:

* files are split in shrunk and encrypted at rest and distributed within cloud storage: so it is mostly impossible to rebuild a file as each shrunk has its own key
* VM can be preemptable (terminated after 24 or 10 first minutes) or committed (1 year).
* Public IP will change when stopping VM.
* Linux or windows OS, quite a lot of configurable parameters.

## VPC networking

* same flat optical fibers between data centers.
* G. network is connected to internet by multiple point of presence, via peering (interconnection between internet networks). 100 interconnections.
* Use global cache to get static content available for frequently access content.
* BBR - [Bottleneck Bandwidth and RTT](https://github.com/google/bbr) congestion control algorithm models the network to send as fast as the available bandwidth so it is 2700x faster than previous TCP

The networking delivers a set of services
* With VPC, you can define your subnets (100sb / VPC), public IP, own firewall, routes, peering and VPN. It is a global network. Each VM has 8 interfaces, on IPv4 unicast. No broadcast.
* NW services for load balancer, DNS and CDN
* Cloud interconnect to connect on-premise servers to cloud via VPN, dedicated connection and routers.
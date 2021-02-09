# Google cloud platform

 [https://cloud.google.com/](https://cloud.google.com/) - 24 regions, 73 zones - 200 countries.
 
Each data center is connected with fiber optical network and a private network on the same subnet. G. connects its network to the rest of the internet via PoP. 

[Cloud console](https://console.cloud.google.com/home/dashboard)

A project is also use as a billing entity. You can define alerting rules as part of a budget on an account.

* VMs are compute engine
* Cloud run is to deploy containerized app.
* function for event-driven serverless

## Tools

* Google cloud shell - it is a small VM with 5G disk. 
* [gcloud](https://cloud.google.com/sdk/gcloud/reference/) to interact with the G. Cloud. (installed undr ~/google-cloud-sdk)

## IAM

* Members: account, group, service account for app and machine, GSuite domain, allAuthenticatedUsers (google accounts holders), allUsers
* Roles: give access to things. PredefinedRoles, PrimitiveRoles, CustomRoles.
* Permissions
* IAM Policy hierarchy: define policy at the different level of the hierarchy: organization -> project -> resources

## Compute engine

Some interesting characteristics:

* files are split in shrunk and encrypted at rest and distributed within cloud storage: so it is mostly impossible to rebuild a file as each shrunk has its own key
* VM can be preemptable (terminated after 24 or 10 first minutes) or committed (1 year).
* Public IP will change when stopping VM.
* Linux or windows OS, quite a lot of configurable parameters.
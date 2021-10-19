# Process mining

Process mining is about obtaining knowledge of, and insights in, processes by means 
of analyzing the event data, generated during the execution of the process.

[IBM Process Mining](https://www.ibm.com/docs/en/cloud-paks/1.0?topic=foundation-process-mining) 
automatically discovers, constantly monitors, and optimizes business processes.

## Features

* Ingest data of process execution from business apps, or middleware or logs
* Simulation capability:  business analysts can use to test unlimited process change. 
It combines historical data with contextual data, like decision rules, to create what-if scenarios that are then analyzed
* Calculate metrics
* Task Mining captures and sends real user interaction data to process mining server

## Architecture

* Process mining has 4 components

    * Process Discovery
    * BPA: for simulation and keep processes, roles and systems information
    * Analytics
    * Admin to manage tenants, groups, users,...

* Task Mining has 3 components

    * Data collector
    * Data processor
    * Task miner

![](./images/pm-components.png)

Which can be seen for a production deployment as:

![](./images/pm-prod-arch.png)

## Use Cases

## Getting started

## Installation

On OpenShift, the process mining is installed via operator, with dependencies on common services and foundation core
The operator supports instances of type `ProcessMining` CRD.

* Need storage class supporting the ReadWriteMany (RWX) mode
* Need MongoDB, DB2
* Need SSL
* Need entitlement key

It is possible to deploy more than one operator instance in different namespaces.

The Process Mining components adds two permissions to the Cloud Pak role management: "Automation Analyst" and "Automation Administrator"

In order to offer Read Write Many (RWX) storage for the applications running on RedHat OpenShift cluster, we need to make OpenShift Data Foundation [available in our RedHat OpenShift cluster](https://cloud.ibm.com/docs/openshift?topic=openshift-ocs-storage-prep). 

[OpenShift Data Foundation (ODF)](https://www.redhat.com/en/resources/openshift-data-foundation-datasheet) is a storage solution that consists of open source technologies [Ceph](https://docs.ceph.com/en/latest/start/intro/), [Noobaa](https://www.noobaa.io/), and [Rook](https://rook.io/). 
ODF allows you to provision and manage File, Block, and Object storage for your containerized workloads in Red Hat® OpenShift® on IBM Cloud™ clusters. 
Unlike other storage solutions where you might need to configure separate drivers and operators for each type of storage, 
ODF is a unified solution capable of adapting or scaling to your storage needs.

In order to [install OpenShift Data Foundation (ODF)](https://cloud.ibm.com/docs/openshift?topic=openshift-deploy-odf-vpc) in our 
RedHat OpenShift Kubernetes Service (ROKS) cluster on IBM Cloud on a Virtual Private Cloud (VPC) Gen 2, 
we need to make sure that our OpenShift cluster counts with at least three worker nodes. 
For high availability, we must create our OpenShift cluster with at least one worker node per zone 
across three zones. Each worker node must have a minimum of 16 CPUs and 64 GB RAM.

!!! danger "Important"
    The `storageClass` used to configure OpenShift Data Foundation to request storage volumes **must be of type** [**`metro`**](https://cloud.ibm.com/docs/openshift?topic=openshift-vpc-block#vpc-block-reference). 

!!! info
    What `metro` means is that the `volumeBindingMode` of that `storageClass` will be set to `WaitForFirstConsumer` as opposed to 
    the default `Immediate`. And what that means is that the Persistent Volume creation and 
    allocation by the IBM Cloud Object Storage, as a result of its Persistent Volume Claim, 
    will not happen until the pod linked to that Persistent Volume Claim is scheduled. 
    This allows IBM Cloud Object Storage to know what Availability Zone of your MultiZone 
    Region cluster the pod requesting block storage ended up on and, as a result, to be 
    able to provision such storage in the appropriate place. Otherwise, if we used 
    a `storageClass` whose `volumeBindingMode` was the default `Immediate`, IBM Cloud Object Storage 
    would create and allocate the Persistent Volume in one of the Availability Zones which might 
    not be the same Availability Zone the pod requiring such storage ends up on as a result of the 
    OpenShift pod scheduler which would make the storage inaccessible to the pod. 
    See Kubernetes official documentation [here](https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode) for further detail.

!!! danger "Important"
    The `storageClass` you need to configure OpenShift Data Foundation to use with **must not have Retain Reclaim policy**. 
    Using `ibmc-file-gold-gid` seems to work

!!! info
    If you retain the Persistent Volume, it might end up assigned to a pod in a different Availability Zone later, making that storage inaccessible to the pod allocated to. 


See the process mining subscription in [dba-gitops-catalog](https://github.com/ibm-cloud-architecture/dba-gitops-catalog/tree/main/process-mining/operator/base)

## Integration with data ingestion


## Read more

* [Academic papers on process mining](https://sebastiaanvanzelst.com/?page_id=62)
* [Product marketing page](https://www.ibm.com/cloud/cloud-pak-for-business-automation/process-mining)
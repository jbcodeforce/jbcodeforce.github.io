# IBM Public Cloud

## ibmcloud CLI summary

```shell
# login with sso
ibmcloud login --sso
```


## Cloud Object Storage

Very similar service as S3. [Product doc](https://cloud.ibm.com/docs/services/cloud-object-storage/about-cos.html#about-ibm-cloud-object-storage).

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

* as part of a data lake
* serving static websites
* 
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
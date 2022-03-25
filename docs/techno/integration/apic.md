# Note on API Connect

## Documentations

* [EDA article on API as a pattern](https://ibm-cloud-architecture.github.io/refarch-eda/patterns/api-mgt/)
* [Product tutorial]()

## Concepts to keep in mind

* API Connect users belong to organizations
* A provider organization (often shortened as p-org) is a group of people who create, publish, and maintain APIs that are then used by people in a consumer organization.
* You publish APIs by adding them to a Product and then publishing the Product to a Catalog. To be able to publish Products to a Catalog, the Catalog must be assigned at least one gateway service so that the APIs in the Product are available to be called at a gateway service endpoint.
* A catalog is a staging target that behaves as a logical partition of the gateway and the developer portal. Typically, an API provider organization uses a development catalog for testing APIs under development and a production catalog for hosting APIs that are ready for full use.

## Demo

* Connect using the jerome/passw0rd.
* Go to 


The product 'orderlifecycleapis:1.0.0 (OrderLifeCycleAPIs)' cannot be staged because the API 'orderentitylifecycle:1.0.0 (Order entity life cycle)' is not enforced but has x-ibm-configuration.gateway value set to 'event-gateway' (it has to be absent or empty).
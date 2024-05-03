# Apache Solr

[Solr](https://solr.apache.org/guide/solr/latest/) is a search server running in cluster and built on top of Apache Lucene.

It is used in document retrieval or analytical applications involving unstructured data, semi-structured data or a mix of unstructured and structured data.

Supports simplest keyword searching through to complex queries on multiple fields and faceted search results

It accesses to almost all of Lucene’s text analysis features including tokenization, stemming, synonyms

## Getting started

See docker compose file in [solr]() to start one node and one zookeeper. The zookeeper is needed to let solr runs in cloud mode, which exposes the `api/solr` endpoints.

The typical steps are:

1. Create a collection
1. Define schema for the collection
1. Upload documents for indexing, and commit the changes
1. Start querying the collection

## Concepts

* The basic unit of information is a document, which is a set of data that describes something
* Documents are composed of fields, which hasa field type used to do better query.
* Schema stores the details about the fields and field types Solr is expected to understand. It can include normalization instruction.
* Faceting is the arrangement of search results into categories 

## Assessment

* What sorts of data do you need to index?
* What kind of query / search to perform?
* What are the criteria to assess search result quality?


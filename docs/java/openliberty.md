# OpenLiberty notes

[OpenLiberty.io](https://openliberty.io/)

## Create OpenLiberty webapp

### From starting repo

```shell
git clone https://github.com/OpenLiberty/sample-getting-started.git
cd sample-getting-started
mvn liberty:dev
```

### From templates

See folder MyTemplates/OpenLiberty

| Repo | What inside |
| --- | :--- |
| jaxrs-order-mp | Microprofile 3.0 Order CRUD with repository as hashmap, metrics, OpenApi |


### With maven archetype

The runtime dependencies

```xml
<dependency>
<groupId>io.openliberty</groupId>
<artifactId>openliberty-runtime</artifactId>
<version>[20.0.0.5,)</version>
<type>zip</type>
</dependency>
```

## OpenLiberty Operator

[OpenLiberty Operator](https://github.com/OpenLiberty/open-liberty-operator) helps to deploy and manage applications running on Open Liberty into kubernetes or OpenShift clusters.

To build a openliberty app docker image [follow guidelines here](https://github.com/OpenLiberty/ci.docker#container-images).

Install it using the Operator Hub. Once installed the following commands 

## Appsody stack

The appsody stack for [open liberty using operator](https://github.com/appsody/stacks/tree/master/incubator/java-openliberty) is a good way to start a project.

### Specific open liberty maven declaration

```xml
<parent>
	<groupId>net.wasdev.wlp.maven.parent</groupId>
	<artifactId>liberty-maven-app-parent</artifactId>
	<version>RELEASE</version>
</parent>
```

Properties:
```
<app.name>${project.artifactId}</app.name>
<testServerHttpPort>9080</testServerHttpPort>
<testServerHttpsPort>9443</testServerHttpsPort>
<warContext>${app.name}</warContext>
<package.file>${project.build.directory}/${app.name}.zip</package.file>
<packaging.type>usr</packaging.type>
```

### Open liberty links

* [Open Liberty developer tool for eclipse](https://marketplace.eclipse.org/category/free-tagging/open-liberty)
* [Super guides](https://openliberty.io/guides/)
* [Understanding the liberty maven plugin](https://developer.ibm.com/wasdev/docs/installing-liberty-liberty-maven-plug/)

### Debug Openliberty app

Start `mvn liberty:debug`, the console should display the port number, it listens to (7777). Then in Eclipse define a debud configuration for a `remote java application`, use localhost and the matching port number. Any breakpoint in the code should be reachable.

For VS code:

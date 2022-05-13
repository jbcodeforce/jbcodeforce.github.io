# OpenLiberty notes

[OpenLiberty.io](https://openliberty.io/)

## Create OpenLiberty webapp

### From starting repo

```shell
git clone https://github.com/openliberty/guide-getting-started.git
# or
git clone https://github.com/OpenLiberty/sample-getting-started.git
cd sample-getting-started
mvn liberty:dev
```
### maven commands

```sh
# dev mode: The Open Liberty server automatically reloads the configuration without restarting
mvn liberty:dev
# dev mode with docker
#builds a Docker image, mounts the required directories, binds the required ports, and then runs the application inside of a container
mvn liberty:devc 
# or control the start, stop...
mvn liberty:run
mvn liberty:start
mvn liberty:stop
```

These messages are also logged to the `target/liberty/wlp/usr/servers/defaultServer/logs/console.log`. You can find the error logs in the ffdc directory and the tracing logs in the trace.log file.

To set properties, they can be set in the server.xml

```xml
  <variable name="app.inMaintenance" value="false"/>
```

### Build . test . package


```sh
mvn package
# will create a war file with the <artifactId> name
```

Instead of creating a server package, you can generate a runnable JAR file that contains the application along with a server runtime. As a result, the generated JAR file is only about 50 MB.

```sh
mvn liberty:package -Dinclude=runnable
# execute
java -jar yourapp.jar
```


## Features


* **mpHealth-4.0**" health Check and Readiness classes

### CDI

When bean must be persistent between all of the clients, which means multiple clients need to share the same instance. Simply add the `@ApplicationScoped` annotation onto the class.

With the `@RequestScoped` annotation, the bean is instantiated when the request is received and destroyed when a response is sent back to the client. A request scope is short-lived.

The `@Inject` annotation indicates a dependency injection

## OpenLiberty Operator

[OpenLiberty Operator](https://github.com/OpenLiberty/open-liberty-operator) helps to deploy and manage applications running on Open Liberty into kubernetes or OpenShift clusters.

To build a openliberty app docker image [follow guidelines here](https://github.com/OpenLiberty/ci.docker#container-images).

Install it using the Operator Hub. Once installed the following commands 



### Open liberty links

* [Open Liberty developer tool for eclipse](https://marketplace.eclipse.org/category/free-tagging/open-liberty)
* [Super guides](https://openliberty.io/guides/)
* [Understanding the liberty maven plugin](https://developer.ibm.com/wasdev/docs/installing-liberty-liberty-maven-plug/)

### Debug Openliberty app

Start `mvn liberty:debug`, the console should display the port number, it listens to (7777). Then in Eclipse define a debud configuration for a `remote java application`, use localhost and the matching port number. Any breakpoint in the code should be reachable.

For VS code:

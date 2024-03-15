# Java studies

[Java studies repository with a bench of code](https://github.com/jbcodeforce/java-studies)

## 1.8 new features

[Java 8 tutorials](https://mkyong.com/tutorials/java-8-tutorials/)

### Functional programming

A functional programming function is like a mathematical function, which produces an output that typically depends only on its arguments.
Functions exhibit referential transparency, which means you could replace a function call with its resulting value without changing the computation's meaning. With function Java becomes declarative while with object it is imperative.

```java
// compute the length of a string. 
Function<String, Integer> func = x -> x.length();
Assertions.assertEquals(6,func.apply("jerome"));
// can chain functions
Function<Integer, Integer> func2 = x -> x * 2;
Assertions.assertEquals(12,func.andThen(func2).apply("jerome"));
``` 
They favor immutability, which means the state cannot change. Function doe not support variable assignments.

[Function examples](https://mkyong.com/java8/java-8-function-examples/)

### Lambdas

* single method classes that represent behavior
* can be assigned to a variable
* can be pass as argument to a method
* The type of any lambda is a functional interface: A functional interface is a special interface with one and only one abstract method.

```java
@FunctionalInterface
public interface Function<T, R> {
      R apply(T t);
}
```

	* It has one and only one abstract method.
	* It can be decorated with an optional @FunctionalInterface

### New date

Java 8 created a series of new date and time APIs in java.time package

### Streams

A Stream is a sequence of elements from a source that supports aggregate operations.
Streams API lets you process data in a declarative way. Aggregate functions are SQL-like operations and common operations from functional programing languages, such as `filter, map, reduce, find, match, sorted`.

Streams can leverage multi-core architectures without you having to write a single line of multithread code.

```java
List<String> lines = Arrays.asList("spring", "node", "quarkus");
List<String> result = lines.stream()                // convert list to stream
             .filter(line -> !"spring".equals(line))     // we dont like spring
             .collect(Collectors.toList());              // collect the output and convert streams to a List

result.forEach(System.out::println);                
```

Search within a list
```java
Person result1 = persons.stream()                        
                .filter(x -> "jack".equals(x.getName()))        // we want "jack" only
                .findAny()                                      // If 'findAny' then return found
                .orElse(null); 
```

Many stream operations return a stream themselves. This allows operations to be chained to form a larger pipeline, which can be seen as forming a query on the data.

```java
List<Integer> transactionsIds = 
    transactions.stream()
                .filter(t -> t.getType() == Transaction.GROCERY)
                .sorted(comparing(Transaction::getValue).reversed())
                .map(Transaction::getId)
                .collect(toList());
```

`map()` is used to extract information. No work is actually done until collect is invoked. The collect operation will start processing the pipeline to return a result.
`toList()` describes a recipe for converting a Stream into a List.

* Stream operations that can be connected are called **intermediate operations**. 
* Operations that close a stream pipeline are called **terminal operations**.

[See streams tests in](https://github.com/jbcodeforce/java-studies/tree/master/data-structure-play/streams-play)

???- "More readings"
    * [Streams filter examples](https://mkyong.com/java8/java-8-streams-filter-examples/)
    * [Processing Data with Java SE 8 Streams](https://www.oracle.com/technical-resources/articles/java/ma14-java-se-8-streams.html)
    * [java.util .stream.Stream](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)

### Enterprise Context

The `Context` refers to the interface used to interact with your runtime environment. In java we have Servlet's ServletContext, JSF's FacesContext, Spring's ApplicationContext, Android's Context, JNDI's InitialContext,...

!!! note
		Recall that Java EE servers host several application component types that correspond to the tiers in a multi-tiers application. The Java EE server provides services to these components in the form of a container.

		* The web container is the interface between web components and the web server. The container manages the component’s life cycle, dispatches requests to application components, and provides interfaces to context data, such as information about the current request. 
		* EJB container is the interface between enterprise beans, which provide the business logic in a Java EE application.
		* The application client container runs on the client machine and is the gateway between the client application and the Java EE server components.

javax.enterprise.context is a set of annotation APIs to define component scope. See [ApplicationScoped](https://javaee.github.io/javaee-spec/javadocs/javax/enterprise/context/ApplicationScoped.html).

## Java 11 updates

[Baeldung Java 11 new features](https://www.baeldung.com/java-11-new-features)

* OpenJDK as Hotspot is licenced now
* New String methods like isBlank, lines, repeat, strip...

  ```java
  String multilineString = "Baeldung helps \n \n developers \n explore Java.";
  List<String> lines = multilineString.lines()
    .filter(line -> !line.isBlank())
    .map(String::strip)
    .collect(Collectors.toList());
  assertThat(lines).containsExactly("Baeldung helps", "developers", "explore Java.");
  ```

* Add stream capability, Not Predicate 
* local variable in lambda

   ```java
   sampleList.stream().map((@Nonnull var x) -> x.toUpperCase())
  ```

* HTTP client: improves overall performance and provides support for both HTTP/1.1 and HTTP/2
* we can directly run the file using the java command, no more need to explicitly call javac
* Improved Aarch64 Intrinsics to leverage CPU capabilities
* Java Flight Recorder (JFR) is open source and used for jvm profiling.
## Web sites with good content

Good web sites I like to go back to for excellent source of knowledge

* [Baeldung](https://www.baeldung.com/)
* [Open liberty](https://openliberty.io/docs/)
* [Quarkus](https://quarkus.io/)
* [Microprofile guides](https://microprofile.io/)
* [Vert.x](https://how-to.vertx.io/)


## sdkman.io

[sdkman](https://sdkman.io/) is a tool for managing parallel versions of multiple Software Development Kits like java.

```shell
# update a project to set environment to create a .sdkmanrc file
sdk env init
# list existing java installable version
sdk list java

# install a specific version
sdk install java 8.0.265.hs-adpt 
sdk use java 11.0.8.j9-adpt
or
sdk use java 8.0.265.hs-adpt
# then do your maven project with older 1.8 compile.
```

## Maven

Update maven cli: download it from http://maven.apache.org/download.cgi, unzip to ~/Tools. modify $PATH.

### Create a java project with maven

```sh
mvn archetype:generate -DgroupId=jbcodeforce -DartifactId=apicurio-client -DarchetypeArtifactId=maven-archetype-quickstart
```

### Create executable Java

* Need to generate the manifest from the class, for that we use the following plugin

```xml
  <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>2.4</version>
        <configuration>
          <archive>
            <manifest>
              <addClasspath>true</addClasspath>
              <mainClass>ibm.swat.KafkaClientV35</mainClass>
              <classpathPrefix>dependency-jars/</classpathPrefix>
            </manifest>
          </archive>
        </configuration>
      </plugin>
```

* it also needs to get dependencies

```xml
 <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <version>2.5.1</version>
        <executions>
          <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
              <goal>copy-dependencies</goal>
            </goals>
            <configuration>
              <outputDirectory>
                ${project.build.directory}/dependency-jars/
              </outputDirectory>
            </configuration>
          </execution>
        </executions>

      </plugin>
```

See tech academy [tech jam pom file]().
### Multi-module maven

This project includes different modules to test different subjects related to the java last language features and other topics on Java, like reactive messaging, kafka, ...
See [this tutorial](https://www.baeldung.com/maven-multi-module) to understand maven multi modules.
 
* Define an aggregator POM

```shell
mvn archetype:generate -DgroupId=jbcodeforce -DartifactId=Java-studies
```

* Change the `<packaging>` element to `pom`
* Define each module in separate child folder with its own pom using the command:

```shell
mvn archetype:generate -DgroupId=jbcodeforce  -DartifactId=AlgoPlay
```

By building the project through the aggregator POM, each project that has packaging type different than pom will result in a built archive file

By setting packaging to pom type, we're declaring that project will serve as a parent or an aggregator for other sub module project. A module element is added to the parent project.

When running `mvn package` command in the parent project directory, Maven will build and test all the dependent modules. 

To bypass integration test: `mvn install -DskipITs`

!!! note
		Recall that maven `profile` helps to define specific environments for maven execution. It is useful, to set some different runtime properties. Useful for testing and production packaging.
		`mvn package -P test`. See some examples [here](https://www.mkyong.com/maven/maven-profiles-example/)

### Maven building jars with dependency

First you need to declare to use the assembly plugin

```xml
<build>
    <pluginManagement>
	 <plugins>
		<plugin>
          <artifactId>maven-assembly-plugin</artifactId>
          <version>3.0.0</version>
          <configuration>
            <phase>package</phase>
            <archive>
              <manifest>
                <mainClass>${fully.qualified.main.class}</mainClass>
              </manifest>
            </archive>
            <descriptorRefs>
              <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
          </configuration>
        </plugin>
      </plugins>
    </pluginManagement>
</build>
```

Then in the plugins section add the execution stanza to specify when to run the assembly.

```xml
 <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <executions>
          <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
              <goal>single</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
```

There is a better alternate is to use [maven shade](https://maven.apache.org/plugins/maven-shade-plugin/) plugin to build a fat or uber jar. 

### maven exec

`mvn  exec:java -Dexec.mainClass=`

`mvn exec:java -Dexec.mainClass="jb.Main" -Dexec.args="arg0 arg1 arg2"`

Get the available parameters: `mvn exec:help -Ddetail=true -Dgoal=java  `

### Maven profiles

[Profile](http://maven.apache.org/guides/introduction/introduction-to-profiles.html) helps to use different configuration for different environment. 
They modify the POM at build time, and are meant to be used in complementary sets to give equivalent-but-different parameters for a set of target environments.
Profiles can be explicitly specified using the `-P profilename`, or in the activeProfiles in the settings.xml file.

### Using maven with docker

Typical dockerfile

```dockerfile
FROM maven:3.6.3-jdk13
COPY pom.xml workspace/
COPY src workspace/src/
WORKDIR /workspace
CMD [ "mvn" "compile" "quarkus:dev" ]
```

Run and reuse existing m2 to avoid downloading each time

```shell
docker run -ti --network kafkanet -p 8080:8080 -v ~/.m2:/root/.m2 tmp-builder
```

## Algo play 

The folder Algo play has its own pom, and the following problems are implemented:

* Searching in a graph using DPS and Transversal in a graph. See nice article [here](https://www.baeldung.com/java-graphs)



## Jakarta EE 8

Jakarta EE comprises many technologies such as:

* Java Server Pages or JSP,
* Java Server Faces or JSF,
* Serverlet,
* JSTL,
* JDBC,
* Struts,
* Java Persistence API or JPA
* Hibernate ORM

### Servlet 4.0

The typical life cycle:

* First the HTTP requests coming to the server are delegated to the servlet container.
* The servlet container loads the servlet and call `init()`, before invoking the `service()` method.
* Then the servlet container handles multiple requests by spawning multiple threads, each thread executing the service() method of a single instance of the servlet.
* The servlet is terminated by calling the destroy() method.
* Finally, servlet is garbage collected by the garbage collector of the JVM

Use the Open Liberty guide from [here](https://openliberty.io/guides/maven-intro.html) to create a web app. Below is a quick summary of what was done for JEEPlay project.

* Define a server.xml file in src/main/liberty/config using the `servlet-4.0` feature. Clone [this open liberty guide](https://github.com/openliberty/guide-maven-intro.git) as source.
* Add open liberty maven app parent artifact
* Add war as project packaging
* Add the properties for the app server used in server.xml and integration tests (See pom.xml in JEEPlay folder)
* Add dependencies on servlet 4.01 api and http client. The dependency is set to provided, which means that the API is in the server runtime and doesn’t need to be packaged by the application
* Add the Liberty Maven plugin, which gives details of the name, version, and file type of Open Liberty runtime package which it will download from the public Maven repository. The `<bootstrapProperties/>` section provides the set of variables that the `server.xml` references. The `<stripVersion/>` field removes the version number from the name of the application.
* Maven is configured to run the integration test using the maven-failsafe-plugin. The `<systemPropertyVariables/>` section defines some variables that the test class uses. The test code needs to know where to find the application that it is testing. While the port number and context root information can be hardcoded in the test class, it is better to specify it in a single place like the Maven pom.xml file because this information is also used by other files in the project.
* mvn install and then start liberty: 

	```shell
	mvn liberty:start-server
	```

See above steps materialized in code in JEEPlay/... [HelloServlet.java](https://github.com/jbcodeforce/java-studies/tree/master/JEEPlay/src/main/java/jbcodeforce/servlet/HelloServlet.java) and [ServletEndPointIT.java](https://github.com/jbcodeforce/java-studies/blob/master/JEEPlay/src/test/java/jbcodeforce/it/ServletEndPointIT.java).

The `javax.servlet.annotation.WebServlet` helps to replace the web.xml file and servlet section to define name, urlPattern, load on startup...
* For integration tests or connecting to remote end point, use the Apache [commons client.](https://hc.apache.org/httpcomponents-client-4.5.x/tutorial/html/index.html).

See also [this tutorial](https://www.tutorialspoint.com/servlets/index.htm) on servlet.

## JAX-RS resource

In JAX-RS, a single class should represent a single resource, or a group of resources of the same type.

The `@Path` annotation on the resource class indicates that this resource responds to the properties path in the JAX-RS application. The `@ApplicationPath` annotation in the SystemApplication class together with the `@Path` annotation in the resource class indicates the URL the resource is available at.

JAX-RS maps the HTTP methods on the URL to the methods on the class. The method to call is determined by the annotations that are specified on the methods.

The `@Produces` annotation indicates the format of the content that will be returned.

## JAX-RS client FAQ

### Create a client

```java
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;

Client client = ClientBuilder.newClient();

WebTarget target = client.target(url);
Response response = target.request().get();
response.getStatus();
String json = response.readEntity(String.class);
// transform json string
response.close();
```

### Create a client using header

```
```

### Client for HTTPs connection

```
```

## Reactor

Reactor is an implementation of the Reactive Programming paradigm, which can be summed up as: it is an asynchronous programming concerned with data streams and the propagation of change.
It provides few additional aspects:

* Composability and readability
* Data as a flow manipulated with a rich vocabulary of operators
* Nothing happens until you subscribe
* Back pressure or the ability for the consumer to signal the producer that the rate of emission is too high
* High level but high value abstraction that is concurrency-agnostic

See the simplest examples of Flux code in [ReactorSimpleTest.java](https://github.com/jbcodeforce/java-studies/blob/master/src/test/java/jbcodeforce/react/ReactorSimpleTest.java). Then tests with the StepVerifier. StepVerifier wraps source of stream and express expectations about the next signals to occur [ReactorStepVerifier.java](https://github.com/jbcodeforce/java-studies/blob/master/src/test/java/jbcodeforce/react/ReactorStepVerifier.java).

See [Project Reactor](http://projectreactor.io/docs/core/release/reference/#intro-reactive)

## Kafka

See [this dedicated studies](https://jbcodeforce.github.io/kafka-studies/) for how to do end to end event driven microservice with kafka.

See also the eda-quickstart project for tool and project template.

## Reactive messaging

See the extensive doc from [SmallRye](https://smallrye.io/smallrye-reactive-messaging/) and my note [quarkus](./quarkus.md)

## MQ

This is the implementation of [the MQ developer tutorial](https://developer.ibm.com/messaging/learn-mq/mq-tutorials/mq-dev-challenge/) and supports the Reseller class outlined in the red rectangle below:
![](https://developer.ibm.com/messaging/wp-content/uploads/sites/18/2018/08/LearnMQbadgeDiag1.png)

Code to subscribe to topic, and put, get from Queue. It includes a Docker image with MQ embedded [more explanation here.](mqChallenge.md)

## TestContainer for integration test

[junit based Test containers](https://www.testcontainers.org/) and a simple [quickstart](https://www.testcontainers.org/quickstart/junit_5_quickstart/).

Projects where I used it: 

* [JMSMQClient](https://github.com/jbcodeforce/java-studies/tree/master/mqChallenges)
* [Person manager with couchdb](https://github.com/jbcodeforce/person-manager)

```java
@Container
    public static GenericContainer container = new GenericContainer("couchdb").withExposedPorts(5984)
            .withEnv("COUCHDB_USER", "admin").withEnv("COUCHDB_PASSWORD", "password");
    public static  PersonRepository repo = new PersonRepository();
```

## Enterprise Inject

`javax.enterprise.inject.Produces`: Identifies a producer method or field. [CDI specification](http://download.oracle.com/otn-pub/jcp/web_beans-1.0-fr-eval-oth-JSpec/web_beans-1_0-fr-eval-spec.pdf). A producer method acts as a source of objects to be injected, where:

* the objects to be injected are not required to be instances of beans, or
* the concrete type of the objects to be injected may vary at runtime, or
* the objects require some custom initialization that is not performed by the bean constructor.

The container is responsible for processing all methods and fields marked with a @Produces annotation, and will normally do this when your application is deployed. The processed methods and fields will then be used as part of the injection point resolution for managed beans, as needed
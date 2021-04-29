# Spring Cloud and Spring Boot

This note is to summarize the techno, from an older springframework (2003) dev. 

## Spring Boot

To get started with Spring Boot see [this REST service app guide](https://spring.io/guides/gs/rest-service/).  Use [Spring initialzr](https://start.spring.io/) tool to get the maven project starting code. The starter guide use Spring Web.

When creating app to be deployed as container think to add Actuator to get health, metrics, sessions, ...

To build: `./mvnw clean package`.
To run the main executable: `java -jar target/demo-0.0.1-SNAPSHOT.jar`

`@SpringBootApplication` is a convenience annotation that adds: `@Configuration`, `@EnableAutoConfiguration`  (Tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings), `@ComponentScan`. (look for other components, configurations, and services in package, letting it find the controllers.

REST resources are `@RESTController` and the methods are annoted with `@GetMapping`, `@PostMapping`...
To use test driven development add the dependency

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-test</artifactId>
	<scope>test</scope>
</dependency>
```

And then test classes like:

```java
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class GreetingControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	public void noParamGreetingShouldReturnDefaultMessage() throws Exception {

		this.mockMvc.perform(get("/greeting")).andDo(print()).andExpect(status().isOk())
				.andExpect(jsonPath("$.content").value("Hello, World!"));
	}
}
```

One of the most complete app is [KC container service](https://github.com/ibm-cloud-architecture/refarch-kc-container-ms/)

### To Remember

* Spring boot app is a main with `@SpringBootApplication` annotation to let the injection and bean management working
* [Bean](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html) is the IoC component of your application managed by Spring. A function can become a bean using `@Bean`.
* [@Configuration](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html) indicates that a class declares one or more @Bean methods and may be processed by the Spring container to generate bean definitions.

### Some how to

* Define the app-root for url: add properties: `server.servlet.context-path: orderms`
* Get the VScode to recognize `org.springframework` package: use `Update Project` on the pom.xml
* Copy a java bean properties into another one: use BeanUtils from spring: The bean needs to have getters and setters

    ```java 
    public static Order from(OrderDTO dto){
       
        Order mappedOrder = new Order();
        BeanUtils.copyProperties(dto, mappedOrder);
        return mappedOrder;
    }
    ```

#### Add swagger UI 

* Add springfox dependency
   ```
   ```
* Add swagger configuration via Docket bean

## Spring Cloud

< re integrate tvp work>
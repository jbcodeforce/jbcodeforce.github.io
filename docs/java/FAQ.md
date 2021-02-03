# FAQ

## List current JDK installed

```
/usr/libexec/java_home -V
```


## Get UUID

```java
    UUID uuid = UUID.randomUUID();
    order.setOrderID(uuid.toString());
```

## Java SE

### Read from a properties file

```java
Properties props = new Properties();
 try {
        props.load(  new FileInputStream(filename));
 } catch (FileNotFoundException e){
         e.printStackTrace();
  } catch (IOException e) {
        e.printStackTrace();
 }
```

### How to read json file

Using google parser. For the [maven dependency](https://mvnrepository.com/artifact/com.google.code.gson/gson)


```java
FileReader input= new FileReader("src/test/resources/testpumps.json");
Gson parser = new Gson();
AssetEvent[] assets = parser.fromJson(new JsonReader(input), AssetEvent[].class);
```

Using jsonb (quarkus)

```java
Book book = new Book("Java 11", LocalDate.now(), 1, false, "Duke", new BigDecimal(44.444));
Jsonb jsonb = JsonbBuilder.create();
String resultJson = jsonb.toJson(book);
Book serializedBook = jsonb.fromJson(resultJson, Book.class);
```

Using jackson to serialize an object to a String

```java
import com.fasterxml.jackson.databind.ObjectMapper;
static ObjectMapper mapper = new ObjectMapper();
 try {
    this.order = mapper.writeValueAsString(order);
} catch (JsonProcessingException e) {
    e.printStackTrace();
    this.order = "";
}
```


### Json binding JSR 367

JSR 367 is the API for JSON processing, and implemented with JSON-B. The maven with quarkus is

```
    <dependency>
      <groupId>io.quarkus</groupId>
      <artifactId>quarkus-resteasy-jsonb</artifactId>
    </dependency>
```

The main [API features](https://www.baeldung.com/java-json-binding-api#api-features)

Example of sending a java object as json string with rest-assured:

```java
Jsonb jsonb = JsonbBuilder.create();

given()
    .contentType(ContentType.JSON)
    .body(jsonb.toJson(order)).post(url).then();
```

### Kafka stream and json-b serdes

How to use a pojo as value in the stream? use the io.quarkus.kafka.client.serialization.JsonbSerde class.

```java
import io.quarkus.kafka.client.serialization.JsonbSerde;

JsonbSerde<WeatherStation> weatherStationSerde = new JsonbSerde<>(
                WeatherStation.class);
JsonbSerde<Aggregation> aggregationSerde = new JsonbSerde<>(Aggregation.class);

// then use the serdes...
GlobalKTable<Integer, WeatherStation> stations = builder.globalTable( 
                WEATHER_STATIONS_TOPIC,
                Consumed.with(Serdes.Integer(), weatherStationSerde));

```

## JAXRS

### Get startup and destroy event

```java
@ApplicationScoped
public class StartupListener {

    public void init(@Observes
                     @Initialized(ApplicationScoped.class) ServletContext context) {
        // Perform action during application's startup
    }

    public void destroy(@Observes
                        @Destroyed(ApplicationScoped.class) ServletContext context) {
        // Perform action during application's shutdown
    }
```

### Unit test when there is CDI

Add a constructor with the injectable bean as parameter:

```java
	@Inject
	private OrderRepository repository;

	public OrderService(OrderRepository repository) {
		this.repository = repository;
	}
```

## Securing communication with SSL

To secure a service exposing end point with TLS. In Java a client can have a client key, it saves is a keystore, and then consume server certificate that needs to match a certificate saved in is truststore. 

Suppose the app expose a SSL end point, so it will have to define a server certificate, and then it will consume other service so it needs to import the other service end point to its truststore so during theSSL handshake, the connection can be estalished. 

### Good articles

* [https://www.baeldung.com/java-ssl](https://www.baeldung.com/java-ssl)
* [oracle doc](https://docs.oracle.com/cd/E54932_01/doc.705/e54936/cssg_create_ssl_cert.htm#CSVSG180)

### Concept summary

SSL is necessary to support the three main information security principles:

* Encryption: protect data transmissions between parties
* Authentication: ensure the server we connect to is indeed the proper server
* Data integrity: guarantee that the requested data is what is effectively delivered

A self-signed certificate is one that you create for your server, in the server's KeyStore.

The truststore is the file containing trusted certificates that Java uses to validate secured connections.

add the public certificate of the server to the default cacerts truststore used by Java. while initiating the SSL connection.
Set the javax.net.ssl.trustStore environment variable to point to the truststore file so that the application can pick up that file which contains the public certificate of the server we are connecting to.
The steps to install a new certificate into the Java default truststore are:


An error like *unable to find valid certification path* to requested target while establishing the SSL connection, it indicates that we don't have the public certificate of the server which we're trying to connect in the Java truststore.

### Summary of what needs to be done

* create a self signed certificate to be the server of your end point

* Import the ca certificate of the server you want to connect to.
    
    * Extract cert from server: `openssl s_client -connect server:443`
    * Import certificate into truststore using keytool: `keytool -import -alias alias.server.com -keystore $JAVA_HOME/jre/lib/security/cacerts` or to a truststore file you can use in a dockerfile, or upload as a truststore and then mount to a pod.


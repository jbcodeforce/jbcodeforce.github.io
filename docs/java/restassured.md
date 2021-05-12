# Rest Assured

[REST Assured](https://rest-assured.io/) is used to test REST services in java. See some examples [here](https://www.hascode.com/2011/10/testing-restful-web-services-made-easy-using-the-rest-assured-framework/)
and [Baeldung post](https://www.baeldung.com/rest-assured-tutorial)

Test a GET

```java
@Test public void
lotto_resource_returns_200_with_expected_id_and_winners() {

    when().
            get("/lotto/{id}", 5).
    then().
            statusCode(200).
            body("lotto.lottoId", equalTo(5),
                 "lotto.winners.winnerId", hasItems(23, 54));

}
```

Other examples

* [InventoryResourceIT](https://github.com/ibm-cloud-architecture/refarch-eda-item-inventory/blob/master/src/test/java/it/InventoryResourceIT.java):

```java
public void shouldGetOneInventory(){
        Response r = given().headers("Content-Type", ContentType.JSON, "Accept", ContentType.JSON)
        .when()
        .get("/inventory/Store-1/Item-1")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .extract()
        .response();

        System.out.println(r.jsonPath());
    }
```

Test a POST

```java
given()
          .pathParam("numberRecords", 3)
          .when().post("http://localhost:8080/start/{numberRecords}")
          .then()
             .statusCode(200)
             .body(is("started"));
```
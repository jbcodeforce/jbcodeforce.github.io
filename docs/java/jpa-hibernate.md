# Hibernate ORM for JPA

Capabilities:

* object-relational mapping
* manage entities life cycle
* uses persistence context as a "cache" for entities read or saved to a database
* session is a logical transaction, defined at the method level with @Transaction or using entity Manager
* Entities are in one of `transient, persitent, detached` states

Practices:

* always have a single instance of entity for every database record during the session

## Dev solution

#### Specify column property

```java
@Column(length = 255)
public String name;
```

## Error - solution

org.hibernate.PersistentObjectException: detached entity passed to persist

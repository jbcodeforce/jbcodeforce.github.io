# Drools business rule management systems

## Introduction

[Open Source - https://www.drools.org/](https://www.drools.org/) under Apache license. The commercial version is RedHat Decision Manager. It is essentially a forward-chaining and backward-chaining inference-based rule engine, DMN decisions engine.

[Last KIE Docker image from quay.io](https://quay.io/repository/kiegroup/business-central-workbench).

```sh
docker run -p 8080:8080 -p 8001:8001 -d --name business-central-workbench quay.io/kiegroup/business-central-workbench:latest
```

See the  KIE (Knowledge Is Everything) Business-Central Workbench at [http://localhost:8080/business-central](http://localhost:8080/business-central). Business Central is the graphical user interface where you create and manage business rules. You can install it in JBoss EAP instance or on OpenShift. KIE Server is the server where rules and other artifacts are executed. A KIE container is a specific version of a project. Git repositories are used internally within Business Central to store all processes, rules, and other artifacts that are created in the authoring environment.

KIE includes multiple projects: [Kogito](https://docs.jboss.org/kogito/release/latest/html_single/) (for cloud native deployment (Quarkus - springboot)), OptaPlanner, jBPM. See the examples in [Kogito Central git repository](https://github.com/kiegroup/kogito-examples). Kogito originates from KIE.

For older Drools version see this [blog](https://vishnu-chalil.medium.com/how-to-setup-drools-workbench-in-local-machine-with-docker-image-c846ca37eab2).

### DMN support

Decision Model and Notation (DMN) is a standard established by the Object Management Group (OMG) for describing and modeling operational decisions. It defines a XML schema to share model between platforms. [Drools supports DMN](https://www.drools.org/learn/dmn.html).

## Key constructs

* **Rules** are DRL or DMN artifacts. They have conditions adn actions parts. Use **Facts** to pass data to the rule engine's working memory. **Production memory** is where rules are stored in the Drools rule engine. **Agenda** keeps activated rules before execution.
* **KIE session**: In Drools, a KIE session stores and executes runtime data. Session can be stateless or stateful (data is retained between session invocations).

???- Code "Some KIE session code Drools 8"
    DRL rules are in the resources folder of the project, which is in the class path. Stateless call:
    ```java
    // code compiles all the rule files found on the class path and adds the result of this compilation, 
    // a KieModule object, in the KieContainer
    KieServices kieServices = KieServices.Factory.get();
    KieContainer kContainer = kieServices.getKieClasspathContainer();
    StatelessKieSession kSession = kContainer.newStatelessKieSession();
    Applicant applicant .... // the domain object model
    ksession.execute(applicant);
    // passing multiple objects
    ksession.execute(Arrays.asList(new Object[] { application, applicant })); 
    ```

    There are other way to pass parameters, like using Command and BatchExecutor.

With stateful KIE session, the engine relies on the `modify` statement in rules to notify the Drools rule engine of changes. It  reasons over the changes and assesses impact on subsequent rule executions.

* **DataSource**:
* **DataStore**: 
* **RuleUnitData**: Rule Units is a recommended style for implementing rules in Drools 8
* **RuleUnitInstance**
* **RuleUnitProvider** 

## Kogito

## Sources

* [Drools 7.74 docs](https://docs.jboss.org/drools/release/7.74.1.Final/drools-docs/html_single/)
* [Drools 8.44 product documentation](https://docs.jboss.org/drools/release/8.44.0.Final/drools-docs/drools/introduction/index.html)
* [Kie Group - Drools git repo.](https://github.com/kiegroup/drools.git)

## Next Steps

* [ ] Develop a prototype using kogito and DRL based decision service 
* [ ] Develop a prototype using kogito and DMN based decision service 
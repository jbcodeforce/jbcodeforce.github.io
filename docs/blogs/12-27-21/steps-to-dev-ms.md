# Steps to develop an event driven microservices

* Add all needed extensions

  ```sh
  quarkus ext add reactive-messaging-kafka,reactive-mq,hibernate-reactive-panache,reactive-pg-client,rest-client-jackson
  ```
* Define a docker compose with mq, redpanda, postgresql

```yaml
version: '3.1'
services:
  postgresql:
    container_name: postgres
    hostname: postgres
    image:  docker.io/bitnami/postgresql:13.2.0-debian-10-r11
    environment:
      POSTGRESQL_USERNAME: postgres
      POSTGRESQL_PASSWORD: pgpwd
      POSTGRESQL_DATABASE: loandb
      BITNAMI_DEBUG: "false"
      ALLOW_EMPTY_PASSWORD: "yes"
    ports:
      - "5432:5432"
    volumes:
      - ./data:/bitnami/postgresql
  pgadmin:
    image: dpage/pgadmin4
    hostname: pgadmin
    container_name: pgadmin
    ports:
      - 8082:80
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@domain.com
      PGADMIN_DEFAULT_PASSWORD: alongpassw0rd
  ibmmq:
    image: ibmcom/mq
    ports:
        - '1414:1414'
        - '9443:9443'
        - '9157:9157'
    volumes:
        - qm1data:/mnt/mqm
    stdin_open: true
    tty: true
    restart: always
    environment:
        LICENSE: accept
        MQ_QMGR_NAME: QM1
        MQ_APP_PASSWORD: passw0rd
        MQ_ENABLE_METRICS: "true"
  redpanda:
    command:
    - redpanda
    - start
    - --smp
    - '1'
    - --reserve-memory
    - 0M
    - --overprovisioned
    - --node-id
    - '0'
    - --kafka-addr
    - PLAINTEXT://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092
    - --advertise-kafka-addr
    - PLAINTEXT://redpanda:29092,OUTSIDE://localhost:9092
    # NOTE: Please use the latest version here!
    image: docker.vectorized.io/vectorized/redpanda:v21.7.6
    container_name: redpanda-1
    ports:
    - 9092:9092
    - 29092:29092
volumes:
  qm1data:
```

* Start the compose: `docker compose up`
* Open Postgresql Admin console from URL: [http://localhost:8082/browser/](http://localhost:8082/browser/)
* Define a new server with the name `local-dev-Server` and the connection property matching the environment settings in the 
compose file. The hostname = postgres and port 5432 and not localhost, as the console runs in the docker network

    ```
    POSTGRESQL_USERNAME: postgres
    POSTGRESQL_PASSWORD: pgpwd
    POSTGRESQL_DATABASE: loandb
    ```

* Add a business entity like an Order or a LoanApplication to be a PanacheEntity. See [this guide](https://quarkus.io/guides/hibernate-reactive-panache) to refresh memory.

    ```java
    @Entity
    public class LoanApplication extends PanacheEntity{
        public String loanApplicationId;
        public String primaryApplicantName;
        public String secondaryApplicantName;
        public double loanAmount;
        public String propertyType;
        public String loanPurposeType;
    }
    ```
* add `import.sql` in the `src/main/resources` to add one record to the table
* restart the application `quarkus dev`
* Within the PGAdmin console, verify the record is created in database using the option `scripts > SELECT scripts` at the table level, and then run it.
* Add one resource class and define basic APIs

```java
@Path("/api/v1/loans")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LoanApplicationResource {

    @ConfigProperty(name="app.version")
    public String version;

    @GET
    @Path("/version")
    public String getVersion(){
        return "{ \"version\": \"" + version + "\"}";
    }

    @GET
    public Uni<LoanApplication>> getAll(){
        return LoanApplication.listAll());
    }
}
```

* Install OpenShift Pipeline and OpenShift Gitops operators, can be done via the OpenShift Console, Operator Hub or with CLI.

   ```sh
    # for OpenShift 4.7+
    # GitOps for solution deployment
    oc apply -k ./openshift-gitops/operators/overlays/stable
    # and Pipeline for building solution
    oc apply -k ./openshift-pipelines-operator/overlays/stable
   ```

* Create a gitops repo

```sh
kam bootstrap \
    --service-repo-url https://github.com/jbcodeforce/loan-origin-cmd-ms \
    --gitops-repo-url  https://github.com/jbcodeforce/loan-origin-gitops \
    --image-repo quay.io/jbcodforce/loan-origin-cmd-ms \
    --git-host-access-token <your-github-token> \
    --prefix los --push-to-git=true
```

* In the -gitops project, add a `bootstrap` folder and add an `ArgoProject` definition so we will not use 
the `default` project. See example in [this project](https://raw.githubusercontent.com/jbcodeforce/rt-inventory-gitops/main/bootstrap/rt-inventory/argo-project.yaml).

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: AppProject
  metadata:
    name: rt-inventory
  ```

  `oc apply -f argo-project.yaml`

* Get Argo CD Console URL and admin user password

```sh
oc get route openshift-gitops-server -n openshift-gitops
# Get password
oc extract secret/openshift-gitops-cluster -n openshift-gitops --to=-
```

* Bootstrap continuous deployment with ArgoCD

```sh
oc apply -k config/argocd/
```

At least 5 ArgoCD applications will be created

```
application.argoproj.io/rt-argo-app created
application.argoproj.io/rt-cicd-app created
application.argoproj.io/rt-inventory-dev-app-refarch-eda-store-simulator created
application.argoproj.io/rt-inventory-dev-env created
application.argoproj.io/rt-inventory-dev-services created
```

* create sealed secret
* Define secrets
* create deployment
* Tune deployment for the application
* add privileged scc to pipeline sa

* add webhook in each microservice git repo - use the secret 
* create openapi doc
* create asyncAPI doc

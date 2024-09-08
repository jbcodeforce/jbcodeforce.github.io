# Run Kafka on minikube using helm

* Be sure to have bitnami repo

```sh
helm repo list
# if needed reference it
helm repo add bitnami https://charts.bitnami.com/bitnami
```

* Install Kafka

```sh
helm install bitnami/kafka --generate-name
```

* Get the passwrod of the user decrypted

```sh
kubectl get secret kafka-1725727453-user-passwords --namespace default -o jsonpath='{.data.client-passwords}' | base64 -d | cut -d , -f 1)
```

* To create a pod that you can use as a Kafka client run the following commands:

```sh
kubectl run kafka-1725727453-client --restart='Never' --image docker.io/bitnami/kafka:3.8.0-debian-12-r3 --namespace default --command -- sleep infinity
kubectl cp --namespace default kclient.properties kafka-1725727453-client:/tmp/client.properties
kubectl exec --tty -i kafka-1725727453-client --namespace default -- bash
```


For PRODUCER:


```sh
kafka-console-producer.sh \
    --producer.config /tmp/client.properties \
    --broker-list kafka-1725727453-controller-0.kafka-1725727453-controller-headless.default.svc.cluster.local:9092,kafka-1725727453-controller-1.kafka-1725727453-controller-headless.default.svc.cluster.local:9092,kafka-1725727453-controller-2.kafka-1725727453-controller-headless.default.svc.cluster.local:9092 \
    --topic test
```

For CONSUMER:


```sh
kafka-console-consumer.sh \
    --consumer.config /tmp/client.properties \
    --bootstrap-server kafka-1725727453.default.svc.cluster.local:9092 \
    --topic test \
    --from-beginning
```
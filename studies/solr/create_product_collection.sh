curl --request POST \
--url http://localhost:8983/api/collections --header 'Content-Type: application/json' \
--data '{
  "name": "v_prod_group",
  "numShards": 1,
  "replicationFactor": 1
}'
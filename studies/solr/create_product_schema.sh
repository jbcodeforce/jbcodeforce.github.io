curl --request POST --url http://localhost:8983/api/collections/v_prod_group/schema --header 'Content-Type: application/json' \
--data '{
  "add-field": [
     {"name": "code", "type": "string"},
    {"name": "label", "type": "text_general", "multiValued": false}
  ]
}'
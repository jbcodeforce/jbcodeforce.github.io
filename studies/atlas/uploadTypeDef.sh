#/bin/bash
ATLAS_BASE_URL=http://localhost:21000/api/atlas/v2

if [[ $# -eq 1 ]]
then
  FNAME=$1
else
  FNAME="@./server-types.json"
fi

echo " Post server types"

curl -v -s -u admin:admin -X POST -H "Content-Type: application/json" -H "Accept: application/json" $ATLAS_BASE_URL"/types/typedefs" -d @$FNAME

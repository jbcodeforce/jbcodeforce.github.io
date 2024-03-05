#/bin/bash
ATLAS_BASE_URL=http://localhost:21000/api/atlas/v2

echo " List existing types"
curl -v -u admin:admin -H "Content-Type: application/json" -H "Accept: application/json" "${ATLAS_BASE_URL}/types/typedefs"

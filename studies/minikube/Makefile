.PHONY: create_ns
# Setting global variables
DEV_NS ?= demo
DBNAME ?= app
# -------------------------------------------------------
# Entry points
# -------------------------------------------------------
prepare: create_ns deploy_postgresql 

all: prepare

ensure_ns = \
	@kubectl get ns $1 >/dev/null 2>&1; \
	if [ $$? -ne 0 ]; then \
			kubectl create ns $1; \
	else \
			echo "$1 exists";\
	fi

create_ns:
	$(call ensure_ns, $(DEV_NC))

# ----------------------------- POSTGRESQL -------------
deploy_postgres_operator:
	@kubectl apply --server-side -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.24/releases/cnpg-1.24.1.yaml


deploy_postgresql:
	@kubectl apply -f postgresql/pg-cluster.yaml  -n $(DEV_NS)

get_postgresql_pwd:
	@kubectl get secret --namespace  $(DEV_NS) $(DBNAME) -o jsonpath="{.data.password}" | base64 -d 

get_postgresql_dbname:
	@kubectl get secret --namespace  $(DEV_NS) $(DBNAME) -o jsonpath="{.data.dbname}" | base64 -d 

get_postgresql_user:
	@kubectl get secret --namespace  $(DEV_NS) $(DBNAME) -o jsonpath="{.data.user}" | base64 -d 

set_k8s_context:
	@kubectl config  --kubeconfig=$HOME/.kube/config  use-context athena-demo

# ------------- PG admin webapp -----------------------------------
deploy_pgadmin:
	@kubectl apply -f postgresql/pgadmin-secrets.yaml  -n $(DEV_NS); \
	@kubectl apply -f postgresql/pgadmin-cm.yaml -n $(DEV_NS); \
	@kubectl apply -f postgresql/pgadmin-svc.yaml -n $(DEV_NS); \
	@kubectl apply -f postgresql/pgadmin-sfs.yaml -n $(DEV_NS); \
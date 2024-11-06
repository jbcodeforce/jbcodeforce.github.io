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
	@kubectl apply -f pg-k8s/pg-cluster.yaml  -n $(DEV_NS)

get_postgresql_pwd:
	@kubectl get secret --namespace  $(DEV_NS) $(DBNAME) -o jsonpath="{.data.password}" | base64 -d 

get_postgresql_dbname:
	@kubectl get secret --namespace  $(DEV_NS) $(DBNAME) -o jsonpath="{.data.dbname}" | base64 -d 

get_postgresql_user:
	@kubectl get secret --namespace  $(DEV_NS) $(DBNAME) -o jsonpath="{.data.user}" | base64 -d 

set_k8s_context:
	@kubectl config  --kubeconfig=$HOME/.kube/config  use-context athena-demo

# ------ install prometheus and grafana
deploy_prometheus:
	@helm upgrade --install \
  -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/main/docs/src/samples/monitoring/kube-stack-config.yaml \
  prometheus-community prometheus-community/kube-prometheus-stack
  	@kubectl apply -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/main/docs/src/samples/monitoring/prometheusrule.yaml

# ------------- PG admin webapp -----------------------------------
deploy_pgadmin: set_pgadmin_secrets set_pgadmin_cm set_pgadmin_svc set_pgadmin_statefulset

set_pgadmin_secrets:
    @kubectl apply -f pg-k8s/pgadmin-secrets.yaml  -n $(DEV_NS)

set_pgadmin_cm:
    @kubectl apply -f pg-k8s/pgadmin-cm.yaml -n $(DEV_NS)

set_pgadmin_svc:
    @kubectl apply -f pg-k8s/pgadmin-svc.yaml -n $(DEV_NS)

set_pgadmin_statefulset:
    @kubectl apply -f pg-k8s/pgadmin-sfs.yaml -n $(DEV_NS)
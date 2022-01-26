# Operational decision management


## Deployment to OpenShift

Follow [link](http://www.ibm.com/support/knowledgecenter/SSYHZ8_21.0.x/com.ibm.dba.offerings/topics/con_odm_prod.html) for details about this product.

* Need LDAP
* Need a database like Postgresql
* You do not have to integrate with the User Management Service (UMS)
* Running the `./cp4a-deployment.sh` script and selecting ODM, you have the choice to select ODM sub components like

        1) Decision Center (Selected)
        2) Rule Execution Server (Selected)
        3) Decision Runner 
        4) User Management Service 
        5) Business Automation Insights 

   When doing Enterprise deployment the LDAP type supported does not include OpenLDAP, we can select microsoft active directory and modify the generated CR.yaml.

The CR has the following declarations to review

    ```yaml
    sc_deployment_type: "enterprise"
    sc_deployment_platform: "ROKS"
    sc_deployment_patterns: "foundation,decisions"
    sc_optional_components: "decisionCenter,decisionServerRuntime"
    odm_configuration:
    # To enable ODM Runtime.
    decisionServerRuntime:
        enabled: true
        replicaCount: 2
    # To enable the Authoring part
    decisionRunner:
        enabled: false
        replicaCount: 2
    decisionCenter:
        enabled: true
        replicaCount: 2
    ```

And more to update for LDAP and Postgresql DB

* Install [Rule Designer from the Eclipse Marketplace](https://marketplace.eclipse.org/content/ibm-operational-decision-manager-developers-v-8105-rule-designer).

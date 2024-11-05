# Helm 

[Helm](https://helm.sh) is the package manager to deploy application in Kubernetes.

## Important concepts

* A **Chart** is a Helm package
* A **Repository** is the place where charts can be collected and shared. 
* A **Release** is an instance of a chart running in a Kubernetes cluster.

## Important documentations

* [Getting Started](https://helm.sh/docs/chart_template_guide/getting_started/).
* [Values files](https://helm.sh/docs/chart_template_guide/values_files/)
* [Helm commands](https://helm.sh/docs/helm/helm/)
* [Cheat Sheet.](https://helm.sh/docs/intro/cheatsheet/)

## Development practices

* `helm create chart_name` , this will create a folder with the name of the chart.  Chart names must be lower case letters and numbers
* Recall that release name is specified during the deployment: `helm install --name <release_name> chart_name`
* Update the metadata in the `Chart.yaml`
* Add any dependencies in the `Chart.yaml`
* Think to change the chart version number each time you make changes to the template or values.yaml, once an application was deployed. The version of the app is different than the version of the Chart. Version number follow SemVer2 specs: MAJOR.MINOR.PATCH
* Tune the content of the template folder to keep the strict minimum:

    * Be sure to tune the notes.txt file as it is the final message to be presented to the user, once the deployment is done.
    * All defined template names should be namespaced.
    * Assess if you need a service account. It is a good practice to set a service account to any deployed application to define security policies at the role / service account level.
    * 

* Tune the content of `values.yaml`. Variable names should begin with a lowercase letter, and words should be separated with camelcase. 
* Every defined property in values.yaml should be documented.
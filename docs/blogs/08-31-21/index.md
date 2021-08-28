# OpenShift GitOps playground

In this blog I present what I did to manage the real time inventory solution with GitOps. GitOps is still
quite new and there are still different iteration of how best to do it. Red Hat has delivered two operators around Tekton
for continuous integration, and ArgoCD for continuous deployment. As part of thee OpenShift Gitops there is also a CLI tool
 to help developer to start on the good track, at least for simple solution.

The core idea of GitOps is having a Git repository that always contains declarative descriptions 
of the infrastructure currently desired in the production environment and an automated process 
to make the production environment match the described state in the repository.

## What I want to do

I think it will be always challenging, for big solution, to understand what needs to be done. 
At the high level, by just following KAM's [Day 1 Operations](https://github.com/redhat-developer/kam/tree/master/docs/journey/day1) I want to
manage three event-driven microservices

## What you need to know

This could take a lot of time...

* [Understand GitOps](https://www.gitops.tech/)
* [Study KAM](https://github.com/redhat-developer/kam)
# Docker based environments

## Different development CLI

* Build a dev image

```sh
 docker build -f Dev-Dockerfile -t j9r/dev-env .
```

* Run it to access to git client

```sh
docker run -ti -v $(pwd):/home/me j9r/dev-env bash
```

* Use it for git commands.

```sh
git config --global user.email "..."
git config --global user.name jbcodeforce
```

## Python / Machine Learning

For Python environment, see the [ML repository](https://github.com/jbcodeforce/ML-studies)
# My machine learning Tools Summary

## Jupyter notebook
The [Jupyter](http://jupyter.org/) Notebook is an open-source web application that allows you to create and share documents that contain live code, equations, visualizations and narrative text.

[The project](https://github.com/jbcodeforce/ml-basics) has notebook for machine learning in Python.

### Playing with Python 3.5 Anaconda packaging
[Anaconda](https://www.anaconda.com/) is the leading open data science platform powered by Python. The following command uses [anaconda3 docker image](https://hub.docker.com/r/continuumio/anaconda3/) (python 3.5) to do all the tutorials and studies using Jupyter notebooks. See [dockerfile](https://github.com/jbcodeforce/ml-basics/blob/master/Dockerfile) to build a custom image and use it for jupyter or python.

The scripts `startJupyter.sh` or `startPythonDocker.sh` in [this project](https://github.com/jbcodeforce/ml-basics) use the created image.

### Some good practices
* do all imports in first code cell: It has two benefits. The dependencies and tools used are obvious at the first glance. When you restart the notebook server, you can have all your imports restored with a single re-run. It is especially useful when you don’t want to re-execute the entire notebook.
* Start, keep draft version of your notebook
* Wrap cell content in function
* use job lib for caching output of any function
* Make sections of your notebook loosely bound: Use as little global variables as possible. If you wrap your cells in functions and you use joblib for caching, it is really inexpensive to call same code within each section. It’s better than making code reliable on the variables created several cells above.
* use assertions to test

## sklearn or scikit-learn
[sklearn](http://scikit-learn.org/stable/index.html) is a python api and library to do ML.
Some examples are in


## Canopy

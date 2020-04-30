# My machine learning summary and concepts
In these notes I summarize all the work I'm doing around machine learning from book and onlin e training.

## Main concepts
Machine learning is the field of study that gives computers the ability to learn without being explicitly programmed. It
learns from experience E with respect to some task T and some performance measure P, if its performance on T as measured by P, improves with experience E.

Two types machine learning algorithms
- supervised learning
- unsupervised learning

### Supervised learning:
The main goal in supervised learning is to learn a model from labeled training data that allows us to make predictions about unseen or future data. **Supervised** because we give to the algorithm a dataset with a right answers  (y).
Different categories of supervised learning:
* **Classification** problem is when we are trying to predict one of a small number of discrete-valued outputs, such as whether it is Sunny (which we might designate as class 0), Cloudy (say class 1) or Rainy (class 2).
The class labels are defined as multiple classes or binary classification task, where the machine learning algorithm learns a set of rules in order to distinguish between the possible classes.

Here is an example of data set and classes from the NIST's `iris flower` dataset: 4 features (*a feature is an attribute to use for classifying*), three potential classes
```python
feature_names= ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']
target_names= ['setosa', 'versicolor', 'virginica']
data = [[ 5.1,  3.5,  1.4,  0.2],[ 4.9,  3. ,  1.4,  0.2]]

labels = [0, 0, 0, 0,…1,1,1,… 2,2,2]
```
First row of data correspond to first label of value 0

* **Regression**, where the outcome signal is a continuous value. In the table below the Price is the outcome (y) the size # of bedrooms… are features
![](assets/docs/ml/images/house-table.png)

In regression analysis, we are given a number of predictor (explanatory) variables and a continuous response variable (outcome), and we try to find a relationship between those variables that allows us to predict an outcome.

### Unsupervised learning
- giving a dataset and try to find tendency in the data, by using techniques like clustering
- example news.google.com ;  genes map for individuals
- organize large computer clusters, social network analysis, market segmentation, astronomical data analysis

### Reinforcement learning

The goal is to develop a system (agent) that improves its performance based on interactions with the environment: it learns a series of actions that maximizes a reward via an exploratory trial-and-error approach or deliberative planning.  


### Unsupervised dimensionality reduction
It is a commonly used approach in feature preprocessing to remove noise from data, which can also degrade the predictive performance of certain algorithms, and compress the data onto a smaller dimensional subspace while retaining most of the relevant information.


### Model representation
#### notation:
    m= # of training examples
    X= input variables or features
    y=output or target
   (x(i),y(i)) for the i<sup>th</sup> training example

- training set is the input to learning algorithm  -> generate an hypothesis that will be used to map from x to y
- how to represent h the hypothesis?
    for example h is a linear function of x;  
<img src="http://latex.codecogs.com/svg.latex?\Large h_\Theta(x)=\Theta_0 + \Theta_1  x"></img>


#### Cost function:
Its goal is to search the value of &Theta;<sub>0</sub> and &Theta;<sub>1</sub> so that h(x) is close to y for the training set (x,y).  
The problem is to minimize the following cost function:  

<img src="http://latex.codecogs.com/svg.latex?\Large J(\Theta_0, \Theta_1)= \frac{1}{2 m} \sum_{i=1}^{m} (h_\theta(x^{i}) - y^{i})^2"></img>

hypothesis function is of X while the cost function is of parameter Theta

#### Gradient descent
It is the algorithm to minimize the cost function:
* start some &Theta;<sub>0</sub> and &Theta;<sub>1</sub>
* keep changing &Theta;<sub>0</sub> to &Theta;<sub>1</sub> to reduce J(&Theta;<sub>0</sub>, &Theta;<sub>1</sub>) until reaching a minimum:

 <img src="http://latex.codecogs.com/svg.latex?\Large \Theta_j := \Theta_j - \alpha\frac{\delta}{\delta\Theta_j} J(\theta_0, \Theta_1)"></img> (for j = 0 and  j = 1)


&alpha; is the learning rate, and corresponds to the step size to go downhill.
if &Theta;<sub>0</sub> = 0, the problem is to find the min of J(&Theta;<sub>1</sub>).


The approach is to use a 'simultaneous update' to avoid using modified &Theta;<sub>0</sub> to compute new value for &Theta;<sub>1</sub>. So keep &Theta;<sub>0</sub> original value.


The fraction factor is the derivative of the function J: the slope of the tangent at the curve on point &Theta;<sub>j</sub>.

If &alpha; is too big, gradient descent can overshoot the minimum and fails to converge or worse it could diverge.
when J(&Theta;<sub>0</sub>,&Theta;<sub>1</sub>) is already at the local minimum the slope of the tangent is 0 so &Theta;<sub>j</sub> will not change.


When going closer to the local minimum the slope of the tangent will go slower so the algo will automatically take smaller step.


When using linear regression there is a unique global minima for the cost function.


Linear algebra is the notation/ mathematical model to use to define the features: the set of feature is a matrix called X. and Y, representing the trained results, is a vector.

#### Linear regression with multiple variables

When the number of features is more than one the problem becomes a linear regression
   n      is the number of features
   X<sup>(i)</sup>= features of i<sup>th</sup> training (i<sup>th</sup> row or vector)

   X<sub>j</sub><sup>(i)</sup> = value of feature j in i<sup>th</sup> training

the hypothesis is now becoming:  
<img src="http://latex.codecogs.com/svg.latex?\Large h_\Theta(x)=\Theta_0 X_0+ \Theta_1 X_1 + ... + \Theta_k X_k"></img>

Xo = 1 so a feature is a vector and T is also a row vector of dimension n+1 so H is a matrix multiplication: it is called **multivariate linear regression**

The gradient descent algorithm for a multiple features problem looks like

repeat {  
  <img src="http://latex.codecogs.com/svg.latex?\Large \Theta_j := \Theta_j - \alpha \frac{1}{m} \sum_{i=1}^{m} (h_\theta(x^{i}) - y^{i}) x_j^{i}"></img>

  simultaneously update &Theta;<sub>j</sub> for j = 0,...n  
}

when the unit of each feature are very different the gradient descent will take a lot of time to find the minima. So it is important to transform each feature so they are in the same scale. (close to: from -1 to 1 range)

```
Normalization of ratings means adjusting values measured on different scales to a notionally common scale, often prior to averaging. In another usage in statistics, normalization refers to the creation of shifted and scaled versions of statistics, where the intention is that these normalized values allow the comparison of corresponding normalized values for different datasets in a way that eliminates the effects of certain gross influences, as in an anomaly time series.

Feature scaling used to bring all values into the range [0,1]. This is also called unity-based normalization.

```
X'=(X-X<sub>min</sub>)/(X<sub>max</sub>-X<sub>min</sub>)

#### polynomial regression  
the hypothesis function could be a polynomial. One problem is to select the pertinent features.
there are algorithms to help to pick up features automatically.

#### normal equation
is the method to solve &Theta; analytically. It is a real.
As an example to minimize a quadratic function:  

<img src="http://latex.codecogs.com/svg.latex?\Large J(Theta) = a \Theta^2 + b\Theta + c"></img>

is to find the value of &Theta; where the derivative of J is 0

The Normal Equation:

<img src="http://latex.codecogs.com/svg.latex?\Large Theta = ( X^T X)^{-1} X^T y "></img>

the advantage of normal equation over gradient descent is that you do not need to choose alpha, and do not need to iterate. It could be slow for n > 10,000 as it needs to compute the inverse of X<sup>T</sup>*X, which is close to O(n<sup>3</sup>)

In normal equation X may not be invertible. This could happen when two features are redundant or when the number of feature is too high.

```
With n=200000 features, you will have to invert a 200001×200001 matrix to compute the normal equation.
Inverting such a large matrix is computationally expensive, so gradient descent is a good choice.
```

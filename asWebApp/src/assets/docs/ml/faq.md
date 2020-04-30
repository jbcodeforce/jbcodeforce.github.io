## Frequently Asked Questions

### What is AI?
AI is augmenting human intelligence to take better decision. Humans are better at common sense reasoning, value judgment, self directed goals. Machines are better at large scale math, pattern discovery and statistical reasoning. One critical component of any kind of intelligence is the ability to learn.
Some challenges to resolve:
* having a natural interaction between human and machine.
* Machine should be proactive for it needs, effective computing, sentiment analysis.


### AI Ethics?
Here are a set of challenges AI solution should assess for ethics control:
* Is the machine is following my same ethical principles? => value alignment.
* is it fair in its decisions, or does it favor some group more than others, bias? => as data are coming from people, they are biased. It is recognized, there are 140 kinds of bias. Developer needs to clean the data for illegal discrimination according to the specified protected attributes. Authorize complaint for any downstream AI.
* is it explaining why is it making a certain decision? can I get an explanation?
* can I check the reasoning processing of this machine?
* how the machine using data to develop of his capabilities? or share with other?
In reward based recommender systems for example we want to control with rules what can be recommended without violating ethical policy. Responses from user should not violate such policy: an horror film being so cool, but not proposed to kids...
Model ethical deviation and threshold-based compliance: machine can alert human when going out of policy, like self-driving car.

### What is AI bias?
Training data are unbalanced and lead to bias.
The cognitive bias to consider while developing AI solution:

<img src="http://ritholtz.com/wp-content/uploads/2016/09/1-71TzKnr7bzXU_l_pU6DCNA.jpeg" width=1024></img>

AI system has sensors to get information from the world or environment, and they have also bias, it has model, which is built-in assumptions, and actuators which execute decision back into the world may have some bias too.

### What is natural language processing?

NLP seeks to empower computers to process and communicate in natural language. Be able to read text and process speech.


### Why using feature scaling?
Feature scaling speeds up gradient descent by avoiding many extra iterations that are required when one or more features take on much larger values than the rest.
To normalize each feature we need to Subtract the mean value of each feature from the dataset. And after subtracting the mean, additionally scale (divide) the feature values by their respective \standard deviations.

The standard deviation is a way of measuring how much variation there is in the range of values of a particular feature (most data points will lie within 2 standard deviations of the mean); this is an alternative to taking the range of values (max-min)

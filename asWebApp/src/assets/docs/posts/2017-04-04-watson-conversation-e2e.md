---
layout: post
title:  "Watson Conversation within an end to end solution"
date:   2017-04-07 18:00:00 -0700
categories: cognitive
---
A Watson conversation service on bluemix is not just an API to call. It supports defining Intent, Entities and Dialog. But a chat bot solution, which Watson conversation service (WCS) helps to build, need more things to be done. The following diagram is a system context diagram I have built for a customer and tuned over time to address a internal IT Support chat bot: End users search for solution to an IT problem, the chat bot helps to deliver solution automatically.

You should have basic knowledge of Watson Conversation and interested in understanding how to do things outside of hello world.

![WCS](/assets/posts/images/wcssc.png)
1. On right side the end user use the chat bot user interface to start the conversation using natural language sentences.
* The user interface is served by a nodejs app, defining routing logic to integrate with all the necessary services, part of the end to end solution. We name it broker app.
2. Watson conversation API is used and the conversation context is set within the nodejs broker app.
3. The conversation is persisted in a document oriented DB so cases not supported by the dialog will be analyzed so developers can fine tune the solution.
* If the query is about access to one of the business application, the broker can get the state of all business application from a stateful event processing platform like IBM ODM Decision Insight: each application and its included business services are entities and events about the application states are correlated and processed. When the application is in degraded mode, the user email address is kept so when a new event about the application being back online, emails can be sent to the previously impacted end users.
4. Rule processing can be used to also define what is the best action to provide when the conversation reach a certain flow and content.
5. One of such action could be to perform a specific query to Watson Discovery. The broker app will expose the n most accurate results to the user interface, so the end user could select a solution to his/her problem.
6. The intent of the user could be to access one of the business processes the company has defined and implemented in product like IBM BPM. The process can automatically triggered, and Watson conversation could gather the minimum data elements to be injected in the process.
7. Finally the broker can route the conversation to the first level support staff, as result of the 'best action' evaluation, or by user request.

This simple diagram illustrates that many components can be part of a Watson Conversation solution. A minimum viable product may be limited to user interface, broker component, conversation definitions, conversation persistence inside a document DB, and route to human capabilities. With those minimum building blocks we can quickly build, and measure the efficiency of the bot, and learn from there.

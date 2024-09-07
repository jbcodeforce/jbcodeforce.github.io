# Reactjs and Next.js

## Next.js

Next.js is a flexible React framework that gives developers building blocks to create fast, full-stack web applications.

[Learn Next.js tutorial.](https://nextjs.org/learn/dashboard-app) Some important concepts:

* Next.js uses file-system routing: instead of using code to define the routes of the application, you can use folders and files
* Next.js uses React Server Components, a new feature that allows React to render on the server. By moving rendering and data fetching to the server, you can reduce the amount of code sent to the client, which can improve your application's performance

## Reactjs Getting started

React is a JavaScript library for building interactive user interfaces. To use it ina html page, load two scripts:

```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<-- to compile jsx code to js -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

In React a component is a function that returns UI elements. See the [index.html](https://github.com/jbcodeforce/jbcodeforce.github.io/tree/code/studies/reactjs/index.html)

In React, data flows down the component tree. This is referred to as one-way data flow. Props are read-only information that's passed to components. State is information that can change over time, usually triggered by user interaction. State is initiated and stored within a component

* [React foundation course](https://nextjs.org/learn/react-foundations)

* [Start a new project](https://react.dev/learn/start-a-new-react-project): Need a framework with reactjs to support webapp dev like next.js. 

    * Create backend folder with squeleton for a FastAPI [tutorial from testdrivent.io](https://testdriven.io/blog/fastapi-react/)
    * Create a new Next.js project  (See [Create React App](https://create-react-app.dev/docs/getting-started/))

    ```sh
    npx create-next-app@latest frontend
    ```

* [This tutorial from product documentation.](https://react.dev/learn)

## Key concepts

React components are JavaScript functions that return markup. React component names must always start with a capital letter, while HTML tags must be lowercase.

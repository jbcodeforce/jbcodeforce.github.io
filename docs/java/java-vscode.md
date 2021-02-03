# Java programming with VScode

## Some Editor tricks

The access to the command palette shift -> cmd -> P

palette and access to preview a file like a csv.

### Autocompletion

* main to get public void main.... 
* sysout for System.out...
* F2 to refactor name

### Navigate

* cmd -> click to navigate to the source of a class
* opt -> Shift -> o to organize import
* cmd -> shift -> O get the code outline
* cmd ->  P navigate project file

### Run a java main

Create a configuration with the name of the class and arguments. See [example here.](https://code.visualstudio.com/docs/java/java-debugging). Something like:

```json
 "configurations": [
        {
            "type": "java",
            "name": "Debug (Launch)",
            "request": "launch",
            "mainClass": "jbcodeforce.p1.WordCountMain",
            "args": "wc.txt"
        }
 ]
```

## VSCode tricks

* Control the file exposed (like removing eclipse related file) -> code -> Preferences -> Settings -> your-existing-projectname -> Commonly used, file exclude and then enter a pattern like (`**/.classpath`)
* Java Dependencies view helps to get the code of the used dependencies
* Run maven goals from the maven projects view in the Explorer
* Avoid file closed when not edited: double clicks on the file header so it changes from italic to regular.

## Debugging

[Codelens debugging](https://code.visualstudio.com/docs/java/java-debugging)

## Set environment variables

select Debug > Open Configurations then you should see a set of launch configurations for debugging your code. You can then add to it an env property with a dictionary of string:string.

```
            "env": {
                "BOOTSTRAP_SERVERS": "localhost:9092",
                "TOPIC_NAME": "orders"
            }
```

## Error

* `Failed to launch debugger in terminal. Reason: Failed to launch debuggee in terminal. Reason: java.util.concurrent.TimeoutException: timeout`: this was done by unknown localhost resolution due to some DNS setting on mac.

## Quarkus support

Create a new projet: shift -> cmd -> P:  `Quarkus: Generate a Maven project `
Start debugger:  shift -> cmd -> P: `Quarkus:  Debug current Quarkus Project` to create a configuration.

Add code for a resource: Add a java file and use `qrc` in editor.

To add an extension to current project: shift -> cmd -> P: `Quarkus:add an extension to current project`.

In the outline view, we can get a tree view for application.properties
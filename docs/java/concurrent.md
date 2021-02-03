
## ExecutorService

The Java ExecutorService interface, java.util.concurrent.ExecutorService, represents an asynchronous execution mechanism which is capable of executing tasks concurrently in the background. Once the thread has delegated the task to the ExecutorService, the thread continues its own execution independent of the execution of that task. The ExecutorService then executes the task concurrently, independently of the thread that submitted the task.

The api offers a way to specify the pool size, this is to avoid loading the app server common thread pool.

```java
ExecutorService executor = Executors.newFixedThreadPool(2);
orderEventRunner = new OrderEventRunner();
executor.execute(orderEventRunner);
```

`Execute` method execute a Runnable asynchronously. The Java ExecutorService `submit(Runnable)` method also takes a Runnable implementation, but returns a `Future` object. This Future object can be used to check if the Runnable has finished executing. The second flavor for submit is using a Callable as argument. A callable is the same as a Runnable, excepts it returns an object and can generate exception.

```java
public interface Callable{
    public Object call() throws Exception;
}
```

```java
Future future = executorService.submit(new Callable(){
    public Object call() throws Exception {
        System.out.println("Asynchronous Callable");
        return "Callable Result";
    }
});

System.out.println("future.get() = " + future.get());
```
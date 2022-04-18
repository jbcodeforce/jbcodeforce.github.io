# Conduct system design

* Verify the goals

    * Why we are doing this application / solution
    * Who is the end user
    * How they will use the system and for what
    * What are the expected outcome and inputs
    * How to measure success?

* Establish scope

    * list some potential features
    * Are we looking at end to end experience or API design
    * type of client applications or device
    * Do we require authentication? Analytics? Integrating with existing systems?

* Design according to scale

    * What is the expected read-to-write ratio?
    * How many concurrent requests should we expect?
    * What’s the average expected response time?
    * What’s the limit of the data we allow users to provide?
    * De we need to expose read data in different geographys?

* From high level to drill down

    * Cover end to end process
    * Go when necessary to detail of an API, data stores,..
    * look at potential performance bottle neck

* Review data structure and algorithms to support distributed system and scaling

* Be able to argument around

    * What type of database would you use and why?
    * What caching solutions are out there? Which would you choose and why?
    * What frameworks can we use as infrastructure in your ecosystem of choice?

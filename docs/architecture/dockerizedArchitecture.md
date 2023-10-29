# <i class="fab fa-docker"></i>  Dockerized Application</i>

<span style="color: red;">**überarbeiten**</span>

We decided to deploy our Vue.js web application using a Docker container. Docker is an application containerisation platform that allows applications and all their dependencies to run in an isolated container. This makes it easier to deploy and scale applications in different environments because the container is consistent and portable.
<br>

**important aspects of a Dockerized Vue.js application:**

- <span style="background-color: fuchsia;">**Isolation**</span>: The Vue.js application and all its dependencies, including the web server and other required software components, are isolated in a Docker container. This means that the application should run consistently regardless of the environment in which it is executed.
<br>
- <span style="background-color: fuchsia;">**Portability**</span>: A Docker container is portable and can be easily moved between different environments. This facilitates the deployment and scaling of the application in different environments, e.g. development, test and production.
<br>
- <span style="background-color: fuchsia;">**Reproducibility**</span>: With Docker, you can ensure that all developers in your team and in other environments use the same environment, which improves the reproducibility of development and test environments.
<br>
- <span style="background-color: fuchsia;">**Scalability**</span>: Docker containers can be managed in container orchestration platforms to improve application scalability and manageability.
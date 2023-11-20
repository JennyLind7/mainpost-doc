# <i class="fab fa-docker"></i>  Dockerized Application</i>

Since the delivery of a finished project can be complicated, especially if it consists of frontend, backend, model tracking and database, we decided to virtualize all components of our application. To do this, we opted for the containerization technology Docker. Our application consists of a total of 3 Docker containers, which can all be started directly via a **docker compose up ** command. The frontend is bound to port 8080 by default, the backend to 8000. These basic settings can be adjusted using docker-compose and dockerifle.
<br>
<br>
<span style="color:red;">Gründe für dockerized backend + models</span>


**important aspects of a Dockerized Vue.js application:**

- <span style="background-color: #0284c7;">**Isolation**</span>: The Vue.js application and all its dependencies, including the web server and other required software components, are isolated in a Docker container. This means that the application should run consistently regardless of the environment in which it is executed.
<br>
- <span style="background-color: #0284c7;">**Portability**</span>: A Docker container is portable and can be easily moved between different environments. This facilitates the deployment and scaling of the application in different environments, e.g. development, test and production.
<br>
- <span style="background-color: #0284c7;">**Reproducibility**</span>: With Docker, you can ensure that all developers in your team and in other environments use the same environment, which improves the reproducibility of development and test environments.
<br>
- <span style="background-color: #0284c7;">**Scalability**</span>: Docker containers can be managed in container orchestration platforms to improve application scalability and manageability.

[<i class="fas fa-folder"></i>  find our docker files on Github](https://github.com/UHPDome/backend_mainpost/tree/main/docker)


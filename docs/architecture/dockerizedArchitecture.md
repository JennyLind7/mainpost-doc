# <i class="fab fa-docker"></i>  Dockerized Application</i>

Since the complexities in delivering our project, encompassing frontend, backend, model tracking, and a database, we have opted to virtualize all components of our application using Docker containerization technology. Our project comprises a total of 3 Docker containers, all deployable with the **docker-compose up** command. <br>
The default bindings are set to port 8080 for the frontend and 8000 for the backend, with the flexibility to adjust these fundamental settings using Docker-Compose and Dockerfile. 
<br>
Docker was particularly suitable for our project as it enables the individual application components to be isolated in special containers. This not only ensures portability across different environments, but also improves the reproducibility of our development setups. In addition, Docker streamlines scalability and deployment through container orchestration, enabling efficient resource utilisation and providing a comprehensive solution for the development, deployment and maintenance of our interconnected project.
<br>
<br>

[<i class="fas fa-folder"></i> find our docker files on Github](https://github.com/UHPDome/backend_mainpost/tree/main/docker){:target="_blank"}

## Dockerized Vue.js Application

- <span style="background-color: #0284c7;">**Isolation**</span>: The Vue.js application and all its dependencies, including the web server and other required software components, are isolated in a Docker container. This means that the application should run consistently regardless of the environment in which it is executed.
<br>
- <span style="background-color: #0284c7;">**Portability**</span>: A Docker container is portable and can be easily moved between different environments. This facilitates the deployment and scaling of the application in different environments, e.g. development, test and production.
<br>
- <span style="background-color: #0284c7;">**Reproducibility**</span>: With Docker, you can ensure that all developers in your team and in other environments use the same environment, which improves the reproducibility of development and test environments.
<br>
- <span style="background-color: #0284c7;">**Scalability**</span>: Docker containers can be managed in container orchestration platforms to improve application scalability and manageability.


## Dockerized Backend and Models

- <span style="background-color: #0284c7;">**Scalability and Resource Management**</span>: Separating the backend and models into distinct containers enables more efficient resource management. Additional model containers can be easily added to scale independently of the backend.
- <span style="background-color: #0284c7;">**Technological Independence**</span>: Containers allow independent development, testing, and deployment of backend and models, fostering a modular architecture. This flexibility allows choosing different technologies for each component.
- <span style="background-color: #0284c7;">**Versioning and Updates**</span>: Isolating backend and models facilitates independent versioning and updates. For example, updating a model in a container can be done without impacting the backend, easing the testing of new models and gradual application updates.
- <span style="background-color: #0284c7;">**Load Distribution**</span>: Optimizing load distribution for applications with high model traffic is achievable by using separate containers for models. This enables scaling and distributing resources based on model demand without affecting the backend.
- <span style="background-color: #0284c7;">**Independent Development Teams**</span>: Containerization supports parallel development and deployment for different teams responsible for the backend and models. As long as defined interfaces (APIs) are maintained, teams can work independently.
- <span style="background-color: #0284c7;">**Flexibility in Technology Choice**</span>: Backend and models can employ different technologies, programming languages, and frameworks. Containerization allows selecting the most suitable technologies for each element without concerns about potential conflicts.


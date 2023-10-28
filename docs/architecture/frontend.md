# <i class="fas fa-desktop"></i> Frontend

<span style="color: red;">Einleitung</span>
<br>

## Service Design Pattern
<span style="color: red;">Grafik service Software Design Pattern</span>

## Vue.js Application

Vue.js is an open-source JavaScript framework mainly used for developing user interfaces of web applications and single-page applications (SPAs).
<br>

**important features and details of Vue.js Framework:**
<br>

- <span style="background-color: fuchsia;">**Lightweight**</span>: Vue.js is relatively lightweight and easy to integrate into existing projects, even if you already use other JavaScript libraries or frameworks.
<br>
- <span style="background-color: fuchsia;">**Component-based architecture**</span>: Vue.js makes it possible to split user interfaces into reusable components.
<br>
- <span style="background-color: fuchsia;">**Reactive data binding**</span>: Vue.js provides reactive data binding that allows developers to link data models and user interface components. When data changes, the user interface is automatically updated to reflect these changes.
<br>
- <span style="background-color: fuchsia;">**Directives**</span>: Vue.js has special directives that can be integrated into the HTML markup to control the application of the framework. For example, the `v-for` directive for rendering lists and the `v-if` directive for conditional rendering of elements.
<br>
- <span style="background-color: fuchsia;">**Routing**</span>: Vue Router is an official extension to Vue.js that simplifies the creation of single-page applications with client-side routing functionality.
<br>
- <span style="background-color: fuchsia;">**Tools and ecosystem**</span>: Vue.js has an active and growing community. There are numerous extensions, plugins, and tools that facilitate the development and debugging of Vue.js applications.


[Getting started with Vue.js](https://vuejs.org/)


## Dockerized Application <i class="fab fa-docker"></i>

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
# <i class="fas fa-wrench"></i>  Installation

  <i class="fab fa-docker"></i> Install Docker on your system<br>
  <i class="fab fa-github"></i> You need a GitHub account


## Project Setup

### Github Repositories

Clone our Github Repositories.

<i class="fab fa-github"></i> <strong>Frontend</strong>
<details>
<summary>HTTPS</summary>

```
https://github.com/SimonUnterlugauer/dockerized_mainpost_frontend.git

```
</details>

<details>
<summary>SSH</summary>

```
git@github.com:SimonUnterlugauer/dockerized_mainpost_frontend.git

```
</details>

<i class="fab fa-github"></i> <strong>Backend</strong>

<details>
<summary>HTTPS</summary>

```
git clone https://github.com/UHPDome/backend_mainpost.git

```
</details>

<details>
<summary>SSH</summary>

```
git clone git@github.com:UHPDome/backend_mainpost.git

```
</details>

---

### Edit .env.example

```
VUE_APP_SUPABASE_KEY=value
VUE_APP_MAPBOX_API_TOKEN=value
```
The corresponding file can also be found in [/frontend](https://github.com/UHPDome/backend_mainpost/tree/main/frontend)

--- 
### Project directory

Navigate into the project directory:
```
cd backend_mainpost
```
### Start Docker Container

Start the Docker containers:
```
docker-compose up
```
---

### docker-compose.yml

<details>
<summary>Edit setup in docker-compose.yml file</summary>

```
version: "3.9"
services:
  fastapi:
    build:
      context: .
      dockerfile: ./docker/backend/Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./app:/app
  mlflow:
    build:
      context: .
      dockerfile: ./docker/mlflow/Dockerfile  # Verweisen Sie auf das oben gezeigte Dockerfile
    ports:
      - "5001:5001"
    volumes:
      - ./development/src/mlruns:/mlflow/mlruns
      - ./development/src/mlartifacts:/mlflow/mlartifacts
  frontend:
    container_name: 'dockerized-mainpost-frontend'
    build: 
      context: ./
      dockerfile: './docker/frontend/Dockerfile'
    stdin_open: true
    tty: true
    ports:
      - "8080:8080"
    volumes:
      - ./frontend:/app/frontend
      - /app/frontend/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
  # cronjob:
  #   container_name: 'dockerized-cronjob'
  #   build:
  #     context: .
  #     dockerfile: ./docker/development/Dockerfile  # Verweisen Sie auf das oben gezeigte Dockerfile
  #   ports:
  #     - "7000:7001"

```
</details>








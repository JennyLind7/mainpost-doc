# <i class="fas fa-wrench"></i>  Installation

<i class="fab fa-docker" style="margin-left:20px;"></i><span style="margin-left:20px;">Install Docker on your system</span><br>
<i class="fab fa-github" style="margin-left:20px;"></i><span style="margin-left:20px;">You need a GitHub account</span>


## Project Setup

### Github Repositories

<span style="margin-left:20px;">Clone our Github Repository:</span>

<details open>
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
<span style="margin-left:20px;">The corresponding file can also be found in <a href="https://github.com/UHPDome/backend_mainpost/tree/main/frontend" target="_blank">/frontend</a></span>


--- 
### Project directory

<span style="margin-left:20px;">Navigate into the project directory:</span>
```
cd backend_mainpost
```
### Start Docker Container

<span style="margin-left:20px;">Start the Docker containers:</span>
```
docker-compose up
```
---

### docker-compose.yml

<details open>
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









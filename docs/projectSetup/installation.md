
These instructions will guide you on how to get the application running on your local system.

## Requirements

<span style="color: red;">Requirements einfügen</span>


## <i class="fas fa-wrench"></i>  Project Installation

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

### Edit .env.example

Edit <strong>.env.example</strong> file in the <strong>/frontend</strong> folder as per format specified below.
```
VUE_APP_SUPABASE_KEY=value
VUE_APP_MAPBOX_API_TOKEN=value
```

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


## <i class="fas fa-globe"></i>  Ports
In default configuration the docker container run on following ports:
<ul>
  <li><strong>Frontend:</strong>
    <p style="margin-left: 20px;">
    </p>
  </li>
  <li><strong>Backend:</strong>
    <p style="margin-left: 20px;">
    </p>
  </li>
</ul>







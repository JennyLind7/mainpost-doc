# <i class="fab fa-docker"></i> Docker Setup

![Docker Setup](Docker_set.png)

## Vuejs - Frontend
<span style="margin-left:20px;">Right now in docker compose the dev dockerfile gets executed.</span>

### Dockerfile for dev
- Builds the container for the frontend application. 
<details open>
<summary>Frontend Dockerfile</summary>

```
# Stage 1: Build Vue.js app
FROM node:lts-alpine as build-stage

# Set the working directory to the /frontend folder inside the container
WORKDIR /app/frontend

# Install Vue CLI globally
RUN npm install -g @vue/cli

# Copy the package.json and package-lock.json files to the container
COPY ./frontend/package*.json ./

# Install project dependencies, including the newly added package(s)
RUN npm install 

RUN npm install --save \
  @fullcalendar/core \
  @fullcalendar/vue3

# Copy /frontend from the host to the /frontend folder inside the container
COPY ./frontend .
COPY ./frontend/.env .env

# Run the app
CMD ["npm", "run", "serve"]

EXPOSE 8080

```
</details>

### Dockerfile for production
- Builds the container for the frontend application for later to be realised production scenario.
<details>
<summary>Production Dockerfile</summary>

```
# Stage 2: Serve the built app using Nginx
FROM nginx:stable-alpine as production-stage


# Copy the Nginx configuration file into the image
COPY my-nginx-config.conf /etc/nginx/conf.d/default.conf

# Copy the built app from the build-stage to Nginx web server's root folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]

```
</details>
 ---

## Fast - API Backend

- Builds the container for the backend/api implementation. 
<details>
<summary>Backend Dockerfile</summary>

```
# Use the Python base image
FROM python:3.9

# Set work directory in the container
WORKDIR /app

# Create a virtual environment
RUN python -m venv /venv

# Activate the virtual environment
ENV PATH="/venv/bin:$PATH"

# Copy the application files to the work directory in the container
COPY ./app/app.py /app/app.py

# Installation of the required python dependencies
COPY ./docker/backend/requirements.txt /app/requirements.txt

# Installation of the required python dependencies
RUN pip install -r /app/requirements.txt

# Installing Rust
RUN apt-get update && apt-get install -y rustc

# Start the FastAPI application with Uvicorn and activate the live reload
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

```
</details>

---

## MLFlow - Modeltracking
- Builds the container for the mlflow instance which is used for the model tracking. 
<details>
<summary>MLFlow Dockerfile</summary>

```
# Use the Python base image
FROM python:3.9

# Set work directory in the container
WORKDIR /mlflow

# Installation of the required Python dependencies for MLflow
RUN pip install mlflow psycopg2-binary sqlalchemy

# Start the MLflow server when starting the container
CMD ["mlflow", "server", "--backend-store-uri", "/mlflow/mlruns", "--default-artifact-root", "/mlflow/mlartifacts", "--host", "0.0.0.0", "--port", "5001"]

```
</details>

---

## Cronjob Implementation
- Builds the container for the mlflow instance which is used for the model tracking. 
<details>
<summary>Cronjob Dockerfile</summary>

```
# Verwenden Sie das Python-Basisimage
FROM python:3.9

# Arbeitsverzeichnis im Container festlegen
WORKDIR /code

# Kopieren Sie die Anwendungsdateien in das Arbeitsverzeichnis im Container
COPY ./development/src/update_data.py /code/update_data.py
COPY ./development/src/update_predictions.py /code/update_predictions.py
COPY ./development/src/retrain_models.py /code/retrain_models.py

# Installieren der erforderlichen python Abhängigkeiten
COPY docker/cron/requirements.txt /code/requirements.txt

# Installieren der erforderlichen Python-Abhängigkeiten
RUN pip install -r /code/requirements.txt

# Updating packages and installing cron
RUN apt-get update && apt-get -y install cron

# Adding crontab to the appropriate location
COPY docker/cron/crontab /etc/cron.d/crontab

# Giving permission to crontab file
RUN chmod 0644 /etc/cron.d/crontab

# Running crontab
RUN /usr/bin/crontab /etc/cron.d/crontab

# Creating entry point for cron 

CMD ["cron","-f", "-l", "2"]

```
</details>

---

<i class="fas fa-folder"></i> Our Dockerfiles can be found in the [/docker directory](https://github.com/UHPDome/backend_mainpost/tree/main/docker){:target="_blank"}. 
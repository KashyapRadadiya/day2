# Day 2: Jenkins CI/CD Pipeline Demo

This is a simple Node.js web application demonstrating CI/CD automation using **Jenkins** and **Docker**.

## Project Overview
- **App**: Minimal Node.js + Express application  
- **Dockerized**: Using a Dockerfile  
- **CI/CD**: Jenkins pipeline automatically builds, tests, and deploys the Docker image on every code push  
- **DockerHub Repository**: kashyapradadiya/simple-node-app 
- **GitHub Repository**: KashyapRadadiya/day2  

## Jenkins Pipeline
The Jenkinsfile defines the following stages:  
1. **Checkout**: Pull latest code from GitHub  
2. **Install dependencies**: Run `npm ci` inside Node Docker container  
3. **Test**: Run Mocha tests and generate JUnit reports  
4. **Build Docker image**: Create Docker image for the app  
5. **Push Docker image**: Push image to DockerHub 
6. **Deploy**: Run Docker container locally on port 3000  

## How to Run
1. Clone the repository  
2. Configure Jenkins job to use the repository and Jenkinsfile  
3. Run the pipeline manually or trigger via SCM polling/webhook  
4. Visit: `http://localhost:3000` → should return JSON `{ "message": "Hello from Jenkins CI/CD by kashyap!!! TASK2 DONE" }`

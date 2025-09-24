pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        // Run npm install inside Node.js container
        bat 'docker run --rm -v "%WORKSPACE%:/work" -w /work node:18 npm ci'
      }
    }

    stage('Test') {
      steps {
        // Create reports folder and run tests inside Node.js container
        bat 'docker run --rm -v "%WORKSPACE%:/work" -w /work node:18 sh -c "mkdir -p reports && npm test"'
      }
      post {
        always {
          junit 'reports/*.xml'
        }
      }
    }

    stage('Build Docker image') {
      steps {
        bat 'docker build -t simple-node-app:%BUILD_NUMBER% .'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat '''
            set IMAGE=%DOCKER_USER%/simple-node-app:%BUILD_NUMBER%
            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
            docker tag simple-node-app:%BUILD_NUMBER% %IMAGE%
            docker push %IMAGE%
          '''
        }
      }
    }

    stage('Deploy (host)') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat '''
            set IMAGE=%DOCKER_USER%/simple-node-app:%BUILD_NUMBER%
            docker rm -f simple-node-app || exit 0
            docker run -d --name simple-node-app -p 3000:3000 %IMAGE%
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Build #${env.BUILD_NUMBER} succeeded."
    }
    failure {
      echo "Build failed. Check console output."
    }
  }
}

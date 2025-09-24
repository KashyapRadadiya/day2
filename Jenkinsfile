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
        // run npm install inside a node container so Jenkins doesn't need node installed
        sh 'docker run --rm -v $WORKSPACE:/work -w /work node:18 npm ci'
      }
    }

    stage('Test') {
      steps {
        // create reports folder and run tests inside node image
        sh 'docker run --rm -v $WORKSPACE:/work -w /work node:18 sh -c "mkdir -p reports && npm test"'
      }
      post {
        always {
          junit 'reports/*.xml'
        }
      }
    }

    stage('Build Docker image') {
      steps {
        // build an image tagged with the Jenkins BUILD_NUMBER
        sh 'docker build -t simple-node-app:${BUILD_NUMBER} .'
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            IMAGE="$DOCKER_USER/simple-node-app:${BUILD_NUMBER}"
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker tag simple-node-app:${BUILD_NUMBER} "$IMAGE"
            docker push "$IMAGE"
          '''
        }
      }
    }

    stage('Deploy (host)') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            IMAGE="$DOCKER_USER/simple-node-app:${BUILD_NUMBER}"
            docker rm -f simple-node-app || true
            docker run -d --name simple-node-app -p 3000:3000 "$IMAGE"
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

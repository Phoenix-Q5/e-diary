pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    DOCKERHUB_NAMESPACE = "bhavyanth02"
    IMAGE_WEB  = "${DOCKERHUB_NAMESPACE}/e-diary-web"
    IMAGE_API = "${DOCKERHUB_NAMESPACE}/e-diary-api"

    DOCKERHUB_CREDS_ID = "docker-creds"

    NODE_ENV = "production"

    VITE_API_URL= "http://localhost:8082"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
        script {
            git branch: 'main',
            url: 'https://github.com/Phoenix-Q5/e-diary.git',
            credentialsId: 'github-creds'
          env.GIT_SHA = sh(script: "git rev-parse --short=7 HEAD", returnStdout: true).trim()
          env.TAG = "${env.BUILD_NUMBER}-${env.GIT_SHA}"
        }
      }
    }

    stage("Docker Build API") {
      steps {
      sh """
      set -e  
          export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:\$PATH"
          docker build --no-cache\
            -f apps/api/Dockerfile \
            -t ${IMAGE_API}:${env.TAG} \
            -t ${IMAGE_API}:latest \
            apps/api
        """
      }
    }

    stage("Docker Build WEB") {
      steps {
      sh """
      set -e  
          export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:\$PATH"    
          docker build --no-cache\
            -f apps/web/Dockerfile \
            --build-arg VITE_API_URL="${VITE_API_URL}" \
            -t ${IMAGE_WEB}:${env.TAG} \
            -t ${IMAGE_WEB}:latest \
            apps/web
        """
      }
    }

    stage("Push to Docker Hub") {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${DOCKERHUB_CREDS_ID}",
          usernameVariable: "DH_USER",
          passwordVariable: "DH_TOKEN"
        )]) {
          sh """
            set -e
            export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:\$PATH"
            echo "\$DH_TOKEN" | docker login -u "\$DH_USER" --password-stdin

            docker push ${IMAGE_API}:${env.TAG}
            docker push ${IMAGE_API}:latest
            docker push ${IMAGE_WEB}:${env.TAG}
            docker push ${IMAGE_WEB}:latest

            docker logout
          """
        }
      }
    }
  }

  // post {
  //   always {
  //     sh """ 
  //     set -e
  //     export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:\$PATH"
  //     docker image prune -f || true 
  //     """
  //     cleanWs()
  //   }
  // }
}

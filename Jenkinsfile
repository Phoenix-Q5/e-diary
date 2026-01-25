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

    stage("Docker Build") {
      steps {
      sh '''
      set -e
      export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
      which docker
      docker --version
      '''
        sh """
          set -e
          docker build \
            -f apps/api/Dockerfile \
            -t ${IMAGE_API}:${env.TAG} \
            -t ${IMAGE_API}:latest \
            apps/api
            
          docker build \
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
          usernameVariable: "bhavyanth02",
          passwordVariable: "Tiger@9959"
        )]) {
          sh """
            set -e
            echo "${DH_TOKEN}" | docker login -u "${DH_USER}" --password-stdin

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

  post {
    always {
      sh "docker image prune -f || true"
      cleanWs()
    }
  }
}

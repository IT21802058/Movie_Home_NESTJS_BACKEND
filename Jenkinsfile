pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'osadha2001'
        IMAGE_NAME = "${DOCKER_HUB_USER}/movie-home-backend"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Build') {
            steps {
                cms /s/bin/sh -c 'npm install'
                cms /s/bin/sh -c 'npm run build'
            }
        }

        stage('Test') {
            steps {
                cms /s/bin/sh -c 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    cms /s/bin/sh -c 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    cms /s/bin/sh -c 'echo "Osadha?2001" | docker login -u $DOCKER_HUB_USER --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                cms /s/bin/sh -c 'docker push $IMAGE_NAME:$IMAGE_TAG'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

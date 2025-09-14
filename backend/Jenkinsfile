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
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Replace with your Docker Hub credentials
                    sh 'echo "Osadha?2001" | docker login -u $DOCKER_HUB_USER --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
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

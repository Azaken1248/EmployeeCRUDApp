pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Tag Image') {
            steps {
                echo 'Building React/Nginx Docker Image...'
                sh 'docker build -t registry.azaken.com/employee-v2-frontend:latest .'
            }
        }

        stage('Push to Private Registry') {
            steps {
                echo 'Pushing to registry.azaken.com...'
                sh 'docker push registry.azaken.com/employee-v2-frontend:latest'
            }
        }
        
        stage('Deploy via Docker Compose') {
            steps {
                echo 'Pulling new image and redeploying frontend...'
                sh '''
                cd /home/aza/employee-deployment
                docker-compose pull employee-v2-app
                docker-compose up -d --no-deps employee-v2-app
                '''
            }
        }
    }
}

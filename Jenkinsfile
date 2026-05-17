pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building React/Nginx Docker Image...'
                sh 'docker build -t employee-v2-frontend:latest .'
            }
        }
        
        stage('Deploy Frontend Container') {
            steps {
                echo 'Stopping and removing old container...'
                sh 'docker rm -f employee-v2-app || true'
                
                echo 'Starting new container...'
                sh '''
                docker run -d \
                  --name employee-v2-app \
                  -p 5001:80 \
                  --restart unless-stopped \
                  employee-v2-frontend:latest
                '''
            }
        }
    }
}

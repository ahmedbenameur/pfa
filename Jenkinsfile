pipeline {
    agent any
    tools {nodejs "node"}
    environment {
        // Define any environment variables needed for your pipeline
        NODE_HOME = '/usr/local/bin/node'
        NPM_HOME = '/usr/local/bin/npm'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                // Install backend dependencies
                sh 'cd Server && npm install'
                // Install frontend dependencies
                sh 'cd EmployeeMs && npm install'
            }
        }

        stage('Build') {
            steps {
                // Build frontend
                sh 'cd EmployeeMs && npm run build'
            }
        }

        stage('Test') {
            steps {
                // Run backend tests
               // sh 'cd Server && npm test'
                // Run frontend tests
               // sh 'cd EmployeeMs && npm test'
                sh 'echo testing'
            }
        }
         stage('Build docker image'){
    steps{
        script{
            sh 'cd EmployeeMs && docker build -t ahmedba77777/frontendj .'
            sh 'cd Server && docker build -t ahmedba77777/backendj .'
        }
    }
}       

         stage('Push image to Hub'){
            steps{
                script{
                   withCredentials([string(credentialsId: 'dockerhubpwd', variable: 'dockerhubpwd')]) {
                   sh 'docker login -u ahmedba77777 -p ${dockerhubpwd}'

}
                   sh 'docker push ahmedba77777/backendj:latest'
                   sh 'docker push ahmedba77777/frontendj:latest'
                }
            }
        }
       stage('Move to deploy-app directory') {
    steps {
        script {
            dir('deploy-app') {
                // Vous pouvez exécuter des commandes spécifiques ici une fois dans le répertoire Server
            }
        }
    }
}

stage('Deploy to k8s') {
    steps {
        script {
            // Assurez-vous que vous êtes dans le bon répertoire pour trouver votre fichier YAML
            dir('deploy-app') {
                // Déployer le fichier YAML sur Kubernetes
                kubernetesDeploy (configs: 'backend-app-deploy.yml', kubeconfigId: 'k8sconfigpwd')
                kubernetesDeploy (configs: 'react-app-deploy.yml', kubeconfigId: 'k8sconfigpwd')
                kubernetesDeploy (configs: 'backend-app-service.yml', kubeconfigId: 'k8sconfigpwd')
                kubernetesDeploy (configs: 'react-app-service.yml', kubeconfigId: 'k8sconfigpwd')
            }
        }
    }
}


    }
      

    post {
        success {
            // Actions to be taken if the pipeline succeeds
            echo 'Pipeline succeeded!'
        }
        failure {
            // Actions to be taken if the pipeline fails
            echo 'Pipeline failed!'
        }
    }
}

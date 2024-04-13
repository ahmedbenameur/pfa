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
            sh 'cd EmployeeMs && docker build -t frontendj .'
            sh 'cd Server && docker build -t backendj .'
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
pipeline {
    agent any
    tools {
        maven "maven" // Ensure "maven" is configured in Global Tool Configuration
      
    }
    environment {
        DOCKER_REGISTRY = 'ahmedba77777'
        PROJECT_NAME = 'microservice-springboot'
    }
    stages {
        stage('Build and Push Microservices') {
            steps {
                script {
                    // List of microservices to build
                    def microservices = ['ConfigService', 'RegistryService', 'GatewayService', 'MemberService-copy', 'ArticleService', 'ToolsService', 'EventService']

                    for (def microserviceName in microservices) {
                        buildAndPushMicroservice(microserviceName)
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                cleanWs() // Ensures it runs within a workspace context
            }
        }
    }
}

def buildAndPushMicroservice(microserviceName) {
    dir(microserviceName) {
        script {


            // Build and push Docker image
            def dockerImageName = "${DOCKER_REGISTRY}/${microserviceName.toLowerCase()}:latest"
            sh "docker build -t ${dockerImageName} ."

            // Push to Docker Hub
           withCredentials([string(credentialsId: 'dockerhubpwd', variable: 'dockerhubpwd')]) {
                   sh 'docker login -u ahmedba77777 -p ${dockerhubpwd}'
               sh "docker push ${dockerImageName}"
            }

            // Run Docker container with specific ports
            def dockerRunCommand = "docker run -d -p "
            switch (microserviceName) {
                case 'ConfigService':
                    dockerRunCommand += "8888:8888"
                    break
                case 'RegistryService':
                    dockerRunCommand += "8761:8761"
                    break
                case 'GatewayService':
                    dockerRunCommand += "9000:9000"
                    break
                case 'EventService':
                    dockerRunCommand += "8081:8081"
                    break
                case 'MemberService-copy':
                    dockerRunCommand += "8085:8085"
                    break
                case 'ToolsService':
                    dockerRunCommand += "8084:8084"
                    break;
                case 'ArticleService':
                    dockerRunCommand += "8082:8082"
                    break;
            }
            dockerRunCommand += " ${dockerImageName}"
            sh dockerRunCommand
        }
    }
}

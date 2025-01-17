pipeline {
    agent any
    tools {
        // Use the installed Maven version
        maven "maven"
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials-id')
        DOCKER_REGISTRY = 'ahmedba77777'
        PROJECT_NAME = 'microservice-springboot'
    }

    stages {
        stage('Build and Push Microservices') {
            steps {
                script {
                    // List of microservices to build
                    def microservices = ['ConfigService', 'RegistryService', 'GatewayService', 'MemberService', 'ArticleService', 'ToolsService', 'EventService']

                    for (def microserviceName in microservices) {
                        buildAndPushMicroservice(microserviceName)
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

def buildAndPushMicroservice(microserviceName) {
    dir(microserviceName) {
        script {
            // Build with Maven
            tool name: 'maven3', type: 'maven'
            sh "mvn clean install"
            
            // Build and push Docker image
            def dockerImageName = "${DOCKER_REGISTRY}/${microserviceName.toLowerCase()}:latest"
            sh "docker build -t ${dockerImageName} ."

            // Push to Docker Hub
            withCredentials([usernamePassword(credentialsId: 'dockerhubpwd', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                sh "docker push ${dockerImageName}"

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
                    case 'MemberService':
                        dockerRunCommand += "8095:8085"
                        break
                    case 'ToolsService':
                        dockerRunCommand += "8084:8084"
                        break
                    case 'ArticleService':
                        dockerRunCommand += "8082:8082"
                        break
                }
                // Add the image name to the run command
                dockerRunCommand += " ${dockerImageName}"
                
                // Run the Docker container
                sh dockerRunCommand
            }
        }
    }
}

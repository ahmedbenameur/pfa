FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the packaged JAR file into the container
COPY target/*.jar Gateway.jar

# Run the application when the container launches
CMD ["java", "-jar", "Gateway.jar"]

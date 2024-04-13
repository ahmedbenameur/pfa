# Use the official Node.js runtime as the base image for the build stage
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app
env MYSQL_USER "root"
env MYSQL_PASSWORD ""
env MYSQL_HOST ""
env MYSQL_DATABASE ""
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Debugging: List files after copying
RUN ls -la

# Use Node.js as the production server
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose port 3000 for the Express server
EXPOSE 3000

# Start your Express app
CMD ["npm", "start"]

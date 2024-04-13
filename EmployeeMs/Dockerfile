# Use the official Node.js runtime as the base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

ENV BACKEND_SERVICE ''

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Debugging: List files in the working directory
RUN ls -la

# Copy the entire application code to the container
COPY . .

# Debugging: List files after copying
RUN ls -la

# Build the React app for production
RUN npm run build

# Debugging: List files after building
RUN ls -la

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html
ENV BACKEND_SERVICE ''

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]

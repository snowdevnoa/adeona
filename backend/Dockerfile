# We're containerizing an Express app from the beginning without installing Node or npm locally, so create a package.json and add express as a dependency.
# also create a src folder and index.js with a basic Hello World example.
# Add nodemon as a dev dependency  to enable hot reloading inside a Docker container.
# Docker’s mounted volumes don’t reliably emit file system events, so we enable legacy polling.
# This ensures that nodemon can detect code changes even within a containerized environment.

# Determine base image
FROM node:24-slim

# Set working directory in container
WORKDIR /app

# Set node environment
ENV NODE_ENV=development

# Copy package.json before running npm install, for layer caching
COPY package*.json ./

# Install express
RUN npm install

# Copy remaining source code AFTER installing dependencies into container
COPY . .

# Expose port and document port number
EXPOSE 3000

# Start the server with nodemon for hot reloading
CMD ["npm", "run", "dev"]

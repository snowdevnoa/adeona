# We're containerizing a Next app from the beginning without installing Node or npm locally, so create a package.json and add next and react as a dependency.
# Docker’s mounted volumes don’t reliably emit file system events, so we enable legacy polling.

# Determine base image
FROM node:24-slim

# Set working directory in container
WORKDIR /app

# Set node environment
ENV NODE_ENV=development

# Enable hot reloading via polling in Turbopack
ENV WATCHPACK_POLLING=true

# Copy package.json before running npm install, for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining source code AFTER installing dependencies into container
COPY . .

# Expose the port
EXPOSE 3001

#Start the development server
CMD ["npm", "run", "dev"]
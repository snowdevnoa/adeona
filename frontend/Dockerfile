# 1. DEPS Stage: Install everything (Dev + Prod)
FROM node:24-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. DEV Stage: For local development (self note: set docker compose file to target stage)
FROM node:24-slim AS dev
WORKDIR /app
# We need the full node_modules for dev (HMR, Linters, etc.)
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
ENV WATCHPACK_POLLING=true
#Define default port
ENV PORT=3001 
EXPOSE 3001
CMD ["npm", "run", "dev"]

# 3. BUILDER Stage: Where the heavy lifting happens
# Railway will run this part automatically on its way to the last stage
FROM node:24-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Define the ARGs from the cloud provider or CLI
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PRIVATE_API_URL

# Convert them to ENVs so 'npm run build' can see them
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PRIVATE_API_URL=$NEXT_PRIVATE_API_URL
# Perform the production build
RUN npm run build
# Remove devDependencies (Tailwind, ESLint) to save RAM
RUN npm prune --production

# 4. PRODUCTION Stage: The final imagg for production
FROM node:24-slim AS production
WORKDIR /app
# Fix: No spaces in ENV, use production
ENV NODE_ENV=production

# Copy only build artifacts and pruned modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

#Default port of cloud providers
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
# 1. DEPS Stage
FROM node:24-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. DEV Stage: For local development (self note: set docker compose file to target stage)FROM node:24-slim AS dev
FROM node:24-slim AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 3. BUILDER Stage: Transpile JS/TS to dist/
FROM node:24-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. PRODUCTION Stage: Lean runner
FROM node:24-slim AS production
WORKDIR /app
ENV NODE_ENV=production

# Re-install only production deps to keep image tiny
COPY --from=deps /app/package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy the compiled JS from the builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/app.js"]

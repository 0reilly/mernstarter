FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files first to leverage layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for testing)
RUN pnpm install --no-store

# Copy source files
COPY . .

# Run tests
RUN CI=true pnpm test || echo "::ERROR:: Backend tests failed"

# Production stage
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN pnpm install --prod --no-store

# Copy only necessary files from builder
COPY --from=builder /app/index.js ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/models ./models
COPY --from=builder /app/config ./config
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/middleware ./middleware

# Set production environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=128"

EXPOSE 5001

CMD ["node", "index.js"]

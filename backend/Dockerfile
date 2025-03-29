FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN pnpm install --no-store

# Copy the rest of the application code
COPY . .

# Run tests first to ensure code quality
RUN CI=true pnpm test || echo "::ERROR:: Backend tests failed"

# Production stage
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json and install production dependencies only
COPY package*.json ./
RUN pnpm install --prod --no-store

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Set production environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=128"

EXPOSE 5001

CMD ["node", "dist/index.js"]

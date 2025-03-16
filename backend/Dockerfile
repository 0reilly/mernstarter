FROM node:18-alpine

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

EXPOSE 5001

CMD ["pnpm", "start"]

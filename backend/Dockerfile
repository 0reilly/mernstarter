FROM node:18-slim

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Run tests
RUN pnpm test -- --detectOpenHandles --forceExit

EXPOSE 5001

CMD ["pnpm", "start"]

FROM node:18-alpine

# Install pnpm and serve
RUN npm install -g pnpm serve

WORKDIR /app

# Add build argument
ARG PROJECT_ID

# Set environment variables
ENV PUBLIC_URL=/preview/app/${PROJECT_ID}
ENV REACT_APP_BASE_PATH=/preview/app/${PROJECT_ID}
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider"

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN pnpm install --no-store

# Copy the rest of the application code
COPY . .

RUN pnpm run build:css

RUN pnpm run build

EXPOSE 3001

# Use serve to handle client-side routing and base path
CMD ["serve", "-s", "build", "-l", "3001", "--cors", "--no-clipboard", "--single"]

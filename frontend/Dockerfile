FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider"

RUN pnpm run build:css

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "start"]

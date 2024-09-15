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

RUN pnpm run build

RUN pnpm run build:css

RUN CI=true pnpm run test

EXPOSE 3001

CMD ["pnpm", "start"]

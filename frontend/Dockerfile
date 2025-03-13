FROM node:18-alpine

# Install pnpm and tailwindcss globally
RUN npm install -g pnpm
RUN npm install -g tailwindcss

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies with proper flags to handle pnpm permission issues
RUN pnpm install --no-store --shamefully-hoist

# Install @tailwindcss/postcss for Tailwind CSS v4 compatibility
RUN pnpm add -D @tailwindcss/postcss

# Copy the rest of the application code
COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider"
ENV PATH=/app/node_modules/.bin:$PATH

# Skip the tailwindcss build step as it will be handled by the main build process
# through the PostCSS plugin

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "start"]

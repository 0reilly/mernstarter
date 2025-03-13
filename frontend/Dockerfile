FROM node:18-alpine

# Install pnpm and tailwindcss globally
RUN npm install -g pnpm
RUN npm install -g tailwindcss

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies with proper flags to handle pnpm permission issues
RUN pnpm install --no-store --shamefully-hoist

# Copy the rest of the application code
COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_OPTIONS="--max-old-space-size=4096 --openssl-legacy-provider"
ENV PATH=/app/node_modules/.bin:$PATH

# Run tailwindcss directly with npx to ensure it's found in the path
RUN npx tailwindcss -i src/index.css -o src/tailwind.output.css || echo "Tailwind CSS build failed, continuing"

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "start"]

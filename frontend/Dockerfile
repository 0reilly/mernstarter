FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Create a .npmrc file to help with pnpm config
RUN echo "shamefully-hoist=true\nstrict-peer-dependencies=false\nnode-linker=hoisted" > .npmrc

# Install dependencies including Tailwind CSS and its PostCSS plugin
RUN pnpm install
RUN pnpm install -D tailwindcss @tailwindcss/postcss postcss

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

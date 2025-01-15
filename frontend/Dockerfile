FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV CI=false

# Build the app
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

EXPOSE 3001

# Serve the app with the correct base path
CMD ["serve", "-s", "build", "-l", "3001"]
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
# Use Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
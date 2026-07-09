# Use node alpine base image for lightweight container
FROM node:18-alpine

WORKDIR /app

# Install system dependencies needed for some node builds
RUN apk add --no-cache libc6-compat

# Install node dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Generate Prisma Client mappings inside the node_modules directory
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment defaults
ENV PORT=3000
ENV NODE_ENV=production

# Start production server
CMD ["npm", "run", "start"]

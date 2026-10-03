# Use node alpine base image for lightweight container
FROM node:18-alpine AS base

WORKDIR /app

# Install system dependencies needed for native modules and Prisma
RUN apk add --no-cache libc6-compat openssl

# Install node dependencies
COPY package*.json ./
RUN npm ci

# Stage for development (live reload with local code mounted)
FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npm run dev"]

# Stage for building production application
FROM base AS builder
WORKDIR /app
COPY . .
RUN npx prisma generate
RUN npm run build

# Production runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache libc6-compat openssl
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npm run start"]

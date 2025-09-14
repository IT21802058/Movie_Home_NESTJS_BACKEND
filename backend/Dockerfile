# Dockerfile

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Install all (including dev) to run build
RUN npm ci

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build


# Stage 2: Run
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user (security best practice)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package.json and node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Use non-root user
USER nextjs

# App listens on port 5000
EXPOSE 5000

# Start the app
CMD ["node", "dist/main"]

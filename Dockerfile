# Multi-stage build for optimized production image
FROM node:24-alpine AS development-dependencies-env
COPY package.json package-lock.json ./
WORKDIR /app
RUN npm ci

FROM node:24-alpine AS production-dependencies-env
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:24-alpine AS build-env
COPY package.json package-lock.json /app/
WORKDIR /app
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
COPY . /app/
RUN npm run build

# Production image
FROM node:24-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built application
COPY --from=build-env /app/build ./build

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (default React Router port, can be overridden via PORT env var)
EXPOSE 3000

# Health check for AWS services (port can be overridden via PORT env var)
# Note: AWS ECS/App Runner will use their own health checks configured in the service
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const http=require('http');const port=process.env.PORT||3000;http.get(`http://localhost:${port}/health`,(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

# Start the application
CMD ["npm", "run", "start"]
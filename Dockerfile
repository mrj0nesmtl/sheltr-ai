# Multi-stage Dockerfile for SHELTR platform
# Optimized for production deployment and security scanning

# ================================
# Frontend Build Stage
# ================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/web
COPY apps/web/package*.json ./
RUN npm ci --only=production

COPY apps/web/ ./
RUN npm run build

# ================================
# Backend Build Stage  
# ================================
FROM python:3.11-slim AS backend-builder

WORKDIR /app/api
COPY apps/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/ ./

# ================================
# Production Runtime Stage
# ================================
FROM node:18-alpine AS runtime

# Install Python for backend
RUN apk add --no-cache python3 py3-pip

# Create non-root user for security
RUN addgroup -g 1001 -S sheltr && \
    adduser -S sheltr -u 1001

# Set working directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder --chown=sheltr:sheltr /app/web/out ./public
COPY --from=frontend-builder --chown=sheltr:sheltr /app/web/next.config.ts ./

# Copy backend
COPY --from=backend-builder --chown=sheltr:sheltr /app/api ./api

# Install backend dependencies in runtime
COPY apps/api/requirements.txt ./api/
RUN pip install --no-cache-dir -r ./api/requirements.txt

# Set proper permissions
RUN chown -R sheltr:sheltr /app

# Switch to non-root user
USER sheltr

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose ports
EXPOSE 3000 8000

# Default command (can be overridden)
CMD ["npm", "start"]

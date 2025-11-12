# Build frontend
FROM node:22-alpine AS frontend-builder

ARG VITE_OPENAI_API_KEY
ARG VITE_OPENAI_API_ENDPOINT
ARG VITE_LLM_MODEL_NAME
ARG VITE_API_URL=http://localhost
ARG VITE_HIDE_CHARTDB_CLOUD
ARG VITE_DISABLE_ANALYTICS
ARG VITE_APP_URL
ARG VITE_HOST_URL
ARG VITE_IS_CHARTDB_IO=false

WORKDIR /usr/src/frontend

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN echo "VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}" > .env && \
    echo "VITE_OPENAI_API_ENDPOINT=${VITE_OPENAI_API_ENDPOINT}" >> .env && \
    echo "VITE_LLM_MODEL_NAME=${VITE_LLM_MODEL_NAME}" >> .env && \
    echo "VITE_API_URL=${VITE_API_URL}" >> .env && \
    echo "VITE_HIDE_CHARTDB_CLOUD=${VITE_HIDE_CHARTDB_CLOUD}" >> .env && \
    echo "VITE_DISABLE_ANALYTICS=${VITE_DISABLE_ANALYTICS}" >> .env && \
    echo "VITE_APP_URL=${VITE_APP_URL}" >> .env && \
    echo "VITE_HOST_URL=${VITE_HOST_URL}" >> .env && \
    echo "VITE_IS_CHARTDB_IO=${VITE_IS_CHARTDB_IO}" >> .env

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Build backend
FROM node:22-alpine AS backend-builder

WORKDIR /usr/src/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ .
RUN npm run build

# Production image with both frontend (nginx) and backend (node)
FROM node:22-alpine AS production

# Install nginx and gettext (for envsubst)
RUN apk add --no-cache nginx gettext

WORKDIR /usr/src/app

# Setup backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --production
COPY --from=backend-builder /usr/src/backend/dist ./dist

# Setup frontend
COPY --from=frontend-builder /usr/src/frontend/dist /usr/share/nginx/html
COPY ./default.conf.template /etc/nginx/http.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
COPY start-services.sh /start-services.sh
RUN chmod +x /entrypoint.sh /start-services.sh && \
    mkdir -p /run/nginx

# Backend environment variables with defaults
ENV PORT=3000
ENV FRONTEND_URL=http://localhost
ENV DIAGRAM_TTL=0
# REDIS_URL should be passed at runtime via docker run -e REDIS_URL=...

# Expose both ports
EXPOSE 80 3000

# Start both services
CMD ["/start-services.sh"]

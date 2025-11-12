#!/bin/sh
set -e

# Replace placeholders in nginx.conf
envsubst '${OPENAI_API_KEY} ${OPENAI_API_ENDPOINT} ${LLM_MODEL_NAME} ${HIDE_CHARTDB_CLOUD} ${DISABLE_ANALYTICS}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

echo "Nginx configuration generated successfully"

# Test nginx configuration
nginx -t

echo "Starting nginx in foreground mode..."

# Start Nginx in foreground
exec nginx -g "daemon off;"

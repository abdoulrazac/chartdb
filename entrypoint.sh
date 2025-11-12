#!/bin/sh

# Replace placeholders in nginx.conf
envsubst '${OPENAI_API_KEY} ${OPENAI_API_ENDPOINT} ${LLM_MODEL_NAME} ${HIDE_CHARTDB_CLOUD} ${DISABLE_ANALYTICS}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

# Start Nginx
nginx -g "daemon off;"

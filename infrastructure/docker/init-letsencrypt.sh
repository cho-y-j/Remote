#!/bin/bash
# init-letsencrypt.sh — First-time SSL certificate setup for desk.on1.kr
# Usage: sudo bash init-letsencrypt.sh

set -e

DOMAIN="desk.on1.kr"
EMAIL="support@on1.kr"
DATA_PATH="./certbot"

echo "### Starting Let's Encrypt certificate setup for $DOMAIN ..."

# Check if certificate already exists
if [ -d "$DATA_PATH/conf/live/$DOMAIN" ]; then
  echo "### Certificate already exists. Skipping initial setup."
  echo "### To force renewal, delete $DATA_PATH/conf/live/$DOMAIN and re-run."
  exit 0
fi

# Create required directories
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"
mkdir -p "$DATA_PATH/www"

# Download recommended TLS parameters
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$DATA_PATH/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"
fi

# Create dummy certificate so nginx can start
echo "### Creating dummy certificate for $DOMAIN ..."
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout "$DATA_PATH/conf/live/$DOMAIN/privkey.pem" \
  -out "$DATA_PATH/conf/live/$DOMAIN/fullchain.pem" \
  -subj "/CN=$DOMAIN" 2>/dev/null

echo "### Starting nginx with dummy certificate ..."
docker compose up -d nginx

echo "### Waiting for nginx to start ..."
sleep 5

# Delete dummy certificate
echo "### Removing dummy certificate ..."
rm -rf "$DATA_PATH/conf/live/$DOMAIN"

# Request real certificate from Let's Encrypt
echo "### Requesting Let's Encrypt certificate for $DOMAIN ..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "### Reloading nginx with real certificate ..."
docker compose exec nginx nginx -s reload

echo "### Done! SSL certificate has been set up for $DOMAIN"
echo "### Certificate will auto-renew via the certbot container."

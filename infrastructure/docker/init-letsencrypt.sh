#!/bin/bash
# init-letsencrypt.sh — First-time SSL certificate setup for desk.on1.kr
# Usage: sudo bash init-letsencrypt.sh

set -e

DOMAIN="desk.on1.kr"
EMAIL="support@on1.kr"
DATA_PATH="./certbot"
NGINX_CONF="./nginx"

echo "### Starting Let's Encrypt certificate setup for $DOMAIN ..."

# Check if certificate already exists
if [ -d "$DATA_PATH/conf/live/$DOMAIN" ]; then
  echo "### Certificate already exists. Switching to SSL config..."
  cp "$NGINX_CONF/ssl.conf" "$NGINX_CONF/default.conf"
  docker compose exec nginx nginx -s reload 2>/dev/null || docker compose restart nginx
  echo "### Done! SSL is now active."
  exit 0
fi

# Create required directories
mkdir -p "$DATA_PATH/www"

# Step 1: Make sure nginx is running with HTTP-only config
echo "### Ensuring HTTP-only nginx config..."
docker compose up -d --no-deps nginx
sleep 3

# Step 2: Request certificate from Let's Encrypt
echo "### Requesting Let's Encrypt certificate for $DOMAIN ..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

# Step 3: Switch to SSL config
echo "### Switching to SSL config..."
cp "$NGINX_CONF/ssl.conf" "$NGINX_CONF/default.conf"

# Step 4: Restart nginx with SSL
echo "### Restarting nginx with SSL..."
docker compose restart nginx

echo "### Done! SSL certificate has been set up for $DOMAIN"
echo "### Site is now available at https://$DOMAIN"

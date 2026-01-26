#!/bin/bash

# Configuration
domains=(nio-far-tourisme.com www.nio-far-tourisme.com)
email="admin@nio-far-tourisme.com"
staging=0
rsa_key_size=4096
data_path="./certbot"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Initializing SSL certificate setup for nio-far-tourisme.com${NC}"
echo ""

# Check if certificates already exist
if [ -d "$data_path/conf/live/${domains[0]}" ]; then
  echo -e "${YELLOW}Existing certificates found. Do you want to replace them? (y/N)${NC}"
  read -p "" decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    echo -e "${GREEN}Keeping existing certificates.${NC}"
    exit 0
  fi
fi

# Download recommended TLS parameters if not present
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo -e "${GREEN}Downloading recommended TLS parameters...${NC}"
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo ""
fi

# Create dummy certificate for initial nginx startup
echo -e "${GREEN}Creating dummy certificate for ${domains[0]}...${NC}"
path="/etc/letsencrypt/live/${domains[0]}"
mkdir -p "$data_path/conf/live/${domains[0]}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo ""

# Start nginx with dummy certificate
echo -e "${GREEN}Starting nginx...${NC}"
docker-compose up --force-recreate -d web
echo ""

# Delete dummy certificate
echo -e "${GREEN}Deleting dummy certificate for ${domains[0]}...${NC}"
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${domains[0]} && \
  rm -Rf /etc/letsencrypt/archive/${domains[0]} && \
  rm -Rf /etc/letsencrypt/renewal/${domains[0]}.conf" certbot
echo ""

# Request Let's Encrypt certificate
echo -e "${GREEN}Requesting Let's Encrypt certificate for ${domains[0]}...${NC}"

# Join domains for certbot
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Set staging mode if needed
staging_arg=""
if [ $staging != "0" ]; then
  staging_arg="--staging"
  echo -e "${YELLOW}Using staging server (test mode)${NC}"
fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $domain_args \
    --email $email \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal \
    --non-interactive" certbot
echo ""

# Reload nginx to load the new certificate
echo -e "${GREEN}Reloading nginx...${NC}"
docker-compose exec web nginx -s reload

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL certificate setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your site should now be accessible at:"
echo -e "${GREEN}https://nio-far-tourisme.com${NC}"
echo ""
echo -e "Certificate will auto-renew every 12 hours."

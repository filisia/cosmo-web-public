#!/bin/bash

# HTTPS Setup Script for Cosmo Bridge
# This script automates the setup of HTTPS with secure WebSocket connections

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="bridge.explorecosmo.com"
EMAIL="your-email@example.com"  # Change this to your email
PROXY_PORT="8443"

echo -e "${GREEN}🔒 HTTPS Setup for Cosmo Bridge${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}Email: ${EMAIL}${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo -e "${RED}❌ This script must be run as root (use sudo)${NC}"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    
    if command_exists apt; then
        # Ubuntu/Debian
        apt update
        apt install -y nginx certbot python3-certbot-nginx curl
    elif command_exists yum; then
        # CentOS/RHEL
        yum install -y nginx certbot python3-certbot-nginx curl
    else
        echo -e "${RED}❌ Unsupported package manager${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to setup SSL certificate
setup_ssl() {
    echo -e "${YELLOW}🔐 Setting up SSL certificate...${NC}"
    
    # Stop nginx temporarily for certificate generation
    systemctl stop nginx 2>/dev/null || true
    
    # Get SSL certificate
    certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
    
    echo -e "${GREEN}✅ SSL certificate obtained${NC}"
}

# Function to setup nginx configuration
setup_nginx() {
    echo -e "${YELLOW}🌐 Setting up Nginx configuration...${NC}"
    
    # Create nginx configuration
    cat > /etc/nginx/sites-available/cosmoweb << EOF
server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Serve the React app
    location / {
        root /var/www/cosmoweb;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # WebSocket proxy to local bridge
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket specific settings
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
        proxy_connect_timeout 86400;
        
        # CORS headers for WebSocket
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range" always;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}
EOF
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/cosmoweb /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    nginx -t
    
    # Start nginx
    systemctl start nginx
    systemctl enable nginx
    
    echo -e "${GREEN}✅ Nginx configuration completed${NC}"
}

# Function to setup WebSocket proxy
setup_websocket_proxy() {
    echo -e "${YELLOW}🔌 Setting up WebSocket proxy...${NC}"
    
    # Install Node.js if not present
    if ! command_exists node; then
        echo -e "${YELLOW}📦 Installing Node.js...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Create proxy directory
    mkdir -p /opt/cosmo-proxy
    
    # Copy proxy files
    cp websocket-proxy.js /opt/cosmo-proxy/
    cp websocket-proxy-package.json /opt/cosmo-proxy/package.json
    
    # Install proxy dependencies
    cd /opt/cosmo-proxy
    npm install
    
    # Update proxy configuration
    sed -i "s|sslCert: '/path/to/your/certificate.crt'|sslCert: '/etc/letsencrypt/live/$DOMAIN/fullchain.pem'|g" websocket-proxy.js
    sed -i "s|sslKey: '/path/to/your/private.key'|sslKey: '/etc/letsencrypt/live/$DOMAIN/privkey.pem'|g" websocket-proxy.js
    sed -i "s|allowedOrigins: \['https://bridge.explorecosmo.com'\]|allowedOrigins: ['https://$DOMAIN']|g" websocket-proxy.js
    
    # Start proxy with PM2
    pm2 start websocket-proxy.js --name "cosmo-proxy"
    pm2 startup
    pm2 save
    
    echo -e "${GREEN}✅ WebSocket proxy setup completed${NC}"
}

# Function to setup firewall
setup_firewall() {
    echo -e "${YELLOW}🔥 Setting up firewall...${NC}"
    
    if command_exists ufw; then
        # Ubuntu/Debian
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw allow $PROXY_PORT/tcp
        ufw --force enable
    elif command_exists firewall-cmd; then
        # CentOS/RHEL
        firewall-cmd --permanent --add-port=80/tcp
        firewall-cmd --permanent --add-port=443/tcp
        firewall-cmd --permanent --add-port=$PROXY_PORT/tcp
        firewall-cmd --reload
    fi
    
    echo -e "${GREEN}✅ Firewall configured${NC}"
}

# Function to setup automatic renewal
setup_renewal() {
    echo -e "${YELLOW}🔄 Setting up automatic certificate renewal...${NC}"
    
    # Add renewal to crontab
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    echo -e "${GREEN}✅ Automatic renewal configured${NC}"
}

# Function to test setup
test_setup() {
    echo -e "${YELLOW}🧪 Testing setup...${NC}"
    
    # Test HTTPS
    if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
        echo -e "${GREEN}✅ HTTPS working${NC}"
    else
        echo -e "${RED}❌ HTTPS not working${NC}"
    fi
    
    # Test WebSocket proxy
    if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN:$PROXY_PORT/health | grep -q "200"; then
        echo -e "${GREEN}✅ WebSocket proxy working${NC}"
    else
        echo -e "${RED}❌ WebSocket proxy not working${NC}"
    fi
    
    # Test redirect
    if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "301"; then
        echo -e "${GREEN}✅ HTTP to HTTPS redirect working${NC}"
    else
        echo -e "${RED}❌ HTTP to HTTPS redirect not working${NC}"
    fi
}

# Function to display final information
display_info() {
    echo ""
    echo -e "${GREEN}🎉 HTTPS Setup Complete!${NC}"
    echo ""
    echo -e "${BLUE}📋 Configuration Summary:${NC}"
    echo -e "   Domain: ${DOMAIN}"
    echo -e "   HTTPS: https://${DOMAIN}"
    echo -e "   WebSocket: wss://${DOMAIN}/ws (via Nginx)"
    echo -e "   WebSocket Proxy: wss://${DOMAIN}:${PROXY_PORT} (via Node.js)"
    echo ""
    echo -e "${BLUE}🔧 Next Steps:${NC}"
    echo -e "   1. Upload your React app to /var/www/cosmoweb/"
    echo -e "   2. Update public/config.js with the WebSocket URL"
    echo -e "   3. Ensure your Cosmo Bridge is running on port 8080"
    echo -e "   4. Test the connection"
    echo ""
    echo -e "${BLUE}📊 Monitoring:${NC}"
    echo -e "   PM2 Status: pm2 status"
    echo -e "   Nginx Status: systemctl status nginx"
    echo -e "   Certificate Status: certbot certificates"
    echo ""
    echo -e "${BLUE}🛠 Troubleshooting:${NC}"
    echo -e "   Nginx Logs: tail -f /var/log/nginx/error.log"
    echo -e "   Proxy Logs: pm2 logs cosmo-proxy"
    echo -e "   Test WebSocket: wscat -c wss://${DOMAIN}/ws"
}

# Main execution
main() {
    check_root
    
    echo -e "${YELLOW}⚠️  This script will:${NC}"
    echo -e "   - Install Nginx and Certbot"
    echo -e "   - Obtain SSL certificate for ${DOMAIN}"
    echo -e "   - Configure Nginx with HTTPS"
    echo -e "   - Setup WebSocket proxy"
    echo -e "   - Configure firewall"
    echo -e "   - Setup automatic certificate renewal"
    echo ""
    
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Setup cancelled${NC}"
        exit 1
    fi
    
    install_dependencies
    setup_ssl
    setup_nginx
    setup_websocket_proxy
    setup_firewall
    setup_renewal
    test_setup
    display_info
}

# Run main function
main "$@" 
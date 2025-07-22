#!/bin/bash

# CosmoWeb Deployment Script
# Usage: ./deploy.sh [server-ip] [username] [domain] [websocket-url]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP=${1:-"your-server-ip"}
USERNAME=${2:-"your-username"}
DOMAIN=${3:-"your-domain.com"}
WS_URL=${4:-"ws://localhost:8080"}
REMOTE_PATH="/var/www/cosmoweb"

echo -e "${GREEN}🚀 Starting CosmoWeb deployment...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the cosmoweb directory.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Step 2: Build the application
echo -e "${YELLOW}🔨 Building for production...${NC}"
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Error: Build failed. build/ directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Step 3: Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
echo -e "${YELLOW}   Server: ${SERVER_IP}${NC}"
echo -e "${YELLOW}   User: ${USERNAME}${NC}"
echo -e "${YELLOW}   Path: ${REMOTE_PATH}${NC}"

# Create remote directory if it doesn't exist
ssh ${USERNAME}@${SERVER_IP} "sudo mkdir -p ${REMOTE_PATH} && sudo chown ${USERNAME}:${USERNAME} ${REMOTE_PATH}"

# Upload files using rsync
rsync -avz --delete build/ ${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/

echo -e "${GREEN}✅ Upload completed!${NC}"

# Step 4: Set proper permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
ssh ${USERNAME}@${SERVER_IP} "sudo chown -R www-data:www-data ${REMOTE_PATH} && sudo chmod -R 755 ${REMOTE_PATH}"

# Step 5: Restart web server
echo -e "${YELLOW}🔄 Restarting web server...${NC}"
ssh ${USERNAME}@${SERVER_IP} "sudo systemctl reload nginx"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your application should be available at: http://${DOMAIN}${NC}"

# Optional: Check if the site is accessible
echo -e "${YELLOW}🔍 Checking if the site is accessible...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://${DOMAIN} | grep -q "200"; then
    echo -e "${GREEN}✅ Site is accessible!${NC}"
else
    echo -e "${YELLOW}⚠️  Site might not be accessible yet. Please check your DNS and server configuration.${NC}"
fi

echo -e "${GREEN}🎉 Deployment script completed!${NC}" 
# CosmoWeb Deployment Guide

This guide covers deploying the CosmoWeb React application to a standard Linux hosting environment.

## Prerequisites

- Node.js 16+ and npm installed on your local machine
- Access to a Linux server (VPS, cloud instance, or shared hosting)
- SSH access to the server (for VPS/cloud deployments)
- Domain name (optional but recommended)

## Local Build Process

### 1. Install Dependencies
```bash
cd cosmoweb
npm install
```

### 2. Build for Production
```bash
npm run build
```

This creates a `build/` directory with optimized static files ready for deployment.

## Deployment Options

### Option 1: VPS/Cloud Server (Recommended)

#### Server Setup
1. **Connect to your server via SSH**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js and npm** (if not already installed)
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **Install a web server** (Nginx recommended)
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx

   # CentOS/RHEL
   sudo yum install nginx
   ```

#### Deploy the Application

1. **Upload your build files**
   ```bash
   # From your local machine
   scp -r cosmoweb/build/* user@your-server-ip:/var/www/cosmoweb/
   
   # Or use rsync for better performance
   rsync -avz --delete cosmoweb/build/ user@your-server-ip:/var/www/cosmoweb/
   ```

2. **Set up Nginx configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/cosmoweb
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       root /var/www/cosmoweb;
       index index.html;

       # Handle React Router
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
   }
   ```

3. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/cosmoweb /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Set up SSL with Let's Encrypt** (recommended)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### Option 2: Shared Hosting (cPanel, etc.)

1. **Build locally**
   ```bash
   cd cosmoweb
   npm install
   npm run build
   ```

2. **Upload via FTP/SFTP**
   - Connect to your hosting via FTP client (FileZilla, etc.)
   - Upload all contents of the `build/` directory to your `public_html/` folder

3. **Create .htaccess file** (for Apache)
   Create a `.htaccess` file in your `public_html/` directory:
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]

   # Cache static assets
   <IfModule mod_expires.c>
       ExpiresActive on
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/jpg "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/gif "access plus 1 year"
       ExpiresByType image/ico "access plus 1 year"
       ExpiresByType image/svg+xml "access plus 1 year"
   </IfModule>
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   # Use nginx to serve static files
   FROM nginx:alpine
   
   # Copy built files
   COPY build/ /usr/share/nginx/html/
   
   # Copy custom nginx config
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   
   # Expose port 80
   EXPOSE 80
   
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Build and run**
   ```bash
   docker build -t cosmoweb .
   docker run -p 80:80 cosmoweb
   ```

## Environment Configuration

### WebSocket Connection
The app connects to the Cosmo Bridge via WebSocket. You'll need to:

1. **Update WebSocket URL** in production
   - Modify `cosmoweb/src/services/WebSocketService.js` to use your production WebSocket URL
   - Or use environment variables

2. **Set up environment variables**
   Create `.env.production` file:
   ```env
   REACT_APP_WS_URL=wss://your-websocket-server.com
   ```

## Automated Deployment Script

Create a deployment script `deploy.sh`:
```bash
#!/bin/bash

# Build the application
echo "Building CosmoWeb..."
npm install
npm run build

# Upload to server (replace with your server details)
echo "Uploading to server..."
rsync -avz --delete build/ user@your-server-ip:/var/www/cosmoweb/

# Restart services
echo "Restarting services..."
ssh user@your-server-ip "sudo systemctl reload nginx"

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Troubleshooting

### Common Issues

1. **404 errors on page refresh**
   - Ensure your web server is configured to serve `index.html` for all routes
   - Check the Nginx/Apache configuration above

2. **WebSocket connection fails**
   - Verify the WebSocket server is running and accessible
   - Check firewall settings
   - Ensure the WebSocket URL is correct

3. **Static assets not loading**
   - Check file permissions on the server
   - Verify the build directory was uploaded completely
   - Check web server logs for errors

### Useful Commands

```bash
# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Check file permissions
ls -la /var/www/cosmoweb/

# Test nginx configuration
sudo nginx -t
```

## Performance Optimization

1. **Enable gzip compression** in Nginx:
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

2. **Set up CDN** for static assets (optional)
3. **Enable browser caching** (already included in configs above)

## Security Considerations

1. **HTTPS**: Always use SSL/TLS in production
2. **Security headers**: Included in Nginx configuration
3. **Keep dependencies updated**: Regularly run `npm audit`
4. **Firewall**: Configure server firewall appropriately

## Monitoring

1. **Set up log monitoring**
2. **Configure uptime monitoring**
3. **Set up error tracking** (Sentry, etc.)

## Backup Strategy

1. **Regular backups** of the deployed files
2. **Version control** for configuration files
3. **Database backups** (if applicable)

---

For additional support, refer to the CosmoWeb documentation in the `cosmowebdocs/` directory. 
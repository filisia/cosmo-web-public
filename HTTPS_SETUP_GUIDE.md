# HTTPS Setup Guide for Cosmo Bridge

## 🔒 **Why HTTPS is Essential**

- **Security**: Protects user data and communications
- **Trust**: Modern browsers require HTTPS for many features
- **SEO**: Better search engine rankings
- **User Experience**: No security warnings or mixed content issues

## 🚀 **Solution Options**

### **Option 1: Nginx Reverse Proxy (Recommended)**

#### **Step 1: Install Nginx**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### **Step 2: Configure SSL Certificate**
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d bridge.explorecosmo.com
```

#### **Step 3: Use the Provided Nginx Config**
Copy `nginx-ssl-proxy.conf` to `/etc/nginx/sites-available/cosmoweb`:
```bash
sudo cp nginx-ssl-proxy.conf /etc/nginx/sites-available/cosmoweb
```

Update the SSL certificate paths in the config file:
```nginx
ssl_certificate /etc/letsencrypt/live/bridge.explorecosmo.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/bridge.explorecosmo.com/privkey.pem;
```

#### **Step 4: Enable the Site**
```bash
sudo ln -s /etc/nginx/sites-available/cosmoweb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Option 2: Node.js Proxy Server**

#### **Step 1: Install Dependencies**
```bash
cd cosmoweb
npm install ws
```

#### **Step 2: Get SSL Certificate**
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d bridge.explorecosmo.com
```

#### **Step 3: Update Proxy Configuration**
Edit `websocket-proxy.js`:
```javascript
const config = {
  bridgeUrl: 'ws://localhost:8080',
  proxyPort: 8443,
  sslCert: '/etc/letsencrypt/live/bridge.explorecosmo.com/fullchain.pem',
  sslKey: '/etc/letsencrypt/live/bridge.explorecosmo.com/privkey.pem',
  allowedOrigins: ['https://bridge.explorecosmo.com']
};
```

#### **Step 4: Run the Proxy Server**
```bash
# Start the proxy server
node websocket-proxy.js

# Or use PM2 for production
npm install -g pm2
pm2 start websocket-proxy.js --name "cosmo-proxy"
pm2 startup
pm2 save
```

### **Option 3: Cloudflare Workers**

#### **Step 1: Create Cloudflare Account**
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update DNS to use Cloudflare nameservers

#### **Step 2: Deploy Worker**
1. Go to Workers & Pages in Cloudflare dashboard
2. Create a new Worker
3. Copy the code from `cloudflare-worker.js`
4. Deploy the worker

#### **Step 3: Configure Custom Domain**
1. Add custom domain: `wss.bridge.explorecosmo.com`
2. Update `config.js` to use the worker URL

## 🔧 **Configuration Updates**

### **Update Runtime Configuration**
Edit `public/config.js`:
```javascript
window.COSMO_CONFIG = {
  wsUrl: 'wss://bridge.explorecosmo.com/ws',  // For Nginx proxy
  // OR
  wsUrl: 'wss://bridge.explorecosmo.com:8443',  // For Node.js proxy
  // OR
  wsUrl: 'wss://wss.bridge.explorecosmo.com',  // For Cloudflare Worker
  debug: true,  // Enable for troubleshooting
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

### **Update Environment Variables**
```bash
# For build-time configuration
echo "REACT_APP_WS_URL=wss://bridge.explorecosmo.com/ws" > .env.production
npm run build
```

## 🔍 **Testing the Setup**

### **1. Test SSL Certificate**
```bash
# Check certificate validity
openssl s_client -connect bridge.explorecosmo.com:443 -servername bridge.explorecosmo.com

# Test with curl
curl -I https://bridge.explorecosmo.com
```

### **2. Test WebSocket Connection**
```bash
# Using wscat
npm install -g wscat
wscat -c wss://bridge.explorecosmo.com/ws

# Or in browser console
const ws = new WebSocket('wss://bridge.explorecosmo.com/ws');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);
```

### **3. Test Health Endpoints**
```bash
# Nginx health check
curl https://bridge.explorecosmo.com/health

# Node.js proxy health check
curl https://bridge.explorecosmo.com:8443/health
```

## 🛠 **Troubleshooting**

### **Common Issues**

#### **1. Certificate Errors**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

#### **2. WebSocket Connection Fails**
- Verify bridge server is running on port 8080
- Check firewall settings
- Ensure proxy server is running
- Check CORS configuration

#### **3. Mixed Content Errors**
- Ensure all resources use HTTPS
- Check for hardcoded HTTP URLs
- Verify WebSocket URL uses `wss://`

### **Debug Commands**
```bash
# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check proxy server logs
pm2 logs cosmo-proxy

# Test network connectivity
telnet bridge.explorecosmo.com 443
telnet bridge.explorecosmo.com 8443
```

## 📋 **Deployment Checklist**

- [ ] SSL certificate installed and valid
- [ ] Nginx/Proxy server configured
- [ ] WebSocket proxy running
- [ ] Firewall rules updated
- [ ] DNS records configured
- [ ] Runtime configuration updated
- [ ] Application deployed
- [ ] HTTPS redirect working
- [ ] WebSocket connection tested
- [ ] Health checks passing

## 🔄 **Maintenance**

### **Automatic Certificate Renewal**
```bash
# Add to crontab
sudo crontab -e

# Add this line for daily renewal checks
0 12 * * * /usr/bin/certbot renew --quiet
```

### **Monitoring**
```bash
# Set up monitoring for proxy server
pm2 monit

# Monitor Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 🎯 **Recommended Setup**

For production, we recommend:

1. **Nginx Reverse Proxy** for the web application
2. **Node.js Proxy Server** for WebSocket connections
3. **Let's Encrypt** for SSL certificates
4. **PM2** for process management
5. **Automatic renewal** for certificates

This provides the best balance of security, performance, and maintainability. 
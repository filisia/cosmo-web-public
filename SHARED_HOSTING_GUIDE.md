# Shared Hosting HTTPS Setup Guide

## 🏠 **Shared Hosting Limitations**

Since you don't have `sudo` access, we need to use alternative solutions that work within shared hosting constraints:

- ❌ No system-level package installation
- ❌ No nginx/apache configuration changes
- ❌ No SSL certificate management
- ✅ Can upload files via FTP/SFTP
- ✅ Can use external services (Cloudflare, etc.)
- ✅ Can modify application code

## 🚀 **Solution Options**

### **Option 1: Cloudflare Workers (Recommended)**

**Best for shared hosting** - No server access required!

#### **Step 1: Create Cloudflare Account**
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain: `bridge.explorecosmo.com`
3. Update DNS to use Cloudflare nameservers

#### **Step 2: Deploy Worker**
1. Go to **Workers & Pages** in Cloudflare dashboard
2. Click **Create Application** → **Create Worker**
3. Copy the code from `cloudflare-worker-simple.js`
4. Update the bridge URL in the worker code:
   ```javascript
   const bridgeUrl = 'ws://YOUR_BRIDGE_IP:8080'
   ```
5. Deploy the worker

#### **Step 3: Configure Custom Domain**
1. In your worker settings, add custom domain
2. Use: `wss.bridge.explorecosmo.com`
3. Update your `public/config.js`:
   ```javascript
   wsUrl: 'wss://wss.bridge.explorecosmo.com'
   ```

#### **Step 4: Test Connection**
```bash
# Test the worker
curl https://wss.bridge.explorecosmo.com

# Test WebSocket (in browser console)
const ws = new WebSocket('wss://wss.bridge.explorecosmo.com');
ws.onopen = () => console.log('✅ Connected!');
```

### **Option 2: ngrok Tunnel (Development)**

**Good for testing** - Creates secure tunnel to your local bridge

#### **Step 1: Install ngrok**
```bash
# Download from https://ngrok.com/
# Or use npm
npm install -g ngrok
```

#### **Step 2: Create Tunnel**
```bash
# Create secure tunnel to your bridge
ngrok http 8080

# This will give you a URL like: https://abc123.ngrok.io
```

#### **Step 3: Update Configuration**
Edit `public/config.js`:
```javascript
wsUrl: 'wss://abc123.ngrok.io'  // Use the ngrok URL
```

#### **Step 4: Upload and Test**
1. Upload your build files to shared hosting
2. Test the connection

### **Option 3: Client-Side Proxy (Temporary)**

**Quick fix** - Use the provided proxy page

#### **Step 1: Upload Proxy Page**
Upload `public/websocket-proxy.html` to your shared hosting

#### **Step 2: Use the Proxy**
1. Open `https://your-domain.com/websocket-proxy.html`
2. Click "Connect" to bridge
3. Keep this page open while using your main app

#### **Step 3: Update Main App**
Edit `public/config.js` to use a local WebSocket:
```javascript
wsUrl: 'ws://localhost:8080'  // This will work when proxy is active
```

## 🔧 **Configuration Updates**

### **Update Runtime Configuration**
Edit `public/config.js` on your shared hosting:

```javascript
window.COSMO_CONFIG = {
  // Choose one of these options:
  
  // Option 1: Cloudflare Worker
  wsUrl: 'wss://wss.bridge.explorecosmo.com',
  
  // Option 2: ngrok tunnel
  // wsUrl: 'wss://abc123.ngrok.io',
  
  // Option 3: Local (with proxy)
  // wsUrl: 'ws://localhost:8080',
  
  debug: true,  // Enable for troubleshooting
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

### **Environment Variables (if supported)**
Some shared hosting providers support environment variables:

```bash
# In your hosting control panel, set:
REACT_APP_WS_URL=wss://wss.bridge.explorecosmo.com
```

## 📋 **Deployment Steps**

### **1. Build the Application**
```bash
npm run build
```

### **2. Upload Files**
Upload the contents of `build/` directory to your shared hosting's `public_html/` folder

### **3. Update Configuration**
Edit `public_html/config.js` with the correct WebSocket URL

### **4. Test Connection**
Visit your site and check the browser console for connection status

## 🛠 **Troubleshooting**

### **Common Issues**

#### **1. Mixed Content Errors**
- Ensure WebSocket URL uses `wss://` not `ws://`
- Check that all resources use HTTPS

#### **2. Connection Refused**
- Verify bridge server is running
- Check firewall settings on bridge server
- Ensure correct IP address/port

#### **3. CORS Errors**
- Cloudflare Workers handle CORS automatically
- For other solutions, ensure proper CORS headers

### **Debug Commands**
```bash
# Test bridge server locally
curl http://localhost:8080

# Test WebSocket locally
wscat -c ws://localhost:8080

# Check if port is open
telnet localhost 8080
```

## 🎯 **Recommended Approach**

For shared hosting, I recommend this order:

1. **Cloudflare Workers** - Most reliable, no server access needed
2. **ngrok Tunnel** - Good for development/testing
3. **Client-Side Proxy** - Quick temporary solution

## 📞 **Getting Help**

If you continue to have issues:

1. **Check browser console** for detailed error messages
2. **Verify bridge server** is running and accessible
3. **Test with different WebSocket URLs**
4. **Contact your hosting provider** about WebSocket support
5. **Use the debug mode** in `config.js`

## 🔄 **Quick Start Checklist**

- [ ] Choose a solution (Cloudflare Workers recommended)
- [ ] Set up the chosen solution
- [ ] Build the application (`npm run build`)
- [ ] Upload files to shared hosting
- [ ] Update `config.js` with correct WebSocket URL
- [ ] Test the connection
- [ ] Monitor for any errors

The Cloudflare Workers solution is the most reliable for shared hosting environments and requires no server access! 
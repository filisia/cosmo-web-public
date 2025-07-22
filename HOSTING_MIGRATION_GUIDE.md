# Hosting Migration Guide: Vercel to Current Hosting

## 🔍 **Why It Worked on Vercel But Not Current Hosting**

The difference between Vercel and your current hosting likely comes down to several factors:

### **1. Environment Variables**
- **Vercel**: May have had different environment variables configured
- **Current Hosting**: Uses default `ws://localhost:8080`

### **2. Protocol Handling**
- **Vercel**: May have served over HTTP in development/preview
- **Current Hosting**: Serves over HTTPS, causing mixed content blocking

### **3. Build Configuration**
- **Vercel**: Automatic environment variable injection
- **Current Hosting**: Manual configuration required

## 🚀 **Solutions Implemented**

### **1. Runtime Configuration**
Created `public/config.js` that can be updated without rebuilding:

```javascript
window.COSMO_CONFIG = {
  wsUrl: 'ws://localhost:8080',  // Change this for your environment
  debug: false,
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

### **2. Enhanced Error Handling**
- Comprehensive console logging
- User-friendly error messages
- Automatic protocol detection
- Multiple fallback options

### **3. Flexible WebSocket URL Resolution**
The app now checks for WebSocket URL in this order:
1. Environment variable (`REACT_APP_WS_URL`)
2. Runtime configuration (`window.COSMO_CONFIG.wsUrl`)
3. Legacy support (`window.COSMO_WS_URL`)
4. Default fallback (`ws://localhost:8080`)

## 🔧 **Configuration Options**

### **Option 1: Update Runtime Config (Recommended)**
Edit `public/config.js` on your server:

```javascript
window.COSMO_CONFIG = {
  wsUrl: 'ws://your-bridge-server-ip:8080',  // Update this
  debug: true  // Enable for troubleshooting
};
```

### **Option 2: Environment Variables**
Set environment variable on your hosting:
```bash
REACT_APP_WS_URL=ws://your-bridge-server-ip:8080
```

### **Option 3: Direct Window Variable**
Add to your HTML or server-side script:
```javascript
window.COSMO_WS_URL = 'ws://your-bridge-server-ip:8080';
```

## 🌐 **Hosting-Specific Solutions**

### **For Shared Hosting (cPanel, etc.)**
1. Upload the `build/` directory to `public_html/`
2. Edit `public_html/config.js` to set the correct WebSocket URL
3. Ensure the bridge server is accessible from the hosting server

### **For VPS/Cloud Hosting**
1. Deploy using the provided deployment scripts
2. Configure environment variables in your hosting platform
3. Set up proper firewall rules for WebSocket connections

### **For CDN/Static Hosting**
1. Upload build files
2. Update `config.js` with the correct WebSocket URL
3. Ensure CORS is properly configured on the bridge server

## 🔍 **Troubleshooting Steps**

### **1. Check Current Configuration**
Open browser console and look for:
```
🔧 WebSocket Configuration: {
  url: "ws://localhost:8080",
  protocol: "https:",
  hostname: "your-domain.com",
  runtimeConfig: {...}
}
```

### **2. Test WebSocket Connection**
In browser console:
```javascript
const ws = new WebSocket('ws://your-bridge-server-ip:8080');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);
```

### **3. Verify Bridge Server**
On the bridge server:
```bash
netstat -tlnp | grep 8080
curl -I http://localhost:8080
```

### **4. Check Network Connectivity**
```bash
ping your-bridge-server-ip
telnet your-bridge-server-ip 8080
```

## 📋 **Migration Checklist**

- [ ] Upload new build files to hosting
- [ ] Update `config.js` with correct WebSocket URL
- [ ] Test connection from hosting server to bridge server
- [ ] Verify firewall rules allow WebSocket connections
- [ ] Test the web application
- [ ] Monitor console for any errors
- [ ] Update DNS if bridge server IP changed

## 🛠 **Advanced Solutions**

### **Reverse Proxy Setup**
If you need HTTPS to WSS conversion:

```nginx
# Nginx configuration
location /ws {
    proxy_pass http://your-bridge-server:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

Then use: `wss://your-domain.com/ws`

### **CORS Configuration**
Ensure your bridge server allows connections from your web app domain.

### **SSL/TLS Setup**
If your bridge supports WSS, configure SSL certificates and use `wss://` URLs.

## 📞 **Support**

If you continue to have issues:

1. **Check browser console** for detailed error messages
2. **Verify network connectivity** between hosting and bridge
3. **Test with different WebSocket URLs**
4. **Enable debug mode** in `config.js`
5. **Check hosting provider's WebSocket support**

## 🔄 **Quick Fix for Current Issue**

If you need an immediate solution:

1. **Visit via HTTP**: `http://your-domain.com` instead of `https://your-domain.com`
2. **Allow mixed content** in browser settings
3. **Update `config.js`** with the correct bridge server IP
4. **Restart the bridge application**

The new build includes comprehensive error handling and user guidance to help resolve these issues automatically. 
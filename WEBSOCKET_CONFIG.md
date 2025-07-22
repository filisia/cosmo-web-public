# WebSocket Configuration Guide

## Problem
The CosmoWeb application is trying to connect to `ws://localhost:8080` which only works when the Cosmo Bridge (macOS app) is running on the same machine as the web browser.

## Solution
You need to configure the WebSocket URL to point to the machine where the Cosmo Bridge is actually running.

## Configuration Options

### Option 1: Environment Variables (Recommended)

1. **Create a `.env.production` file** in the `cosmoweb` directory:
   ```bash
   # .env.production
   REACT_APP_WS_URL=ws://your-bridge-server-ip:8080
   ```

2. **For HTTPS/WSS** (if your web app uses HTTPS):
   ```bash
   # .env.production
   REACT_APP_WS_URL=wss://your-bridge-server-ip:8080
   ```

3. **Rebuild the application**:
   ```bash
   npm run build
   ```

### Option 2: Direct Configuration

Edit `cosmoweb/src/config.js`:
```javascript
const config = {
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:8080',
  development: {
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:8080',
  },
  production: {
    wsUrl: 'ws://your-bridge-server-ip:8080',  // Update this
  },
};
```

### Option 3: Runtime Configuration

Create a configuration file that can be updated without rebuilding:
```javascript
// public/config.js
window.COSMO_CONFIG = {
  wsUrl: 'ws://your-bridge-server-ip:8080'
};
```

Then update `src/config.js`:
```javascript
const runtimeConfig = window.COSMO_CONFIG || {};
const config = {
  wsUrl: runtimeConfig.wsUrl || process.env.REACT_APP_WS_URL || 'ws://localhost:8080',
  // ... rest of config
};
```

## Deployment Scenarios

### Scenario 1: Bridge on Same Server as Web App
```bash
REACT_APP_WS_URL=ws://localhost:8080
```

### Scenario 2: Bridge on Different Server
```bash
REACT_APP_WS_URL=ws://192.168.1.100:8080
```

### Scenario 3: Bridge Behind Reverse Proxy
```bash
REACT_APP_WS_URL=wss://your-domain.com/ws
```

### Scenario 4: Bridge on Local Network
```bash
REACT_APP_WS_URL=ws://192.168.1.100:8080
```

## Network Configuration

### Firewall Settings
Ensure port 8080 is open on the bridge server:
```bash
# Ubuntu/Debian
sudo ufw allow 8080

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### CORS Configuration
If you get CORS errors, the bridge server needs to allow connections from your web app domain.

## Testing the Connection

1. **Check if bridge is running**:
   ```bash
   # On the bridge server
   netstat -tlnp | grep 8080
   ```

2. **Test WebSocket connection**:
   ```bash
   # Using wscat (install with: npm install -g wscat)
   wscat -c ws://your-bridge-server-ip:8080
   ```

3. **Browser console test**:
   ```javascript
   const ws = new WebSocket('ws://your-bridge-server-ip:8080');
   ws.onopen = () => console.log('Connected!');
   ws.onerror = (e) => console.error('Error:', e);
   ```

## Troubleshooting

### Common Issues

1. **Connection refused**:
   - Bridge server not running
   - Wrong IP address
   - Firewall blocking port 8080

2. **CORS errors**:
   - Bridge server needs to allow your web app domain
   - Check bridge server CORS configuration

3. **SSL/TLS errors**:
   - Use `wss://` for HTTPS connections
   - Ensure SSL certificate is valid

### Debug Steps

1. **Check bridge server logs**
2. **Verify network connectivity**:
   ```bash
   ping your-bridge-server-ip
   telnet your-bridge-server-ip 8080
   ```
3. **Check browser console for errors**
4. **Verify WebSocket URL in browser network tab**

## Security Considerations

1. **Use WSS (WebSocket Secure)** in production
2. **Implement authentication** if needed
3. **Restrict access** to bridge server
4. **Use VPN** for remote bridge connections

## Example Configurations

### Development
```bash
# .env.development
REACT_APP_WS_URL=ws://localhost:8080
```

### Production (Same Server)
```bash
# .env.production
REACT_APP_WS_URL=ws://localhost:8080
```

### Production (Different Server)
```bash
# .env.production
REACT_APP_WS_URL=wss://bridge.yourdomain.com:8080
```

### Production (Local Network)
```bash
# .env.production
REACT_APP_WS_URL=ws://192.168.1.100:8080
``` 
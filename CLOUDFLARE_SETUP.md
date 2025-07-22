# Cloudflare Workers Setup Guide

## 🌐 **Domain Configuration**

### **Important: Root Domain Required**

Cloudflare requires you to add the **root domain**, not a subdomain. For example:
- ✅ **Correct**: `explorecosmo.com`
- ❌ **Incorrect**: `bridge.explorecosmo.com`

## 🚀 **Step-by-Step Setup**

### **Step 1: Add Root Domain to Cloudflare**

1. **Sign up/Login** to [cloudflare.com](https://cloudflare.com)
2. **Click "Add a Site"**
3. **Enter your root domain**: `explorecosmo.com` (or whatever domain you own)
4. **Choose plan**: Free plan is sufficient
5. **Update DNS**: Cloudflare will provide nameservers to update at your domain registrar

### **Step 2: Update DNS at Your Registrar**

Go to your domain registrar (where you bought the domain) and update nameservers to Cloudflare's:

```
Nameserver 1: [Cloudflare provided]
Nameserver 2: [Cloudflare provided]
```

### **Step 3: Create Worker**

1. **Go to Workers & Pages** in Cloudflare dashboard
2. **Click "Create Application"**
3. **Choose "Create Worker"**
4. **Name your worker**: `cosmo-bridge-proxy`
5. **Copy the code** from `cloudflare-worker-simple.js`
6. **Update the bridge URL** in the worker code:
   ```javascript
   const bridgeUrl = 'ws://YOUR_BRIDGE_IP:8080'
   ```
7. **Deploy the worker**

### **Step 4: Configure Custom Domain**

1. **In your worker settings**, go to "Triggers"
2. **Add Custom Domain**
3. **Choose one of these options**:

#### **Option A: Use Subdomain of Your Domain**
```
Domain: bridge.explorecosmo.com
```

#### **Option B: Use Cloudflare's Free Subdomain**
```
Domain: cosmo-bridge-proxy.your-username.workers.dev
```

#### **Option C: Use Different Subdomain**
```
Domain: wss.explorecosmo.com
```

### **Step 5: Update Your Web App Configuration**

Edit `public/config.js` on your shared hosting:

```javascript
window.COSMO_CONFIG = {
  // Choose the domain you configured in Step 4:
  
  // Option A: Your subdomain
  wsUrl: 'wss://bridge.explorecosmo.com',
  
  // Option B: Cloudflare's free subdomain
  // wsUrl: 'wss://cosmo-bridge-proxy.your-username.workers.dev',
  
  // Option C: Different subdomain
  // wsUrl: 'wss://wss.explorecosmo.com',
  
  debug: true,
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

## 🔧 **Alternative: No Domain Required**

If you don't own a domain, you can use Cloudflare's free subdomain:

### **Step 1: Create Worker Only**
1. **Create worker** as described above
2. **Skip custom domain setup**
3. **Use the default worker URL**: `https://cosmo-bridge-proxy.your-username.workers.dev`

### **Step 2: Update Configuration**
```javascript
window.COSMO_CONFIG = {
  wsUrl: 'wss://cosmo-bridge-proxy.your-username.workers.dev',
  debug: true,
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

## 🧪 **Testing the Setup**

### **1. Test Worker Directly**
```bash
# Test the worker endpoint
curl https://bridge.explorecosmo.com

# Should return: "WebSocket proxy only"
```

### **2. Test WebSocket Connection**
```javascript
// In browser console
const ws = new WebSocket('wss://bridge.explorecosmo.com');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);
```

### **3. Test with Your Web App**
1. **Upload your build files** to shared hosting
2. **Update config.js** with the correct WebSocket URL
3. **Open your web app** and check browser console

## 🛠 **Troubleshooting**

### **Common Issues**

#### **1. "Domain not found" Error**
- Ensure you added the **root domain** to Cloudflare
- Wait for DNS propagation (can take up to 24 hours)
- Check that nameservers are updated at your registrar

#### **2. Worker Not Responding**
- Check worker code for syntax errors
- Ensure worker is deployed successfully
- Check worker logs in Cloudflare dashboard

#### **3. WebSocket Connection Fails**
- Verify bridge server is running
- Check bridge server IP address in worker code
- Ensure firewall allows connections to port 8080

### **Debug Steps**
```bash
# Test bridge server locally
curl http://localhost:8080

# Test WebSocket locally
wscat -c ws://localhost:8080

# Check worker status
curl https://your-worker-url.workers.dev
```

## 📋 **Complete Setup Checklist**

- [ ] Add root domain to Cloudflare
- [ ] Update nameservers at registrar
- [ ] Wait for DNS propagation
- [ ] Create Cloudflare Worker
- [ ] Deploy worker code
- [ ] Configure custom domain (optional)
- [ ] Test worker connection
- [ ] Update web app configuration
- [ ] Upload files to shared hosting
- [ ] Test complete setup

## 🎯 **Quick Start (No Domain)**

If you want to get started immediately without a domain:

1. **Create Cloudflare account**
2. **Create worker** with the provided code
3. **Use the default worker URL**
4. **Update your config.js** with the worker URL
5. **Upload and test**

This will work immediately without any domain setup! 
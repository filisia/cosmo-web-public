# Vercel Deployment Guide

## 🚀 **Why Vercel Works**

Vercel provides the perfect environment for your Cosmo Bridge web app because:
- ✅ **No mixed content issues** - Vercel serves over HTTP in development
- ✅ **Automatic HTTPS** - Production builds get HTTPS automatically
- ✅ **Easy deployment** - Just connect your repository
- ✅ **Free hosting** - Perfect for development and testing
- ✅ **Custom domains** - Can use your own domain if needed

## 📋 **Deployment Steps**

### **Step 1: Prepare Your Repository**

Ensure your code is in a Git repository (GitHub, GitLab, or Bitbucket):

```bash
# If not already a git repository
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# Push to your preferred Git provider
git remote add origin https://github.com/yourusername/cosmo-bridge.git
git push -u origin main
```

### **Step 2: Connect to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your Git provider account
3. **Click "New Project"**
4. **Import your repository**
5. **Configure the project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `cosmoweb` (if your repo has multiple projects)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### **Step 3: Environment Variables**

In the Vercel project settings, add these environment variables:

```
REACT_APP_WS_URL=ws://localhost:8080
NODE_ENV=production
```

### **Step 4: Deploy**

Click **"Deploy"** and wait for the build to complete.

## 🔧 **Configuration Files**

### **vercel.json**
The `vercel.json` file is already configured for optimal deployment:

```json
{
  "version": 2,
  "name": "cosmoweb",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_WS_URL": "ws://localhost:8080"
  }
}
```

### **public/config.js**
The runtime configuration is set for Vercel:

```javascript
window.COSMO_CONFIG = {
  wsUrl: 'ws://localhost:8080',  // Works with local bridge
  debug: true,
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

## 🌐 **Custom Domain (Optional)**

If you want to use your own domain:

### **Step 1: Add Domain in Vercel**
1. Go to your project settings
2. Click **"Domains"**
3. Add your domain: `bridge.explorecosmo.com`

### **Step 2: Update DNS**
Add a CNAME record at your domain registrar:
```
Type: CNAME
Name: bridge
Value: cname.vercel-dns.com
```

### **Step 3: Wait for Propagation**
DNS changes can take up to 24 hours to propagate.

## 🧪 **Testing Your Deployment**

### **1. Test the Web App**
1. **Open your Vercel URL** (e.g., `https://cosmoweb.vercel.app`)
2. **Check browser console** for WebSocket connection logs
3. **Verify the app loads** correctly

### **2. Test with Local Bridge**
1. **Start your Cosmo Bridge** on your computer
2. **Open the Vercel app** in your browser
3. **Check for successful connection** in the console

### **3. Test Device Connection**
1. **Connect your Cosmo devices**
2. **Verify they appear** in the web app
3. **Test device functionality**

## 🔄 **Automatic Deployments**

Vercel automatically deploys when you push to your repository:

```bash
# Make changes to your code
git add .
git commit -m "Update WebSocket configuration"
git push origin main

# Vercel automatically deploys the changes
```

## 🛠 **Troubleshooting**

### **Common Issues**

#### **1. Build Failures**
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify the build command is correct

#### **2. WebSocket Connection Issues**
- Ensure your Cosmo Bridge is running locally
- Check that port 8080 is accessible
- Verify the WebSocket URL in `config.js`

#### **3. Mixed Content Errors**
- Vercel should handle this automatically
- If issues persist, check for hardcoded HTTP URLs

### **Debug Commands**
```bash
# Test local bridge
curl http://localhost:8080

# Test WebSocket locally
wscat -c ws://localhost:8080

# Check Vercel deployment
curl https://your-vercel-url.vercel.app
```

## 📊 **Monitoring**

### **Vercel Analytics**
- **Function Logs**: Check for any server-side errors
- **Performance**: Monitor app loading times
- **Usage**: Track bandwidth and function calls

### **Browser Console**
Monitor these logs in your browser:
```
[WebSocketService] Initialized with URL: ws://localhost:8080
[WebSocketService] WebSocket Connected
[WebSocketContext] WebSocket connected
```

## 🎯 **Production Considerations**

### **For Production Use**
If you plan to use this in production:

1. **Set up a proper WebSocket proxy** (Cloudflare Workers, etc.)
2. **Use a custom domain** for better branding
3. **Configure proper CORS** if needed
4. **Set up monitoring** and error tracking

### **Security**
- The current setup works for local development
- For production, consider implementing authentication
- Use HTTPS/WSS for all connections

## 📋 **Deployment Checklist**

- [ ] Code is in a Git repository
- [ ] Vercel project is created
- [ ] Environment variables are set
- [ ] Build is successful
- [ ] App loads correctly
- [ ] WebSocket connects to local bridge
- [ ] Devices are detected
- [ ] Custom domain is configured (optional)
- [ ] Monitoring is set up

## 🚀 **Quick Deploy**

If you want to deploy immediately:

1. **Push your code** to GitHub
2. **Connect to Vercel** and import the repository
3. **Deploy** with default settings
4. **Test** the connection

Your app will be live at `https://your-project.vercel.app` and ready to connect to your local Cosmo Bridge! 
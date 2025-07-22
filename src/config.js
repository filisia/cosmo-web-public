// Try to get WebSocket URL from multiple sources
const getWebSocketUrlFromEnv = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_WS_URL) {
    return process.env.REACT_APP_WS_URL;
  }
  
  // Check for runtime configuration (useful for different hosting environments)
  if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
    return window.COSMO_CONFIG.wsUrl;
  }
  
  // Legacy support for direct window variable
  if (typeof window !== 'undefined' && window.COSMO_WS_URL) {
    return window.COSMO_WS_URL;
  }
  
  // Default fallback
  return 'ws://localhost:8080';
};

const config = {
  wsUrl: getWebSocketUrlFromEnv(),
  development: {
    wsUrl: getWebSocketUrlFromEnv(),
  },
  production: {
    wsUrl: getWebSocketUrlFromEnv(),
  },
};

const env = process.env.NODE_ENV || 'development';
const baseConfig = config[env];

// Handle mixed content issues and provide comprehensive user guidance
const getWebSocketUrl = () => {
  const url = baseConfig.wsUrl;
  
  // Log the current configuration for debugging
  console.log('🔧 WebSocket Configuration:', {
    url,
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    runtimeConfig: typeof window !== 'undefined' ? window.COSMO_CONFIG : 'not available'
  });
  
  // If we're on HTTPS and trying to connect to ws://, show comprehensive guidance
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('ws://')) {
    console.warn('⚠️ HTTPS site connecting to non-secure WebSocket. This may be blocked by the browser.');
    console.warn('💡 Solutions:');
    console.warn('   1. Visit via HTTP: http://' + window.location.hostname);
    console.warn('   2. Allow mixed content in browser settings');
    console.warn('   3. Update config.js to use wss:// if bridge supports it');
    console.warn('   4. Use a reverse proxy for secure WebSocket');
    
    // Show a comprehensive user-friendly message
    setTimeout(() => {
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 450px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        border-left: 4px solid #fff;
      `;
      message.innerHTML = `
        <div style="margin-bottom: 12px;">
          <strong style="font-size: 16px;">🔌 Bridge Connection Required</strong>
        </div>
        <div style="margin-bottom: 12px;">
          This app needs to connect to your local Cosmo Bridge. Each user needs their own bridge running.
        </div>
        <div style="margin-bottom: 12px;">
          <strong>Quick Solutions:</strong>
          <br>• <a href="/setup-guide.html" style="color: #fff; text-decoration: underline;">📖 Setup Guide</a>
          <br>• <a href="http://${window.location.hostname}" style="color: #fff; text-decoration: underline;">🌐 Use HTTP instead</a>
          <br>• <a href="#" onclick="allowMixedContent()" style="color: #fff; text-decoration: underline;">🔓 Allow Mixed Content</a>
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
          The bridge must be running on your computer for this app to work.
        </div>
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          opacity: 0.7;
        ">&times;</button>
      `;
      document.body.appendChild(message);
      
      // Auto-remove after 30 seconds
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 30000);
    }, 2000);
  }
  
  return url;
};

// Add global function to help users allow mixed content
if (typeof window !== 'undefined') {
  window.allowMixedContent = function() {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: #333;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 10001;
      max-width: 500px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.6;
    `;
    message.innerHTML = `
      <h3 style="margin-top: 0; color: #2c3e50;">🔓 Allow Mixed Content</h3>
      <p><strong>To allow this app to connect to your local bridge:</strong></p>
      
      <h4>Chrome/Edge:</h4>
      <ol>
        <li>Click the lock icon 🔒 in the address bar</li>
        <li>Click "Site settings"</li>
        <li>Find "Insecure content" and change to "Allow"</li>
        <li>Refresh the page</li>
      </ol>
      
      <h4>Firefox:</h4>
        <ol>
        <li>Click the shield icon 🛡️ in the address bar</li>
        <li>Click "Site permissions"</li>
        <li>Find "Access your location" and change to "Allow"</li>
        <li>Refresh the page</li>
      </ol>
      
      <h4>Safari:</h4>
      <ol>
        <li>Go to Safari > Preferences > Security</li>
        <li>Uncheck "Block all cookies"</li>
        <li>Refresh the page</li>
      </ol>
      
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        <strong>Note:</strong> This is safe because you're connecting to your own local computer.
      </p>
      
      <button onclick="this.parentElement.remove(); location.reload();" style="
        background: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 15px;
      ">Got it, refresh page</button>
      
      <button onclick="this.parentElement.remove()" style="
        background: #95a5a6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 15px;
        margin-left: 10px;
      ">Close</button>
    `;
    document.body.appendChild(message);
  };
}

export default {
  ...baseConfig,
  wsUrl: getWebSocketUrl()
}; 
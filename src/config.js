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
        max-width: 350px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        border-left: 4px solid #fff;
      `;
      message.innerHTML = `
        <div style="margin-bottom: 12px;">
          <strong style="font-size: 16px;">🔌 Connection Issue</strong>
        </div>
        <div style="margin-bottom: 12px;">
          This site needs to connect to your local Cosmo Bridge app.
        </div>
        <div style="margin-bottom: 12px;">
          <strong>Quick Fix:</strong> Visit via HTTP instead of HTTPS:
          <br><a href="http://${window.location.hostname}" style="color: #fff; text-decoration: underline;">http://${window.location.hostname}</a>
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
          Or allow "mixed content" in your browser settings.
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
      
      // Auto-remove after 15 seconds
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 15000);
    }, 2000);
  }
  
  return url;
};

export default {
  ...baseConfig,
  wsUrl: getWebSocketUrl()
}; 
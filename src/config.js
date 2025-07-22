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

// Wait for runtime config to be available
const waitForRuntimeConfig = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
      resolve(window.COSMO_CONFIG.wsUrl);
    } else {
      // Wait for runtime config to load
      const checkConfig = () => {
        if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
          resolve(window.COSMO_CONFIG.wsUrl);
        } else {
          setTimeout(checkConfig, 100);
        }
      };
      checkConfig();
    }
  });
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
const getWebSocketUrl = async () => {
  // Wait for runtime config if we're in the browser
  if (typeof window !== 'undefined') {
    try {
      const runtimeUrl = await waitForRuntimeConfig();
      console.log('🔧 Using runtime WebSocket URL:', runtimeUrl);
      return runtimeUrl;
    } catch (error) {
      console.warn('Failed to get runtime config, using fallback:', error);
    }
  }
  
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
  }
  
  return url;
};

// For immediate use, return a promise-based config
export default {
  ...baseConfig,
  get wsUrl() {
    // If we're in the browser and runtime config is available, use it
    if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
      return window.COSMO_CONFIG.wsUrl;
    }
    return baseConfig.wsUrl;
  },
  getWebSocketUrl
}; 
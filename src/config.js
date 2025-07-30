// Check for runtime configuration first
const getWebSocketUrl = () => {
  // Check for runtime configuration (useful for different hosting environments)
  if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
    return window.COSMO_CONFIG.wsUrl;
  }
  
  // Default fallback - for development, always use ws://localhost:8080
  // Only use wss in production with HTTPS
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isProduction) {
      // Production: try to discover the local Mac app
      // This will attempt to connect to common local network addresses
      return null; // Will be handled by the discovery mechanism
    }
    return window.location.protocol === 'https:' 
      ? 'wss://localhost:8443' 
      : 'ws://localhost:8080';
  }
  return 'ws://localhost:8080';
};

const config = {
  wsUrl: getWebSocketUrl(),
  development: {
    wsUrl: getWebSocketUrl(),
  },
  production: {
    wsUrl: getWebSocketUrl(),
  },
};

const env = process.env.NODE_ENV || 'development';
export default config[env]; 
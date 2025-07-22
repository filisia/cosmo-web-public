// Check for runtime configuration first
const getWebSocketUrl = () => {
  // Check for runtime configuration (useful for different hosting environments)
  if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
    return window.COSMO_CONFIG.wsUrl;
  }
  
  // Default fallback - use secure WebSocket for HTTPS
  return typeof window !== 'undefined' && window.location.protocol === 'https:' 
    ? 'wss://localhost:8443' 
    : 'ws://localhost:8080';
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
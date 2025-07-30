// Check for runtime configuration first
const getWebSocketUrl = () => {
  // Check for runtime configuration (useful for different hosting environments)
  if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
    return window.COSMO_CONFIG.wsUrl;
  }
  
  // Always use ws://localhost:8080 as per CLAUDE.md specification
  // The Cosmo Bridge runs locally on the user's machine
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
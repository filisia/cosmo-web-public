// Runtime configuration for CosmoWeb
// This file can be updated without rebuilding the application
// Useful for different hosting environments (Vercel, shared hosting, etc.)

window.COSMO_CONFIG = {
  // WebSocket URL for connecting to the Cosmo Bridge
  // Options:
  // - ws://localhost:8080 (local development - each user needs their own bridge)
  // - ws://your-server-ip:8080 (remote bridge)
  // - wss://your-domain.com/ws (secure WebSocket via proxy)
  // - wss://bridge.explorecosmo.com:8443 (secure WebSocket via proxy server)
  // - wss://bridge.explorecosmo.com/ws (secure WebSocket via Nginx proxy)
  wsUrl: window.location.protocol === 'https:' ? 'wss://localhost:8443' : 'ws://localhost:8080',
  
  // Additional configuration options
  debug: true,
  reconnectAttempts: 5,
  reconnectDelay: 1000,
  
  // Feature flags
  enableSound: true,
  enableVibration: true,
  enableNotifications: true
};

// Log configuration for debugging
if (window.COSMO_CONFIG.debug) {
  console.log('🔧 CosmoWeb Runtime Config:', window.COSMO_CONFIG);
} 
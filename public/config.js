// Runtime configuration for CosmoWeb
// This file can be updated without rebuilding the application
// Useful for different hosting environments (Vercel, shared hosting, etc.)

window.COSMO_CONFIG = {
  // WebSocket URL for connecting to the Cosmo Bridge
  // Use secure WebSocket for HTTPS sites
  wsUrl: 'wss://localhost:8443',
  
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
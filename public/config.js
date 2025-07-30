// Runtime configuration for CosmoWeb
// This file can be updated without rebuilding the application
// Useful for different hosting environments (Vercel, shared hosting, etc.)

// Auto-detect development vs production environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.startsWith('192.168.') ||
                     window.location.hostname.endsWith('.local');

const isHTTPS = window.location.protocol === 'https:';

// Determine WebSocket URL based on environment
const getWebSocketUrl = () => {
  if (isDevelopment) {
    // Development: always use ws://localhost:8080
    return 'ws://localhost:8080';
  } else {
    // Production: use secure WebSocket if HTTPS, otherwise regular WebSocket
    return isHTTPS ? 'wss://localhost:8443' : 'ws://localhost:8080';
  }
};

window.COSMO_CONFIG = {
  // WebSocket URL for connecting to the Cosmo Bridge
  // Automatically detects development vs production
  wsUrl: getWebSocketUrl(),
  
  // Additional configuration options
  debug: isDevelopment, // Enable debug only in development
  reconnectAttempts: isDevelopment ? Infinity : 10, // Unlimited retries in dev
  reconnectDelay: 1000,
  
  // Environment info
  environment: isDevelopment ? 'development' : 'production',
  isHTTPS: isHTTPS,
  
  // Feature flags
  enableSound: true,
  enableVibration: true,
  enableNotifications: true
};

// Log configuration for debugging
if (window.COSMO_CONFIG.debug) {
  console.log('🔧 CosmoWeb Runtime Config:', window.COSMO_CONFIG);
}
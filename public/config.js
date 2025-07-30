// Runtime configuration for CosmoWeb
// This file can be updated without rebuilding the application
// Useful for different hosting environments (Vercel, shared hosting, etc.)

// Auto-detect development vs production environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.startsWith('192.168.') ||
                     window.location.hostname.endsWith('.local');

const isHTTPS = window.location.protocol === 'https:';

// Allow override via URL parameters for easy testing
const urlParams = new URLSearchParams(window.location.search);
const wsHostOverride = urlParams.get('wsHost');
const wsPortOverride = urlParams.get('wsPort');

// Determine WebSocket URL based on environment
const getWebSocketUrl = () => {
  // Allow URL parameter override for testing
  if (wsHostOverride) {
    const host = wsHostOverride;
    const port = wsPortOverride || (isHTTPS ? '8443' : '8080');
    return isHTTPS ? `wss://${host}:${port}` : `ws://${host}:${port}`;
  }
  
  if (isDevelopment) {
    // Development: always use ws://localhost:8080
    return 'ws://localhost:8080';
  } else {
    // Production: try to discover the local Mac app
    // This will attempt to connect to common local network addresses
    return null; // Will be handled by the discovery mechanism
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

// Instructions for deployment:
// The app now automatically discovers local Cosmo Bridge apps
// No manual configuration needed - just ensure the Mac app is running
// For testing, you can use URL parameters: ?wsHost=192.168.1.100&wsPort=8443

// Log configuration for debugging
if (window.COSMO_CONFIG.debug) {
  console.log('🔧 CosmoWeb Runtime Config:', window.COSMO_CONFIG);
}
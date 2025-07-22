// Runtime configuration for CosmoWeb
// This file can be updated without rebuilding the application
// Useful for different hosting environments (Vercel, shared hosting, etc.)

window.COSMO_CONFIG = {
  // WebSocket URL for connecting to the Cosmo Bridge
  // Options:
  // - ws://localhost:8080 (local development)
  // - ws://192.168.1.14:8080 (local network - your actual IP)
  // - wss://your-domain.com/ws (secure WebSocket via proxy)
  // - wss://bridge.explorecosmo.com:8443 (secure WebSocket via proxy server)
  // - wss://cosmo-bridge.vercel.app/ws (Vercel deployment - needs proxy)
  // - wss://bridge.explorecosmo.com/ws (custom domain - needs WebSocket server)
  
  // For local development with Vercel deployment:
  wsUrl: 'ws://192.168.1.14:8080', // Your local IP address
  
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
  console.log('💡 To connect to your local bridge:');
  console.log('   1. Make sure your Cosmo Bridge is running on port 8080');
  console.log('   2. Ensure your firewall allows connections on port 8080');
  console.log('   3. Test connection: ws://192.168.1.14:8080');
} 
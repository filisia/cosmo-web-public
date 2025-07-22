// WebSocket Proxy Server
// Run this alongside your Cosmo Bridge to enable secure WebSocket connections

const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Bridge server (your local Cosmo Bridge)
  bridgeUrl: 'ws://localhost:8080',
  
  // Proxy server settings
  proxyPort: 8443,
  sslCert: '/path/to/your/certificate.crt',
  sslKey: '/path/to/your/private.key',
  
  // CORS settings
  allowedOrigins: ['https://bridge.explorecosmo.com', 'https://www.bridge.explorecosmo.com']
};

// SSL options (if you have certificates)
const sslOptions = {
  cert: fs.readFileSync(config.sslCert),
  key: fs.readFileSync(config.sslKey)
};

// Create HTTPS server
const server = https.createServer(sslOptions);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

console.log('🔌 WebSocket Proxy Server Starting...');
console.log(`📡 Bridge URL: ${config.bridgeUrl}`);
console.log(`🔒 Proxy Port: ${config.proxyPort}`);

// Handle WebSocket connections
wss.on('connection', (ws, request) => {
  const origin = request.headers.origin;
  
  // CORS check
  if (!config.allowedOrigins.includes(origin)) {
    console.warn(`⚠️ Blocked connection from unauthorized origin: ${origin}`);
    ws.close(1008, 'Unauthorized origin');
    return;
  }
  
  console.log(`✅ New client connected from: ${origin}`);
  
  // Connect to bridge
  const bridgeSocket = new WebSocket(config.bridgeUrl);
  
  bridgeSocket.on('open', () => {
    console.log('🔗 Connected to bridge server');
  });
  
  bridgeSocket.on('message', (data) => {
    // Forward messages from bridge to client
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
  
  bridgeSocket.on('error', (error) => {
    console.error('❌ Bridge connection error:', error.message);
    ws.close(1011, 'Bridge connection failed');
  });
  
  bridgeSocket.on('close', (code, reason) => {
    console.log(`🔌 Bridge connection closed: ${code} - ${reason}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.close(code, reason);
    }
  });
  
  // Handle messages from client
  ws.on('message', (data) => {
    // Forward messages from client to bridge
    if (bridgeSocket.readyState === WebSocket.OPEN) {
      bridgeSocket.send(data);
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ Client connection error:', error.message);
    bridgeSocket.close();
  });
  
  ws.on('close', (code, reason) => {
    console.log(`🔌 Client connection closed: ${code} - ${reason}`);
    bridgeSocket.close();
  });
});

// Health check endpoint
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('healthy\n');
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>WebSocket Proxy</title></head>
        <body>
          <h1>WebSocket Proxy Server</h1>
          <p>Status: Running</p>
          <p>Bridge: ${config.bridgeUrl}</p>
          <p>Connect to: wss://bridge.explorecosmo.com:${config.proxyPort}</p>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start server
server.listen(config.proxyPort, () => {
  console.log(`🚀 WebSocket Proxy Server running on port ${config.proxyPort}`);
  console.log(`🔒 Secure WebSocket URL: wss://bridge.explorecosmo.com:${config.proxyPort}`);
  console.log(`📋 Health check: https://bridge.explorecosmo.com:${config.proxyPort}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WebSocket Proxy Server...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ Server stopped');
      process.exit(0);
    });
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 
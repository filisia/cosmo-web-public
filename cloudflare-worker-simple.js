// Simple Cloudflare Worker for WebSocket Proxy
// Deploy this to Cloudflare Workers to enable secure WebSocket connections

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle WebSocket upgrade requests
  if (request.headers.get('Upgrade') === 'websocket') {
    return handleWebSocket(request)
  }
  
  // Handle regular HTTP requests
  return new Response('WebSocket proxy only', { 
    status: 400,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

async function handleWebSocket(request) {
  try {
    // Your local bridge server URL - update this to your bridge server IP
    // For local development:
    const bridgeUrl = 'ws://localhost:8080'
    
    // For remote bridge servers, use the actual IP address:
    // const bridgeUrl = 'ws://192.168.1.100:8080'
    
    // For cloud/hosting environments:
    // const bridgeUrl = 'ws://your-server-ip:8080'
    
    // Create WebSocket connection to bridge
    const bridgeSocket = new WebSocket(bridgeUrl)
    
    // Handle the WebSocket upgrade
    const upgradeHeader = request.headers.get('Upgrade')
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 })
    }
    
    // Create response with WebSocket upgrade
    const response = new Response(null, {
      status: 101,
      webSocket: bridgeSocket
    })
    
    return response
    
  } catch (error) {
    return new Response(`WebSocket proxy error: ${error.message}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// Alternative: Simple HTTP proxy for testing
addEventListener('fetch', event => {
  if (event.request.url.includes('/proxy')) {
    event.respondWith(proxyRequest(event.request))
  }
})

async function proxyRequest(request) {
  try {
    // Forward the request to your local bridge
    const bridgeUrl = 'http://localhost:8080'
    
    const response = await fetch(bridgeUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    })
  } catch (error) {
    return new Response(`Bridge connection failed: ${error.message}`, { 
      status: 502,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
} 
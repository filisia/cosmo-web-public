// Cloudflare Worker for WebSocket proxy
// This allows secure WebSocket connections from HTTPS to your local bridge

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
  return new Response('WebSocket proxy only', { status: 400 })
}

async function handleWebSocket(request) {
  // Your local bridge server URL
  const bridgeUrl = 'ws://localhost:8080'
  
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
}

// Alternative: Simple proxy without WebSocket upgrade
addEventListener('fetch', event => {
  if (event.request.url.includes('/ws')) {
    event.respondWith(proxyWebSocket(event.request))
  }
})

async function proxyWebSocket(request) {
  // Forward the request to your local bridge
  const bridgeUrl = 'http://localhost:8080'
  
  try {
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
    return new Response('Bridge connection failed', { status: 502 })
  }
} 
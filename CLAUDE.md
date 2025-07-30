# Cosmoweb Project - Development Assistant Guide

## Project Overview
Cosmoweb is a React-based web application that interfaces with Filisia's Cosmo BLE devices through a WebSocket bridge. The system enables real-time button press detection, device control, and multi-device management. The app is designed to work from Vercel (cloud hosting) while connecting to users' local Mac applications.

## Architecture
```
Cosmo BLE Device → Cosmoid Bridge (WebSocket Server) → Cosmoweb (React Client)
                   [Local Mac App - localhost:8080]    [Vercel Hosted App]
```

## Key Technologies
- **Frontend**: React 18+ with functional components, hooks, Tailwind CSS
- **Communication**: WebSocket (`ws://localhost:8080`) - **Always connects to localhost**
- **State Management**: React Context API
- **Bridge**: Node.js/Electron WebSocket server (Mac app)
- **Hardware**: Cosmo devices with button, LED, vibration capabilities
- **Deployment**: Vercel for web app, local installation for bridge app

## Core Components

### Services
- `src/services/WebSocketService.js` - Singleton WebSocket service with auto-reconnection
- `src/contexts/WebSocketContext.js` - React Context for WebSocket state management

### Main Components
- `GamePress.js` - Button press game with confetti animations
- `HomePage.js` - Device connection and discovery interface
- `DeviceManager` - Device selection and connection management
- `utils/characteristics.js` - BLE characteristic mappings

## WebSocket Protocol

### Message Structure
```json
{
  "type": "messageType",
  "timestamp": "2025-06-15T13:20:17.123Z",
  "data": { /* payload */ }
}
```

### Key Message Types
- **Incoming**: `deviceUpdate`, `buttonStateChanged`, `characteristicValueChanged`, `lockStateChanged`, `error`
- **Outgoing**: `characteristicChanged`, `lockDevices`, `requestScan`, `ping`

### Button Press Events
```json
{
  "type": "buttonStateChanged",
  "deviceId": "device-uuid",
  "buttonState": "pressed", // "pressed" | "released"
  "pressValue": 255, // 255 for pressed, 0 for released
  "timestamp": "2025-06-15T13:20:17.123Z"
}
```

## Device Management

### Device Object Structure
```javascript
{
  id: "device-uuid",
  name: "Cosmo Device",
  serial: "2405002009",
  firmware: "4.6.00",
  batteryLevel: 85,
  isConnected: true,
  connectionState: "connected",
  lastSeen: "2025-06-15T13:20:17Z",
  deviceType: "cosmo",
  capabilities: ["button", "led", "vibration"],
  rssi: -45
}
```

### Connection States
- `available` - Device discovered but not connected
- `connecting` - Connection in progress
- `connected` - Successfully connected
- `disconnected` - Connection lost
- `error` - Connection failed

## BLE Characteristics

### Primary Service
- Service UUID: `000015231212efde1523785feabcd123`

### Key Characteristics
- **LED Control**: `000015241212efde1523785feabcd123` - RGB values [r, g, b] (0-255)
- **Button Status**: `000015251212efde1523785feabcd123` - Notify-enabled
- **Vibration**: `000015271212efde1523785feabcd123` - Intensity [0-255]
- **Sound Control**: `000015281212efde1523785feabcd123` - [frequency_hz, duration_ms]

## Development Guidelines

### Best Practices
1. **Always validate device selection** before processing events
2. **Implement proper cleanup** in useEffect to prevent memory leaks
3. **Use meaningful state names** for button and device status
4. **Provide visual feedback** for all user interactions
5. **Handle edge cases** like device disconnection during operations
6. **Log strategically** for debugging without overwhelming console
7. **Test with multiple devices** to ensure proper isolation

### Error Handling
- **Connection Errors**: `BLE_CONNECTION_FAILED`, `WEBSOCKET_CONNECTION_LOST`
- **Characteristic Errors**: `WRITE_FAILED`, `READ_FAILED`, `NOTIFY_FAILED`
- **System Errors**: `BRIDGE_NOT_READY`, `DEVICE_LOCKED`, `OPERATION_NOT_SUPPORTED`

### Rate Limiting
- **Characteristic writes**: Maximum 10 messages/second per device
- **Lock operations**: Maximum 1 message/second
- **Ping messages**: Maximum 1 message/10 seconds

### Performance Requirements
- **Button Response Time**: <50ms from WebSocket message to UI update
- **Connection Stability**: Auto-reconnection with exponential backoff
- **Event Reliability**: 100% button press detection rate
- **Multi-Device Support**: Tested with 3+ simultaneous connections

## Testing Strategy
- **Unit Tests**: Mock WebSocket service for component testing
- **Integration Tests**: End-to-end button press flows
- **Message Validation**: Protocol compliance and error handling
- **Performance Tests**: Rate limiting and connection stability

## Vercel-to-Localhost Connection Architecture

### Overview
The core innovation of this project is enabling a Vercel-hosted web application to connect directly to users' local Mac applications via WebSocket. This eliminates the need for complex network discovery, ngrok tunneling, or manual IP configuration.

### How It Works
1. **Vercel app loads** → Configuration returns `'ws://localhost:8080'`
2. **Browser interprets `localhost`** → Points to user's local machine (where Mac app runs)
3. **Mac app accepts connection** → Because it's listening on all interfaces (0.0.0.0:8080)
4. **Connection established** → Real-time communication works! 🎯

### Technical Implementation

#### Web App Configuration
- **`src/config.js`**: Always returns `'ws://localhost:8080'` (no environment detection)
- **`public/config.js`**: Runtime config also returns `'ws://localhost:8080'`
- **`src/services/WebSocketService.js`**: Simplified to direct connection (no discovery mechanism)

#### Mac App Configuration
- **`mac/src/main/ws-server.js`**: Binds to `0.0.0.0:8080` (all interfaces)
- **Port range**: 8080-8090 (tries 8080 first, which matches web app)
- **Regular WebSocket**: Uses `ws://` protocol (not `wss://`)

#### Browser Security Model
- **HTTPS → WS Localhost**: Modern browsers allow HTTPS sites to connect to `ws://localhost`
- **Same-Origin Exception**: Localhost connections are treated as secure context
- **No CORS Issues**: Localhost connections bypass CORS restrictions

### Previous Problems Solved

#### ❌ Discovery Mechanism (Removed)
```javascript
// OLD: Problematic approach
if (isProduction) {
  return null; // Triggered discovery
}
// Discovery tried to scan 192.168.x.x, 10.0.0.x networks
// This failed from Vercel because cloud apps can't scan local networks
```

#### ✅ Direct Localhost Connection (Current)
```javascript
// NEW: Simple and effective
return 'ws://localhost:8080'; // Always works from any hosting environment
```

### Configuration Files Details

#### `src/config.js`
```javascript
const getWebSocketUrl = () => {
  // Check for runtime configuration override
  if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
    return window.COSMO_CONFIG.wsUrl;
  }
  
  // Always connect to localhost:8080 - works from Vercel to user's local machine
  return 'ws://localhost:8080';
};
```

#### `public/config.js`
```javascript
const getWebSocketUrl = () => {
  // Allow URL parameter override for testing
  if (wsHostOverride) {
    const host = wsHostOverride;
    const port = wsPortOverride || (isHTTPS ? '8443' : '8080');
    return isHTTPS ? `wss://${host}:${port}` : `ws://${host}:${port}`;
  }
  
  // Always use localhost - works from Vercel to user's local machine
  return 'ws://localhost:8080';
};
```

### Testing Override
For manual testing, you can still use URL parameters:
```
https://your-app.vercel.app?wsHost=192.168.1.100&wsPort=8443
```

### Deployment Workflow
1. **Develop locally**: Both web app and Mac app run on localhost
2. **Test locally**: Verify connection between local web app and Mac app
3. **Deploy to Vercel**: Web app automatically connects to users' local Mac apps
4. **Users install Mac app**: Bridge app runs locally, accepts connections from Vercel app

### Error Handling
- **Mac app not running**: Connection fails, shows appropriate UI message
- **Wrong port**: Mac app tries ports 8080-8090, web app uses 8080
- **Firewall blocking**: Users may need to allow Mac app through firewall
- **No URL configured**: Should not happen with current config, but handled gracefully

### Success Indicators
- ✅ **Vercel app connects to localhost:8080**
- ✅ **No discovery mechanism needed**
- ✅ **No manual IP configuration required**
- ✅ **Works on all user networks (home, office, cafe)**
- ✅ **No ngrok or tunneling services needed**

### References
- **Working example**: `https://cosmoids.vercel.app/` (uses this exact pattern)
- **Browser compatibility**: All modern browsers (Chrome, Safari, Firefox, Edge)
- **Security**: HTTPS sites can connect to localhost WebSocket servers

## Commands
- Run development server: `npm start`
- Run tests: `npm test`
- Build for production: `npm run build`
- Run linter: `npm run lint`
- Type check: `npm run type-check`

## Security & Lock Management
- **Device Locking**: Exclusive access control for multi-client scenarios
- **Session Management**: Lock/unlock with session IDs
- **Permission Control**: Application-level access restrictions

## Common Patterns
- Use `useWebSocket` hook for WebSocket connection management
- Implement device selection with auto-select fallback
- Handle button state changes with proper debouncing
- Use React Context for global device state
- Implement confetti animations for game feedback
- Validate device connection before characteristic operations
# Cosmoweb Project - Development Assistant Guide

## Project Overview
Cosmoweb is a React-based web application that interfaces with Filisia's Cosmo BLE devices through a WebSocket bridge. The system enables real-time button press detection, device control, and multi-device management.

## Architecture
```
Cosmo BLE Device → Cosmoid Bridge (WebSocket Server) → Cosmoweb (React Client)
```

## Key Technologies
- **Frontend**: React 18+ with functional components, hooks, Tailwind CSS
- **Communication**: WebSocket (`ws://localhost:8080`)
- **State Management**: React Context API
- **Bridge**: Node.js/Electron WebSocket server
- **Hardware**: Cosmo devices with button, LED, vibration capabilities

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

## Commands
- Run development server: `npm start`
- Run tests: `npm test`
- Build for production: `npm run build`
- Run linter: `npm run lint`
- Type check: `npm run type-check`

## Public Repository Workflow

### Repository Structure
- **Private Development**: `/Users/abinop/code/CosmoCode/cosmo-bridge/cosmoweb/`
- **Public Repository**: `/Users/abinop/code/CosmoCode/cosmo-web-public/`

### Copying Changes to Public Repository
When changes are ready for public release, copy files from the private development repository to the public repository:

```bash
# Copy specific component
cp /Users/abinop/code/CosmoCode/cosmo-bridge/cosmoweb/src/components/ExerciseSettings.js /Users/abinop/code/CosmoCode/cosmo-web-public/src/components/ExerciseSettings.js

# Navigate to public repository
cd /Users/abinop/code/CosmoCode/cosmo-web-public

# Stage and commit changes
git add src/components/ExerciseSettings.js
git commit -m "Update ExerciseSettings component with [description of changes]"

# Push to public repository
git push origin master
```

### When to Use Public Repository
- **UI Components**: Ready-for-release React components
- **Documentation Updates**: Public-facing documentation changes
- **Feature Releases**: Completed and tested features
- **Bug Fixes**: Validated fixes ready for public use

### Best Practices
1. **Test thoroughly** in private repository before copying to public
2. **Use descriptive commit messages** explaining the changes
3. **Copy entire files** rather than partial changes to maintain consistency
4. **Verify file paths** match between repositories
5. **Check git status** before and after copying to ensure all changes are captured

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
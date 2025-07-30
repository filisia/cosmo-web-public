# Deployment Troubleshooting Guide

## Vercel-to-Localhost Connection Issues

This document provides solutions for common deployment and connection issues when hosting the Cosmoweb app on Vercel while connecting to users' local Mac bridge applications.

## Quick Diagnosis

### ✅ Working Setup Indicators
- Vercel app shows "Bridge App (Beta) Detected"
- No "Refresh Page" message visible when connected
- WebSocket URL in console shows `ws://localhost:8080`
- Mac app logs show incoming WebSocket connections

### ❌ Common Problem Indicators
- Vercel app shows "Searching Bridge App (Beta)" forever
- Console shows "WebSocket connection failed" errors
- Discovery mechanism logs (should not happen anymore)
- Connection attempts to IP addresses other than localhost

## Solution: Direct Localhost Connection

### Root Cause
The issue occurs when configuration files return `null` for production environments, triggering a local network discovery mechanism that cannot work from cloud-hosted applications like Vercel.

### Fix Applied
**Always return `'ws://localhost:8080'` regardless of environment.**

### Configuration Files to Check

#### 1. `src/config.js`
```javascript
// ✅ CORRECT
const getWebSocketUrl = () => {
  if (typeof window !== 'undefined' && window.COSMO_CONFIG && window.COSMO_CONFIG.wsUrl) {
    return window.COSMO_CONFIG.wsUrl;
  }
  return 'ws://localhost:8080'; // Always localhost
};
```

#### 2. `public/config.js`
```javascript
// ✅ CORRECT
const getWebSocketUrl = () => {
  if (wsHostOverride) {
    // Allow manual override for testing
    return `ws://${wsHostOverride}:${wsPortOverride || '8080'}`;
  }
  return 'ws://localhost:8080'; // Always localhost
};
```

## Success Indicators
- ✅ **Vercel app connects to localhost:8080**
- ✅ **No discovery mechanism needed**
- ✅ **No manual IP configuration required**
- ✅ **Works on all user networks (home, office, cafe)**

## References
- **Working example**: `https://cosmoids.vercel.app/` (uses this exact pattern)
- **Browser compatibility**: All modern browsers (Chrome, Safari, Firefox, Edge)
- **Security**: HTTPS sites can connect to localhost WebSocket servers

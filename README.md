# CosmoWeb

A modern web interface for Filisia's Cosmo devices, providing real-time, interactive experiences for therapy, education, and play.

## How It Works

CosmoWeb automatically connects to your locally running Cosmo Bridge app. Here's what happens:

1. **Automatic Discovery**: When you visit CosmoWeb, it automatically searches for your local Cosmo Bridge app
2. **Local Network Search**: The app tries common local network addresses to find your Mac app
3. **Secure Connection**: Once found, it establishes a secure WebSocket connection
4. **Real-time Control**: You can then control your Cosmo devices directly from the browser

## Requirements

- **Cosmo Bridge App**: Must be installed and running on your Mac
- **Same Network**: Your Mac and the device running CosmoWeb must be on the same network
- **Supported Browser**: Chrome or Edge (for WebSocket support)

## Getting Started

### Option 1: Local Network Connection (Recommended)

1. **Install Cosmo Bridge**: Download and install the Cosmo Bridge app on your Mac
2. **Start the Bridge**: Launch the Cosmo Bridge app and ensure it's running
3. **Visit CosmoWeb**: Open this website in your browser from a device on the same network
4. **Wait for Connection**: The app will automatically search for and connect to your Bridge
5. **Start Using**: Once connected, you can control your Cosmo devices!

### Option 2: Internet Connection via Tunnel

If you want to connect from anywhere on the internet:

1. **Install ngrok**: Download from [ngrok.com](https://ngrok.com)
2. **Start your Mac app**: Ensure the Cosmo Bridge app is running
3. **Create tunnel**: Run this command in Terminal:
   ```bash
   ngrok http 8443
   ```
4. **Copy the ngrok URL**: It will look like `https://abc123.ngrok.io`
5. **Connect via URL parameter**: Visit the web app with:
   ```
   https://your-vercel-app.vercel.app?wsHost=abc123.ngrok.io&wsPort=443
   ```

### Option 3: Manual IP Connection

1. **Find your Mac's IP**: Run this in Terminal:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
2. **Ensure Mac app is accessible**: The app should listen on all interfaces
3. **Connect via URL parameter**: Visit the web app with:
   ```
   https://your-vercel-app.vercel.app?wsHost=YOUR_MAC_IP&wsPort=8443
   ```

## Troubleshooting

### "No local Cosmo Bridge app found"

- Ensure the Cosmo Bridge app is installed and running on your Mac
- Check that both devices are on the same network
- Try refreshing the page
- Check the connection logs for more details

### Connection Issues

- Make sure your Mac's firewall allows connections on ports 8080 and 8443
- Try using a different browser (Chrome or Edge recommended)
- Check that the Cosmo Bridge app is listening on all network interfaces
- For internet connections, use ngrok or similar tunnel service

### Manual Testing

You can manually specify a host for testing:
```
https://your-vercel-app.vercel.app?wsHost=192.168.1.100&wsPort=8443
```

## Features

- **Real-time Device Control**: Control LED colors, modes, and luminosity
- **Button Press Detection**: Monitor button presses and releases
- **Device Management**: View connected devices and their status
- **Exercise Games**: Interactive games and activities
- **Visual Music**: Audio-reactive visualizations

## Development

This is a React application that communicates with the Cosmo Bridge via WebSocket. The connection is automatically discovered using local network scanning.

## Security

- All connections use secure WebSocket (WSS) when available
- Local network discovery only - no external connections
- No data is stored or transmitted to external servers
- For internet connections, use secure tunnel services like ngrok 
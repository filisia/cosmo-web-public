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

1. **Install Cosmo Bridge**: Download and install the Cosmo Bridge app on your Mac
2. **Start the Bridge**: Launch the Cosmo Bridge app and ensure it's running
3. **Visit CosmoWeb**: Open this website in your browser
4. **Wait for Connection**: The app will automatically search for and connect to your Bridge
5. **Start Using**: Once connected, you can control your Cosmo devices!

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

### Manual Testing

You can manually specify a host for testing:
```
https://your-app.vercel.app?wsHost=192.168.1.100&wsPort=8443
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
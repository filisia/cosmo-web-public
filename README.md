# Cosmo Bridge Web Application

A React-based web application for connecting to and controlling Cosmo robots through a web interface.

## 🚀 Features

- **Real-time WebSocket Communication** - Connect to Cosmo Bridge servers
- **Device Management** - Discover and manage multiple Cosmo devices
- **Interactive Games** - Exercise games and visual music experiences
- **Responsive Design** - Works on desktop and mobile devices
- **Secure Connections** - Supports both HTTP and HTTPS environments

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket API** - Real-time communication
- **Web Bluetooth API** - Device discovery and connection

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cosmo-web-public.git
cd cosmo-web-public

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Configuration

The application uses a runtime configuration file (`public/config.js`) that can be updated without rebuilding:

```javascript
window.COSMO_CONFIG = {
  wsUrl: 'ws://localhost:8080',  // WebSocket server URL
  debug: false,
  reconnectAttempts: 5,
  reconnectDelay: 1000
};
```

## 🌐 Deployment

This application is deployed on Vercel at [https://cosmo-bridge.vercel.app](https://cosmo-bridge.vercel.app).

### Environment Variables

- `REACT_APP_WS_URL` - WebSocket server URL for production

## 🔗 Connecting to Cosmo Bridge

1. **Start your local Cosmo Bridge server** on port 8080
2. **Open the web application** at [https://cosmo-bridge.vercel.app](https://cosmo-bridge.vercel.app)
3. **The app will automatically connect** to `ws://localhost:8080`
4. **Use the device discovery** to find and connect to Cosmo robots

### Important Notes:
- Each user needs their own local Cosmo Bridge server running
- The web app connects to `localhost:8080` on the user's machine
- No server-side WebSocket proxy is needed

## 📱 Browser Support

- Chrome/Chromium (recommended for Web Bluetooth)
- Firefox
- Safari
- Edge

## 🤝 Contributing

This is a public repository for the web interface. For the full Cosmo Bridge project including desktop applications, see the private repository.

## 📄 License

This project is part of the Cosmo Bridge ecosystem. 
# Dual Repository Deployment Guide

This guide explains how to use the dual repository setup for deploying the Cosmo Bridge web application to Vercel.

## 📁 Repository Structure

### Private Monorepo (`cosmo-bridge`)
- **Location**: Private repository containing both `cosmoweb` and `mac` applications
- **Purpose**: Development and collaboration on the full Cosmo Bridge ecosystem
- **Access**: Private, for team development

### Public Web Repository (`cosmo-web-public`)
- **Location**: Public repository containing only the web application
- **Purpose**: Vercel deployment and public access
- **Access**: Public, for deployment and sharing

## 🚀 Deployment Workflow

### 1. Development (Private Monorepo)
```bash
# Work on features in the private monorepo
cd cosmo-bridge/cosmoweb
# Make changes to the web application
npm start  # Test locally
```

### 2. Sync to Public Repository
```bash
# Navigate to the public repository
cd ../cosmo-web-public

# Run the sync script
./sync-from-monorepo.sh
```

### 3. Deploy to Vercel
```bash
# Push changes to the public repository
git push origin main

# Vercel will automatically deploy from the public repository
```

## 🔧 Vercel Configuration

The public repository is configured with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_WS_URL": "wss://bridge.explorecosmo.com/ws"
  }
}
```

## 📋 Setup Instructions

### Initial Setup

1. **Create the public repository on GitHub**:
   ```bash
   # Create a new repository on GitHub named 'cosmo-web-public'
   # Make it public
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import the `cosmo-web-public` repository
   - Vercel will automatically detect the React configuration

3. **Configure environment variables**:
   - Set `REACT_APP_WS_URL` to your WebSocket server URL
   - Example: `wss://bridge.explorecosmo.com/ws`

### Regular Development Workflow

1. **Make changes in the private monorepo**:
   ```bash
   cd cosmo-bridge/cosmoweb
   # Edit files, test locally
   ```

2. **Sync to public repository**:
   ```bash
   cd ../cosmo-web-public
   ./sync-from-monorepo.sh
   ```

3. **Deploy**:
   ```bash
   git push origin main
   # Vercel automatically deploys
   ```

## 🔄 Sync Script Details

The `sync-from-monorepo.sh` script:

- Creates a backup of current state
- Copies all files from `../cosmo-bridge/cosmoweb/` to current directory
- Excludes `node_modules/`, `build/`, `.git/`, and `.DS_Store`
- Preserves public-specific files (`vercel.json`, `README.md`, `.gitignore`)
- Commits changes if any are detected

## 🛠️ Troubleshooting

### Build Issues
- Ensure all dependencies are properly installed: `npm install`
- Check that the build works locally: `npm run build`
- Verify `vercel.json` configuration is correct

### Sync Issues
- Make sure you're running the sync script from the `cosmo-web-public` directory
- Check that the monorepo path is correct: `../cosmo-bridge/cosmoweb`
- Ensure you have `rsync` installed on your system

### Deployment Issues
- Check Vercel build logs for specific errors
- Verify environment variables are set correctly
- Ensure the public repository is connected to Vercel

## 📝 Best Practices

1. **Always test locally** before syncing
2. **Use meaningful commit messages** in both repositories
3. **Keep the sync script updated** if you change the monorepo structure
4. **Monitor Vercel deployments** for any issues
5. **Update environment variables** when changing WebSocket URLs

## 🔗 Useful Commands

```bash
# Test build locally
npm run build

# Start development server
npm start

# Sync from monorepo
./sync-from-monorepo.sh

# Check git status
git status

# View Vercel deployment logs
vercel logs
```

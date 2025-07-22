#!/bin/bash

# Sync script to update the public repository from the private monorepo
# This script copies changes from the cosmoweb directory in the monorepo to this public repo

set -e

echo "🔄 Syncing public repository from monorepo..."

# Path to the monorepo cosmoweb directory
MONOREPO_COSMOWEB="../cosmo-bridge/cosmoweb"

# Check if the monorepo directory exists
if [ ! -d "$MONOREPO_COSMOWEB" ]; then
    echo "❌ Error: Monorepo cosmoweb directory not found at $MONOREPO_COSMOWEB"
    echo "Make sure you're running this script from the cosmo-web-public directory"
    exit 1
fi

# Create a backup of current state
echo "📦 Creating backup of current state..."
git stash push -m "Backup before sync $(date)"

# Copy files from monorepo (excluding node_modules and build)
echo "📋 Copying files from monorepo..."
rsync -av --delete \
    --exclude='node_modules/' \
    --exclude='build/' \
    --exclude='.git/' \
    --exclude='.DS_Store' \
<<<<<<< Updated upstream
    --exclude='sync-from-monorepo.sh' \
=======
>>>>>>> Stashed changes
    "$MONOREPO_COSMOWEB/" .

# Restore our specific files that shouldn't be overwritten
echo "🔄 Restoring public-specific files..."
<<<<<<< Updated upstream
if git show HEAD:README.md >/dev/null 2>&1; then
    git checkout HEAD -- README.md
fi
if git show HEAD:.gitignore >/dev/null 2>&1; then
    git checkout HEAD -- .gitignore
fi
if git show HEAD:DEPLOYMENT_GUIDE.md >/dev/null 2>&1; then
    git checkout HEAD -- DEPLOYMENT_GUIDE.md
fi
if git show HEAD:vercel.json >/dev/null 2>&1; then
    git checkout HEAD -- vercel.json
fi
=======
git checkout HEAD -- vercel.json
git checkout HEAD -- README.md
git checkout HEAD -- .gitignore
>>>>>>> Stashed changes

# Check if there are any changes
if git diff --quiet; then
    echo "✅ No changes detected"
    git stash pop
else
    echo "📝 Changes detected, committing..."
    git add .
    git commit -m "Sync from monorepo $(date)"
    echo "✅ Sync completed successfully!"
fi

<<<<<<< Updated upstream
echo "🎉 Sync process completed!"
=======
echo "🎉 Sync process completed!" 
>>>>>>> Stashed changes

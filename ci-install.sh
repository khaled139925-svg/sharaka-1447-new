#!/bin/bash
set -e

# CI Installation Script for pnpm
# This script handles pnpm installation in non-TTY environments

export CI=true
export NODE_ENV=production

# Disable TTY checks
export npm_config_loglevel=warn

# Install pnpm globally if not available
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm@10.29.2
fi

# Clean up
rm -rf node_modules/.vite dist 2>/dev/null || true

# Install dependencies with explicit CI settings
pnpm install \
    --no-optional \
    --no-frozen-lockfile \
    --force \
    --recursive \
    2>&1 | grep -v "^Progress:" || true

# Build
pnpm run build

echo "✓ CI build completed successfully"

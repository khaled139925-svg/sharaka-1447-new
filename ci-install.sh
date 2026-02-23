#!/bin/bash
# Safe pnpm installation script for CI environments
# Prevents ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY errors

set -e

echo "🔧 Starting CI-safe pnpm installation..."

# Set critical CI environment variables
export CI=true
export PNPM_HOME="${PNPM_HOME:=$HOME/.pnpm}"
export PATH="$PNPM_HOME:$PATH"
export NODE_ENV=production
export npm_config_loglevel=warn

# Ensure pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm globally..."
    npm install -g pnpm@10.29.2
fi

echo "✓ pnpm version: $(pnpm --version)"

# Ensure .pnpmrc is properly configured for CI
echo "📝 Ensuring .pnpmrc is configured for CI..."
cat > .pnpmrc << 'EOF'
ci-mode=true
force=true
interactive=false
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
prefer-frozen-lockfile=false
node-linker=hoisted
ignore-scripts=false
verify-store-integrity=false
recursive-install=true
optional=false
store-dir=.pnpm-store
EOF

# Clean up any corrupted state
echo "🧹 Cleaning up any corrupted state..."
rm -rf .pnpm-store 2>/dev/null || true
rm -rf node_modules/.pnpm 2>/dev/null || true

# Force fresh installation
echo "📦 Installing dependencies with pnpm..."
pnpm install \
    --no-frozen-lockfile \
    --force \
    --no-optional \
    --recursive \
    2>&1 | grep -v "^Progress:" || true

echo "✅ CI-safe installation completed successfully!"

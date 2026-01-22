#!/bin/bash

# Remote Control Service - Development Setup Script

set -e

echo "=== Remote Control Service Setup ==="

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "ERROR: $1 is not installed. Please install it first."
        exit 1
    fi
    echo "✓ $1 found"
}

echo ""
echo "Checking prerequisites..."
check_command docker
check_command git

# Check for Rust
if command -v cargo &> /dev/null; then
    echo "✓ Rust/Cargo found"
else
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

# Check for Flutter
if command -v flutter &> /dev/null; then
    echo "✓ Flutter found"
else
    echo "WARNING: Flutter not found. Please install Flutter manually."
fi

# Setup vcpkg if not exists
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ ! -d "$PROJECT_ROOT/vcpkg" ]; then
    echo ""
    echo "Setting up vcpkg..."
    cd "$PROJECT_ROOT"
    git clone https://github.com/microsoft/vcpkg
    ./vcpkg/bootstrap-vcpkg.sh
fi

# Install vcpkg dependencies
echo ""
echo "Installing C++ dependencies via vcpkg..."
export VCPKG_ROOT="$PROJECT_ROOT/vcpkg"
cd "$VCPKG_ROOT"
./vcpkg install libvpx libyuv opus aom

# Initialize git submodules for RustDesk
echo ""
echo "Initializing RustDesk submodules..."
cd "$PROJECT_ROOT/rustdesk"
git submodule update --init --recursive

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Start infrastructure: cd infrastructure/docker && docker-compose up -d"
echo "2. Build RustDesk: cd rustdesk && cargo build --release"
echo "3. Run backend: cd backend && ./gradlew bootRun"
echo ""

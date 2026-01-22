#!/bin/bash

# Remote Control Service - Build Script
# Builds customized RustDesk clients for various platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
RUSTDESK_DIR="$PROJECT_ROOT/rustdesk"
OUTPUT_DIR="$PROJECT_ROOT/dist"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_usage() {
    echo "Usage: $0 [platform] [options]"
    echo ""
    echo "Platforms:"
    echo "  macos       Build macOS desktop client"
    echo "  windows     Build Windows desktop client"
    echo "  linux       Build Linux desktop client"
    echo "  android     Build Android mobile client"
    echo "  all         Build all platforms"
    echo ""
    echo "Options:"
    echo "  --release   Build in release mode (default)"
    echo "  --debug     Build in debug mode"
    echo "  --flutter   Build Flutter version (recommended)"
    echo "  --help      Show this help message"
}

# Parse arguments
PLATFORM=""
BUILD_MODE="--release"
USE_FLUTTER="true"

while [[ $# -gt 0 ]]; do
    case $1 in
        macos|windows|linux|android|all)
            PLATFORM=$1
            shift
            ;;
        --release)
            BUILD_MODE="--release"
            shift
            ;;
        --debug)
            BUILD_MODE=""
            shift
            ;;
        --flutter)
            USE_FLUTTER="true"
            shift
            ;;
        --help)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            print_usage
            exit 1
            ;;
    esac
done

if [ -z "$PLATFORM" ]; then
    print_usage
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Set environment variables
export VCPKG_ROOT="$PROJECT_ROOT/vcpkg"
export PATH="$HOME/.cargo/bin:$PATH"

echo -e "${BLUE}=== Remote Control Service Build ===${NC}"
echo -e "Platform: ${GREEN}$PLATFORM${NC}"
echo -e "Mode: ${GREEN}${BUILD_MODE:-debug}${NC}"
echo ""

cd "$RUSTDESK_DIR"

build_macos() {
    echo -e "${YELLOW}Building macOS client...${NC}"

    if [ "$USE_FLUTTER" == "true" ]; then
        python3 build.py --flutter $BUILD_MODE

        # Copy output
        if [ -d "flutter/build/macos/Build/Products/Release" ]; then
            cp -r flutter/build/macos/Build/Products/Release/*.app "$OUTPUT_DIR/"
            echo -e "${GREEN}✓ macOS app copied to $OUTPUT_DIR${NC}"
        fi
    else
        cargo build $BUILD_MODE
        cp target/release/rustdesk "$OUTPUT_DIR/remote-helper-macos"
        echo -e "${GREEN}✓ macOS binary copied to $OUTPUT_DIR${NC}"
    fi
}

build_windows() {
    echo -e "${YELLOW}Building Windows client...${NC}"
    echo -e "${RED}Note: Windows build requires Windows environment${NC}"

    if [ "$USE_FLUTTER" == "true" ]; then
        python3 build.py --flutter $BUILD_MODE
    else
        cargo build $BUILD_MODE --target x86_64-pc-windows-msvc
    fi
}

build_linux() {
    echo -e "${YELLOW}Building Linux client...${NC}"

    if [ "$USE_FLUTTER" == "true" ]; then
        python3 build.py --flutter $BUILD_MODE

        if [ -d "flutter/build/linux/x64/release/bundle" ]; then
            cp -r flutter/build/linux/x64/release/bundle "$OUTPUT_DIR/remote-helper-linux"
            echo -e "${GREEN}✓ Linux app copied to $OUTPUT_DIR${NC}"
        fi
    else
        cargo build $BUILD_MODE
        cp target/release/rustdesk "$OUTPUT_DIR/remote-helper-linux"
    fi
}

build_android() {
    echo -e "${YELLOW}Building Android client...${NC}"

    cd flutter

    # Clean previous build
    flutter clean

    # Get dependencies
    flutter pub get

    # Build APK
    if [ "$BUILD_MODE" == "--release" ]; then
        flutter build apk --release
        cp build/app/outputs/flutter-apk/app-release.apk "$OUTPUT_DIR/remote-helper.apk"
    else
        flutter build apk --debug
        cp build/app/outputs/flutter-apk/app-debug.apk "$OUTPUT_DIR/remote-helper-debug.apk"
    fi

    echo -e "${GREEN}✓ Android APK copied to $OUTPUT_DIR${NC}"
    cd ..
}

# Execute build based on platform
case $PLATFORM in
    macos)
        build_macos
        ;;
    windows)
        build_windows
        ;;
    linux)
        build_linux
        ;;
    android)
        build_android
        ;;
    all)
        build_macos
        build_android
        echo -e "${YELLOW}Note: Windows and Linux builds may require their respective environments${NC}"
        ;;
esac

echo ""
echo -e "${GREEN}=== Build Complete ===${NC}"
echo -e "Output directory: ${BLUE}$OUTPUT_DIR${NC}"
ls -la "$OUTPUT_DIR"

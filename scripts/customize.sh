#!/bin/bash

# Remote Control Service - Customization Script
# This script applies custom branding and configuration to RustDesk

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
RUSTDESK_DIR="$PROJECT_ROOT/rustdesk"
CUSTOM_DIR="$PROJECT_ROOT/customization"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Remote Control Service Customization ===${NC}"
echo ""

# Check if RustDesk directory exists
if [ ! -d "$RUSTDESK_DIR" ]; then
    echo -e "${RED}Error: RustDesk directory not found at $RUSTDESK_DIR${NC}"
    echo "Please run setup.sh first to clone RustDesk"
    exit 1
fi

# Function to backup original files
backup_file() {
    local file=$1
    if [ -f "$file" ] && [ ! -f "${file}.original" ]; then
        cp "$file" "${file}.original"
        echo -e "${YELLOW}Backed up: $file${NC}"
    fi
}

# Function to restore original files
restore_originals() {
    echo -e "${YELLOW}Restoring original files...${NC}"
    find "$RUSTDESK_DIR" -name "*.original" | while read orig; do
        local target="${orig%.original}"
        mv "$orig" "$target"
        echo "Restored: $target"
    done
}

# Parse command line arguments
if [ "$1" == "--restore" ]; then
    restore_originals
    echo -e "${GREEN}Original files restored${NC}"
    exit 0
fi

echo "1. Applying configuration patches..."

# Backup and modify config.rs
CONFIG_FILE="$RUSTDESK_DIR/libs/hbb_common/src/config.rs"
if [ -f "$CONFIG_FILE" ]; then
    backup_file "$CONFIG_FILE"

    # Read server configuration
    SERVER_ADDRESS="${CUSTOM_SERVER:-your-server.example.com}"
    PUBLIC_KEY="${CUSTOM_PUBLIC_KEY:-}"
    APP_NAME="${CUSTOM_APP_NAME:-원격도우미}"
    ORG_ID="${CUSTOM_ORG_ID:-com.remote.helper}"

    # Apply changes using sed
    sed -i.bak "s/RustDesk/$APP_NAME/g" "$CONFIG_FILE"
    sed -i.bak "s/com.carriez/$ORG_ID/g" "$CONFIG_FILE"
    sed -i.bak "s/rs-ny.rustdesk.com/$SERVER_ADDRESS/g" "$CONFIG_FILE"

    if [ -n "$PUBLIC_KEY" ]; then
        sed -i.bak "s/OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw=/$PUBLIC_KEY/g" "$CONFIG_FILE"
    fi

    rm -f "${CONFIG_FILE}.bak"
    echo -e "${GREEN}✓ Config.rs modified${NC}"
fi

echo ""
echo "2. Updating Cargo.toml..."

CARGO_FILE="$RUSTDESK_DIR/Cargo.toml"
if [ -f "$CARGO_FILE" ]; then
    backup_file "$CARGO_FILE"

    sed -i.bak 's/name = "rustdesk"/name = "remote-helper"/g' "$CARGO_FILE"
    sed -i.bak 's/ProductName = "RustDesk"/ProductName = "원격도우미"/g' "$CARGO_FILE"
    sed -i.bak 's/FileDescription = "RustDesk Remote Desktop"/FileDescription = "원격도우미 Remote Support"/g' "$CARGO_FILE"
    sed -i.bak 's/OriginalFilename = "rustdesk.exe"/OriginalFilename = "remote-helper.exe"/g' "$CARGO_FILE"

    rm -f "${CARGO_FILE}.bak"
    echo -e "${GREEN}✓ Cargo.toml modified${NC}"
fi

echo ""
echo "3. Updating Flutter pubspec.yaml..."

PUBSPEC_FILE="$RUSTDESK_DIR/flutter/pubspec.yaml"
if [ -f "$PUBSPEC_FILE" ]; then
    backup_file "$PUBSPEC_FILE"

    sed -i.bak 's/name: flutter_hbb/name: remote_helper/g' "$PUBSPEC_FILE"
    sed -i.bak 's/description: RustDesk/description: 원격도우미/g' "$PUBSPEC_FILE"

    rm -f "${PUBSPEC_FILE}.bak"
    echo -e "${GREEN}✓ pubspec.yaml modified${NC}"
fi

echo ""
echo "4. Copying custom Flutter UI..."

# Copy all custom Flutter files
FLUTTER_LIB="$RUSTDESK_DIR/flutter/lib"
if [ -d "$FLUTTER_LIB" ]; then
    mkdir -p "$FLUTTER_LIB/elderly"

    # Copy elderly UI theme and components
    if [ -f "$CUSTOM_DIR/flutter/elderly_ui_theme.dart" ]; then
        cp "$CUSTOM_DIR/flutter/elderly_ui_theme.dart" "$FLUTTER_LIB/elderly/"
    fi
    if [ -f "$CUSTOM_DIR/flutter/elderly_home_wrapper.dart" ]; then
        cp "$CUSTOM_DIR/flutter/elderly_home_wrapper.dart" "$FLUTTER_LIB/elderly/"
    fi
    if [ -f "$CUSTOM_DIR/flutter/simple_home_page.dart" ]; then
        cp "$CUSTOM_DIR/flutter/simple_home_page.dart" "$FLUTTER_LIB/elderly/"
    fi

    echo -e "${GREEN}✓ Elderly-friendly UI files copied${NC}"
fi

echo ""
echo "5. Updating Android package name..."

ANDROID_BUILD="$RUSTDESK_DIR/flutter/android/app/build.gradle"
if [ -f "$ANDROID_BUILD" ]; then
    backup_file "$ANDROID_BUILD"

    sed -i.bak 's/com.carriez.flutter_hbb/com.remote.helper/g' "$ANDROID_BUILD"

    rm -f "${ANDROID_BUILD}.bak"
    echo -e "${GREEN}✓ Android build.gradle modified${NC}"
fi

echo ""
echo "6. Updating iOS bundle identifier..."

IOS_PROJECT="$RUSTDESK_DIR/flutter/ios/Runner.xcodeproj/project.pbxproj"
if [ -f "$IOS_PROJECT" ]; then
    backup_file "$IOS_PROJECT"

    sed -i.bak 's/com.carriez.rustdesk/com.remote.helper/g' "$IOS_PROJECT"

    rm -f "${IOS_PROJECT}.bak"
    echo -e "${GREEN}✓ iOS project modified${NC}"
fi

echo ""
echo -e "${GREEN}=== Customization Complete ===${NC}"
echo ""
echo "Next steps:"
echo "  1. Replace 'your-server.example.com' with your actual server address"
echo "  2. Add your server's public key to the configuration"
echo "  3. Run build script: ./scripts/build.sh"
echo ""
echo "To restore original files: ./scripts/customize.sh --restore"

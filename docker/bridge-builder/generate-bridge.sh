#!/bin/bash
set -e

echo "=== RustDesk Bridge Generator ==="
echo ""

# Check if rustdesk source is mounted
if [ ! -f "/app/rustdesk/src/flutter_ffi.rs" ]; then
    echo "Error: RustDesk source not found at /app/rustdesk"
    echo "Please mount the rustdesk directory: -v /path/to/rustdesk:/app/rustdesk"
    exit 1
fi

cd /app/rustdesk

echo "1. Preparing Flutter dependencies..."
cd flutter
# Fix extended_text version if needed
sed -i -e 's/extended_text: 14.0.0/extended_text: 13.0.0/g' pubspec.yaml 2>/dev/null || true
flutter pub get
cd ..

echo ""
echo "2. Generating bridge files..."
flutter_rust_bridge_codegen \
    --rust-input ./src/flutter_ffi.rs \
    --dart-output ./flutter/lib/generated_bridge.dart \
    --c-output ./flutter/macos/Runner/bridge_generated.h

echo ""
echo "3. Copying header files..."
cp ./flutter/macos/Runner/bridge_generated.h ./flutter/ios/Runner/bridge_generated.h 2>/dev/null || true

echo ""
echo "=== Bridge Generation Complete ==="
echo ""
echo "Generated files:"
ls -la ./src/bridge_generated*.rs 2>/dev/null || echo "  (Rust files in src/)"
ls -la ./flutter/lib/generated_bridge*.dart 2>/dev/null || echo "  (Dart files in flutter/lib/)"
ls -la ./flutter/macos/Runner/bridge_generated.h 2>/dev/null || echo "  (Header in flutter/macos/)"
echo ""
echo "You can now build RustDesk natively on your platform."

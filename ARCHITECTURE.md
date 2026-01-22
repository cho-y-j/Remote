# Remote Control Service - Architecture Documentation

## RustDesk Source Code Analysis

### Core Directory Structure

```
rustdesk/
├── src/                          # Main Rust application
│   ├── main.rs                   # Entry point
│   ├── client.rs                 # Peer connection handling (152KB)
│   ├── server.rs                 # Server mode implementation
│   ├── rendezvous_mediator.rs    # Communication with rustdesk-server
│   ├── flutter.rs                # Flutter bridge
│   ├── flutter_ffi.rs            # FFI bindings for Flutter
│   ├── ipc.rs                    # Inter-process communication
│   ├── keyboard.rs               # Keyboard handling
│   ├── clipboard.rs              # Clipboard operations
│   ├── common.rs                 # Shared utilities (83KB)
│   ├── ui_interface.rs           # UI interface layer
│   ├── ui_session_interface.rs   # Session UI interface
│   ├── platform/                 # Platform-specific code
│   │   ├── macos.rs
│   │   ├── windows.rs
│   │   └── linux.rs
│   ├── server/                   # Service implementations
│   │   ├── audio_service.rs
│   │   ├── video_service.rs
│   │   ├── input_service.rs
│   │   └── clipboard_service.rs
│   └── lang/                     # Localization (50+ languages)
├── libs/                         # Core libraries
│   ├── hbb_common/               # Common utilities
│   │   ├── src/config.rs         # Configuration management
│   │   ├── protos/               # Protobuf definitions
│   │   └── src/socket_client.rs  # Network connections
│   ├── scrap/                    # Screen capture
│   ├── enigo/                    # Keyboard/mouse control
│   └── clipboard/                # Clipboard handling
├── flutter/                      # Flutter UI
│   ├── lib/
│   │   ├── desktop/              # Desktop-specific UI
│   │   ├── mobile/               # Mobile-specific UI
│   │   ├── common/               # Shared components
│   │   └── models/               # Data models
│   ├── android/                  # Android platform
│   ├── ios/                      # iOS platform
│   ├── macos/                    # macOS platform
│   └── windows/                  # Windows platform
└── res/                          # Resources (icons, assets)
```

### Key Components

#### 1. Rendezvous System (rendezvous_mediator.rs)
- Handles connection to ID server (hbbs)
- Manages NAT traversal
- Coordinates peer-to-peer connections
- Falls back to relay server (hbbr) when direct connection fails

#### 2. Screen Capture (libs/scrap/)
- Platform-specific screen capture
- Supports ScreenCaptureKit on macOS
- Hardware acceleration options

#### 3. Input Control (libs/enigo/)
- Cross-platform keyboard/mouse simulation
- Permission handling per platform

#### 4. Configuration (libs/hbb_common/src/config.rs)
- User preferences
- Server settings
- Connection options
- **Critical for customization**: Server addresses, branding

### Communication Protocol

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────>│    hbbs     │<────│   Helper    │
│  (Elderly)  │     │ (ID Server) │     │ (Support)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │           ┌──────────────┐            │
       └──────────>│    hbbr     │<───────────┘
                   │(Relay Server)│
                   └──────────────┘
```

### Customization Points

1. **Branding**: `res/` directory - logos, icons
2. **Server Address**: `libs/hbb_common/src/config.rs` - hardcode custom server
3. **UI Simplification**: `flutter/lib/` - modify Flutter UI
4. **Language**: `src/lang/` - add/modify translations

### Build System

- `build.py` - Main build script
- `Cargo.toml` - Rust dependencies
- `flutter/pubspec.yaml` - Flutter dependencies
- vcpkg - C++ dependencies (libvpx, libyuv, opus, aom)

### Server Components

#### hbbs (ID/Rendezvous Server)
- Ports: 21115 (TCP), 21116 (TCP/UDP), 21118 (TCP WebSocket)
- Manages client IDs
- Facilitates peer discovery

#### hbbr (Relay Server)
- Ports: 21117 (TCP), 21119 (TCP WebSocket)
- Relays traffic when P2P fails
- Higher bandwidth requirement

## Project Structure for Remote Control Service

```
Remote/
├── rustdesk/                     # Forked RustDesk (customized)
├── vcpkg/                        # C++ package manager
├── backend/                      # Spring Boot API
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── build.gradle
├── infrastructure/               # AWS/Docker configs
│   ├── docker-compose.yml
│   ├── terraform/
│   └── kubernetes/
├── docs/                         # Documentation
└── scripts/                      # Build/deploy scripts
```

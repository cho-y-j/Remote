# Bridge Generator for RustDesk
# Generates flutter_rust_bridge files in a Linux container

FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive
ENV CARGO_EXPAND_VERSION="1.0.95"
ENV FLUTTER_RUST_BRIDGE_VERSION="1.80.1"
ENV RUST_VERSION="1.75"
ENV FLUTTER_VERSION="3.22.3"

# Install prerequisites
RUN apt-get update && apt-get install -y \
    ca-certificates \
    clang \
    cmake \
    curl \
    gcc \
    git \
    g++ \
    libclang-dev \
    libgtk-3-dev \
    llvm-dev \
    nasm \
    ninja-build \
    pkg-config \
    wget \
    unzip \
    xz-utils \
    libstdc++-12-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain ${RUST_VERSION}
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git -b stable /opt/flutter --depth 1
ENV PATH="/opt/flutter/bin:${PATH}"
RUN flutter --version && flutter precache

# Install bridge tools
RUN cargo install cargo-expand --version ${CARGO_EXPAND_VERSION} --locked
RUN cargo install flutter_rust_bridge_codegen --version ${FLUTTER_RUST_BRIDGE_VERSION} --features "uuid" --locked

WORKDIR /app

# Copy the generate script
COPY generate-bridge.sh /generate-bridge.sh
RUN chmod +x /generate-bridge.sh

ENTRYPOINT ["/generate-bridge.sh"]

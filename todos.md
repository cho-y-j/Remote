# Remote Control Service - 작업 현황 및 TODO

> 최종 업데이트: 2026-01-22 (세션 3)
> 프로젝트: RustDesk 기반 원격 지원 서비스 (고령자 친화적 UX)

---

## 프로젝트 개요

**목표**: RustDesk를 커스터마이징하여 고령자를 위한 초간단 원격 지원 서비스 개발

**지원 플랫폼**: Windows, macOS, Android, Web (상담원용)

**기술 스택**:
- 코어: RustDesk (Rust)
- 모바일/데스크톱 UI: Flutter
- 백엔드 API: Java Spring Boot
- 웹 뷰어: React + Vite + TypeScript
- 인프라: Docker, AWS (배포 예정)
- 데이터베이스: PostgreSQL + Redis

---

## 완료된 작업 (Phase 1-5)

### Phase 1: 환경 구축 ✅

| 항목 | 상태 | 비고 |
|------|------|------|
| Rust 설치 (rustup, cargo) | ✅ | v1.92.0 |
| Flutter 설치 | ✅ | v3.38.7 |
| Docker 설치 | ✅ | v29.1.3 |
| AWS CLI 설치 | ✅ | v2.33.4 |
| Git 저장소 초기화 | ✅ | GitHub: cho-y-j/Remote |
| RustDesk 소스 클론 | ✅ | /rustdesk 디렉토리 |
| vcpkg 설치 및 의존성 | ✅ | libvpx, libyuv, opus, aom |

### Phase 2: 서버 인프라 ✅

| 항목 | 상태 | 비고 |
|------|------|------|
| Docker Compose 구성 | ✅ | hbbs, hbbr, postgres, redis |
| hbbs (ID 서버) | ✅ | 포트: 21115, 21116, 21118 |
| hbbr (릴레이 서버) | ✅ | 포트: 21117, 21119 |
| PostgreSQL | ✅ | 포트: 5433 (로컬) |
| Redis | ✅ | 포트: 6380 (로컬) |
| 서버 키 생성 | ✅ | 아래 참조 |
| DB 스키마 생성 | ✅ | users, devices, sessions, connection_logs |

**서버 공개키**:
```
EuqXn0Ag+1F3W66vpAbYYQRbQnhm7F+ZImuRwUoQQi4=
```

### Phase 3: 백엔드 API ✅

| 항목 | 상태 | 비고 |
|------|------|------|
| Spring Boot 프로젝트 | ✅ | Java 17, Gradle |
| JWT 인증 | ✅ | access/refresh token |
| 사용자 API | ✅ | /api/v1/auth/* |
| 디바이스 API | ✅ | /api/v1/devices/* |
| 세션 API | ✅ | /api/v1/sessions/* |
| Swagger 문서 | ✅ | /swagger-ui.html |
| 로컬 실행 확인 | ✅ | 포트: 8081 |

**API 엔드포인트**:
```
POST /api/v1/auth/register  - 회원가입
POST /api/v1/auth/login     - 로그인
GET  /api/v1/sessions/active - 활성 세션
POST /api/v1/sessions/create - 세션 생성
...
```

### Phase 4: 클라이언트 커스터마이징 ✅ (부분)

| 항목 | 상태 | 비고 |
|------|------|------|
| 브랜딩 설정 파일 | ✅ | custom_config.toml |
| 커스터마이징 스크립트 | ✅ | scripts/customize.sh |
| Flutter 고령자 UI 테마 | ✅ | elderly_ui_theme.dart |
| Flutter 홈 래퍼 | ✅ | elderly_home_wrapper.dart |
| 커스터마이징 적용 | ✅ | Cargo.toml, config.rs 등 수정됨 |
| **클라이언트 빌드** | ❌ | bridge_generated.rs 생성 실패 |

### Phase 5: 웹 뷰어 (상담원용) ✅

| 항목 | 상태 | 비고 |
|------|------|------|
| React + Vite 프로젝트 | ✅ | TypeScript |
| 로그인 페이지 | ✅ | LoginPage.tsx |
| 대시보드 | ✅ | DashboardPage.tsx |
| 연결 페이지 | ✅ | ConnectPage.tsx (placeholder) |
| API 연동 | ✅ | axios + interceptors |
| 상태 관리 | ✅ | Zustand |
| 프록시 설정 | ✅ | vite.config.ts → 8081 |

---

## 현재 문제점 및 블로커

### 클라이언트 빌드 - 재확인 필요

**상태 업데이트 (세션 2)**:
- `bridge_generated.rs` 파일 존재 확인됨 ✅
- `flutter/lib/generated_bridge.dart` 파일 존재 확인됨 ✅
- 빌드 테스트 필요 (cargo check --features flutter)

**이전 이슈 (참고용)**:
1. `cargo expand` 실행 시 C/C++ 의존성 컴파일 실패
2. libyuv가 Homebrew에 없음 (vcpkg에는 있음)
3. VCPKG_ROOT 설정해도 일부 패키지에서 SIGKILL 발생

**권장 빌드 방법**:
- Docker 빌드 (가장 안정적)
- 또는 build.py 스크립트 사용

---

## 다음 작업 (TODO)

### 옵션 1: 공식 RustDesk로 서버 테스트 (권장 - 빠름)

```bash
# 1. 공식 RustDesk 다운로드
# https://rustdesk.com/download

# 2. 설정에서 서버 지정:
#    ID 서버: localhost
#    릴레이 서버: localhost
#    공개키: EuqXn0Ag+1F3W66vpAbYYQRbQnhm7F+ZImuRwUoQQi4=

# 3. 두 클라이언트로 연결 테스트
```

### 옵션 2: Docker로 빌드 (권장 - 안정적)

RustDesk 공식 Docker 빌드 이미지 사용:

```bash
# RustDesk 공식 빌드 문서 참조
# https://github.com/rustdesk/rustdesk/blob/master/docs/BUILD.md

# Docker 빌드 예시:
docker build -t rustdesk-builder .
```

### 옵션 3: 로컬 빌드 환경 완성

필요한 작업:
1. libyuv 소스에서 직접 빌드
2. 또는 vcpkg 경로를 모든 빌드 스크립트에 하드코딩
3. bridge_generated.rs 수동 생성 또는 pre-built 파일 사용

---

## 파일 구조

```
/Users/jojo/pro/Remote/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/remote/control/
│   │   ├── controller/         # REST 컨트롤러
│   │   ├── service/            # 비즈니스 로직
│   │   ├── repository/         # JPA 레포지토리
│   │   ├── model/              # 엔티티
│   │   ├── security/           # JWT, Security Config
│   │   └── dto/                # DTO 클래스
│   └── src/main/resources/
│       └── application.yml     # 설정 (포트: 8081)
│
├── infrastructure/
│   └── docker/
│       ├── docker-compose.yml  # hbbs, hbbr, postgres, redis
│       ├── data/               # 서버 키 저장 위치
│       │   └── id_ed25519.pub  # 공개키
│       ├── init-scripts/       # DB 초기화 SQL
│       └── .env                # 환경변수
│
├── customization/
│   ├── config/
│   │   └── custom_config.toml  # 브랜딩/서버 설정
│   └── flutter/
│       ├── elderly_ui_theme.dart
│       └── elderly_home_wrapper.dart
│
├── web-viewer/                 # React 웹 뷰어
│   ├── src/
│   │   ├── pages/              # LoginPage, DashboardPage, ConnectPage
│   │   ├── components/         # Layout
│   │   └── services/           # api.ts, authStore.ts
│   └── vite.config.ts          # 프록시 설정 (→ 8081)
│
├── scripts/
│   ├── customize.sh            # 커스터마이징 적용 스크립트
│   └── build.sh                # 빌드 스크립트
│
├── rustdesk/                   # RustDesk 소스 (gitignore)
└── vcpkg/                      # C++ 패키지 매니저 (gitignore)
```

---

## 서비스 실행 방법

### 1. Docker 서비스 시작

```bash
cd /Users/jojo/pro/Remote/infrastructure/docker
docker-compose up -d
```

### 2. Spring Boot API 시작

```bash
cd /Users/jojo/pro/Remote/backend
./gradlew bootRun
# 실행 후: http://localhost:8081
```

### 3. 웹 뷰어 시작

```bash
cd /Users/jojo/pro/Remote/web-viewer
npm install
npm run dev
# 실행 후: http://localhost:3000
```

### 4. 테스트 계정

```
Email: admin@test.com
Password: admin123
```

---

## Git 커밋 히스토리

```
40c602e Update rustdesk submodule with customizations
b6ac75d Upload current work
7ccab9f Add project status and TODO documentation
91f42db Update web viewer proxy to use correct API port
1a44dda Fix backend configuration for local development
0bc3a4b Add web viewer for support staff (React + Vite)
```

---

## 참고 링크

- GitHub 저장소: https://github.com/cho-y-j/Remote
- RustDesk 공식: https://rustdesk.com
- RustDesk 빌드 문서: https://github.com/rustdesk/rustdesk/blob/master/docs/BUILD.md

---

## 완료된 작업 (세션 3)

- ✅ macOS 클라이언트 빌드 성공 (RustDesk.app)
- ✅ 로컬 서버 연결 테스트 성공
- ✅ 웹 뷰어 관리 대시보드로 업데이트

## 다음 세션에서 할 일

1. **E2E 테스트**: 다른 기기(Windows/Android)에서 연결 테스트
2. **Windows 빌드**: GitHub Actions 또는 Windows PC에서 빌드
3. **Android 빌드**: Flutter Android 빌드
4. **AWS 배포**: 프로덕션 서버 구축
5. **브랜딩 완성**: 앱 이름/아이콘 커스터마이징

### 서비스 시작 순서
```bash
# 1. Docker (hbbs, hbbr, DB)
cd /Users/jojo/pro/Remote/infrastructure/docker && docker-compose up -d

# 2. Backend (8081)
cd /Users/jojo/pro/Remote/backend && ./gradlew bootRun

# 3. Web Viewer (3000)
cd /Users/jojo/pro/Remote/web-viewer && npm run dev
```

### macOS 앱 실행
```bash
# 코드 서명 후 실행
cd /Users/jojo/pro/Remote/rustdesk/flutter
codesign --force --deep --sign - build/macos/Build/Products/Release/RustDesk.app
open build/macos/Build/Products/Release/RustDesk.app
```

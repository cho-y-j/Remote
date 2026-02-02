-- My Computers Feature Schema
-- 내 컴퓨터 기능을 위한 스키마

-- Device Trusts (신뢰된 기기 관계)
CREATE TABLE IF NOT EXISTS device_trusts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 소유자 (이 기기에 접속할 수 있는 사용자)
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 신뢰된 기기 (등록된 devices 테이블 참조, nullable - 아직 등록 안된 경우)
    trusted_device_id UUID REFERENCES devices(id) ON DELETE SET NULL,

    -- RustDesk ID (9자리)
    rustdesk_id VARCHAR(20) NOT NULL,

    -- 영구 비밀번호 해시 (bcrypt)
    permanent_password_hash VARCHAR(255),

    -- 별칭 ("집 PC", "회사 PC", "고객A 컴퓨터")
    alias VARCHAR(100),

    -- 신뢰 레벨
    trust_level VARCHAR(20) NOT NULL DEFAULT 'FULL_ACCESS',
    -- FULL_ACCESS: 완전 제어
    -- VIEW_ONLY: 보기 전용
    -- FILE_TRANSFER: 파일 전송만

    -- 승인 설정
    require_approval BOOLEAN DEFAULT false,  -- false = 비밀번호만으로 연결

    -- 메타데이터
    platform VARCHAR(50),
    hostname VARCHAR(100),
    tags TEXT DEFAULT '[]',
    note TEXT,

    -- 연결 통계
    connection_count INTEGER DEFAULT 0,
    last_connected_at TIMESTAMP WITH TIME ZONE,

    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 유효기간 (NULL = 무기한)
    expires_at TIMESTAMP WITH TIME ZONE,

    -- 유니크 제약
    CONSTRAINT uk_owner_rustdesk UNIQUE (owner_user_id, rustdesk_id)
);

-- 인덱스
CREATE INDEX idx_device_trusts_owner ON device_trusts(owner_user_id);
CREATE INDEX idx_device_trusts_rustdesk_id ON device_trusts(rustdesk_id);
CREATE INDEX idx_device_trusts_device ON device_trusts(trusted_device_id);

-- Trust Requests (신뢰 요청 - 고객 기기 등록용)
CREATE TABLE IF NOT EXISTS trust_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 요청자 (상담원/도움주는 사람)
    requester_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 대상 기기 정보
    target_rustdesk_id VARCHAR(20) NOT NULL,
    target_device_name VARCHAR(100),

    -- 승인 코드 (6자리)
    approval_code VARCHAR(10) NOT NULL,

    -- 상태
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING: 대기 중
    -- APPROVED: 승인됨
    -- REJECTED: 거절됨
    -- EXPIRED: 만료됨

    -- 요청 시 설정할 값들
    alias VARCHAR(100),
    trust_level VARCHAR(20) DEFAULT 'FULL_ACCESS',
    require_approval BOOLEAN DEFAULT false,
    note TEXT,

    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,

    -- 유니크 제약
    CONSTRAINT uk_approval_code UNIQUE (approval_code)
);

-- 인덱스
CREATE INDEX idx_trust_requests_requester ON trust_requests(requester_user_id);
CREATE INDEX idx_trust_requests_code ON trust_requests(approval_code);
CREATE INDEX idx_trust_requests_status ON trust_requests(status);

-- My Computer Connections (연결 이력)
CREATE TABLE IF NOT EXISTS my_computer_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 신뢰 관계 참조
    trust_id UUID NOT NULL REFERENCES device_trusts(id) ON DELETE CASCADE,

    -- 연결한 사용자
    user_id UUID NOT NULL REFERENCES users(id),

    -- 연결 정보
    connection_type VARCHAR(20) NOT NULL DEFAULT 'REMOTE',
    -- REMOTE: 원격 제어
    -- FILE_TRANSFER: 파일 전송
    -- PORT_FORWARD: 포트 포워딩

    -- 시간
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,

    -- 네트워크 정보
    client_ip VARCHAR(45),
    connection_mode VARCHAR(20) -- DIRECT, RELAY
);

-- 인덱스
CREATE INDEX idx_mc_connections_trust ON my_computer_connections(trust_id);
CREATE INDEX idx_mc_connections_user ON my_computer_connections(user_id);
CREATE INDEX idx_mc_connections_time ON my_computer_connections(started_at);

-- Trigger for updated_at on device_trusts
CREATE TRIGGER update_device_trusts_updated_at
    BEFORE UPDATE ON device_trusts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 기본 테스트 데이터 (선택적)
-- INSERT INTO device_trusts (owner_user_id, rustdesk_id, alias, platform)
-- SELECT id, '123456789', '테스트 PC', 'WINDOWS' FROM users WHERE email = 'admin@test.com' LIMIT 1;

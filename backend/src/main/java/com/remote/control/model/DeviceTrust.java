package com.remote.control.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "device_trusts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceTrust {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trusted_device_id")
    private Device trustedDevice;

    @Column(name = "rustdesk_id", nullable = false)
    private String rustdeskId;

    @Column(name = "permanent_password_hash")
    private String permanentPasswordHash;

    private String alias;

    @Enumerated(EnumType.STRING)
    @Column(name = "trust_level", nullable = false)
    @Builder.Default
    private TrustLevel trustLevel = TrustLevel.FULL_ACCESS;

    @Column(name = "require_approval")
    @Builder.Default
    private Boolean requireApproval = false;

    private String platform;

    private String hostname;

    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private String tags = "[]";

    private String note;

    @Column(name = "connection_count")
    @Builder.Default
    private Integer connectionCount = 0;

    @Column(name = "last_connected_at")
    private OffsetDateTime lastConnectedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    public enum TrustLevel {
        FULL_ACCESS,    // 완전 제어
        VIEW_ONLY,      // 보기 전용
        FILE_TRANSFER   // 파일 전송만
    }

    // 편의 메서드: 온라인 여부 (trustedDevice가 있고 온라인인 경우)
    public Boolean isOnline() {
        return trustedDevice != null && trustedDevice.getIsOnline();
    }

    // 편의 메서드: 만료 여부
    public Boolean isExpired() {
        return expiresAt != null && OffsetDateTime.now().isAfter(expiresAt);
    }

    // 연결 카운트 증가
    public void incrementConnectionCount() {
        this.connectionCount = (this.connectionCount == null ? 0 : this.connectionCount) + 1;
        this.lastConnectedAt = OffsetDateTime.now();
    }
}

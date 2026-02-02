package com.remote.control.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trust_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrustRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_user_id", nullable = false)
    private User requester;

    @Column(name = "target_rustdesk_id", nullable = false)
    private String targetRustdeskId;

    @Column(name = "target_device_name")
    private String targetDeviceName;

    @Column(name = "approval_code", nullable = false, unique = true)
    private String approvalCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    // 승인 시 설정할 값들
    private String alias;

    @Enumerated(EnumType.STRING)
    @Column(name = "trust_level")
    @Builder.Default
    private DeviceTrust.TrustLevel trustLevel = DeviceTrust.TrustLevel.FULL_ACCESS;

    @Column(name = "require_approval")
    @Builder.Default
    private Boolean requireApproval = false;

    private String note;

    @CreationTimestamp
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "processed_at")
    private OffsetDateTime processedAt;

    public enum RequestStatus {
        PENDING,    // 대기 중
        APPROVED,   // 승인됨
        REJECTED,   // 거절됨
        EXPIRED     // 만료됨
    }

    // 편의 메서드: 만료 여부
    public Boolean isExpired() {
        return OffsetDateTime.now().isAfter(expiresAt);
    }

    // 편의 메서드: 처리 가능 여부
    public Boolean canProcess() {
        return status == RequestStatus.PENDING && !isExpired();
    }
}

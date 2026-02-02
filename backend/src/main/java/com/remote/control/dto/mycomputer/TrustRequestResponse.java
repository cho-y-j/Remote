package com.remote.control.dto.mycomputer;

import com.remote.control.model.DeviceTrust;
import com.remote.control.model.TrustRequest;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class TrustRequestResponse {

    private UUID id;
    private String targetRustdeskId;
    private String targetDeviceName;
    private String approvalCode;
    private TrustRequest.RequestStatus status;
    private String alias;
    private DeviceTrust.TrustLevel trustLevel;
    private Boolean requireApproval;
    private String note;
    private OffsetDateTime createdAt;
    private OffsetDateTime expiresAt;
    private OffsetDateTime processedAt;

    // 남은 시간 (초)
    private Long remainingSeconds;

    public static TrustRequestResponse from(TrustRequest request) {
        long remaining = 0;
        if (request.getExpiresAt() != null && request.getStatus() == TrustRequest.RequestStatus.PENDING) {
            remaining = Math.max(0,
                java.time.Duration.between(OffsetDateTime.now(), request.getExpiresAt()).getSeconds());
        }

        return TrustRequestResponse.builder()
                .id(request.getId())
                .targetRustdeskId(request.getTargetRustdeskId())
                .targetDeviceName(request.getTargetDeviceName())
                .approvalCode(request.getApprovalCode())
                .status(request.getStatus())
                .alias(request.getAlias())
                .trustLevel(request.getTrustLevel())
                .requireApproval(request.getRequireApproval())
                .note(request.getNote())
                .createdAt(request.getCreatedAt())
                .expiresAt(request.getExpiresAt())
                .processedAt(request.getProcessedAt())
                .remainingSeconds(remaining)
                .build();
    }
}

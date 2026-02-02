package com.remote.control.dto.mycomputer;

import com.remote.control.model.DeviceTrust;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class MyComputerResponse {

    private UUID id;
    private String rustdeskId;
    private String alias;
    private DeviceTrust.TrustLevel trustLevel;
    private Boolean requireApproval;
    private String platform;
    private String hostname;
    private String note;

    // 상태 정보
    private Boolean isOnline;
    private Boolean hasPassword;

    // 통계
    private Integer connectionCount;
    private OffsetDateTime lastConnectedAt;

    // 타임스탬프
    private OffsetDateTime createdAt;
    private OffsetDateTime expiresAt;

    public static MyComputerResponse from(DeviceTrust trust) {
        return MyComputerResponse.builder()
                .id(trust.getId())
                .rustdeskId(trust.getRustdeskId())
                .alias(trust.getAlias())
                .trustLevel(trust.getTrustLevel())
                .requireApproval(trust.getRequireApproval())
                .platform(trust.getPlatform())
                .hostname(trust.getHostname())
                .note(trust.getNote())
                .isOnline(trust.isOnline())
                .hasPassword(trust.getPermanentPasswordHash() != null)
                .connectionCount(trust.getConnectionCount())
                .lastConnectedAt(trust.getLastConnectedAt())
                .createdAt(trust.getCreatedAt())
                .expiresAt(trust.getExpiresAt())
                .build();
    }
}

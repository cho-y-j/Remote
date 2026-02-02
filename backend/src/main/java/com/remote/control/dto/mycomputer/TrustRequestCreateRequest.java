package com.remote.control.dto.mycomputer;

import com.remote.control.model.DeviceTrust;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrustRequestCreateRequest {

    @NotBlank(message = "대상 RustDesk ID는 필수입니다")
    @Size(min = 9, max = 20)
    private String targetRustdeskId;

    // 대상 기기 이름 (선택)
    private String targetDeviceName;

    // 등록 시 사용할 별칭
    @Size(max = 100)
    private String alias;

    // 신뢰 레벨
    private DeviceTrust.TrustLevel trustLevel = DeviceTrust.TrustLevel.FULL_ACCESS;

    // 연결 시 승인 필요 여부
    private Boolean requireApproval = false;

    // 메모
    private String note;

    // 승인 코드 유효 시간 (분, 기본 30분)
    private Integer expirationMinutes = 30;
}

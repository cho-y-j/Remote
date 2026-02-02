package com.remote.control.dto.mycomputer;

import com.remote.control.model.DeviceTrust;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MyComputerRegisterRequest {

    @NotBlank(message = "RustDesk ID는 필수입니다")
    @Size(min = 9, max = 20, message = "RustDesk ID는 9~20자리입니다")
    private String rustdeskId;

    // 영구 비밀번호 (선택사항 - 나중에 설정 가능)
    private String permanentPassword;

    // 별칭 (집 PC, 회사 PC 등)
    @Size(max = 100)
    private String alias;

    // 신뢰 레벨
    private DeviceTrust.TrustLevel trustLevel = DeviceTrust.TrustLevel.FULL_ACCESS;

    // 연결 시 승인 필요 여부
    private Boolean requireApproval = false;

    // 플랫폼 정보 (자동 감지 또는 수동 입력)
    private String platform;

    // 호스트명
    private String hostname;

    // 메모
    private String note;
}

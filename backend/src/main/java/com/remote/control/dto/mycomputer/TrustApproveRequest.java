package com.remote.control.dto.mycomputer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrustApproveRequest {

    @NotBlank(message = "승인 코드는 필수입니다")
    @Size(min = 6, max = 6, message = "승인 코드는 6자리입니다")
    private String approvalCode;

    // 영구 비밀번호 (선택)
    private String permanentPassword;
}

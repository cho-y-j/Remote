package com.remote.control.dto.mycomputer;

import com.remote.control.model.DeviceTrust;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MyComputerUpdateRequest {

    @Size(max = 100)
    private String alias;

    private DeviceTrust.TrustLevel trustLevel;

    private Boolean requireApproval;

    private String note;

    // 비밀번호 변경 (null이면 변경 안함)
    private String newPermanentPassword;
}

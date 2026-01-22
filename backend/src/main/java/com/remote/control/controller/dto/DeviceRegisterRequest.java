package com.remote.control.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DeviceRegisterRequest(
        @NotBlank String deviceId,
        String name,
        @NotNull String platform,
        String osVersion
) {}

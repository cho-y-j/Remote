package com.remote.control.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BillingAuthRequest(
        @NotBlank String authKey,
        @NotBlank String customerKey,
        @NotNull String plan,
        @NotNull String billingCycle
) {}

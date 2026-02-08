package com.remote.control.controller.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        String orderId,
        Integer amount,
        String status,
        String orderName,
        OffsetDateTime paidAt,
        OffsetDateTime createdAt
) {}

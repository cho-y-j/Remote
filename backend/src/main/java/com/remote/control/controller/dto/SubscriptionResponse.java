package com.remote.control.controller.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SubscriptionResponse(
        UUID id,
        String plan,
        String status,
        String billingCycle,
        Integer amount,
        OffsetDateTime currentPeriodStart,
        OffsetDateTime currentPeriodEnd,
        OffsetDateTime cancelledAt,
        OffsetDateTime createdAt
) {}

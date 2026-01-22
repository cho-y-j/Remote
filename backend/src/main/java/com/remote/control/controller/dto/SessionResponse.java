package com.remote.control.controller.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SessionResponse(
        UUID id,
        String sessionCode,
        String hostDeviceId,
        String clientDeviceId,
        String status,
        OffsetDateTime startedAt,
        OffsetDateTime endedAt,
        Integer durationSeconds
) {}

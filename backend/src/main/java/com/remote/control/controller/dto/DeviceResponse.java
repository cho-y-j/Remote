package com.remote.control.controller.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceResponse(
        UUID id,
        String deviceId,
        String name,
        String platform,
        String osVersion,
        Boolean isOnline,
        OffsetDateTime lastSeen
) {}

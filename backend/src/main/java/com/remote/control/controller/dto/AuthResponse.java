package com.remote.control.controller.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String email,
        String name,
        String plan
) {}

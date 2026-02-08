package com.remote.control.controller;

import com.remote.control.model.User;
import com.remote.control.service.PlanLimitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/plan")
@RequiredArgsConstructor
@Tag(name = "Plan", description = "User plan and limits API")
public class PlanController {

    private final PlanLimitService planLimitService;

    @GetMapping("/limits")
    @Operation(summary = "Get current user's plan limits")
    public ResponseEntity<PlanLimitService.PlanLimits> getLimits(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(planLimitService.getLimits(user.getPlan()));
    }
}

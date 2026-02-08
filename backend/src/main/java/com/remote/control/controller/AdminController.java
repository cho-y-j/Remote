package com.remote.control.controller;

import com.remote.control.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard API")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard overview stats")
    public ResponseEntity<AdminService.DashboardStats> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users with pagination")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(page, size));
    }

    @PutMapping("/users/{userId}/plan")
    @Operation(summary = "Change a user's plan")
    public ResponseEntity<?> changeUserPlan(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> body) {
        String plan = body.get("plan");
        return ResponseEntity.ok(adminService.changeUserPlan(userId, plan));
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Change a user's role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> body) {
        String role = body.get("role");
        return ResponseEntity.ok(adminService.changeUserRole(userId, role));
    }

    @GetMapping("/payments")
    @Operation(summary = "Get recent payments")
    public ResponseEntity<?> getRecentPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getRecentPayments(page, size));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get active sessions")
    public ResponseEntity<?> getActiveSessions() {
        return ResponseEntity.ok(adminService.getAllActiveSessions());
    }
}

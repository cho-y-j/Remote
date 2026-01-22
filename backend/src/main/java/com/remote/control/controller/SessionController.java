package com.remote.control.controller;

import com.remote.control.controller.dto.SessionCreateRequest;
import com.remote.control.controller.dto.SessionResponse;
import com.remote.control.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "Remote control session management API")
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    @Operation(summary = "Create a new remote session")
    public ResponseEntity<SessionResponse> createSession(@Valid @RequestBody SessionCreateRequest request) {
        return ResponseEntity.ok(sessionService.createSession(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get session by ID")
    public ResponseEntity<SessionResponse> getSession(@PathVariable UUID id) {
        return ResponseEntity.ok(sessionService.getSession(id));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get session by code")
    public ResponseEntity<SessionResponse> getSessionByCode(@PathVariable String code) {
        return ResponseEntity.ok(sessionService.getSessionByCode(code));
    }

    @PostMapping("/code/{code}/join")
    @Operation(summary = "Join a session using session code")
    public ResponseEntity<SessionResponse> joinSession(
            @PathVariable String code,
            @RequestParam String clientDeviceId) {
        return ResponseEntity.ok(sessionService.joinSession(code, clientDeviceId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "End a session")
    public ResponseEntity<SessionResponse> endSession(@PathVariable UUID id) {
        return ResponseEntity.ok(sessionService.endSession(id));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active sessions")
    public ResponseEntity<List<SessionResponse>> getActiveSessions() {
        return ResponseEntity.ok(sessionService.getActiveSessions());
    }
}

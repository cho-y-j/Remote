package com.remote.control.controller;

import com.remote.control.controller.dto.DeviceRegisterRequest;
import com.remote.control.controller.dto.DeviceResponse;
import com.remote.control.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@Tag(name = "Devices", description = "Device management API")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("/register")
    @Operation(summary = "Register a new device")
    public ResponseEntity<DeviceResponse> registerDevice(
            @Valid @RequestBody DeviceRegisterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(deviceService.registerDevice(request, userDetails.getUsername()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's devices")
    public ResponseEntity<List<DeviceResponse>> getMyDevices(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(deviceService.getUserDevices(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a device")
    public ResponseEntity<Void> deleteDevice(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        deviceService.deleteDevice(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{deviceId}/heartbeat")
    @Operation(summary = "Update device online status")
    public ResponseEntity<Void> heartbeat(@PathVariable String deviceId) {
        deviceService.updateHeartbeat(deviceId);
        return ResponseEntity.ok().build();
    }
}

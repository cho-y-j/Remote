package com.remote.control.service;

import com.remote.control.controller.dto.DeviceRegisterRequest;
import com.remote.control.controller.dto.DeviceResponse;
import com.remote.control.model.Device;
import com.remote.control.model.User;
import com.remote.control.repository.DeviceRepository;
import com.remote.control.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final PlanLimitService planLimitService;

    @Transactional
    public DeviceResponse registerDevice(DeviceRegisterRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check plan device limit for new devices
        Device device = deviceRepository.findByDeviceId(request.deviceId()).orElse(null);
        if (device == null) {
            int currentCount = deviceRepository.findByUser(user).size();
            int maxDevices = planLimitService.getMaxDevices(user.getPlan());
            if (currentCount >= maxDevices) {
                throw new IllegalStateException(
                        "기기 등록 한도 초과 (최대 " + maxDevices + "대). 업그레이드가 필요합니다.");
            }
            device = Device.builder().deviceId(request.deviceId()).build();
        }

        device.setUser(user);
        device.setName(request.name());
        device.setPlatform(Device.Platform.valueOf(request.platform().toUpperCase()));
        device.setOsVersion(request.osVersion());
        device.setLastSeen(OffsetDateTime.now());
        device.setIsOnline(true);

        device = deviceRepository.save(device);
        return mapToResponse(device);
    }

    public List<DeviceResponse> getUserDevices(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return deviceRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteDevice(UUID deviceId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));

        if (!device.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to delete this device");
        }

        deviceRepository.delete(device);
    }

    @Transactional
    public void updateHeartbeat(String deviceId) {
        Device device = deviceRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));

        device.setLastSeen(OffsetDateTime.now());
        device.setIsOnline(true);
        deviceRepository.save(device);
    }

    private DeviceResponse mapToResponse(Device device) {
        return new DeviceResponse(
                device.getId(),
                device.getDeviceId(),
                device.getName(),
                device.getPlatform().name(),
                device.getOsVersion(),
                device.getIsOnline(),
                device.getLastSeen()
        );
    }
}

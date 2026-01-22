package com.remote.control.service;

import com.remote.control.controller.dto.SessionCreateRequest;
import com.remote.control.controller.dto.SessionResponse;
import com.remote.control.model.Device;
import com.remote.control.model.Session;
import com.remote.control.repository.DeviceRepository;
import com.remote.control.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final DeviceRepository deviceRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public SessionResponse createSession(SessionCreateRequest request) {
        Device hostDevice = deviceRepository.findByDeviceId(request.hostDeviceId())
                .orElseThrow(() -> new IllegalArgumentException("Host device not found"));

        String sessionCode = generateSessionCode();

        Session session = Session.builder()
                .hostDevice(hostDevice)
                .sessionCode(sessionCode)
                .status(Session.Status.PENDING)
                .startedAt(OffsetDateTime.now())
                .build();

        session = sessionRepository.save(session);
        return mapToResponse(session);
    }

    public SessionResponse getSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        return mapToResponse(session);
    }

    public SessionResponse getSessionByCode(String code) {
        Session session = sessionRepository.findBySessionCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        return mapToResponse(session);
    }

    @Transactional
    public SessionResponse joinSession(String sessionCode, String clientDeviceId) {
        Session session = sessionRepository.findBySessionCode(sessionCode)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (session.getStatus() != Session.Status.PENDING) {
            throw new IllegalStateException("Session is not available for joining");
        }

        Device clientDevice = deviceRepository.findByDeviceId(clientDeviceId)
                .orElseThrow(() -> new IllegalArgumentException("Client device not found"));

        session.setClientDevice(clientDevice);
        session.setStatus(Session.Status.CONNECTING);
        session = sessionRepository.save(session);

        return mapToResponse(session);
    }

    @Transactional
    public SessionResponse endSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        session.setStatus(Session.Status.ENDED);
        session.setEndedAt(OffsetDateTime.now());

        if (session.getStartedAt() != null) {
            long seconds = ChronoUnit.SECONDS.between(session.getStartedAt(), session.getEndedAt());
            session.setDurationSeconds((int) seconds);
        }

        session = sessionRepository.save(session);
        return mapToResponse(session);
    }

    public List<SessionResponse> getActiveSessions() {
        return sessionRepository.findAllActiveSessions().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String generateSessionCode() {
        int code = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(code);
    }

    private SessionResponse mapToResponse(Session session) {
        return new SessionResponse(
                session.getId(),
                session.getSessionCode(),
                session.getHostDevice() != null ? session.getHostDevice().getDeviceId() : null,
                session.getClientDevice() != null ? session.getClientDevice().getDeviceId() : null,
                session.getStatus().name(),
                session.getStartedAt(),
                session.getEndedAt(),
                session.getDurationSeconds()
        );
    }
}

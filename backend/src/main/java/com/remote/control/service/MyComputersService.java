package com.remote.control.service;

import com.remote.control.dto.mycomputer.*;
import com.remote.control.model.Device;
import com.remote.control.model.DeviceTrust;
import com.remote.control.model.TrustRequest;
import com.remote.control.model.User;
import com.remote.control.repository.DeviceRepository;
import com.remote.control.repository.DeviceTrustRepository;
import com.remote.control.repository.TrustRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyComputersService {

    private final DeviceTrustRepository deviceTrustRepository;
    private final TrustRequestRepository trustRequestRepository;
    private final DeviceRepository deviceRepository;
    private final PasswordEncoder passwordEncoder;

    private static final SecureRandom RANDOM = new SecureRandom();

    // ==================== 내 컴퓨터 관리 ====================

    /**
     * 내 컴퓨터 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MyComputerResponse> getMyComputers(User owner) {
        return deviceTrustRepository.findByOwnerOrderByCreatedAtDesc(owner)
                .stream()
                .map(MyComputerResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 활성 컴퓨터만 조회 (만료되지 않은)
     */
    @Transactional(readOnly = true)
    public List<MyComputerResponse> getActiveComputers(User owner) {
        return deviceTrustRepository.findActiveByOwner(owner)
                .stream()
                .map(MyComputerResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 온라인 컴퓨터만 조회
     */
    @Transactional(readOnly = true)
    public List<MyComputerResponse> getOnlineComputers(User owner) {
        return deviceTrustRepository.findOnlineByOwner(owner)
                .stream()
                .map(MyComputerResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 특정 컴퓨터 조회
     */
    @Transactional(readOnly = true)
    public MyComputerResponse getMyComputer(User owner, UUID trustId) {
        DeviceTrust trust = deviceTrustRepository.findById(trustId)
                .filter(t -> t.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new IllegalArgumentException("기기를 찾을 수 없습니다"));
        return MyComputerResponse.from(trust);
    }

    /**
     * 새 컴퓨터 등록
     */
    @Transactional
    public MyComputerResponse registerComputer(User owner, MyComputerRegisterRequest request) {
        // 중복 확인
        if (deviceTrustRepository.existsByOwnerAndRustdeskId(owner, request.getRustdeskId())) {
            throw new IllegalArgumentException("이미 등록된 기기입니다: " + request.getRustdeskId());
        }

        // 기존 devices 테이블에서 기기 찾기
        Optional<Device> existingDevice = deviceRepository.findByRustdeskId(request.getRustdeskId());

        DeviceTrust trust = DeviceTrust.builder()
                .owner(owner)
                .rustdeskId(request.getRustdeskId())
                .trustedDevice(existingDevice.orElse(null))
                .alias(request.getAlias())
                .trustLevel(request.getTrustLevel() != null ? request.getTrustLevel() : DeviceTrust.TrustLevel.FULL_ACCESS)
                .requireApproval(request.getRequireApproval() != null ? request.getRequireApproval() : false)
                .platform(request.getPlatform())
                .hostname(request.getHostname())
                .note(request.getNote())
                .build();

        // 비밀번호 해시 (제공된 경우)
        if (request.getPermanentPassword() != null && !request.getPermanentPassword().isBlank()) {
            trust.setPermanentPasswordHash(passwordEncoder.encode(request.getPermanentPassword()));
        }

        DeviceTrust saved = deviceTrustRepository.save(trust);
        log.info("새 컴퓨터 등록: userId={}, rustdeskId={}", owner.getId(), request.getRustdeskId());

        return MyComputerResponse.from(saved);
    }

    /**
     * 컴퓨터 정보 수정
     */
    @Transactional
    public MyComputerResponse updateComputer(User owner, UUID trustId, MyComputerUpdateRequest request) {
        DeviceTrust trust = deviceTrustRepository.findById(trustId)
                .filter(t -> t.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new IllegalArgumentException("기기를 찾을 수 없습니다"));

        if (request.getAlias() != null) {
            trust.setAlias(request.getAlias());
        }
        if (request.getTrustLevel() != null) {
            trust.setTrustLevel(request.getTrustLevel());
        }
        if (request.getRequireApproval() != null) {
            trust.setRequireApproval(request.getRequireApproval());
        }
        if (request.getNote() != null) {
            trust.setNote(request.getNote());
        }
        if (request.getNewPermanentPassword() != null) {
            if (request.getNewPermanentPassword().isBlank()) {
                trust.setPermanentPasswordHash(null); // 비밀번호 제거
            } else {
                trust.setPermanentPasswordHash(passwordEncoder.encode(request.getNewPermanentPassword()));
            }
        }

        DeviceTrust saved = deviceTrustRepository.save(trust);
        log.info("컴퓨터 정보 수정: trustId={}", trustId);

        return MyComputerResponse.from(saved);
    }

    /**
     * 컴퓨터 등록 해제
     */
    @Transactional
    public void removeComputer(User owner, UUID trustId) {
        DeviceTrust trust = deviceTrustRepository.findById(trustId)
                .filter(t -> t.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new IllegalArgumentException("기기를 찾을 수 없습니다"));

        deviceTrustRepository.delete(trust);
        log.info("컴퓨터 등록 해제: trustId={}, rustdeskId={}", trustId, trust.getRustdeskId());
    }

    /**
     * 연결 기록 (연결할 때마다 호출)
     */
    @Transactional
    public void recordConnection(User owner, UUID trustId) {
        DeviceTrust trust = deviceTrustRepository.findById(trustId)
                .filter(t -> t.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new IllegalArgumentException("기기를 찾을 수 없습니다"));

        trust.incrementConnectionCount();
        deviceTrustRepository.save(trust);
    }

    /**
     * 비밀번호 검증
     */
    @Transactional(readOnly = true)
    public boolean verifyPassword(User owner, UUID trustId, String password) {
        DeviceTrust trust = deviceTrustRepository.findById(trustId)
                .filter(t -> t.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new IllegalArgumentException("기기를 찾을 수 없습니다"));

        if (trust.getPermanentPasswordHash() == null) {
            return false;
        }

        return passwordEncoder.matches(password, trust.getPermanentPasswordHash());
    }

    // ==================== 신뢰 요청 관리 ====================

    /**
     * 신뢰 요청 생성 (고객 기기 등록 요청)
     */
    @Transactional
    public TrustRequestResponse createTrustRequest(User requester, TrustRequestCreateRequest request) {
        // 이미 등록된 기기인지 확인
        if (deviceTrustRepository.existsByOwnerAndRustdeskId(requester, request.getTargetRustdeskId())) {
            throw new IllegalArgumentException("이미 등록된 기기입니다");
        }

        // 동일 기기에 대한 대기 중 요청이 있는지 확인
        List<TrustRequest> pendingRequests = trustRequestRepository.findPendingByTargetRustdeskId(request.getTargetRustdeskId());
        if (!pendingRequests.isEmpty()) {
            // 기존 요청 반환
            return TrustRequestResponse.from(pendingRequests.get(0));
        }

        // 6자리 승인 코드 생성
        String approvalCode = generateApprovalCode();

        TrustRequest trustRequest = TrustRequest.builder()
                .requester(requester)
                .targetRustdeskId(request.getTargetRustdeskId())
                .targetDeviceName(request.getTargetDeviceName())
                .approvalCode(approvalCode)
                .alias(request.getAlias())
                .trustLevel(request.getTrustLevel() != null ? request.getTrustLevel() : DeviceTrust.TrustLevel.FULL_ACCESS)
                .requireApproval(request.getRequireApproval() != null ? request.getRequireApproval() : false)
                .note(request.getNote())
                .expiresAt(OffsetDateTime.now().plusMinutes(
                        request.getExpirationMinutes() != null ? request.getExpirationMinutes() : 30))
                .build();

        TrustRequest saved = trustRequestRepository.save(trustRequest);
        log.info("신뢰 요청 생성: requesterId={}, targetId={}, code={}",
                requester.getId(), request.getTargetRustdeskId(), approvalCode);

        return TrustRequestResponse.from(saved);
    }

    /**
     * 승인 코드로 요청 승인
     */
    @Transactional
    public MyComputerResponse approveTrustRequest(TrustApproveRequest request) {
        TrustRequest trustRequest = trustRequestRepository.findByApprovalCode(request.getApprovalCode())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 승인 코드입니다"));

        if (!trustRequest.canProcess()) {
            if (trustRequest.isExpired()) {
                throw new IllegalArgumentException("만료된 승인 코드입니다");
            }
            throw new IllegalArgumentException("이미 처리된 요청입니다");
        }

        // 요청 상태 업데이트
        trustRequest.setStatus(TrustRequest.RequestStatus.APPROVED);
        trustRequest.setProcessedAt(OffsetDateTime.now());
        trustRequestRepository.save(trustRequest);

        // DeviceTrust 생성
        DeviceTrust trust = DeviceTrust.builder()
                .owner(trustRequest.getRequester())
                .rustdeskId(trustRequest.getTargetRustdeskId())
                .alias(trustRequest.getAlias())
                .trustLevel(trustRequest.getTrustLevel())
                .requireApproval(trustRequest.getRequireApproval())
                .note(trustRequest.getNote())
                .build();

        // 비밀번호 해시 (제공된 경우)
        if (request.getPermanentPassword() != null && !request.getPermanentPassword().isBlank()) {
            trust.setPermanentPasswordHash(passwordEncoder.encode(request.getPermanentPassword()));
        }

        // 기존 devices 테이블에서 기기 연결
        deviceRepository.findByRustdeskId(trustRequest.getTargetRustdeskId())
                .ifPresent(trust::setTrustedDevice);

        DeviceTrust saved = deviceTrustRepository.save(trust);
        log.info("신뢰 요청 승인: requestId={}, rustdeskId={}",
                trustRequest.getId(), trustRequest.getTargetRustdeskId());

        return MyComputerResponse.from(saved);
    }

    /**
     * 내 신뢰 요청 목록 조회
     */
    @Transactional(readOnly = true)
    public List<TrustRequestResponse> getMyTrustRequests(User requester) {
        return trustRequestRepository.findByRequesterOrderByCreatedAtDesc(requester)
                .stream()
                .map(TrustRequestResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 대기 중인 요청만 조회
     */
    @Transactional(readOnly = true)
    public List<TrustRequestResponse> getPendingTrustRequests(User requester) {
        return trustRequestRepository.findPendingByRequester(requester)
                .stream()
                .map(TrustRequestResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 요청 취소
     */
    @Transactional
    public void cancelTrustRequest(User requester, UUID requestId) {
        TrustRequest request = trustRequestRepository.findById(requestId)
                .filter(r -> r.getRequester().getId().equals(requester.getId()))
                .orElseThrow(() -> new IllegalArgumentException("요청을 찾을 수 없습니다"));

        if (request.getStatus() != TrustRequest.RequestStatus.PENDING) {
            throw new IllegalArgumentException("대기 중인 요청만 취소할 수 있습니다");
        }

        trustRequestRepository.delete(request);
        log.info("신뢰 요청 취소: requestId={}", requestId);
    }

    // ==================== 스케줄러 ====================

    /**
     * 만료된 요청 정리 (매 10분)
     */
    @Scheduled(fixedRate = 600000)
    @Transactional
    public void cleanupExpiredRequests() {
        int expired = trustRequestRepository.expireOldRequests(OffsetDateTime.now());
        if (expired > 0) {
            log.info("만료된 신뢰 요청 처리: {}건", expired);
        }
    }

    // ==================== 유틸리티 ====================

    /**
     * 6자리 승인 코드 생성
     */
    private String generateApprovalCode() {
        String code;
        do {
            code = String.format("%06d", RANDOM.nextInt(1000000));
        } while (trustRequestRepository.existsByApprovalCode(code));
        return code;
    }

    /**
     * 통계 조회
     */
    @Transactional(readOnly = true)
    public MyComputerStats getStats(User owner) {
        long totalDevices = deviceTrustRepository.countByOwner(owner);
        long totalConnections = deviceTrustRepository.sumConnectionCountByOwner(owner);
        long onlineDevices = deviceTrustRepository.findOnlineByOwner(owner).size();

        return MyComputerStats.builder()
                .totalDevices(totalDevices)
                .onlineDevices(onlineDevices)
                .totalConnections(totalConnections)
                .build();
    }

    @lombok.Builder
    @lombok.Data
    public static class MyComputerStats {
        private long totalDevices;
        private long onlineDevices;
        private long totalConnections;
    }
}

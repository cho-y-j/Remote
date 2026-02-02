package com.remote.control.controller;

import com.remote.control.dto.mycomputer.*;
import com.remote.control.model.User;
import com.remote.control.service.MyComputersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/my-computers")
@RequiredArgsConstructor
@Tag(name = "My Computers", description = "내 컴퓨터 관리 API")
public class MyComputersController {

    private final MyComputersService myComputersService;

    // ==================== 내 컴퓨터 관리 ====================

    @GetMapping
    @Operation(summary = "내 컴퓨터 목록", description = "등록된 모든 컴퓨터 목록을 조회합니다")
    public ResponseEntity<List<MyComputerResponse>> getMyComputers(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(myComputersService.getMyComputers(user));
    }

    @GetMapping("/active")
    @Operation(summary = "활성 컴퓨터 목록", description = "만료되지 않은 컴퓨터만 조회합니다")
    public ResponseEntity<List<MyComputerResponse>> getActiveComputers(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(myComputersService.getActiveComputers(user));
    }

    @GetMapping("/online")
    @Operation(summary = "온라인 컴퓨터 목록", description = "현재 온라인인 컴퓨터만 조회합니다")
    public ResponseEntity<List<MyComputerResponse>> getOnlineComputers(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(myComputersService.getOnlineComputers(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "컴퓨터 상세 조회")
    public ResponseEntity<MyComputerResponse> getMyComputer(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(myComputersService.getMyComputer(user, id));
    }

    @PostMapping
    @Operation(summary = "새 컴퓨터 등록", description = "RustDesk ID로 새 컴퓨터를 등록합니다")
    public ResponseEntity<MyComputerResponse> registerComputer(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MyComputerRegisterRequest request) {
        return ResponseEntity.ok(myComputersService.registerComputer(user, request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "컴퓨터 정보 수정")
    public ResponseEntity<MyComputerResponse> updateComputer(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody MyComputerUpdateRequest request) {
        return ResponseEntity.ok(myComputersService.updateComputer(user, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "컴퓨터 등록 해제")
    public ResponseEntity<Void> removeComputer(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        myComputersService.removeComputer(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/connect")
    @Operation(summary = "연결 기록", description = "컴퓨터 연결 시 호출하여 통계를 기록합니다")
    public ResponseEntity<Void> recordConnection(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        myComputersService.recordConnection(user, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/verify-password")
    @Operation(summary = "비밀번호 검증")
    public ResponseEntity<PasswordVerifyResponse> verifyPassword(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestBody PasswordVerifyRequest request) {
        boolean valid = myComputersService.verifyPassword(user, id, request.getPassword());
        return ResponseEntity.ok(new PasswordVerifyResponse(valid));
    }

    // ==================== 신뢰 요청 관리 ====================

    @PostMapping("/request")
    @Operation(summary = "신뢰 요청 생성", description = "고객 기기를 등록하기 위한 승인 코드를 생성합니다")
    public ResponseEntity<TrustRequestResponse> createTrustRequest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TrustRequestCreateRequest request) {
        return ResponseEntity.ok(myComputersService.createTrustRequest(user, request));
    }

    @PostMapping("/approve")
    @Operation(summary = "신뢰 요청 승인", description = "승인 코드를 입력하여 기기 등록을 승인합니다")
    public ResponseEntity<MyComputerResponse> approveTrustRequest(
            @Valid @RequestBody TrustApproveRequest request) {
        return ResponseEntity.ok(myComputersService.approveTrustRequest(request));
    }

    @GetMapping("/requests")
    @Operation(summary = "내 신뢰 요청 목록")
    public ResponseEntity<List<TrustRequestResponse>> getMyTrustRequests(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(myComputersService.getMyTrustRequests(user));
    }

    @GetMapping("/requests/pending")
    @Operation(summary = "대기 중인 요청 목록")
    public ResponseEntity<List<TrustRequestResponse>> getPendingTrustRequests(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(myComputersService.getPendingTrustRequests(user));
    }

    @DeleteMapping("/requests/{id}")
    @Operation(summary = "신뢰 요청 취소")
    public ResponseEntity<Void> cancelTrustRequest(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        myComputersService.cancelTrustRequest(user, id);
        return ResponseEntity.noContent().build();
    }

    // ==================== 통계 ====================

    @GetMapping("/stats")
    @Operation(summary = "통계 조회")
    public ResponseEntity<MyComputersService.MyComputerStats> getStats(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(myComputersService.getStats(user));
    }

    // ==================== Inner DTOs ====================

    @lombok.Data
    public static class PasswordVerifyRequest {
        private String password;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class PasswordVerifyResponse {
        private boolean valid;
    }
}

package com.remote.control.repository;

import com.remote.control.model.TrustRequest;
import com.remote.control.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrustRequestRepository extends JpaRepository<TrustRequest, UUID> {

    // 승인 코드로 요청 조회
    Optional<TrustRequest> findByApprovalCode(String approvalCode);

    // 사용자의 요청 목록
    List<TrustRequest> findByRequesterOrderByCreatedAtDesc(User requester);

    // 상태별 요청 조회
    List<TrustRequest> findByRequesterAndStatus(User requester, TrustRequest.RequestStatus status);

    // 대기 중인 요청만 조회
    @Query("SELECT tr FROM TrustRequest tr WHERE tr.requester = :requester AND tr.status = 'PENDING' AND tr.expiresAt > CURRENT_TIMESTAMP")
    List<TrustRequest> findPendingByRequester(@Param("requester") User requester);

    // 승인 코드 존재 여부
    boolean existsByApprovalCode(String approvalCode);

    // 만료된 요청 상태 업데이트
    @Modifying
    @Query("UPDATE TrustRequest tr SET tr.status = 'EXPIRED' WHERE tr.status = 'PENDING' AND tr.expiresAt < :now")
    int expireOldRequests(@Param("now") OffsetDateTime now);

    // 특정 RustDesk ID에 대한 대기 중 요청 확인
    @Query("SELECT tr FROM TrustRequest tr WHERE tr.targetRustdeskId = :rustdeskId AND tr.status = 'PENDING' AND tr.expiresAt > CURRENT_TIMESTAMP")
    List<TrustRequest> findPendingByTargetRustdeskId(@Param("rustdeskId") String rustdeskId);
}

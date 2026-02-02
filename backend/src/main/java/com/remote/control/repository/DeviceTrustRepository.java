package com.remote.control.repository;

import com.remote.control.model.DeviceTrust;
import com.remote.control.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceTrustRepository extends JpaRepository<DeviceTrust, UUID> {

    // 사용자의 모든 신뢰 기기 조회
    List<DeviceTrust> findByOwnerOrderByCreatedAtDesc(User owner);

    // 사용자의 특정 RustDesk ID 기기 조회
    Optional<DeviceTrust> findByOwnerAndRustdeskId(User owner, String rustdeskId);

    // RustDesk ID로 신뢰 기기 조회 (모든 사용자)
    List<DeviceTrust> findByRustdeskId(String rustdeskId);

    // 사용자의 신뢰 기기 존재 여부
    boolean existsByOwnerAndRustdeskId(User owner, String rustdeskId);

    // 별칭으로 검색
    List<DeviceTrust> findByOwnerAndAliasContainingIgnoreCase(User owner, String alias);

    // 플랫폼별 조회
    List<DeviceTrust> findByOwnerAndPlatform(User owner, String platform);

    // 만료되지 않은 기기만 조회
    @Query("SELECT dt FROM DeviceTrust dt WHERE dt.owner = :owner AND (dt.expiresAt IS NULL OR dt.expiresAt > CURRENT_TIMESTAMP)")
    List<DeviceTrust> findActiveByOwner(@Param("owner") User owner);

    // 온라인 기기만 조회
    @Query("SELECT dt FROM DeviceTrust dt JOIN dt.trustedDevice d WHERE dt.owner = :owner AND d.isOnline = true")
    List<DeviceTrust> findOnlineByOwner(@Param("owner") User owner);

    // 통계: 사용자의 총 기기 수
    long countByOwner(User owner);

    // 통계: 사용자의 오늘 연결 횟수
    @Query("SELECT COALESCE(SUM(dt.connectionCount), 0) FROM DeviceTrust dt WHERE dt.owner = :owner")
    Long sumConnectionCountByOwner(@Param("owner") User owner);
}

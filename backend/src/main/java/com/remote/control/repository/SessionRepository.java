package com.remote.control.repository;

import com.remote.control.model.Device;
import com.remote.control.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findBySessionCode(String sessionCode);

    List<Session> findByStatus(Session.Status status);

    List<Session> findByHostDevice(Device device);

    List<Session> findByClientDevice(Device device);

    @Query("SELECT s FROM Session s WHERE s.status = 'ACTIVE' AND (s.hostDevice = :device OR s.clientDevice = :device)")
    List<Session> findActiveSessionsByDevice(Device device);

    @Query("SELECT s FROM Session s WHERE s.status = 'ACTIVE'")
    List<Session> findAllActiveSessions();
}

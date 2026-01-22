package com.remote.control.repository;

import com.remote.control.model.Device;
import com.remote.control.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {

    Optional<Device> findByDeviceId(String deviceId);

    List<Device> findByUser(User user);

    List<Device> findByUserAndIsOnlineTrue(User user);

    boolean existsByDeviceId(String deviceId);
}

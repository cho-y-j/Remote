package com.remote.control.repository;

import com.remote.control.model.Payment;
import com.remote.control.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
}

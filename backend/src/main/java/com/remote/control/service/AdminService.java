package com.remote.control.service;

import com.remote.control.model.Payment;
import com.remote.control.model.Session;
import com.remote.control.model.Subscription;
import com.remote.control.model.User;
import com.remote.control.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final SessionRepository sessionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;

    public DashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDevices = deviceRepository.count();

        List<Session> activeSessions = sessionRepository.findAllActiveSessions();
        long activeSessionCount = activeSessions.size();

        long proUsers = userRepository.findAll().stream()
                .filter(u -> u.getPlan() == User.Plan.PRO).count();
        long bizUsers = userRepository.findAll().stream()
                .filter(u -> u.getPlan() == User.Plan.BUSINESS).count();
        long freeUsers = totalUsers - proUsers - bizUsers;

        // Revenue: sum of all DONE payments
        List<Payment> allPayments = paymentRepository.findAll();
        long totalRevenue = allPayments.stream()
                .filter(p -> p.getStatus() == Payment.Status.DONE)
                .mapToLong(Payment::getAmount)
                .sum();

        // Monthly revenue (current month)
        OffsetDateTime startOfMonth = OffsetDateTime.now().withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);
        long monthlyRevenue = allPayments.stream()
                .filter(p -> p.getStatus() == Payment.Status.DONE)
                .filter(p -> p.getPaidAt() != null && p.getPaidAt().isAfter(startOfMonth))
                .mapToLong(Payment::getAmount)
                .sum();

        long activeSubscriptions = subscriptionRepository.findAll().stream()
                .filter(s -> s.getStatus() == Subscription.Status.ACTIVE).count();

        return new DashboardStats(
                totalUsers, freeUsers, proUsers, bizUsers,
                totalDevices, activeSessionCount, activeSubscriptions,
                totalRevenue, monthlyRevenue
        );
    }

    public Page<UserSummary> getUsers(int page, int size) {
        Page<User> users = userRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return users.map(u -> new UserSummary(
                u.getId(), u.getEmail(), u.getName(),
                u.getPlan().name(), u.getRole().name(),
                u.getProvider().name(), u.getEnabled(),
                u.getCreatedAt()
        ));
    }

    @Transactional
    public Map<String, String> changeUserPlan(UUID userId, String plan) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPlan(User.Plan.valueOf(plan.toUpperCase()));
        userRepository.save(user);
        return Map.of("status", "ok", "plan", user.getPlan().name());
    }

    @Transactional
    public Map<String, String> changeUserRole(UUID userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
        return Map.of("status", "ok", "role", user.getRole().name());
    }

    public Page<PaymentSummary> getRecentPayments(int page, int size) {
        Page<Payment> payments = paymentRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return payments.map(p -> new PaymentSummary(
                p.getId(), p.getUser().getEmail(), p.getOrderId(),
                p.getAmount(), p.getStatus().name(), p.getOrderName(),
                p.getPaidAt(), p.getCreatedAt()
        ));
    }

    public List<SessionSummary> getAllActiveSessions() {
        return sessionRepository.findAllActiveSessions().stream()
                .map(s -> new SessionSummary(
                        s.getId(), s.getSessionCode(),
                        s.getHostDevice() != null ? s.getHostDevice().getDeviceId() : null,
                        s.getClientDevice() != null ? s.getClientDevice().getDeviceId() : null,
                        s.getHostDevice() != null && s.getHostDevice().getUser() != null
                                ? s.getHostDevice().getUser().getEmail() : null,
                        s.getStatus().name(), s.getStartedAt()
                ))
                .toList();
    }

    public record DashboardStats(
            long totalUsers, long freeUsers, long proUsers, long bizUsers,
            long totalDevices, long activeSessions, long activeSubscriptions,
            long totalRevenue, long monthlyRevenue
    ) {}

    public record UserSummary(
            UUID id, String email, String name, String plan,
            String role, String provider, Boolean enabled, OffsetDateTime createdAt
    ) {}

    public record PaymentSummary(
            UUID id, String userEmail, String orderId, Integer amount,
            String status, String orderName, OffsetDateTime paidAt, OffsetDateTime createdAt
    ) {}

    public record SessionSummary(
            UUID id, String sessionCode, String hostDeviceId,
            String clientDeviceId, String hostUserEmail,
            String status, OffsetDateTime startedAt
    ) {}
}

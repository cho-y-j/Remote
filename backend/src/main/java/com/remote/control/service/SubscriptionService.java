package com.remote.control.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.remote.control.controller.dto.PaymentResponse;
import com.remote.control.controller.dto.SubscriptionResponse;
import com.remote.control.model.Payment;
import com.remote.control.model.Subscription;
import com.remote.control.model.User;
import com.remote.control.repository.PaymentRepository;
import com.remote.control.repository.SubscriptionRepository;
import com.remote.control.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final TossPaymentService tossPaymentService;

    private static final int PRO_MONTHLY = 5900;
    private static final int PRO_YEARLY = 49170;    // 5900 * 10 (2개월 무료)
    private static final int BIZ_MONTHLY = 12900;
    private static final int BIZ_YEARLY = 107500;   // 12900 * 10 (2개월 무료)

    /**
     * Subscribe: issue billing key + make first payment + activate plan
     */
    @Transactional
    public SubscriptionResponse subscribe(User user, String authKey, String customerKey,
                                           User.Plan plan, Subscription.BillingCycle cycle) {
        if (plan == User.Plan.FREE) {
            throw new IllegalArgumentException("무료 플랜은 결제가 필요하지 않습니다");
        }

        // Cancel existing active subscription if any
        subscriptionRepository.findByUserAndStatus(user, Subscription.Status.ACTIVE)
                .ifPresent(existing -> {
                    existing.setStatus(Subscription.Status.CANCELLED);
                    existing.setCancelledAt(OffsetDateTime.now());
                    subscriptionRepository.save(existing);
                });

        // Issue billing key from Toss
        JsonNode billingResult = tossPaymentService.issueBillingKey(authKey, customerKey);
        String billingKey = billingResult.get("billingKey").asText();

        int amount = calculateAmount(plan, cycle);
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime periodEnd = cycle == Subscription.BillingCycle.MONTHLY
                ? now.plusMonths(1) : now.plusYears(1);

        // Create subscription
        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(plan)
                .billingKey(billingKey)
                .customerKey(customerKey)
                .status(Subscription.Status.ACTIVE)
                .billingCycle(cycle)
                .amount(amount)
                .currentPeriodStart(now)
                .currentPeriodEnd(periodEnd)
                .build();
        subscription = subscriptionRepository.save(subscription);

        // Make first payment
        String orderId = "ORDER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String orderName = "DeskOn " + plan.name() + " 플랜 ("
                + (cycle == Subscription.BillingCycle.MONTHLY ? "월간" : "연간") + ")";

        JsonNode paymentResult = tossPaymentService.chargeBilling(
                billingKey, customerKey, amount, orderId, orderName);

        Payment payment = Payment.builder()
                .user(user)
                .subscription(subscription)
                .paymentKey(paymentResult.get("paymentKey").asText())
                .orderId(orderId)
                .amount(amount)
                .status(Payment.Status.DONE)
                .orderName(orderName)
                .paidAt(now)
                .build();
        paymentRepository.save(payment);

        // Upgrade user plan
        user.setPlan(plan);
        userRepository.save(user);

        return mapToResponse(subscription);
    }

    /**
     * Cancel subscription (at period end)
     */
    @Transactional
    public SubscriptionResponse cancelSubscription(User user) {
        Subscription subscription = subscriptionRepository
                .findByUserAndStatus(user, Subscription.Status.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("활성 구독이 없습니다"));

        subscription.setStatus(Subscription.Status.CANCELLED);
        subscription.setCancelledAt(OffsetDateTime.now());
        subscription = subscriptionRepository.save(subscription);

        // Downgrade to FREE immediately (or can keep until period end)
        user.setPlan(User.Plan.FREE);
        userRepository.save(user);

        log.info("Subscription cancelled for user: {}", user.getEmail());
        return mapToResponse(subscription);
    }

    /**
     * Get current subscription for user
     */
    public SubscriptionResponse getCurrentSubscription(User user) {
        return subscriptionRepository.findByUserAndStatus(user, Subscription.Status.ACTIVE)
                .map(this::mapToResponse)
                .orElse(null);
    }

    /**
     * Get payment history for user
     */
    public List<PaymentResponse> getPaymentHistory(User user) {
        return paymentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapPaymentResponse)
                .toList();
    }

    /**
     * Scheduled task: renew subscriptions that are past due
     */
    @Scheduled(cron = "0 0 9 * * *") // Every day at 9 AM
    @Transactional
    public void renewSubscriptions() {
        List<Subscription> dueSubscriptions = subscriptionRepository
                .findByStatusAndCurrentPeriodEndBefore(
                        Subscription.Status.ACTIVE, OffsetDateTime.now());

        for (Subscription sub : dueSubscriptions) {
            try {
                String orderId = "RENEW-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                String orderName = "DeskOn " + sub.getPlan().name() + " 플랜 갱신";

                JsonNode result = tossPaymentService.chargeBilling(
                        sub.getBillingKey(), sub.getCustomerKey(),
                        sub.getAmount(), orderId, orderName);

                OffsetDateTime now = OffsetDateTime.now();
                OffsetDateTime newEnd = sub.getBillingCycle() == Subscription.BillingCycle.MONTHLY
                        ? now.plusMonths(1) : now.plusYears(1);

                sub.setCurrentPeriodStart(now);
                sub.setCurrentPeriodEnd(newEnd);
                subscriptionRepository.save(sub);

                Payment payment = Payment.builder()
                        .user(sub.getUser())
                        .subscription(sub)
                        .paymentKey(result.get("paymentKey").asText())
                        .orderId(orderId)
                        .amount(sub.getAmount())
                        .status(Payment.Status.DONE)
                        .orderName(orderName)
                        .paidAt(now)
                        .build();
                paymentRepository.save(payment);

                log.info("Subscription renewed for user: {}", sub.getUser().getEmail());
            } catch (Exception e) {
                log.error("Failed to renew subscription for user {}: {}",
                        sub.getUser().getEmail(), e.getMessage());
                sub.setStatus(Subscription.Status.PAST_DUE);
                subscriptionRepository.save(sub);

                // Downgrade user
                User user = sub.getUser();
                user.setPlan(User.Plan.FREE);
                userRepository.save(user);
            }
        }
    }

    private int calculateAmount(User.Plan plan, Subscription.BillingCycle cycle) {
        return switch (plan) {
            case PRO -> cycle == Subscription.BillingCycle.MONTHLY ? PRO_MONTHLY : PRO_YEARLY;
            case BUSINESS -> cycle == Subscription.BillingCycle.MONTHLY ? BIZ_MONTHLY : BIZ_YEARLY;
            case FREE -> 0;
        };
    }

    private SubscriptionResponse mapToResponse(Subscription sub) {
        return new SubscriptionResponse(
                sub.getId(),
                sub.getPlan().name(),
                sub.getStatus().name(),
                sub.getBillingCycle().name(),
                sub.getAmount(),
                sub.getCurrentPeriodStart(),
                sub.getCurrentPeriodEnd(),
                sub.getCancelledAt(),
                sub.getCreatedAt()
        );
    }

    private PaymentResponse mapPaymentResponse(Payment p) {
        return new PaymentResponse(
                p.getId(),
                p.getOrderId(),
                p.getAmount(),
                p.getStatus().name(),
                p.getOrderName(),
                p.getPaidAt(),
                p.getCreatedAt()
        );
    }
}

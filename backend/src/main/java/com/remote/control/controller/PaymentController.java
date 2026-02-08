package com.remote.control.controller;

import com.remote.control.controller.dto.BillingAuthRequest;
import com.remote.control.controller.dto.PaymentResponse;
import com.remote.control.controller.dto.SubscriptionResponse;
import com.remote.control.model.Subscription;
import com.remote.control.model.User;
import com.remote.control.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Subscription and payment management API")
public class PaymentController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    @Operation(summary = "Subscribe to a plan (issue billing key + first payment)")
    public ResponseEntity<SubscriptionResponse> subscribe(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BillingAuthRequest request) {

        User.Plan plan = User.Plan.valueOf(request.plan().toUpperCase());
        Subscription.BillingCycle cycle = Subscription.BillingCycle.valueOf(
                request.billingCycle().toUpperCase());

        SubscriptionResponse response = subscriptionService.subscribe(
                user, request.authKey(), request.customerKey(), plan, cycle);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/subscribe")
    @Operation(summary = "Cancel current subscription")
    public ResponseEntity<SubscriptionResponse> cancelSubscription(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(subscriptionService.cancelSubscription(user));
    }

    @GetMapping("/subscribe")
    @Operation(summary = "Get current subscription info")
    public ResponseEntity<?> getCurrentSubscription(
            @AuthenticationPrincipal User user) {
        SubscriptionResponse sub = subscriptionService.getCurrentSubscription(user);
        if (sub == null) {
            return ResponseEntity.ok(Map.of("plan", "FREE", "status", "NONE"));
        }
        return ResponseEntity.ok(sub);
    }

    @GetMapping("/history")
    @Operation(summary = "Get payment history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(subscriptionService.getPaymentHistory(user));
    }
}

package com.remote.control.repository;

import com.remote.control.model.Subscription;
import com.remote.control.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByUserAndStatus(User user, Subscription.Status status);
    Optional<Subscription> findByCustomerKey(String customerKey);
    List<Subscription> findByStatusAndCurrentPeriodEndBefore(Subscription.Status status, OffsetDateTime dateTime);
}

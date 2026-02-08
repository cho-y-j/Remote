package com.remote.control.service;

import com.remote.control.model.User;
import org.springframework.stereotype.Service;

@Service
public class PlanLimitService {

    public int getMaxDevices(User.Plan plan) {
        return switch (plan) {
            case FREE -> 3;
            case PRO -> 10;
            case BUSINESS -> Integer.MAX_VALUE;
        };
    }

    public int getMaxConcurrentSessions(User.Plan plan) {
        return switch (plan) {
            case FREE -> 1;
            case PRO -> 3;
            case BUSINESS -> 10;
        };
    }

    public int getMaxSessionDurationMinutes(User.Plan plan) {
        return switch (plan) {
            case FREE -> 60;
            case PRO -> Integer.MAX_VALUE;
            case BUSINESS -> Integer.MAX_VALUE;
        };
    }

    public boolean canUseRelay(User.Plan plan) {
        return switch (plan) {
            case FREE -> false;
            case PRO -> true;
            case BUSINESS -> true;
        };
    }

    public boolean showAds(User.Plan plan) {
        return plan == User.Plan.FREE;
    }

    public PlanLimits getLimits(User.Plan plan) {
        return new PlanLimits(
                plan.name(),
                getMaxDevices(plan),
                getMaxConcurrentSessions(plan),
                getMaxSessionDurationMinutes(plan),
                canUseRelay(plan),
                showAds(plan)
        );
    }

    public record PlanLimits(
            String plan,
            int maxDevices,
            int maxConcurrentSessions,
            int maxSessionDurationMinutes,
            boolean relayEnabled,
            boolean showAds
    ) {}
}

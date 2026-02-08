package com.remote.control.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class TossPaymentService {

    private static final String TOSS_API_URL = "https://api.tosspayments.com";

    @Value("${toss.secret-key:}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Exchange authKey for a billing key (카드 등록)
     */
    public JsonNode issueBillingKey(String authKey, String customerKey) {
        String url = TOSS_API_URL + "/v1/billing/authorizations/" + authKey;

        Map<String, String> body = new HashMap<>();
        body.put("customerKey", customerKey);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, createHeaders());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, String.class);
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            log.error("Failed to issue billing key: {}", e.getMessage());
            throw new IllegalStateException("빌링키 발급에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * Charge using billing key (정기 결제)
     */
    public JsonNode chargeBilling(String billingKey, String customerKey,
                                   int amount, String orderId, String orderName) {
        String url = TOSS_API_URL + "/v1/billing/" + billingKey;

        Map<String, Object> body = new HashMap<>();
        body.put("customerKey", customerKey);
        body.put("amount", amount);
        body.put("orderId", orderId);
        body.put("orderName", orderName);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, createHeaders());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, String.class);
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            log.error("Failed to charge billing: {}", e.getMessage());
            throw new IllegalStateException("결제에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * Cancel a payment (결제 취소)
     */
    public JsonNode cancelPayment(String paymentKey, String cancelReason) {
        String url = TOSS_API_URL + "/v1/payments/" + paymentKey + "/cancel";

        Map<String, String> body = new HashMap<>();
        body.put("cancelReason", cancelReason);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, createHeaders());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, String.class);
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            log.error("Failed to cancel payment: {}", e.getMessage());
            throw new IllegalStateException("결제 취소에 실패했습니다: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String encoded = Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encoded);
        return headers;
    }
}

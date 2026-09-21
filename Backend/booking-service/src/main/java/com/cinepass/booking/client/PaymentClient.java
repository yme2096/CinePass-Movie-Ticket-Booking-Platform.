package com.cinepass.booking.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PaymentClient {

    private final RestClient restClient;

    public PaymentClient() {

        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8084")
                .build();
    }

    public PaymentResponse makePayment(
            Long bookingId,
            Long userId,
            Double amount,
            String paymentMethod) {

        PaymentRequest request = new PaymentRequest(
                bookingId,
                userId,
                amount,
                paymentMethod,
                "SUCCESS"
        );

        return restClient.post()
                .uri("/api/payments")
                .body(request)
                .retrieve()
                .body(PaymentResponse.class);
    }

    public record PaymentRequest(
            Long bookingId,
            Long userId,
            Double amount,
            String paymentMethod,
            String status) {
    }

    public record PaymentResponse(
            Long id,
            Long bookingId,
            Long userId,
            Double amount,
            String paymentMethod,
            String status) {
    }
}
package com.cinepass.booking.dto;

import java.util.List;

public record BookingRequest(
        Long userId,
        Long movieId,
        Long showId,
        List<String> seatNumbers,
        String paymentMethod
) {
}
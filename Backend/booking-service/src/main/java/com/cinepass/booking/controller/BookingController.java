package com.cinepass.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.cinepass.booking.dto.BookingRequest;
import com.cinepass.booking.entity.Booking;
import com.cinepass.booking.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequest request) {

        return bookingService.createBooking(
                request
        );
    }

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id) {

        return bookingService
                .getBookingById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return "Booking deleted successfully";
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id) {

        return bookingService
                .cancelBooking(id);
    }
}
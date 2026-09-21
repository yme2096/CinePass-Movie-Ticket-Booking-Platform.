package com.cinepass.booking.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cinepass.booking.client.PaymentClient;
import com.cinepass.booking.dto.BookingRequest;
import com.cinepass.booking.entity.Booking;
import com.cinepass.booking.entity.MovieShow;
import com.cinepass.booking.entity.ShowSeat;
import com.cinepass.booking.exception.SeatAlreadyBookedException;
import com.cinepass.booking.repository.BookingRepository;
import com.cinepass.booking.repository.MovieShowRepository;
import com.cinepass.booking.repository.ShowSeatRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PaymentClient paymentClient;
    private final ShowSeatRepository showSeatRepository;
    private final MovieShowRepository movieShowRepository;

    public BookingService(
            BookingRepository bookingRepository,
            PaymentClient paymentClient,
            ShowSeatRepository showSeatRepository,
            MovieShowRepository movieShowRepository) {

        this.bookingRepository = bookingRepository;
        this.paymentClient = paymentClient;
        this.showSeatRepository = showSeatRepository;
        this.movieShowRepository = movieShowRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {

        MovieShow show =
                movieShowRepository
                        .findById(request.showId())
                        .orElseThrow(() ->
                                new RuntimeException("Show not found")
                        );

        if (show.getPrice() == null ||
                show.getPrice() <= 0) {

            throw new RuntimeException("Invalid show price");
        }

        List<ShowSeat> seats =
                showSeatRepository
                        .findByShowIdAndSeatNumberIn(
                                request.showId(),
                                request.seatNumbers()
                        );

        if (seats.size() !=
                request.seatNumbers().size()) {

            throw new RuntimeException(
                    "One or more selected seats do not exist"
            );
        }

        for (ShowSeat seat : seats) {

            if ("BOOKED".equalsIgnoreCase(
                    seat.getStatus())) {

                throw new SeatAlreadyBookedException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " is already booked"
                );
            }
        }

        double pricePerSeat =
                show.getPrice();

        int numberOfSeats =
                request.seatNumbers().size();

        double totalAmount =
                numberOfSeats * pricePerSeat;

        for (ShowSeat seat : seats) {
            seat.setStatus("BOOKED");
        }

        showSeatRepository.saveAll(seats);

        Booking booking =
                new Booking();

        booking.setUserId(
                request.userId()
        );

        booking.setMovieId(
                request.movieId()
        );

        booking.setShowId(
                request.showId()
        );

        booking.setSeats(
                numberOfSeats
        );

        booking.setSeatNumbers(
                String.join(
                        ", ",
                        request.seatNumbers()
                )
        );

        booking.setTotalAmount(
                totalAmount
        );

        booking.setStatus(
                "PENDING"
        );

        booking =
                bookingRepository.save(
                        booking
                );

        PaymentClient.PaymentResponse payment =
                paymentClient.makePayment(
                        booking.getId(),
                        request.userId(),
                        totalAmount,
                        request.paymentMethod()
                );

        if (payment != null &&
                "SUCCESS".equalsIgnoreCase(
                        payment.status())) {

            booking.setPaymentId(
                    payment.id()
            );

            booking.setStatus(
                    "CONFIRMED"
            );

        } else {

            for (ShowSeat seat : seats) {
                seat.setStatus("AVAILABLE");
            }

            showSeatRepository.saveAll(seats);

            booking.setStatus(
                    "PAYMENT_FAILED"
            );
        }

        return bookingRepository.save(
                booking
        );
    }

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {

        return bookingRepository
                .findById(id)
                .orElse(null);
    }

    public void deleteBooking(Long id) {

        bookingRepository.deleteById(id);
    }

    @Transactional
    public Booking cancelBooking(Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);

        if (booking == null) {
            return null;
        }

        if ("CANCELLED".equalsIgnoreCase(
                booking.getStatus())) {

            return booking;
        }

        if (booking.getShowId() != null &&
                booking.getSeatNumbers() != null &&
                !booking.getSeatNumbers().isBlank()) {

            List<String> seatNumbers =
                    Arrays.stream(
                            booking
                                    .getSeatNumbers()
                                    .split(",")
                    )
                    .map(String::trim)
                    .toList();

            List<ShowSeat> seats =
                    showSeatRepository
                            .findByShowIdAndSeatNumberIn(
                                    booking.getShowId(),
                                    seatNumbers
                            );

            for (ShowSeat seat : seats) {
                seat.setStatus("AVAILABLE");
            }

            showSeatRepository.saveAll(seats);
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(
                booking
        );
    }
}
package com.cinepass.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.booking.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
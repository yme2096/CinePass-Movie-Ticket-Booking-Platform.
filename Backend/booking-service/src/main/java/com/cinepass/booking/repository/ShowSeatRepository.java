package com.cinepass.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.booking.entity.ShowSeat;

public interface ShowSeatRepository
        extends JpaRepository<ShowSeat, Long> {

    List<ShowSeat> findByShowId(Long showId);

    List<ShowSeat> findByShowIdAndSeatNumberIn(
            Long showId,
            List<String> seatNumbers);
}
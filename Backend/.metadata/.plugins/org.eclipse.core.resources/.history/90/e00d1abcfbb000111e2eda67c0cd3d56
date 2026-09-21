package com.cinepass.booking.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.booking.entity.MovieShow;

public interface MovieShowRepository
        extends JpaRepository<MovieShow, Long> {

    List<MovieShow> findByMovieIdAndShowDate(
            Long movieId,
            LocalDate showDate
    );
}
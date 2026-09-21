package com.cinepass.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.booking.entity.MovieScreen;

public interface MovieScreenRepository
        extends JpaRepository<MovieScreen, Long> {

    List<MovieScreen> findByTheatreId(Long theatreId);
}
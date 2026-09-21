package com.cinepass.movie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.movie.entity.Movie;

public interface MovieRepository
        extends JpaRepository<Movie, Long> {

}
package com.cinepass.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.booking.entity.Theatre;

public interface TheatreRepository extends JpaRepository<Theatre, Long> {

}
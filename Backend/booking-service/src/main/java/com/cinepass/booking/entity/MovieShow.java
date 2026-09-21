package com.cinepass.booking.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "movie_shows")
public class MovieShow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long movieId;

    private LocalDate showDate;

    private LocalTime startTime;

    // Price is controlled by admin
    private Double price;

    @ManyToOne
    @JoinColumn(name = "screen_id")
    private MovieScreen screen;

    // Default constructor
    public MovieShow() {
    }

    // Constructor
    public MovieShow(
            Long movieId,
            LocalDate showDate,
            LocalTime startTime,
            Double price,
            MovieScreen screen) {

        this.movieId = movieId;
        this.showDate = showDate;
        this.startTime = startTime;
        this.price = price;
        this.screen = screen;
    }

    // =========================
    // GETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public Double getPrice() {
        return price;
    }

    public MovieScreen getScreen() {
        return screen;
    }

    // =========================
    // SETTERS
    // =========================

    public void setId(Long id) {
        this.id = id;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public void setShowDate(LocalDate showDate) {
        this.showDate = showDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setScreen(MovieScreen screen) {
        this.screen = screen;
    }
}
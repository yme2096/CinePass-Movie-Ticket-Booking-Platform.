package com.cinepass.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movie_screens")
public class MovieScreen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer totalSeats;

    @ManyToOne
    @JoinColumn(name = "theatre_id")
    private Theatre theatre;

    public MovieScreen() {
    }

    public MovieScreen(String name, Integer totalSeats, Theatre theatre) {
        this.name = name;
        this.totalSeats = totalSeats;
        this.theatre = theatre;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Theatre getTheatre() {
        return theatre;
    }

    public void setTheatre(Theatre theatre) {
        this.theatre = theatre;
    }
}
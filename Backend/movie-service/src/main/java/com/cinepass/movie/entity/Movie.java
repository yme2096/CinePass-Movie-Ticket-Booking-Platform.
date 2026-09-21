package com.cinepass.movie.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String language;

    private Integer duration;

    private String genre;

    // Default constructor
    public Movie() {
    }

    // Constructor used by DataSeeder
    public Movie(
            String title,
            String description,
            String language,
            Integer duration,
            String genre) {

        this.title = title;
        this.description = description;
        this.language = language;
        this.duration = duration;
        this.genre = genre;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLanguage() {
        return language;
    }

    public Integer getDuration() {
        return duration;
    }

    public String getGenre() {
        return genre;
    }

    // Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }
}
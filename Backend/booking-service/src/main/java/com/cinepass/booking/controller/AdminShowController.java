package com.cinepass.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.cinepass.booking.dto.AdminShowRequest;
import com.cinepass.booking.entity.MovieScreen;
import com.cinepass.booking.entity.MovieShow;
import com.cinepass.booking.repository.MovieScreenRepository;
import com.cinepass.booking.repository.MovieShowRepository;

@RestController
@RequestMapping("/api/admin/shows")
public class AdminShowController {

    private final MovieShowRepository showRepository;

    private final MovieScreenRepository screenRepository;

    public AdminShowController(
            MovieShowRepository showRepository,
            MovieScreenRepository screenRepository) {

        this.showRepository = showRepository;
        this.screenRepository = screenRepository;
    }

    // =====================================================
    // GET ALL SHOWS
    // =====================================================

    @GetMapping
    public List<MovieShow> getAllShows() {

        return showRepository.findAll();
    }

    // =====================================================
    // CREATE SHOW
    // =====================================================

    @PostMapping
    public MovieShow createShow(
            @RequestBody AdminShowRequest request) {

        // Find screen

        MovieScreen screen =
                screenRepository
                        .findById(request.screenId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Screen not found"
                                )
                        );

        // Create show

        MovieShow show =
                new MovieShow();

        show.setMovieId(
                request.movieId()
        );

        show.setShowDate(
                request.showDate()
        );

        show.setStartTime(
                request.startTime()
        );

        // ADMIN SETS PRICE HERE

        show.setPrice(
                request.price()
        );

        show.setScreen(
                screen
        );

        return showRepository.save(
                show
        );
    }

    // =====================================================
    // UPDATE SHOW
    // =====================================================

    @PutMapping("/{id}")
    public MovieShow updateShow(
            @PathVariable Long id,
            @RequestBody AdminShowRequest request) {

        MovieShow show =
                showRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Show not found"
                                )
                        );

        MovieScreen screen =
                screenRepository
                        .findById(request.screenId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Screen not found"
                                )
                        );

        show.setMovieId(
                request.movieId()
        );

        show.setShowDate(
                request.showDate()
        );

        show.setStartTime(
                request.startTime()
        );

        // ADMIN CAN CHANGE PRICE

        show.setPrice(
                request.price()
        );

        show.setScreen(
                screen
        );

        return showRepository.save(
                show
        );
    }

    // =====================================================
    // DELETE SHOW
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteShow(
            @PathVariable Long id) {

        if (!showRepository.existsById(id)) {

            throw new RuntimeException(
                    "Show not found"
            );
        }

        showRepository.deleteById(id);

        return "Show deleted successfully";
    }
}
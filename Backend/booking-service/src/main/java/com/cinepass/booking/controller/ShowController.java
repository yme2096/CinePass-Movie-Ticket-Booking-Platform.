package com.cinepass.booking.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.cinepass.booking.entity.MovieShow;
import com.cinepass.booking.entity.ShowSeat;
import com.cinepass.booking.entity.Theatre;
import com.cinepass.booking.repository.MovieShowRepository;
import com.cinepass.booking.repository.ShowSeatRepository;
import com.cinepass.booking.repository.TheatreRepository;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final MovieShowRepository showRepository;
    private final ShowSeatRepository seatRepository;
    private final TheatreRepository theatreRepository;

    public ShowController(
            MovieShowRepository showRepository,
            ShowSeatRepository seatRepository,
            TheatreRepository theatreRepository) {

        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.theatreRepository = theatreRepository;
    }

    @GetMapping
    public List<MovieShow> getShows(
            @RequestParam Long movieId,
            @RequestParam String date) {

        return showRepository.findByMovieIdAndShowDate(
                movieId,
                LocalDate.parse(date)
        );
    }

    @GetMapping("/{showId}/seats")
    public List<ShowSeat> getSeats(
            @PathVariable Long showId) {

        return seatRepository.findByShowId(showId);
    }

    @GetMapping("/theatres")
    public List<Theatre> getTheatres() {

        return theatreRepository.findAll();
    }
}
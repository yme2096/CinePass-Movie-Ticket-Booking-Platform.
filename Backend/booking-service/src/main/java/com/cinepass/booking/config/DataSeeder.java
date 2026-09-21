package com.cinepass.booking.config;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cinepass.booking.entity.MovieScreen;
import com.cinepass.booking.entity.MovieShow;
import com.cinepass.booking.entity.ShowSeat;
import com.cinepass.booking.entity.Theatre;
import com.cinepass.booking.repository.MovieScreenRepository;
import com.cinepass.booking.repository.MovieShowRepository;
import com.cinepass.booking.repository.ShowSeatRepository;
import com.cinepass.booking.repository.TheatreRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedBookingData(
            TheatreRepository theatreRepository,
            MovieScreenRepository screenRepository,
            MovieShowRepository showRepository,
            ShowSeatRepository seatRepository) {

        return args -> {

            // Prevent duplicate seed data
            if (theatreRepository.count() > 0) {
                System.out.println(
                        "Booking data already exists. Skipping seeder."
                );
                return;
            }

            // =====================================================
            // 1. THEATRES
            // =====================================================

            Theatre pvr = theatreRepository.save(
                    new Theatre(
                            "PVR Cinemas",
                            "Vijayawada",
                            "Trendset Mall"
                    )
            );

            Theatre cinepolis = theatreRepository.save(
                    new Theatre(
                            "Cinepolis",
                            "Vijayawada",
                            "PVP Square"
                    )
            );

            Theatre inox = theatreRepository.save(
                    new Theatre(
                            "INOX",
                            "Vijayawada",
                            "LEPL Mall"
                    )
            );

            // =====================================================
            // 2. SCREENS
            // =====================================================

            MovieScreen pvrScreen1 = screenRepository.save(
                    new MovieScreen(
                            "PVR Screen 1",
                            30,
                            pvr
                    )
            );

            MovieScreen pvrScreen2 = screenRepository.save(
                    new MovieScreen(
                            "PVR Screen 2",
                            30,
                            pvr
                    )
            );

            MovieScreen cinepolisScreen1 = screenRepository.save(
                    new MovieScreen(
                            "Cinepolis Screen 1",
                            30,
                            cinepolis
                    )
            );

            MovieScreen inoxScreen1 = screenRepository.save(
                    new MovieScreen(
                            "INOX Screen 1",
                            30,
                            inox
                    )
            );

            // =====================================================
            // 3. DATES
            // =====================================================

            LocalDate today = LocalDate.now();

            LocalDate tomorrow =
                    today.plusDays(1);

            LocalDate dayAfterTomorrow =
                    today.plusDays(2);

            // =====================================================
            // 4. SHOWS
            // =====================================================

            List<MovieShow> shows = new ArrayList<>();

            // -----------------------------
            // PVR
            // -----------------------------

            // Avengers
            shows.add(
                    new MovieShow(
                            1L,
                            today,
                            LocalTime.of(10, 0),
                            150.0,
                            pvrScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            1L,
                            today,
                            LocalTime.of(13, 30),
                            150.0,
                            pvrScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            1L,
                            today,
                            LocalTime.of(18, 30),
                            150.0,
                            pvrScreen2
                    )
            );

            shows.add(
                    new MovieShow(
                            1L,
                            today,
                            LocalTime.of(21, 30),
                            180.0,
                            pvrScreen2
                    )
            );

            // Interstellar
            shows.add(
                    new MovieShow(
                            2L,
                            tomorrow,
                            LocalTime.of(11, 0),
                            200.0,
                            pvrScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            2L,
                            tomorrow,
                            LocalTime.of(19, 0),
                            250.0,
                            pvrScreen2
                    )
            );

            // -----------------------------
            // CINEPOLIS
            // -----------------------------

            shows.add(
                    new MovieShow(
                            3L,
                            today,
                            LocalTime.of(11, 0),
                            180.0,
                            cinepolisScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            3L,
                            today,
                            LocalTime.of(15, 0),
                            200.0,
                            cinepolisScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            2L,
                            tomorrow,
                            LocalTime.of(18, 0),
                            220.0,
                            cinepolisScreen1
                    )
            );

            // -----------------------------
            // INOX
            // -----------------------------

            shows.add(
                    new MovieShow(
                            4L,
                            dayAfterTomorrow,
                            LocalTime.of(9, 30),
                            160.0,
                            inoxScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            5L,
                            dayAfterTomorrow,
                            LocalTime.of(12, 45),
                            180.0,
                            inoxScreen1
                    )
            );

            shows.add(
                    new MovieShow(
                            6L,
                            dayAfterTomorrow,
                            LocalTime.of(17, 30),
                            250.0,
                            inoxScreen1
                    )
            );

            // Save all shows
            shows = showRepository.saveAll(shows);

            // =====================================================
            // 5. CREATE SEATS FOR EVERY SHOW
            // =====================================================

            List<ShowSeat> allSeats =
                    new ArrayList<>();

            for (MovieShow show : shows) {

                for (int i = 1; i <= 30; i++) {

                    String status = "AVAILABLE";

                    /*
                     * Sample already-booked seats.
                     *
                     * This makes the application look realistic
                     * when the user first opens the seat page.
                     */

                    if (i == 3 ||
                        i == 4 ||
                        i == 10 ||
                        i == 11) {

                        status = "BOOKED";
                    }

                    allSeats.add(
                            new ShowSeat(
                                    show,
                                    String.valueOf(i),
                                    status
                            )
                    );
                }
            }

            seatRepository.saveAll(allSeats);

            // =====================================================
            // COMPLETE
            // =====================================================

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "CinePass booking data created!"
            );

            System.out.println(
                    "Theatres : 3"
            );

            System.out.println(
                    "Screens  : 4"
            );

            System.out.println(
                    "Shows    : " + shows.size()
            );

            System.out.println(
                    "Seats    : " + allSeats.size()
            );

            System.out.println(
                    "========================================"
            );
        };
    }
}
package com.cinepass.movie.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cinepass.movie.entity.Movie;
import com.cinepass.movie.repository.MovieRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedMovies(MovieRepository movieRepository) {

        return args -> {

            // Prevent duplicate movies
            if (movieRepository.count() > 0) {
                System.out.println(
                        "Movies already exist. Skipping movie seeder."
                );
                return;
            }

            // Movie 1
            movieRepository.save(
                    new Movie(
                            "Avengers",
                            "Earth's mightiest heroes unite to save the world.",
                            "English",
                            143,
                            "Action"
                    )
            );

            // Movie 2
            movieRepository.save(
                    new Movie(
                            "Interstellar",
                            "A team travels through a wormhole in space.",
                            "English",
                            169,
                            "Sci-Fi"
                    )
            );

            // Movie 3
            movieRepository.save(
                    new Movie(
                            "Inception",
                            "A skilled thief enters people's dreams.",
                            "English",
                            148,
                            "Thriller"
                    )
            );

            // Movie 4
            movieRepository.save(
                    new Movie(
                            "The Dark Knight",
                            "Batman faces a dangerous criminal mastermind.",
                            "English",
                            152,
                            "Action"
                    )
            );

            // Movie 5
            movieRepository.save(
                    new Movie(
                            "Spider-Man",
                            "A young hero discovers extraordinary abilities.",
                            "English",
                            121,
                            "Action"
                    )
            );

            // Movie 6
            movieRepository.save(
                    new Movie(
                            "Avatar",
                            "A human becomes part of an extraordinary alien world.",
                            "English",
                            162,
                            "Adventure"
                    )
            );

            // Movie 7
            movieRepository.save(
                    new Movie(
                            "RRR",
                            "Two revolutionaries fight against British rule.",
                            "Telugu",
                            182,
                            "Action"
                    )
            );

            // Movie 8
            movieRepository.save(
                    new Movie(
                            "KGF",
                            "A determined man rises to power in a gold mine.",
                            "Kannada",
                            156,
                            "Action"
                    )
            );

            // Movie 9
            movieRepository.save(
                    new Movie(
                            "Pushpa",
                            "A labourer rises through the red sandalwood trade.",
                            "Telugu",
                            179,
                            "Action"
                    )
            );

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "CinePass movies created successfully!"
            );

            System.out.println(
                    "======================================"
            );
        };
    }
}
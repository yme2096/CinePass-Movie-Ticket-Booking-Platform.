package com.cinepass.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@Configuration
public class GatewayRoutes {

    // =====================================================
    // USER SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {

        return route("user-service")
                .route(
                        path("/api/users/**"),
                        http()
                )
                .filter(
                        lb("USER-SERVICE")
                )
                .build();
    }

    // =====================================================
    // MOVIE SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> movieServiceRoute() {

        return route("movie-service")
                .route(
                        path("/api/movies/**"),
                        http()
                )
                .filter(
                        lb("MOVIE-SERVICE")
                )
                .build();
    }

    // =====================================================
    // BOOKING SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> bookingServiceRoute() {

        return route("booking-service")
                .route(
                        path("/api/bookings/**"),
                        http()
                )
                .filter(
                        lb("BOOKING-SERVICE")
                )
                .build();
    }

    // =====================================================
    // SHOW SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> showServiceRoute() {

        return route("show-service")
                .route(
                        path("/api/shows/**"),
                        http()
                )
                .filter(
                        lb("BOOKING-SERVICE")
                )
                .build();
    }

    // =====================================================
    // PAYMENT SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> paymentServiceRoute() {

        return route("payment-service")
                .route(
                        path("/api/payments/**"),
                        http()
                )
                .filter(
                        lb("PAYMENT-SERVICE")
                )
                .build();
    }

    // =====================================================
    // ADMIN SHOW SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> adminShowServiceRoute() {

        return route("admin-show-service")
                .route(
                        path("/api/admin/shows/**"),
                        http()
                )
                .filter(
                        lb("BOOKING-SERVICE")
                )
                .build();
    }

    // =====================================================
    // ADMIN THEATRE SERVICE
    // =====================================================

    @Bean
    public RouterFunction<ServerResponse> adminTheatreServiceRoute() {

        return route("admin-theatre-service")
                .route(
                        path("/api/admin/theatres/**"),
                        http()
                )
                .filter(
                        lb("BOOKING-SERVICE")
                )
                .build();
    }
}
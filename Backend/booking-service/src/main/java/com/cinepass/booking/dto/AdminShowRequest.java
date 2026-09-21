package com.cinepass.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AdminShowRequest(

        Long movieId,

        LocalDate showDate,

        LocalTime startTime,

        Double price,

        Long screenId

) {
}
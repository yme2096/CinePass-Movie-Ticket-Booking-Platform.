package com.cinepass.booking.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "show_seats",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"show_id", "seat_number"}
        )
    }
)
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "show_id")
    private MovieShow show;

    private String seatNumber;

    private String status;

    public ShowSeat() {
    }

    public ShowSeat(
            MovieShow show,
            String seatNumber,
            String status) {

        this.show = show;
        this.seatNumber = seatNumber;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public MovieShow getShow() {
        return show;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
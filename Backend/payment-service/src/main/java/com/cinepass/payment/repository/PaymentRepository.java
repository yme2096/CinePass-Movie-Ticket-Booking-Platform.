package com.cinepass.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinepass.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
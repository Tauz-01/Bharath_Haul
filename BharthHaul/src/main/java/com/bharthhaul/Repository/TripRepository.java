package com.bharthhaul.Repository;

import com.bharthhaul.Model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
    Trip findByBookingId(Long bookingId);
}

package com.bharthhaul.Repository;

import com.bharthhaul.Model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_Id(Long customerId);

    List<Booking> findByDriver_Id(Long driverId);

    List<Booking> findByStatus(String status);
}

package com.bharthhaul.Repository;

import com.bharthhaul.Model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByBooking_Id(Long bookingId);
}

package com.bharthhaul.Controller;

import com.bharthhaul.Model.Booking;
import com.bharthhaul.Model.Invoice;
import com.bharthhaul.Repository.BookingRepository;
import com.bharthhaul.Repository.InvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/invoice")
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceRepository invoiceRepo;
    private final BookingRepository bookingRepo;

    public InvoiceController(InvoiceRepository invoiceRepo, BookingRepository bookingRepo) {
        this.invoiceRepo = invoiceRepo;
        this.bookingRepo = bookingRepo;
    }

    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getInvoiceByBooking(@PathVariable Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }

        
        Optional<Invoice> existingInvoice = invoiceRepo.findByBooking_Id(bookingId);
        if (existingInvoice.isPresent()) {
            return ResponseEntity.ok(existingInvoice.get());
        }

        
        Booking booking = bookingOpt.get();

        
        if (!"accepted".equalsIgnoreCase(booking.getStatus()) && !"completed".equalsIgnoreCase(booking.getStatus())) {
            return ResponseEntity.badRequest().body("Invoice can only be generated for accepted or completed bookings");
        }

        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setAmount(booking.getPrice()); 
        invoice.setIssuedDate(LocalDateTime.now());
        invoice.setStatus("PENDING");

        Invoice savedInvoice = invoiceRepo.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }
}

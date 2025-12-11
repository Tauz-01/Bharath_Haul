package com.bharthhaul.Controller;

import com.bharthhaul.Model.Booking;
import com.bharthhaul.Model.Customer;
import com.bharthhaul.Model.Driver;
import com.bharthhaul.Repository.BookingRepository;
import com.bharthhaul.Repository.CustomerRepository;
import com.bharthhaul.Repository.DriverRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepo;
    private final CustomerRepository customerRepo;
    private final DriverRepository driverRepo;

    public BookingController(BookingRepository bookingRepo,
            CustomerRepository customerRepo,
            DriverRepository driverRepo) {
        this.bookingRepo = bookingRepo;
        this.customerRepo = customerRepo;
        this.driverRepo = driverRepo;
    }

    // 1. Customer creates a booking
    @PostMapping("/create/{customerId}")
    public ResponseEntity<String> createBooking(@PathVariable Long customerId,
            @RequestBody com.bharthhaul.Dto.BookingRequest bookingRequest) {
        Optional<Customer> customerOpt = customerRepo.findById(customerId);
        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Customer not found");
        }

        Booking booking = new Booking();
        booking.setCustomer(customerOpt.get());
        booking.setPickupLocation(bookingRequest.getPickupLocation());
        booking.setDropLocation(bookingRequest.getDropoffLocation()); // Map dropoffLocation -> dropLocation
        booking.setLoadType(bookingRequest.getVehicleType()); // Map vehicleType -> loadType
        booking.setPrice(bookingRequest.getFare()); // Map fare -> price
        booking.setLoadWeight(10.0); // Default load weight
        booking.setStatus("pending");

        bookingRepo.save(booking);
        return ResponseEntity.ok("Booking created successfully");
    }

    // 2. Get booking details
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return bookingRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. List customer bookings
    @GetMapping("/customer/{customerId}")
    public List<Booking> getCustomerBookings(@PathVariable Long customerId) {
        return bookingRepo.findByCustomer_Id(customerId);
    }

    // 4. List driver jobs - shows pending bookings (available loads) + driver's
    // accepted bookings
    @GetMapping("/driver/{driverId}")
    public List<Booking> getDriverBookings(@PathVariable Long driverId) {
        // Get all pending bookings (available for any driver) + bookings assigned to
        // this driver
        List<Booking> pendingBookings = bookingRepo.findByStatus("pending");
        List<Booking> driverBookings = bookingRepo.findByDriver_Id(driverId);

        // Combine both lists
        pendingBookings.addAll(driverBookings);
        return pendingBookings;
    }

    // 5. Driver accepts booking
    @PutMapping("/{id}/accept/{driverId}")
    public ResponseEntity<String> acceptBooking(@PathVariable Long id,
            @PathVariable Long driverId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);
        Optional<Driver> driverOpt = driverRepo.findById(driverId);

        if (bookingOpt.isEmpty() || driverOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking or Driver not found");
        }

        Booking booking = bookingOpt.get();
        booking.setDriver(driverOpt.get());
        booking.setStatus("accepted");
        bookingRepo.save(booking);

        return ResponseEntity.ok("Booking accepted by driver");
    }

    // 6. Driver rejects booking
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectBooking(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }

        Booking booking = bookingOpt.get();
        booking.setStatus("rejected");
        bookingRepo.save(booking);

        return ResponseEntity.ok("Booking rejected");
    }
}

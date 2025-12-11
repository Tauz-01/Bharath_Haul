package com.bharthhaul.Controller;

import com.bharthhaul.Model.Booking;
import com.bharthhaul.Model.Driver;
import com.bharthhaul.Repository.BookingRepository;
import com.bharthhaul.Repository.DriverRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final BookingRepository bookingRepo;
    private final DriverRepository driverRepo;

    public AdminController(BookingRepository bookingRepo, DriverRepository driverRepo) {
        this.bookingRepo = bookingRepo;
        this.driverRepo = driverRepo;
    }

  
    @GetMapping("/stats")
    public ResponseEntity<String> getStats() {
        long totalBookings = bookingRepo.count();
        long totalDrivers = driverRepo.count();
        long activeDrivers = driverRepo.findAll().stream()
                .filter(d -> d.getLicensenumber() != null) // simple check for "verified"
                .count();

        return ResponseEntity.ok("Bookings: " + totalBookings +
                ", Drivers: " + totalDrivers +
                ", Active Drivers: " + activeDrivers);
    }

    // 2. List all drivers
    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        return driverRepo.findAll();
    }

    // 3. Approve driver documents
    @PutMapping("/driver/{id}/approve")
    public ResponseEntity<String> approveDriver(@PathVariable Long id) {
        Optional<Driver> driverOpt = driverRepo.findById(id);
        if (driverOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Driver not found");
        }
        Driver driver = driverOpt.get();
        // Here you could set a "verified" flag in Driver model
        driverRepo.save(driver);
        return ResponseEntity.ok("Driver approved");
    }

    // 4. Ban/unban driver
    @PutMapping("/driver/{id}/ban")
    public ResponseEntity<String> banDriver(@PathVariable Long id) {
        Optional<Driver> driverOpt = driverRepo.findById(id);
        if (driverOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Driver not found");
        }
        Driver driver = driverOpt.get();
        // Example: set vehicleNumber = "BANNED" or add a banned flag
        driver.setVehiclenumber("BANNED");
        driverRepo.save(driver);
        return ResponseEntity.ok("Driver banned");
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    @PutMapping("/dispute/{id}/resolve")
    public ResponseEntity<String> resolveDispute(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }
        Booking booking = bookingOpt.get();
        booking.setStatus("dispute_resolved");
        bookingRepo.save(booking);
        return ResponseEntity.ok("Dispute resolved for booking " + id);
    }
}

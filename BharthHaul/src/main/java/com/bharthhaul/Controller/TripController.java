package com.bharthhaul.Controller;

import com.bharthhaul.Model.Trip;
import com.bharthhaul.Model.Booking;
import com.bharthhaul.Repository.TripRepository;
import com.bharthhaul.Repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/trip")
@CrossOrigin(origins = "*")
public class TripController {

    private final TripRepository tripRepo;
    private final BookingRepository bookingRepo;

    public TripController(TripRepository tripRepo, BookingRepository bookingRepo) {
        this.tripRepo = tripRepo;
        this.bookingRepo = bookingRepo;
    }

    // 1. Start trip
    @PostMapping("/start/{bookingId}")
    public ResponseEntity<String> startTrip(@PathVariable Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }

        Trip trip = new Trip();
        trip.setBooking(bookingOpt.get());
        trip.setStatus("in_progress");
        trip.setStartedAt(java.time.LocalDateTime.now());
        tripRepo.save(trip);

        return ResponseEntity.ok("Trip started");
    }

    // 2. Update driver location
    @PutMapping("/{tripId}/update-location")
    public ResponseEntity<String> updateLocation(@PathVariable Long tripId,
                                                 @RequestParam double lat,
                                                 @RequestParam double lng) {
        Optional<Trip> tripOpt = tripRepo.findById(tripId);
        if (tripOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Trip not found");
        }

        Trip trip = tripOpt.get();
        trip.setCurrentLat(lat);
        trip.setCurrentLng(lng);
        tripRepo.save(trip);

        return ResponseEntity.ok("Location updated");
    }

    // 3. Get trip details (for live tracking)
    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTrip(@PathVariable Long tripId) {
        return tripRepo.findById(tripId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Complete trip
    @PostMapping("/{tripId}/complete")
    public ResponseEntity<String> completeTrip(@PathVariable Long tripId) {
        Optional<Trip> tripOpt = tripRepo.findById(tripId);
        if (tripOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Trip not found");
        }

        Trip trip = tripOpt.get();
        trip.setStatus("completed");
        trip.setCompletedAt(java.time.LocalDateTime.now());
        tripRepo.save(trip);

        return ResponseEntity.ok("Trip completed");
    }
}

package com.bharthhaul.Controller;

import com.bharthhaul.Model.Booking;
import com.bharthhaul.Model.Customer;
import com.bharthhaul.Model.Driver;
import com.bharthhaul.Repository.BookingRepository;
import com.bharthhaul.Repository.CustomerRepository;
import com.bharthhaul.Repository.DriverRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bharthhaul.Model.User;
import com.bharthhaul.Repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepo;
    private final CustomerRepository customerRepo;
    private final DriverRepository driverRepo;
    private final UserRepository userRepo;

    public BookingController(BookingRepository bookingRepo,
            CustomerRepository customerRepo,
            DriverRepository driverRepo,
            UserRepository userRepo) {
        this.bookingRepo = bookingRepo;
        this.customerRepo = customerRepo;
        this.driverRepo = driverRepo;
        this.userRepo = userRepo;
    }

    
    @PostMapping("/create/{userId}")
    public ResponseEntity<String> createBooking(@PathVariable Long userId,
            @RequestBody com.bharthhaul.Dto.BookingRequest bookingRequest) {

        
        Optional<Customer> customerOpt = customerRepo.findByUser_Id(userId);
        Customer customer;

        if (customerOpt.isEmpty()) {
            
            Optional<User> userOpt = userRepo.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            
            User user = userOpt.get();
            customer = new Customer();
            customer.setUser(user);
            customer.setName(user.getUsername());
            customer.setPhone(user.getPhone() != null ? user.getPhone() : "N/A");
            customer.setAddress("Details Pending"); 

            customer = customerRepo.save(customer); 
        } else {
            customer = customerOpt.get();
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setPickupLocation(bookingRequest.getPickupLocation());
        booking.setDropLocation(bookingRequest.getDropoffLocation()); 
        booking.setLoadType(bookingRequest.getVehicleType()); 
        booking.setPrice(bookingRequest.getFare()); 
        booking.setLoadWeight(10.0); 
        booking.setStatus("pending");

        bookingRepo.save(booking);
        return ResponseEntity.ok("Booking created successfully");
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return bookingRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    
    @GetMapping("/customer/{userId}")
    public List<Booking> getCustomerBookings(@PathVariable Long userId) {
        
        Optional<Customer> customerOpt = customerRepo.findByUser_Id(userId);
        if (customerOpt.isEmpty()) {
            return List.of(); 
        }
        return bookingRepo.findByCustomer_Id(customerOpt.get().getId());
    }

    
    @GetMapping("/driver/{userId}")
    public List<Booking> getDriverBookings(@PathVariable Long userId) {
        
        Optional<Driver> driverOpt = driverRepo.findByUser_Id(userId);
        Long driverId = -1L;
        if (driverOpt.isPresent()) {
            driverId = driverOpt.get().getId();
        }

        
        List<Booking> pendingBookings = bookingRepo.findByStatus("pending");

        
        if (driverId != -1L) {
            List<Booking> driverBookings = bookingRepo.findByDriver_Id(driverId);
            pendingBookings.addAll(driverBookings);
        }

        return pendingBookings;
    }

    
    @PutMapping("/{id}/accept/{userId}")
    public ResponseEntity<String> acceptBooking(@PathVariable Long id,
            @PathVariable Long userId) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);

        
        Optional<Driver> driverOpt = driverRepo.findByUser_Id(userId);
        Driver driver;

        if (driverOpt.isEmpty()) {
            
            Optional<User> userOpt = userRepo.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            
            User user = userOpt.get();
            driver = new Driver();
            driver.setUser(user);
            driver.setName(user.getUsername());
            driver.setPhone(user.getPhone() != null ? user.getPhone() : "N/A");
            driver.setLicensenumber("Pending");
            driver.setVehicleType("Truck"); 
            driver.setVehiclenumber("Pending");
            driver.setOnline(true);

            driver = driverRepo.save(driver);
        } else {
            driver = driverOpt.get();
        }

        if (bookingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Booking not found");
        }

        Booking booking = bookingOpt.get();
        booking.setDriver(driver);
        booking.setStatus("accepted");
        bookingRepo.save(booking);

        return ResponseEntity.ok("Booking accepted by driver");
    }

    
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

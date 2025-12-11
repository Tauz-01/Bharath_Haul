package com.bharthhaul.Controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bharthhaul.Model.User;
import com.bharthhaul.Repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepo;
    private final com.bharthhaul.Repository.CustomerRepository customerRepo;
    private final com.bharthhaul.Repository.DriverRepository driverRepo;

    public AuthController(UserRepository userRepo,
            com.bharthhaul.Repository.CustomerRepository customerRepo,
            com.bharthhaul.Repository.DriverRepository driverRepo) {
        this.userRepo = userRepo;
        this.customerRepo = customerRepo;
        this.driverRepo = driverRepo;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody com.bharthhaul.Dto.SignupRequest signupRequest) {
        if (userRepo.existsByGmail(signupRequest.getGmail())) {
            return ResponseEntity.badRequest().body("Email Already Exists");
        }

        // 1. Create User
        User user = new User();
        user.setUsername(signupRequest.getUsername()); // Map name to username
        user.setGmail(signupRequest.getGmail());
        user.setPassword(signupRequest.getPassword());
        user.setRole(signupRequest.getRole());

        User savedUser = userRepo.save(user);

        // 2. Create Profile based on Role
        if ("customer".equalsIgnoreCase(signupRequest.getRole())) {
            com.bharthhaul.Model.Customer customer = new com.bharthhaul.Model.Customer();
            customer.setUser(savedUser);
            customer.setName(signupRequest.getUsername());
            customer.setPhone(signupRequest.getPhone());
            customerRepo.save(customer);
        } else if ("driver".equalsIgnoreCase(signupRequest.getRole())) {
            com.bharthhaul.Model.Driver driver = new com.bharthhaul.Model.Driver();
            driver.setUser(savedUser);
            driver.setName(signupRequest.getUsername());

            driver.setPhone(signupRequest.getPhone());
            // Set default/dummy values for required fields if needed, or allow nulls in DB
            driver.setLicensenumber("PENDING");
            driver.setVehicleType("UNKNOWN");
            driver.setVehiclenumber("UNKNOWN");
            driverRepo.save(driver);
        }

        // 3. Return Success Response
        return ResponseEntity.ok(new com.bharthhaul.Dto.SignupResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getGmail(),
                savedUser.getRole(),
                "Signup successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        if (loginRequest.getGmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and Password are required");
        }
        Optional<User> userOpt = userRepo.findByGmail(loginRequest.getGmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(new com.bharthhaul.Dto.SignupResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getGmail(),
                        user.getRole(),
                        "Login successful"));
            } else {
                return ResponseEntity.badRequest().body("Wrong password");
            }
        }
        return ResponseEntity.badRequest().body("User not found");
    }
}

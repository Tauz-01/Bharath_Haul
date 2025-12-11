package com.bharthhaul.Controller;

import com.bharthhaul.Model.Driver;
import com.bharthhaul.Repository.DriverRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/driver")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverRepository driverRepo;

    public DriverController(DriverRepository driverRepo) {
        this.driverRepo = driverRepo;
    }

    // 1. Get driver profile
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable Long id) {
        return driverRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. Update driver profile
    @PutMapping("/{id}")
    public ResponseEntity<String> updateDriver(@PathVariable Long id,
                                               @RequestBody Driver updated) {
        Optional<Driver> driverOpt = driverRepo.findById(id);
        if (driverOpt.isEmpty()) return ResponseEntity.badRequest().body("Driver not found");

        Driver driver = driverOpt.get();
        driver.setName(updated.getName());
        driver.setPhone(updated.getPhone());
        driver.setLicensenumber(updated.getLicensenumber());
        driver.setVehicleType(updated.getVehicleType());
        driver.setVehiclenumber(updated.getVehiclenumber());
        driverRepo.save(driver);

        return ResponseEntity.ok("Driver updated successfully");
    }

    // 3. Update online status
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id,
                                               @RequestParam Boolean online) {
        Optional<Driver> driverOpt = driverRepo.findById(id);
        if (driverOpt.isEmpty()) return ResponseEntity.badRequest().body("Driver not found");

        Driver driver = driverOpt.get();
        driver.setOnline(online);
        driverRepo.save(driver);

        return ResponseEntity.ok("Driver status updated successfully");
    }

    // 4. Update driver rating
    @PutMapping("/{id}/rating")
    public ResponseEntity<String> updateRating(@PathVariable Long id,
                                               @RequestParam Double rating) {
        Optional<Driver> driverOpt = driverRepo.findById(id);
        if (driverOpt.isEmpty()) return ResponseEntity.badRequest().body("Driver not found");

        Driver driver = driverOpt.get();
        driver.setRating(rating);
        driverRepo.save(driver);

        return ResponseEntity.ok("Driver rating updated successfully");
    }
}

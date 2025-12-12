package com.bharthhaul.Controller;

import com.bharthhaul.Model.Customer;
import com.bharthhaul.Repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerRepository customerRepo;

    public CustomerController(CustomerRepository customerRepo) {
        this.customerRepo = customerRepo;
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        return customerRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCustomer(@PathVariable Long id,
                                                 @RequestBody Customer updated) {
        Optional<Customer> customerOpt = customerRepo.findById(id);
        if (customerOpt.isEmpty()) return ResponseEntity.badRequest().body("Customer not found");

        Customer customer = customerOpt.get();
        customer.setName(updated.getName());
        customer.setPhone(updated.getPhone());
        customer.setAddress(updated.getAddress());
        customerRepo.save(customer);

        return ResponseEntity.ok("Customer updated successfully");
    }

    
    @PutMapping("/{id}/address")
    public ResponseEntity<String> addAddress(@PathVariable Long id,
                                             @RequestParam String address) {
        Optional<Customer> customerOpt = customerRepo.findById(id);
        if (customerOpt.isEmpty()) return ResponseEntity.badRequest().body("Customer not found");

        Customer customer = customerOpt.get();
        customer.setAddress(address);
        customerRepo.save(customer);

        return ResponseEntity.ok("Address saved successfully");
    }
}

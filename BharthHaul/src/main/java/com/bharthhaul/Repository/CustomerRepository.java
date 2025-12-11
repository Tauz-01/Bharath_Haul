package com.bharthhaul.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bharthhaul.Model.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long> {
    
}

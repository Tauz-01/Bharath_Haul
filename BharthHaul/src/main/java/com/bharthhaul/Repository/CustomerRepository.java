package com.bharthhaul.Repository;
import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bharthhaul.Model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUser_Id(Long userId);
}

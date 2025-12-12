package com.bharthhaul.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bharthhaul.Model.Driver;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser_Id(Long userId);
}

package com.bharthhaul.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.bharthhaul.Model.Driver;

public interface DriverRepository  extends JpaRepository<Driver,Long>{
    
}

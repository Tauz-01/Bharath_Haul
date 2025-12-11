package com.bharthhaul.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bharthhaul.Model.User;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User>findByUsername(String username);
    Optional<User>findByGmail(String gmail);
    Boolean existsByGmail(String gmail);
}

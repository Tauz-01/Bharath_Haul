package com.bharthhaul.Model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    
    @Column(nullable = false)
    private String status;

    
    private double currentLat;
    private double currentLng;

    
    private LocalDateTime eta;

    
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Booking getBooking() {
        return booking;
    }
    public void setBooking(Booking booking) {
        this.booking = booking;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public double getCurrentLat() {
        return currentLat;
    }
    public void setCurrentLat(double currentLat) {
        this.currentLat = currentLat;
    }
    public double getCurrentLng() {
        return currentLng;
    }
    public void setCurrentLng(double currentLng) {
        this.currentLng = currentLng;
    }
    public LocalDateTime getEta() {
        return eta;
    }
    public void setEta(LocalDateTime eta) {
        this.eta = eta;
    }
    public LocalDateTime getStartedAt() {
        return startedAt;
    }
    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    
}

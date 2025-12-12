package com.bharthhaul.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "driver")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String licensenumber;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private String vehiclenumber;

    private Boolean online = false;

    private String aadharNumber; 
    private Double rating = 0.0; 

    
    private String licenseDocumentPath;
    private String vehicleRcDocumentPath;

    
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLicensenumber() {
        return licensenumber;
    }

    public void setLicensenumber(String licensenumber) {
        this.licensenumber = licensenumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehiclenumber() {
        return vehiclenumber;
    }

    public void setVehiclenumber(String vehiclenumber) {
        this.vehiclenumber = vehiclenumber;
    }

    public Boolean getOnline() {
        return online;
    }

    public void setOnline(Boolean online) {
        this.online = online;
    }

    public String getAadharNumber() {
        return aadharNumber;
    }

    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getLicenseDocumentPath() {
        return licenseDocumentPath;
    }

    public void setLicenseDocumentPath(String licenseDocumentPath) {
        this.licenseDocumentPath = licenseDocumentPath;
    }

    public String getVehicleRcDocumentPath() {
        return vehicleRcDocumentPath;
    }

    public void setVehicleRcDocumentPath(String vehicleRcDocumentPath) {
        this.vehicleRcDocumentPath = vehicleRcDocumentPath;
    }
}

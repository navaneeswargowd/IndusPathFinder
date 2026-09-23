package com.induspathfinder.app.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.induspathfinder.app.enums.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="organization")
public class Organization {
	@Id
	@Column(name="org_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orgId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="category_id",nullable = false)
	private Category category;
	
	@OneToMany(mappedBy = "organization",
	           cascade = CascadeType.ALL,
	           orphanRemoval = true)
	private List<User> users = new ArrayList<>();
	
	@Column(name="org_name",nullable = false,length =200 )
	private String orgName;
	
	@Column(name="cin",nullable = false,length = 100,unique = true)
	private String cin;
	
	@Column(name="reg_num",nullable = false,length=200)
	private String regNum;
	
	@Column(name="org_email",nullable = false,unique = true,length=150)
	private String orgEmail;
	
	@Column(name="org_Phn",nullable = false,unique = true,length=15)
	private String orgPhone;
	
	@Column(name="contact",nullable=false, length=100,unique = true)
	private String contact;
	
	@Column(name="pan", nullable =false,length=20,unique = true)
	private String pan;
	
	@Column(name="GST",nullable=false,length=100,unique = true)
	private String gst;
	
	@Column(name="address",nullable=false,length=250)
	private String address;
	
	@Column(name="city",nullable=false,length=50)
	private String city;
	
	@Column(name="dist",nullable = false,length=50)
	private String dist;
	
	@Column(name="state",nullable=false,length=50)
	private String state;
	
	@Column(name="country",nullable=false,length=50)
	private String country;
	
	@Column(name="pin",nullable=false,length=20)
	private String pin;
	
	@Column(name="logo")
	private String logo;
	
	@Column(name="website",length=300)
	private String website;
	
	@Enumerated(EnumType.STRING)
	private Status  status;
	
	@CreationTimestamp
    @Column(name = "create_on",updatable = false)
    private LocalDateTime createOn;

    @Column(name = "create_by")
	private Long createBy;

    @UpdateTimestamp
    @Column(name = "update_on")
    private LocalDateTime updateOn;

    @Column(name = "update_by")
    private Long updateBy;

}

package com.induspathfinder.app.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.induspathfinder.app.enums.Role;
import com.induspathfinder.app.enums.Status;

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
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_id")
	private Long userId;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="org_id")
	private Organization  organization;
	 
	@Column(name="first_name",nullable = false,length = 100)
	private String firstName;
	
	@Column(name="last_name",length=100)
	private String lastName;
	
	@Column(name="email",unique = true,nullable = false,length=150)
	@Email(message = "Invalid Email")
	@NotBlank(message = "email is Required")
	private String email;
	
	@Column(name="mobile",nullable = false,unique = true,length=20)
	@NotBlank(message = "Mobile number is Required")
	private String mobile;
	
	@Column(name="username",length=50)//,nullable = false
	private String userName;
	
	@Column(name="password",unique = true,length=150)
	@NotBlank(message="Password is must be Required")
	private String password;
	
	
	@Enumerated(EnumType.STRING)
	@Column(name="role",nullable=false)
	private Role role;
	
	@Enumerated(EnumType.STRING)
	@Column(name="status",nullable=false)
	private Status status;
	
	@CreationTimestamp
	@Column(name="create_on",updatable = false)
	private LocalDateTime createOn;
	
	@Column(name="create_by")
	private Long createBy;
	
	@UpdateTimestamp
	@Column(name="update_on")
	private LocalDateTime updateOn;
	
	
	@Column(name="updated_by")
	private Long updatedBy;
	
//	@Column(name = "otp", length = 6)
//	private String otp;
//
//	@Column(name = "otp_expiry")
//	private LocalDateTime otpExpiry;

}

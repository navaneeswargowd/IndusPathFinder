package com.induspathfinder.app.dto.response;

import java.time.LocalDateTime;

import com.induspathfinder.app.entity.Organization;
import com.induspathfinder.app.enums.Role;
import com.induspathfinder.app.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {
	
	private Long userId;
	
	private Long orgId;
	
	private String  orgName;
	
	private String orgEmail;
	
	private String orgPhone;
	
	private String city;
	
	private String website;
	
	private String firstName;
	
	private String lastName;
	
	private String email;
	
	private String mobile;
	
	private String userName;
	
	private Role role;
	
	private Status status;
	
	private LocalDateTime createOn;
	
	private LocalDateTime updateOn;
	
	

}

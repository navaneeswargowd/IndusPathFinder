package com.induspathfinder.app.dto.response;

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
public class LoginResponse {
	
	private String token;
	
	private String tokenType;
	
	private Long userId;
	
	private Long orgId;
	
	private String firstName;
	
	private String lastName;
	
	private String userName;
	
	private String email;
	
	private Role role;
	
	private Status status;
	

}

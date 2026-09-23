package com.induspathfinder.app.dto.request;

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
public class RegisterRequest {
	
	
	private Long orgId;
	
	private String firstName;
	
	private String lastName;
	
	private String email;
	
	private String mobile;
	
	private String userName;
	
	private String password;

	public Role role;

	public Status status;
		

	

}

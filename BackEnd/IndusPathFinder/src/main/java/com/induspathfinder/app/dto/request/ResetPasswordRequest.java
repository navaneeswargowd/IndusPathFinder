package com.induspathfinder.app.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetPasswordRequest {

	private String email;

    private String otp;

    private String newPassword;

    private String confirmPassword;
	
}

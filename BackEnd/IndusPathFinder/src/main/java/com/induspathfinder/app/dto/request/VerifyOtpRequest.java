//package com.induspathfinder.app.dto.request;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class VerifyOtpRequest {
//	
//	private String email;
//
//    private String otp;
//}


package com.induspathfinder.app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOtpRequest {

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid Email Address.")
    private String email;

    @NotBlank(message = "OTP is required.")
    @Pattern(
        regexp = "\\d{6}",
        message = "OTP must contain exactly 6 digits."
    )
    private String otp;
}

package com.induspathfinder.app.service;

import com.induspathfinder.app.dto.request.ForgotPasswordRequest;
import com.induspathfinder.app.dto.request.LoginRequest;
import com.induspathfinder.app.dto.request.RegisterRequest;
import com.induspathfinder.app.dto.request.ResetPasswordRequest;
import com.induspathfinder.app.dto.request.VerifyOtpRequest;


public interface AuthService {

	 Object register(RegisterRequest request);

	    Object login(LoginRequest request);

//	LoginResponse register(RegisterRequest request);
//	
//	LoginResponse login(LoginRequest request);
//	
	void forgotPassword(ForgotPasswordRequest request);
	
	//void verifyPassword(VerifyOtpRequest request);
	
	void resetPassword(ResetPasswordRequest request);
	
	

  

    

    void verifyOtp(VerifyOtpRequest request);

    
}

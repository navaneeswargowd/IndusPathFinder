package com.induspathfinder.app.util;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class ValidationUtil {
	
	private static final String EMAIL_REGEX= "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
	
	private static final String MOBILE_REGEX =  "^[6-9][0-9]{9}$";
	
	private static final String PASSWORD_REGEX= "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$";
	
	 private final Pattern emailPattern =
	            Pattern.compile(EMAIL_REGEX);

	    private final Pattern mobilePattern =
	            Pattern.compile(MOBILE_REGEX);

	    private final Pattern passwordPattern =
	            Pattern.compile(PASSWORD_REGEX);
	    
	    public boolean isValidEmail(String email) {

	        return email != null
	                && emailPattern.matcher(email).matches();
	    }

	    public boolean isValidMobile(String mobile) {

	        return mobile != null
	                && mobilePattern.matcher(mobile).matches();
	    }

	    public boolean isValidPassword(String password) {

	        return password != null
	                && passwordPattern.matcher(password).matches();
	    }

	    public boolean isNullOrEmpty(String value) {

	        return value == null
	                || value.trim().isEmpty();
	    }
	

}

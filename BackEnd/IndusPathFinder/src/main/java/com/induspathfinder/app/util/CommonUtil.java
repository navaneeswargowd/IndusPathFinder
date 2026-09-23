package com.induspathfinder.app.util;

import org.springframework.stereotype.Component;

@Component
public class CommonUtil {
	
	 public boolean isNull(Object object) {

	        return object == null;
	    }

	 
	    public boolean isNotNull(Object object) {

	        return object != null;
	    }
	    

	    public boolean isNullOrEmpty(String value) {

	        return value == null
	                || value.trim().isEmpty();
	    }
	    

	    public String trim(String value) {

	        return value == null
	                ? null
	                : value.trim();
	    }
	}
	
	



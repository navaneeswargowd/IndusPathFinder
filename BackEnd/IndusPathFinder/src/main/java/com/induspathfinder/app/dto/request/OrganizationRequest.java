package com.induspathfinder.app.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationRequest {
	
	 // Category

    private Long categoryId;

    // Organization

    private String orgName;

    private String cin;

    private String regNum;

    private String orgEmail;

    private String orgPhone;

    private String contact;

    private String pan;

    private String gst;

    private String address;

    private String city;

    private String dist;

    private String state;

    private String country;

    private String pin;

    private String logo;

    private String website;

    // Project Manager

    private String firstName;

    private String lastName;

    private String userName;
    
    private String email;
//	private Long categoryId;
//
//	private String orgName;
//	
//	private String cin;
//	
//	private String regNum;
//	
//	private String 	orgEmail;
//	
//	private String orgPhone;
//	
//	private String contact;
//
//	private String pan;
//	
//	private String gst;
//
//    private String address;
//
//    private String city;
//
//    private String dist;
//
//    private String state;
//
//    private String country;
//
//    private String pin;
//
//    private String logo;
//
//    private String website;

}

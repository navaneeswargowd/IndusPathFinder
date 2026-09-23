package com.induspathfinder.app.dto.response;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationResponse {
	
	private Long orgId;

    private String categoryName;

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

    private Status status;

    private LocalDateTime createOn;
//	private Long orgId;
//
//    private String categoryName;
//
//    private String orgName;
//
//    private String cin;
//
//    private String regNum;
//
//    private String orgEmail;
//
//    private String orgPhone;
//
//    private String contact;
//
//    private String pan;
//
//    private String gst;
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
//
//    private Status status;
//
//    private LocalDateTime createOn;
}

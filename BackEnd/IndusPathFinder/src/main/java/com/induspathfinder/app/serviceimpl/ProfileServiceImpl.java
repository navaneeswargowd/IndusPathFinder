package com.induspathfinder.app.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.ChangePasswordRequest;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.request.ProfileRequest;
import com.induspathfinder.app.dto.response.ProfileResponse;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.UserRepository;
import com.induspathfinder.app.service.ProfileService;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService{

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private NotificationServiceImpl notificationService;
	


	@Override
	public ProfileResponse getProfile() {
		User user=getLoggedInUser();
		return mapToResponse(user);
	}

//	@Override
//	@Transactional
//	@AuditAction(
//	    actionName = "UPDATE_PROFILE",
//	    actionScreen = "PROFILE",
//	    actionScreenId = "@currentUserUtil.getCurrentUserId()",
//	    userId = "@currentUserUtil.getCurrentUserId()",
//	    username = "@currentUserUtil.getCurrentUserName()",
//	    details = "User profile updated successfully"
//	)
//	public ProfileResponse updateProfile(ProfileRequest request) {
//		
//		if(request == null) {
//			throw new ValidationException(" Profile request con not be null ");
//		}
//		
//		if(isBlank(request.getFirstName())) {
//			throw new ValidationException(" First Name is required");
//			
//		}
//		
//		if(isBlank(request.getEmail())) {
//			throw new ValidationException("Email is required");
//		}
//		
//		if(isBlank(request.getUserName())) {
//			throw new ValidationException("UserName is required");
//			
//		}
//		//=============== Current user   =======================
//		
//		User user = getLoggedInUser();
//		
//		// ===============  Duplicate Email   ====================
//
//		
//		userRepository.findByEmail(request.getEmail().trim()).ifPresent(existing ->{
//			if (!existing.getUserId()
//                    .equals(user.getUserId())) {
//				throw new DuplicateResourceException(
//                        "Email already exists");
//			}
//
//		});
//		  // ================= UPDATE =================
//		
//		 user.setFirstName(request.getFirstName().trim());
//
//	        user.setLastName(request.getLastName());
//	        
//	        user.setUserName(request.getUserName().trim());
//
//	        user.setEmail( request.getEmail().trim());
//
//	       
//	        user.setUpdatedBy(user.getUserId());
//	        user.setUpdateOn(LocalDateTime.now());
//
//	        User updatedUser = userRepository.save(user);
//	        
//
//	        notificationService.createNotification(
//	                NotificationCreateRequest.builder()
//	                        .userId(updatedUser.getUserId())
//	                        .title("Profile Updated")
//	                        .message(
//	                                "Your profile was updated successfully.")
//	                        .build());
//
//	        return mapToResponse(updatedUser);
//		
//		
//		
//	}
	
	@Override
	@Transactional
	@AuditAction(
	    actionName = "UPDATE_PROFILE",
	    actionScreen = "PROFILE",
	    actionScreenId = "@currentUserUtil.getCurrentUserId()",
	    userId = "@currentUserUtil.getCurrentUserId()",
	    username = "@currentUserUtil.getCurrentUserName()",
	    details = "User profile updated successfully"
	)
	public ProfileResponse updateProfile(
	        ProfileRequest request) {

	    /*
	     * ==========================================
	     * REQUEST VALIDATION
	     * ==========================================
	     */

	    if (request == null) {

	        throw new ValidationException(
	                "Profile request cannot be null");
	    }


	    /*
	     * ==========================================
	     * FIRST NAME
	     * ==========================================
	     */

	    if (isBlank(
	            request.getFirstName())) {

	        throw new ValidationException(
	                "First Name is required");
	    }


	    if (!request
	            .getFirstName()
	            .matches(
	                    "^[A-Za-z]+(?: [A-Za-z]+)*$")) {

	        throw new ValidationException(
	                "First Name is invalid");
	    }


	    /*
	     * ==========================================
	     * LAST NAME
	     * ==========================================
	     */

	    if (isBlank(
	            request.getLastName())) {

	        throw new ValidationException(
	                "Last Name is required");
	    }


	    if (!request
	            .getLastName()
	            .matches(
	                    "^[A-Za-z]+(?: [A-Za-z]+)*$")) {

	        throw new ValidationException(
	                "Last Name is invalid");
	    }


	    /*
	     * ==========================================
	     * MOBILE NUMBER
	     * ==========================================
	     */

	    if (request.getMobile() == null) {

	        throw new ValidationException(
	                "Mobile Number is required");
	    }


	    String mobile =
	            String.valueOf(
	                    request.getMobile());


	    if (!mobile.matches(
	            "^[0-9]{10}$")) {

	        throw new ValidationException(
	                "Mobile Number is invalid");
	    }


	    /*
	     * ==========================================
	     * CURRENT LOGGED-IN USER
	     * ==========================================
	     */

	    User user =
	            getLoggedInUser();


	    /*
	     * ==========================================
	     * UPDATE ONLY ALLOWED PROFILE FIELDS
	     * ==========================================
	     *
	     * Editable:
	     *
	     * firstName
	     * lastName
	     * mobile
	     *
	     * NOT editable:
	     *
	     * userName
	     * email
	     */

	    user.setFirstName(
	            request
	                    .getFirstName()
	                    .trim());

	    user.setLastName(
	            request
	                    .getLastName()
	                    .trim());

	    user.setMobile(
	            request.getMobile());


	    user.setUpdatedBy(
	            user.getUserId());

	    user.setUpdateOn(
	            LocalDateTime.now());


	    User updatedUser =
	            userRepository.save(
	                    user);


	    /*
	     * ==========================================
	     * NOTIFICATION
	     * ==========================================
	     */

	    notificationService
	            .createNotification(
	                    NotificationCreateRequest
	                            .builder()
	                            .userId(
	                                    updatedUser
	                                            .getUserId())
	                            .title(
	                                    "Profile Updated")
	                            .message(
	                                    "Your profile was updated successfully.")
	                            .build());


	    /*
	     * ==========================================
	     * RESPONSE
	     * ==========================================
	     */

	    return mapToResponse(
	            updatedUser);
	}

	@Override
	@Transactional
	@AuditAction(
	    actionName = "CHANGE_PASSWORD",
	    actionScreen = "PROFILE",
	    actionScreenId = "@currentUserUtil.getCurrentUserId()",
	    userId = "@currentUserUtil.getCurrentUserId()",
	    username = "@currentUserUtil.getCurrentUserName()",
	    details = "Password changed successfully"
	)
	public void changePassword(ChangePasswordRequest request) {
		
		  // ================= VALIDATION =================

        if (request == null) {
            throw new ValidationException("Change password request cannot be null");
        }

        if (isBlank(request.getOldPassword())) {
            throw new ValidationException("Old password is required");
        }

        if (isBlank(request.getNewPassword())) {
            throw new ValidationException("New password is required");
        }

        if (request.getNewPassword().length() < 6) {
            throw new ValidationException("Password must contain at least 6 characters");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {

            throw new ValidationException("New password and confirm password do not match");
        }

        // ================= USER =================

        User user = getLoggedInUser();

        // ================= OLD PASSWORD =================

        if (!passwordEncoder.matches(request.getOldPassword(),user.getPassword())) {

            throw new BadRequestException("Old password is incorrect");
        }

        // ================= NEW PASSWORD =================

        
         // Never store plain password.
         
        String encodedPassword =
                passwordEncoder.encode(request.getNewPassword());

        user.setPassword(encodedPassword);

        user.setUpdateOn(LocalDateTime.now());

        userRepository.save(user);
        
        
        notificationService.createNotification(
                NotificationCreateRequest.builder()
                        .userId(user.getUserId())
                        .title("Password Changed")
                        .message(
                                "Your password was changed successfully.")
                        .build());

        // ================= EMAIL =================

        
         // Never send new password.
         
        emailService.sendPasswordChangedMail(
                user.getEmail(),
                user.getFirstName());
    }

	

	
	private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ValidationException(
                    "User is not authenticated");
        }

        String username =
                authentication.getName();

        return userRepository
                .findByUserName(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Logged-in user not found"));
    }
	
	 private ProfileResponse mapToResponse(
	            User user) {

	        ProfileResponse response =
	                new ProfileResponse();

	        response.setUserId(
	                user.getUserId());

	        response.setOrgId(
	                user.getOrganization()
	                        .getOrgId());
	        response.setOrgName(user.getOrganization().getOrgName());
	        
	        response.setOrgEmail(user.getOrganization().getOrgEmail());
	        
	        response.setOrgPhone(user.getOrganization().getOrgPhone());
	        
	        response.setCity(user.getOrganization().getCity());
	        
	        response.setWebsite(user.getOrganization().getWebsite());
	        
	        response.setFirstName(
	                user.getFirstName());

	        response.setLastName(
	                user.getLastName());

	        response.setEmail(
	                user.getEmail());

	        response.setMobile(
	                user.getMobile());

	        response.setUserName(
	                user.getUserName());

	        response.setRole(
	                user.getRole());

	        response.setStatus(
	                user.getStatus());

	        response.setCreateOn(
	                user.getCreateOn());

	        response.setUpdateOn(
	                user.getUpdateOn());

	        return response;
	    }

	    private boolean isBlank(String value) {

	        return value == null ||
	                value.trim().isEmpty();
	    }
	

	}

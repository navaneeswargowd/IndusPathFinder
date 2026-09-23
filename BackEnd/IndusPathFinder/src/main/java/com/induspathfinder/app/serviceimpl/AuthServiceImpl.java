package com.induspathfinder.app.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.ForgotPasswordRequest;
import com.induspathfinder.app.dto.request.LoginRequest;
import com.induspathfinder.app.dto.request.RegisterRequest;
import com.induspathfinder.app.dto.request.ResetPasswordRequest;
import com.induspathfinder.app.dto.request.VerifyOtpRequest;
import com.induspathfinder.app.dto.response.AdminLoginResponse;
import com.induspathfinder.app.dto.response.LoginResponse;
import com.induspathfinder.app.entity.Organization;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.enums.Role;
import com.induspathfinder.app.enums.Status;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.exception.ValidationException;
import com.induspathfinder.app.repository.OrganizationRepository;
import com.induspathfinder.app.repository.UserRepository;
import com.induspathfinder.app.security.JwtService;
import com.induspathfinder.app.service.AuthService;
import com.induspathfinder.app.util.CommonUtil;
import com.induspathfinder.app.util.DateUtil;
import com.induspathfinder.app.util.OtpStore;
import com.induspathfinder.app.util.OtpUtil;
import com.induspathfinder.app.util.ValidationUtil;

@Service
@Transactional
public class AuthServiceImpl  implements AuthService{

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private OrganizationRepository organizationRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private ValidationUtil validationUtil;
	
	@Autowired
	private CommonUtil  commonUtil; 
	
	@Autowired
	private DateUtil dateUtil;
	
	@Autowired 
	private EmailService emailService;
	
	@Autowired
	private  OtpUtil otpUtil;
	
	@Autowired
	private OtpStore otpStore;
	
//	private  CurrentUserUtil currentUserUtil;
	
	

	@Override
	public Object register(RegisterRequest request) {

	    //================ Request Validation ================

	    if (request == null) {
	        throw new ValidationException("Request cannot be null.");
	    }

	    if (commonUtil.isNullOrEmpty(request.getFirstName())) {
	        throw new ValidationException("First Name is required.");
	    }

	    if (commonUtil.isNullOrEmpty(request.getEmail())) {
	        throw new ValidationException("Email is required.");
	    }

	    if (commonUtil.isNullOrEmpty(request.getMobile())) {
	        throw new ValidationException("Mobile Number is required.");
	    }

	    if (commonUtil.isNullOrEmpty(request.getUserName())) {
	        throw new ValidationException("Username is required.");
	    }

	    if (!validationUtil.isValidEmail(request.getEmail())) {
	        throw new ValidationException("Invalid Email Address.");
	    }

	    if (!validationUtil.isValidMobile(request.getMobile())) {
	        throw new ValidationException("Invalid Mobile Number.");
	    }

	    //================ Duplicate Validation ================

	    if (userRepository.existsByEmail(request.getEmail())) {
	        throw new ValidationException("Email already exists.");
	    }

	    if (userRepository.existsByMobile(request.getMobile())) {
	        throw new ValidationException("Mobile already exists.");
	    }

	    if (userRepository.existsByUserName(request.getUserName())) {
	        throw new ValidationException("Username already exists.");
	    }

	    //================ Organization Validation ================

	    Organization organization = null;

	    if (request.getRole() == Role.PROJECT_MANAGER) {

	        if (request.getOrgId() == null) {
	            throw new ValidationException("Organization Id is required.");
	        }

	        organization = organizationRepository.findById(request.getOrgId())
	                .orElseThrow(() ->
	                        new ResourceNotFoundException("Organization Not Found"));
	    }

	    //================ Generate Temporary Password ================

	    String temporaryPassword = otpUtil.generateOtp();

	    System.out.println("Temporary Password : " + temporaryPassword);

	    //================ Create User ================

	    User user = new User();

	    user.setOrganization(organization);
	    user.setFirstName(commonUtil.trim(request.getFirstName()));
	    user.setLastName(commonUtil.trim(request.getLastName()));
	    user.setEmail(commonUtil.trim(request.getEmail()));
	    user.setMobile(commonUtil.trim(request.getMobile()));
	    user.setUserName(commonUtil.trim(request.getUserName()));
	    user.setPassword(passwordEncoder.encode(temporaryPassword));
	    user.setRole(request.getRole());
	    user.setStatus(Status.ACTIVE);
	    user.setCreateOn(dateUtil.getCurrentDateTime());
//	    user.setCreateBy("SELF");

	    //================ Save User ================

	    User savedUser = userRepository.save(user);
	    savedUser.setCreateBy(savedUser.getUserId());
	    savedUser = userRepository.saveAndFlush(savedUser);
	    //================ Generate JWT ================

	    String token = jwtService.generateToken(savedUser);

	    //================ Send Email ================

	    emailService.sendLoginMail(
	            savedUser.getEmail(),
	            savedUser.getUserName(),
	            temporaryPassword);

	    //================ ADMIN Response ================

	    if (savedUser.getRole() == Role.ADMIN) {

	        return AdminLoginResponse.builder()
	                .token(token)
	                .tokenType("Bearer")
	                .userId(savedUser.getUserId())
	                .firstName(savedUser.getFirstName())
	                .lastName(savedUser.getLastName())
	                .userName(savedUser.getUserName())
	                .email(savedUser.getEmail())
	                .role(savedUser.getRole())
	                .status(savedUser.getStatus())
	                .build();
	    }

	    //================ PROJECT_MANAGER Response ================

	    return LoginResponse.builder()
	            .token(token)
	            .tokenType("Bearer")
	            .userId(savedUser.getUserId())
	            .orgId(savedUser.getOrganization().getOrgId())
	            .firstName(savedUser.getFirstName())
	            .lastName(savedUser.getLastName())
	            .userName(savedUser.getUserName())
	            .email(savedUser.getEmail())
	            .role(savedUser.getRole())
	            .status(savedUser.getStatus())
	            .build();
	}
	
	
	//      ==================== Login  =========================
	
	@Override
	@AuditAction(
		    actionName = "LOGIN",
		    actionScreen = "AUTHENTICATION",
		    actionScreenId = "#result.userId",
		    userId = "#result.userId",
		    username = "#result.userName",
		    details = "User logged in successfully"
		)
	public Object login(LoginRequest request) {

	    //================ Request Validation ================

	    if (request == null) {
	        throw new ValidationException("Login request cannot be null.");
	    }

	    if (commonUtil.isNullOrEmpty(request.getEmail())) {
	        throw new ValidationException("Email is required.");
	    }

	    if (commonUtil.isNullOrEmpty(request.getPassword())) {
	        throw new ValidationException("Password is required.");
	    }

	    //================ Find User ================

	    User user = userRepository.findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Invalid Email or Password"));

	    //================ User Status Check ================

	    if (user.getStatus() != Status.ACTIVE) {
	        throw new ValidationException("User account is inactive.");
	    }

	    //================ Password Validation ================

	    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	        throw new ValidationException("Invalid Username or Password");
	    }

	    //================ Generate JWT Token ================

	    String token = jwtService.generateToken(user);

	    //================ Login Success Mail (Optional) ================

//	    emailService.sendLoginMail(
//	            user.getEmail(),
//	            user.getUserName());

	    //================ Response ================

	    Long orgId = null;

	    if (user.getOrganization() != null) {
	        orgId = user.getOrganization().getOrgId();
	    }

//	    return LoginResponse.builder()
//	            .token(token)
//	            .tokenType("Bearer")
//	            .userId(user.getUserId())
//	            .orgId(orgId)
//	            .firstName(user.getFirstName())
//	            .lastName(user.getLastName())
//	            .userName(user.getUserName())
//	            .email(user.getEmail())
//	            .role(user.getRole())
//	            .status(user.getStatus())
//	            .build();
//	    
//	}
	    if (user.getRole() == Role.ADMIN) {

	        return AdminLoginResponse.builder()
	                .token(token)
	                .tokenType("Bearer")
	                .userId(user.getUserId())
	                .firstName(user.getFirstName())
	                .lastName(user.getLastName())
	                .userName(user.getUserName())
	                .email(user.getEmail())
	                .role(user.getRole())
	                .status(user.getStatus())
	                .build();
	    }

	    return LoginResponse.builder()
	            .token(token)
	            .tokenType("Bearer")
	            .userId(user.getUserId())
	            .orgId(user.getOrganization() != null
	                    ? user.getOrganization().getOrgId()
	                    : null)
	            .firstName(user.getFirstName())
	            .lastName(user.getLastName())
	            .userName(user.getUserName())
	            .email(user.getEmail())
	            .role(user.getRole())
	            .status(user.getStatus())
	            .build();
	
	}
	
	
	
	
	
	
	
//	@Override
//	public void forgotPassword(ForgotPasswordRequest request) {
//
//	    //================ Request Validation ================
//
//	    if (request == null) {
//	        throw new ValidationException("Request cannot be null.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getEmail())) {
//	        throw new ValidationException("Email is required.");
//	    }
//
//	    if (!validationUtil.isValidEmail(request.getEmail())) {
//	        throw new ValidationException("Invalid Email Address.");
//	    }
//
//	    //================ Find User ================
//
//	    User user = userRepository.findByEmail(request.getEmail())
//	            .orElseThrow(() ->
//	                    new ResourceNotFoundException("Email does not exist."));
//
//	    //================ Generate OTP ================
//
//	    String otp = otpUtil.generateOtp();
//
//	    //user.setOtp(otp);
//
//	    // OTP valid for 10 minutes
//	   // user.setOtpExpiry(dateUtil.getCurrentDateTime().plusMinutes(10));
//
////	    user.setUpdateOn(dateUtil.getCurrentDateTime());
////	    user.setUpdatedBy("SELF");
////
////	    //================ Save OTP ================
////
////	    userRepository.save(user);
//
//	    //================ Send OTP Mail ================
//
//	    emailService.sendOtpMail(
//	            user.getEmail(),
//	            user.getUserName(),
//	            otp
//	    );
//
//	}
	
	
	
	@Override
	public void forgotPassword(ForgotPasswordRequest request) {

	    if (request == null) {
	        throw new ValidationException(
	                "Request cannot be null.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getEmail())) {

	        throw new ValidationException(
	                "Email is required.");
	    }

	    if (!validationUtil.isValidEmail(
	            request.getEmail())) {

	        throw new ValidationException(
	                "Invalid Email Address.");
	    }

	    User user =
	            userRepository
	                    .findByEmail(
	                            request.getEmail())
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "Email does not exist."));

	    String otp =
	            otpUtil.generateOtp();

	    LocalDateTime expiryTime =
	            dateUtil.getCurrentDateTime()
	                    .plusMinutes(10);

	    /*
	     * Store OTP temporarily in memory.
	     */
	    otpStore.saveOtp(
	            user.getEmail(),
	            otp,
	            expiryTime);

	    emailService.sendOtpMail(
	            user.getEmail(),
	            user.getUserName(),
	            otp);
	}
	
	
//	@Override
//	public void verifyOtp(VerifyOtpRequest request) {
//
//	    //================ Request Validation ================
//
//	    if (request == null) {
//	        throw new ValidationException("Request cannot be null.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getEmail())) {
//	        throw new ValidationException("Email is required.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getOtp())) {
//	        throw new ValidationException("OTP is required.");
//	    }
//
//	    if (!validationUtil.isValidEmail(request.getEmail())) {
//	        throw new ValidationException("Invalid Email Address.");
//	    }
//
//	    //================ Find User ================
//
//	    User user = userRepository.findByEmail(request.getEmail())
//	            .orElseThrow(() ->
//	                    new ResourceNotFoundException("User not found."));
//
//	    //================ Verify OTP ================
//
////	    if (user.getOtp() == null) {
////	        throw new ValidationException("OTP not generated.");
////	    }
//
////	    if (!user.getOtp().equals(request.getOtp())) {
////	        throw new ValidationException("Invalid OTP.");
////	    }
//
//	    //================ Check OTP Expiry ================
//
////	    if (user.getOtpExpiry() == null ||
////	            user.getOtpExpiry().isBefore(dateUtil.getCurrentDateTime())) {
////
////	        throw new ValidationException("OTP has expired.");
////	    }
//
//	    //================ OTP Verified ================
//
////	    user.setOtp(null);
////	    user.setOtpExpiry(null);
////	    user.setUpdateOn(dateUtil.getCurrentDateTime());
////	    user.setUpdatedBy("SELF");
////
////	    userRepository.save(user);
//
//	}
	
	@Override
	public void verifyOtp(
	        VerifyOtpRequest request) {

	    if (request == null) {
	        throw new ValidationException(
	                "Request cannot be null.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getEmail())) {

	        throw new ValidationException(
	                "Email is required.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getOtp())) {

	        throw new ValidationException(
	                "OTP is required.");
	    }

	    if (!validationUtil.isValidEmail(
	            request.getEmail())) {

	        throw new ValidationException(
	                "Invalid Email Address.");
	    }

	    /*
	     * Ensure user exists.
	     */
	    userRepository
	            .findByEmail(
	                    request.getEmail())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User not found."));

	    OtpStore.OtpData otpData =
	            otpStore.getOtpData(
	                    request.getEmail());

	    if (otpData == null) {

	        throw new ValidationException(
	                "OTP not generated. Please request a new OTP.");
	    }

	    /*
	     * Check expiration first.
	     */
	    if (otpData.getExpiryTime() == null
	            || otpData.getExpiryTime()
	                    .isBefore(
	                            dateUtil
	                                    .getCurrentDateTime())) {

	        otpStore.removeOtp(
	                request.getEmail());

	        throw new ValidationException(
	                "OTP has expired. Please request a new OTP.");
	    }

	    /*
	     * Compare actual OTP.
	     */
	    if (!otpData.getOtp()
	            .equals(request.getOtp())) {

	        throw new ValidationException(
	                "Invalid OTP.");
	    }

	    /*
	     * Do NOT remove yet because resetPassword()
	     * is the next API.
	     *
	     * Mark it verified.
	     */
	    otpStore.markVerified(
	            request.getEmail());
	}
	
	
//	@Override
//	public void resetPassword(ResetPasswordRequest request) {
//
//	    //================ Request Validation ================
//
//	    if (request == null) {
//	        throw new ValidationException("Request cannot be null.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getEmail())) {
//	        throw new ValidationException("Email is required.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getOtp())) {
//	        throw new ValidationException("OTP is required.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getNewPassword())) {
//	        throw new ValidationException("New Password is required.");
//	    }
//
//	    if (commonUtil.isNullOrEmpty(request.getConfirmPassword())) {
//	        throw new ValidationException("Confirm Password is required.");
//	    }
//
//	    //================ Email Validation ================
//
//	    if (!validationUtil.isValidEmail(request.getEmail())) {
//	        throw new ValidationException("Invalid Email Address.");
//	    }
//
//	    //================ Password Match ================
//
//	    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
//	        throw new ValidationException("New Password and Confirm Password do not match.");
//	    }
//
//	    //================ Password Validation ================
//
//	    if (!validationUtil.isValidPassword(request.getNewPassword())) {
//	        throw new ValidationException(
//	                "Password must contain uppercase, lowercase, number and special character.");
//	    }
//
//	    //================ Find User ================
//
//	    User user = userRepository.findByEmail(request.getEmail())
//	            .orElseThrow(() ->
//	                    new ResourceNotFoundException("User not found."));
//
//	    //================ Verify OTP ================
//
////	    if (user.getOtp() == null) {
////	        throw new ValidationException("OTP not generated.");
////	    }
////
////	    if (!user.getOtp().equals(request.getOtp())) {
////	        throw new ValidationException("Invalid OTP.");
////	    }
//
//	    //================ Check OTP Expiry ================
//
////	    if (user.getOtpExpiry() == null ||
////	            user.getOtpExpiry().isBefore(dateUtil.getCurrentDateTime())) {
////
////	        throw new ValidationException("OTP has expired.");
////	    }
//
//	    //================ Update Password ================
//
//	    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
//
//	    // Clear OTP after successful reset
////	    user.setOtp(null);
////	    user.setOtpExpiry(null);
//
//	    user.setUpdateOn(dateUtil.getCurrentDateTime());
//	    user.setUpdatedBy(user.getUserId());
//
//	    userRepository.save(user);
//
//	    //================ Send Password Reset Confirmation Mail ================
//
//	    emailService.sendPasswordChangedMail(
//	            user.getEmail(),
//	            user.getUserName()
//	    );
//
//	}
	
	
	@Override
	public void resetPassword(
	        ResetPasswordRequest request) {

	    if (request == null) {
	        throw new ValidationException(
	                "Request cannot be null.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getEmail())) {

	        throw new ValidationException(
	                "Email is required.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getOtp())) {

	        throw new ValidationException(
	                "OTP is required.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getNewPassword())) {

	        throw new ValidationException(
	                "New Password is required.");
	    }

	    if (commonUtil.isNullOrEmpty(
	            request.getConfirmPassword())) {

	        throw new ValidationException(
	                "Confirm Password is required.");
	    }

	    if (!validationUtil.isValidEmail(
	            request.getEmail())) {

	        throw new ValidationException(
	                "Invalid Email Address.");
	    }

	    if (!request.getNewPassword()
	            .equals(
	                    request.getConfirmPassword())) {

	        throw new ValidationException(
	                "New Password and Confirm Password do not match.");
	    }

	    if (!validationUtil.isValidPassword(
	            request.getNewPassword())) {

	        throw new ValidationException(
	                "Password must contain uppercase, lowercase, number and special character.");
	    }

	    User user =
	            userRepository
	                    .findByEmail(
	                            request.getEmail())
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "User not found."));

	    OtpStore.OtpData otpData =
	            otpStore.getOtpData(
	                    request.getEmail());

	    if (otpData == null) {

	        throw new ValidationException(
	                "OTP not generated or already used.");
	    }

	    if (otpData.getExpiryTime() == null
	            || otpData.getExpiryTime()
	                    .isBefore(
	                            dateUtil
	                                    .getCurrentDateTime())) {

	        otpStore.removeOtp(
	                request.getEmail());

	        throw new ValidationException(
	                "OTP has expired.");
	    }

	    if (!otpData.getOtp()
	            .equals(request.getOtp())) {

	        throw new ValidationException(
	                "Invalid OTP.");
	    }

	    if (!otpStore.isVerified(
	            request.getEmail())) {

	        throw new ValidationException(
	                "OTP is not verified.");
	    }

	    user.setPassword(
	            passwordEncoder.encode(
	                    request.getNewPassword()));

	    user.setUpdateOn(
	            dateUtil.getCurrentDateTime());

	    user.setUpdatedBy(
	            user.getUserId());

	    userRepository.save(user);

	    /*
	     * OTP can no longer be reused after
	     * successful password reset.
	     */
	    otpStore.removeOtp(
	            request.getEmail());

	    emailService.sendPasswordChangedMail(
	            user.getEmail(),
	            user.getUserName());
	}
	
}

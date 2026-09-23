package com.induspathfinder.app.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
	@Autowired
	private JavaMailSender mailSender;
	
	private void sendEmail(
            String to,
            String subject,
            String text) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
		// Registration
		 
	public void sendOrganizationCreatedMail(
								            String email,
								            
								            String userName,
								            String temporaryPassword) {
										
		String subject =
                "IndusPathFinder - Account Created";

        String text =
                "Dear " + userName + ",\n\n"
                + "Your IndusPathFinder account has been created successfully.\n\n"
                + "Username: " + userName + "\n"
                + "Temporary Password: " + temporaryPassword + "\n\n"
                + "Please login using these credentials "
                + "and change your password after login.\n\n"
                + "Regards,\n"
                + "IndusPathFinder Team";
        sendEmail(email, subject, text);
			 
		 }
	// auth
	public void sendLoginMail(String email, String userName, String temporaryPassword) {

	    String subject = "Login Credentials";

	    String text =
	            "Hello " + userName + ",\n\n"
	          + "Your account has been created successfully.\n\n"
	          + "Username : " + userName + "\n"
	          + "Temporary Password : " + temporaryPassword + "\n\n"
	          + "Please login and change your password.\n\n"
	          + "Thank You.";

	    sendEmail(email, subject, text);
	}
//	public void sendLoginMail(String email,
//	                          String userName,
//	                          String temporaryPassword) {
//
//	    String subject = "Welcome to IndusPathFinder";
//
//	    String text = "Hello " + userName + ",\n\n"
//	            + "Your account has been created successfully.\n\n"
//	            + "Username : " + userName + "\n"
//	            + "Temporary Password : " + temporaryPassword + "\n\n"
//	            + "Please login using this temporary password and change your password after login.\n\n"
//	            + "Thank You,\n"
//	            + "IndusPathFinder Team";
//
//	    sendEmail(email, subject, text);
//	}
	
//	 public void sendLoginMail(
//	            String email,
//	            String userName) {
//
//	        String subject =
//	                "IndusPathFinder - Login Notification";
//
//	        String text =
//	                "Dear " + userName + ",\n\n"
//	                + "You have successfully logged in to "
//	                + "your IndusPathFinder account.\n\n"
//	                + "If this login was not performed by you, "
//	                + "please contact the administrator.\n\n"
//	                + "Regards,\n"
//	                + "IndusPathFinder Team";
//
//	        sendEmail(email, subject, text);
//	 }
	 
	 public void sendPasswordChangedMail(
	            String email,
	            String userName) {

	        String subject =
	                "IndusPathFinder - Password Changed";

	        String text =
	                "Dear " + userName + ",\n\n"
	                + "Your IndusPathFinder password has been "
	                + "changed successfully.\n\n"
	                + "For security reasons, your new password "
	                + "is not included in this email.\n\n"
	                + "If you did not perform this action, "
	                + "please contact the administrator immediately.\n\n"
	                + "Regards,\n"
	                + "IndusPathFinder Team";

	        sendEmail(email, subject, text);

		 
	}
	 
	 public void sendOtpMail(
	            String email,
	            String otp) {

	        String subject =
	                "IndusPathFinder - Password Reset OTP";

	        String text =
	                "Dear User,\n\n"
	                + "Your OTP for password reset is: "
	                + otp + "\n\n"
	                + "This OTP is valid for 5 minutes.\n"
	                + "Please do not share this OTP with anyone.\n\n"
	                + "Regards,\n"
	                + "IndusPathFinder Team";

	        sendEmail(email, subject, text);
	    }

	 public void sendOrganizationUpdatedMail(
		        String email,
		        String orgName) {

		    String subject =
		            "IndusPathFinder - Organization Updated";

		    String text =
		            "Dear Organization,\n\n"
		            + "Your organization details have been updated "
		            + "successfully in IndusPathFinder.\n\n"
		            + "Organization Name: "
		            + orgName + "\n\n"
		            + "If you did not make this change, "
		            + "please contact the administrator immediately.\n\n"
		            + "Regards,\n"
		            + "IndusPathFinder Team";

		    sendEmail(
		            email,
		            subject,
		            text
		    );
		}
	 public void sendOrganizationDeletedMail(
		        String email,
		        String orgName) {

		    String subject =
		            "IndusPathFinder - Organization Deleted";

		    String text =
		            "Dear Organization       ,\n\n"
		            + "Your organization has been deleted "
		            + "from IndusPathFinder successfully.\n\n"
		            + "Organization Name: "
		            + orgName + "\n\n"
		            + "If you did not request this action, "
		            + "please contact the administrator immediately.\n\n"
		            + "Regards,\n"
		            + "IndusPathFinder Team";

		    sendEmail(
		            email,
		            subject,
		            text
		    );
		}

	 public void sendOtpMail(String email, String userName, String otp) {

	        String subject = "Password Reset OTP - IndusPathFinder";

	        String text = "Dear " + userName + ",\n\n"
	                + "Your OTP for password reset is: " + otp + "\n\n"
	                + "This OTP is valid for 10 minutes.\n\n"
	                + "If you did not request this OTP, please ignore this email.\n\n"
	                + "Regards,\n"
	                + "IndusPathFinder Team";

	        sendEmail(email, subject, text);
	    }
}


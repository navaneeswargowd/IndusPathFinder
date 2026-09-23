package com.induspathfinder.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.request.ForgotPasswordRequest;
import com.induspathfinder.app.dto.request.LoginRequest;
import com.induspathfinder.app.dto.request.RegisterRequest;
import com.induspathfinder.app.dto.request.ResetPasswordRequest;
import com.induspathfinder.app.dto.request.VerifyOtpRequest;
import com.induspathfinder.app.dto.response.LoginResponse;
import com.induspathfinder.app.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // ==========================================================
    // Register
    // ==========================================================

    @PostMapping("/register")
    public ResponseEntity<Object> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    // ==========================================================
    // Forgot Password
    // ==========================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request);

        return ResponseEntity.ok("OTP has been sent successfully.");
    }

    // ==========================================================
    // Verify OTP
    // ==========================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtp(request);

        return ResponseEntity.ok("OTP verified successfully.");
    }

    // ==========================================================
    // Reset Password
    // ==========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok("Password has been reset successfully.");
    }

}
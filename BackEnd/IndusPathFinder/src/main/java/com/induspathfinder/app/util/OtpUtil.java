package com.induspathfinder.app.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class OtpUtil {

    public String generateOtp() {

        SecureRandom random = new SecureRandom();

        return String.valueOf(
                100000 + random.nextInt(900000));
    }
}
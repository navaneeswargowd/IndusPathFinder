package com.induspathfinder.app.util;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class OtpStore {

    private final Map<String, OtpData> otpMap =
            new ConcurrentHashMap<>();

    public void saveOtp(
            String email,
            String otp,
            LocalDateTime expiryTime) {

        otpMap.put(
                normalizeEmail(email),
                new OtpData(
                        otp,
                        expiryTime,
                        false));
    }

    public OtpData getOtpData(
            String email) {

        if (email == null) {
            return null;
        }

        return otpMap.get(
                normalizeEmail(email));
    }

    public void markVerified(
            String email) {

        String key =
                normalizeEmail(email);

        OtpData otpData =
                otpMap.get(key);

        if (otpData != null) {

            otpMap.put(
                    key,
                    new OtpData(
                            otpData.getOtp(),
                            otpData.getExpiryTime(),
                            true));
        }
    }

    public boolean isVerified(
            String email) {

        OtpData otpData =
                getOtpData(email);

        return otpData != null
                && otpData.isVerified();
    }

    public void removeOtp(
            String email) {

        if (email != null) {

            otpMap.remove(
                    normalizeEmail(email));
        }
    }

    private String normalizeEmail(
            String email) {

        return email.trim()
                .toLowerCase();
    }

    public static class OtpData {

        private final String otp;

        private final LocalDateTime expiryTime;

        private final boolean verified;

        public OtpData(
                String otp,
                LocalDateTime expiryTime,
                boolean verified) {

            this.otp = otp;
            this.expiryTime = expiryTime;
            this.verified = verified;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }

        public boolean isVerified() {
            return verified;
        }
    }
}
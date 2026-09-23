package com.induspathfinder.app.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.induspathfinder.app.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Generate Secret Key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT Token
     */
    public String generateToken(User user) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        JwtBuilder builder = Jwts.builder()
                .setSubject(user.getUserName())
                .claim("userId", user.getUserId())
                .claim("role", user.getRole().name())
                .setIssuedAt(now)
                .setExpiration(expiryDate);

        // Add orgId only for PROJECT_MANAGER
        if (user.getOrganization() != null) {
            builder.claim("orgId", user.getOrganization().getOrgId());
        }

        return builder
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract Username
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extract Role
     */
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    /**
     * Extract User Id
     */
    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    /**
     * Extract Organization Id
     */
    public Long extractOrgId(String token) {

        Claims claims = extractAllClaims(token);

        Object orgId = claims.get("orgId");

        if (orgId == null) {
            return null;
        }

        return ((Number) orgId).longValue();
    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(String token, String username) {

        return username.equals(extractUsername(token))
                && !isTokenExpired(token);
    }

    /**
     * Check Token Expired
     */
    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    /**
     * Extract All Claims
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

//package com.induspathfinder.app.security;
//
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//
//import javax.crypto.SecretKey;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import com.induspathfinder.app.entity.User;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import io.jsonwebtoken.JwtBuilder;
//@Service
//public class JwtService {
//
//    @Value("${jwt.secret}")
//    private String secret;
//
//    @Value("${jwt.expiration}")
//    private long expiration;
//
//    /**
//     * Generate Secret Key
//     */
//    private SecretKey getSigningKey() {
//
//        return Keys.hmacShaKeyFor(
//                secret.getBytes(StandardCharsets.UTF_8));
//    }
//
//    /**
//     * Generate JWT Token
//     */
//    
//    public String generateToken(User user) {
//
//        Date now = new Date();
//        Date expiryDate = new Date(now.getTime() + expiration);
//
//        JwtBuilder builder = Jwts.builder()
//                .setSubject(user.getUserName())
//                .claim("userId", user.getUserId())
//                .claim("role", user.getRole().name())
//                .setIssuedAt(now)
//                .setExpiration(expiryDate);
//
//        // Add orgId only for PROJECT_MANAGER
//        if (user.getOrganization() != null) {
//            builder.claim("orgId", user.getOrganization().getOrgId());
//        }
//
//        return builder
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
////    public String generateToken(User user) {
////
////        Date now = new Date();
////        Date expiryDate = new Date(now.getTime() + expiration);
////
////        var builder = Jwts.builder()
////                .setSubject(user.getUserName())
////                .claim("userId", user.getUserId())
////                .claim("role", user.getRole().name())
////                .setIssuedAt(now)
////                .setExpiration(expiryDate);
////
////        if (user.getOrganization() != null) {
////            builder.claim("orgId", user.getOrganization().getOrgId());
////        }
////
////        return builder
////                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
////                .compact();
////    }
////    public String generateToken(User user) {
////
////        Date now = new Date();
////
////        Date expiryDate = new Date(now.getTime() + expiration);
////
////        return Jwts.builder()
////                .setSubject(user.getUserName())
////                .claim("userId", user.getUserId())
////                .claim("orgId", user.getOrganization().getOrgId())
////                .claim("role", user.getRole().name())
////                .setIssuedAt(now)
////                .setExpiration(expiryDate)
////                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
////                .compact();
////    }
//    
//
//    /**
//     * Extract Username
//     */
//    public String extractUsername(String token) {
//
//        return extractAllClaims(token).getSubject();
//    }
//
//    /**
//     * Extract Role
//     */
//    public String extractRole(String token) {
//
//        return extractAllClaims(token)
//                .get("role", String.class);
//    }
//
//    /**
//     * Extract User Id
//     */
//    public Long extractUserId(String token) {
//
//        return extractAllClaims(token)
//                .get("userId", Long.class);
//    }
//
//    /**
//     * Extract Organization Id
//     */
//    public Long extractOrgId(String token) {
//
//        return extractAllClaims(token)
//                .get("orgId", Long.class);
//    }
//
//    /**
//     * Validate Token
//     */
//    public boolean isTokenValid(String token, String username) {
//
//        return username.equals(extractUsername(token))
//                && !isTokenExpired(token);
//    }
//
//    /**
//     * Check Token Expired
//     */
//    private boolean isTokenExpired(String token) {
//
//        return extractAllClaims(token)
//                .getExpiration()
//                .before(new Date());
//    }
//
//    /**
//     * Extract All Claims
//     */
//    private Claims extractAllClaims(String token) {
//
//        return Jwts.parserBuilder()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}
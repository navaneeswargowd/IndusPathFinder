package com.induspathfinder.app.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.exception.UnauthorizedException;
import com.induspathfinder.app.repository.UserRepository;

@Component
public class CurrentUserUtil {

    private final UserRepository userRepository;
    

    public CurrentUserUtil(
            UserRepository userRepository) {

        this.userRepository = userRepository;
        
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                        authentication.getPrincipal())) {

            throw new UnauthorizedException(
                    "User is not authenticated");
        }

        String userName =
                authentication.getName();

        return userRepository
                .findByUserName(userName)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Authenticated user not found"));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    public String getCurrentUserName() {
        return getCurrentUser().getUserName();
    }
}
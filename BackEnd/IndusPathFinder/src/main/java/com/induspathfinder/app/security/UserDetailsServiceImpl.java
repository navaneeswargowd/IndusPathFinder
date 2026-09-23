package com.induspathfinder.app.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.repository.UserRepository;

import lombok.RequiredArgsConstructor;


//@Service
//@RequiredArgsConstructor
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String userName)
//            throws UsernameNotFoundException {
//
//        User user = userRepository.findByUserName(userName)
//                .orElseThrow(() ->
//                        new UsernameNotFoundException(
//                                "User not found with username: " + userName));
//
//        return new CustomUserDetails(user);
//    }
//}
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
    private  UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName)
            throws UsernameNotFoundException {

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with username: " + userName));

        return new CustomUserDetails(user);
    }
}
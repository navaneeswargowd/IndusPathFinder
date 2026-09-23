package com.induspathfinder.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.induspathfinder.app.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	
	Optional<User> findByUserName(String userName);
	Optional<User> findByEmail(String email);
	Optional<User> findByMobile(String mobile);
	
	
	boolean existsByUserName(String userName);
	boolean existsByEmail(String email);
	boolean existsByMobile(String mobile);

}

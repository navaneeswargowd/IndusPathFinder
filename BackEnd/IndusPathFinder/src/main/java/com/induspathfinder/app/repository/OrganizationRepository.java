package com.induspathfinder.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.induspathfinder.app.entity.Organization;


@Repository
public interface OrganizationRepository extends
JpaRepository<Organization, Long>,
JpaSpecificationExecutor<Organization> {	
	

	boolean existsByOrgEmail(String orgEmail);
	boolean existsByOrgName(String orgName);
	boolean existsByregNum(String regNum);
	boolean existsByCin(String cin);
	
	Optional<Organization> findByOrgNameIgnoreCase(String orgName);

	Optional<Organization> findByOrgEmailIgnoreCase(String orgEmail);

	Optional<Organization> findByCinIgnoreCase(String cin);

	Optional<Organization> findByRegNumIgnoreCase(String regNum);

	//Optional<User> findByUserName(String username);
}

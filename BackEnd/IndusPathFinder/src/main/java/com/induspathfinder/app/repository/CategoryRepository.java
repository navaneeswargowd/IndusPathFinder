package com.induspathfinder.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.induspathfinder.app.entity.Category;
import com.induspathfinder.app.enums.Status;
@Repository
public interface CategoryRepository
extends JpaRepository<Category, Long>,
JpaSpecificationExecutor<Category> {	Optional<Category> findByCategoryNameIgnoreCase(String categoryName);
	
	Optional<Category> findByCategoryName(String categoryName);
	
	boolean 	existsByCategoryName (String categoryName);
	
	List<Category> findByStatusOrderByCategoryNameAsc(Status status);

}

package com.induspathfinder.app.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.induspathfinder.app.dto.request.CategoryRequest;
import com.induspathfinder.app.dto.response.CategoryResponse;
public interface CategoryService {
	
	CategoryResponse createCategory(CategoryRequest request);
	
	CategoryResponse getCategory(Long categoryId);
	
	//List<CategoryResponse> getAllCategory();
	Page<CategoryResponse> getAllCategory(
									        String search,
									        String status,
									        int page,
									        int size,
									        String sortBy,
									        String sortDir);
	CategoryResponse updateCategory(Long categoryId, CategoryRequest request);
	
	void deleteCategory(Long categoryId);
	
	CategoryResponse changCategoryStatus(Long categoryId);
	
	List<CategoryResponse> getActiveCategories();

}

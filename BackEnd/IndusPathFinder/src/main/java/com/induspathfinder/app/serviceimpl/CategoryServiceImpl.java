package com.induspathfinder.app.serviceimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.CategoryRequest;
import com.induspathfinder.app.dto.response.CategoryResponse;
import com.induspathfinder.app.entity.Category;
import com.induspathfinder.app.enums.Status;
import com.induspathfinder.app.exception.DuplicateResourceException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.CategoryRepository;
import com.induspathfinder.app.repository.UserRepository;
import com.induspathfinder.app.service.CategoryService;
import com.induspathfinder.app.util.CurrentUserUtil;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
@Service
@Transactional
public class CategoryServiceImpl implements CategoryService{

	
	@Autowired
	private CategoryRepository categoryRepository;
	
//	@Autowired
//	private UserRepository userRepository;
	@Autowired
	private CurrentUserUtil currentUserUtil;
	
	
	
	@Override
	@AuditAction(
		    actionName = "CREATE_CATEGORY",
		    actionScreen = "CATEGORIES",
		    actionScreenId = "#result.categoryId",
		    userId = "@currentUserUtil.getCurrentUserId()",
		    username = "@currentUserUtil.getCurrentUserName()",
		    details = "Category created successfully"
		)
	public CategoryResponse createCategory(CategoryRequest request) {
		
		if (request == null) {
		    throw new ValidationException(
		            "Category request cannot be null");
		}

		if (request.getCategoryName() == null ||
		        request.getCategoryName().trim().isEmpty()) {

		    throw new ValidationException(
		            "Category name is required");
		}

		String categoryName = request.getCategoryName().trim();

		// ================= DUPLICATE CHECK =================

		if (categoryRepository.findByCategoryNameIgnoreCase(categoryName).isPresent()) {

		    throw new DuplicateResourceException( "Category name already exists");
		}

		// ================= ENTITY =================

//		Category category = new Category();
//
//		category.setStatus(Status.ACTIVE);
//		category.setCreateOn(LocalDateTime.now());
//		category.setCreateBy("ADMIN");
//		category.setUpdateOn(LocalDateTime.now());
//		category.setUpdatedBy("ADMIN");
		
		Category category = new Category();

		category.setCategoryName(categoryName);
		category.setStatus(Status.ACTIVE);
		category.setCreateBy(currentUserUtil.getCurrentUserId());
		category.setCreateOn(LocalDateTime.now());
		//category.setUpdatedBy("ADMIN");
		//category.setUpdateOn(LocalDateTime.now());
		// ================= SAVE =================

		Category savedCategory =
		        categoryRepository.save(category);

		// ================= RESPONSE =================

		CategoryResponse response = new CategoryResponse();

		response.setCategoryId(
		        savedCategory.getCategoryId());

		response.setCategoryName(
		        savedCategory.getCategoryName());

		response.setStatus(
		        savedCategory.getStatus());

		response.setCreateOn(
		        savedCategory.getCreateOn());

		return response;
	    }



	@Override
	
	public CategoryResponse getCategory(Long categoryId) {
		if(categoryId == null || categoryId <=0 ) {
			throw new ValidationException("invalid category id");
		}
		
		Category category= categoryRepository.findById(categoryId)
				.orElseThrow(()-> new ResourceNotFoundException("category not found"));
		
		CategoryResponse response=new CategoryResponse();
		response.setCategoryId(category.getCategoryId());
		response.setCategoryName(category.getCategoryName());
		response.setStatus(category.getStatus());
		response.setCreateOn(category.getCreateOn());
		
		return response;
	}
	
	@Override
	public Page<CategoryResponse> getAllCategory(
											        String search,
											        String status,
											        int page,
											        int size,
											        String sortBy,
											        String sortDir) {

	    Sort sort = sortDir.equalsIgnoreCase("desc")
	            ? Sort.by(sortBy).descending()
	            : Sort.by(sortBy).ascending();

	    Pageable pageable = PageRequest.of(page, size, sort);

	    Specification<Category> specification = (root, query, cb) -> {

	        var predicates = cb.conjunction();

	        if (search != null && !search.isBlank()) {

	            predicates = cb.and(
	                    predicates,
	                    cb.like(
	                            cb.lower(root.get("categoryName")),
	                            "%" + search.toLowerCase() + "%"));
	        }

	        if (status != null && !status.isBlank()) {

	            predicates = cb.and(
	                    predicates,
	                    cb.equal(
	                            root.get("status"),
	                            Enum.valueOf(
	                                    com.induspathfinder.app.enums.Status.class,
	                                    status.toUpperCase())));
	        }

	        return predicates;
	    };

	    return categoryRepository
	            .findAll(specification, pageable)
	            .map(this::mapToResponse);
	}

//	@Override
//	public List<CategoryResponse> getAllCategory() {
//
//	    List<Category> categoryList =
//	            categoryRepository.findAll();
//
//	    List<CategoryResponse> responseList =
//	            new ArrayList<>();
//
//	    for (Category category : categoryList) {
//
//	        CategoryResponse response =
//	                new CategoryResponse();
//
//	        response.setCategoryId(
//	                category.getCategoryId());
//
//	        response.setCategoryName(
//	                category.getCategoryName());
//
//	        response.setStatus(
//	                category.getStatus());
//
//	        response.setCreateOn(
//	                category.getCreateOn());
//
//	        responseList.add(response);
//	    }
//
//	    return responseList;
//	}

//	@Override
//	public CategoryResponse updateCategory(
//	        Long categoryId,
//	        CategoryRequest request) {
//
//	    // ========================= VALIDATION =========================
//
//	    if (categoryId == null || categoryId <= 0) {
//	        throw new ValidationException(
//	                "Invalid category id");
//	    }
//
//	    if (request == null) {
//	        throw new ValidationException(
//	                "Category request cannot be null");
//	    }
//
//	    if (request.getCategoryName() == null ||
//	            request.getCategoryName().trim().isEmpty()) {
//
//	        throw new ValidationException(
//	                "Category name is required");
//	    }
//
//	    String categoryName =
//	            request.getCategoryName().trim();
//
//	    // ========================= FIND =========================
//
//	    Category category =
//	            categoryRepository.findById(categoryId)
//	                    .orElseThrow(() ->
//	                            new ResourceNotFoundException(
//	                                    "Category not found"));
//
//	    // ========================= DUPLICATE CHECK =========================
//
//	    categoryRepository
//	            .findByCategoryNameIgnoreCase(categoryName)
//	            .ifPresent(existing -> {
//
//	                if (!existing.getCategoryId()
//	                        .equals(categoryId)) {
//
//	                    throw new DuplicateResourceException(
//	                            "Category name already exists");
//	                }
//	            });
//
//	    // ========================= UPDATE =========================
//
//	    category.setCategoryName(categoryName);
//	    category.setUpdatedBy("ADMIN");
//	    category.setUpdateOn(LocalDateTime.now());
//
//	    // ========================= SAVE =========================
//
//	    Category updatedCategory =
//	            categoryRepository.save(category);
//
//	    // ========================= RESPONSE =========================
//
//	    return mapToResponse(updatedCategory);
//	}
//
	@Override
	@AuditAction(
		    actionName = "UPDATE_CATEGORY",
		    actionScreen = "CATEGORIES",
		    actionScreenId = "#categoryId",
		    userId = "@currentUserUtil.getCurrentUserId()",
		    username = "@currentUserUtil.getCurrentUserName()",
		    details = "Category updated successfully"
		)
	public CategoryResponse updateCategory(
	        Long categoryId,
	        CategoryRequest request) {

	    // ================= VALIDATION =================

	    if (categoryId == null || categoryId <= 0) {
	        throw new ValidationException("Invalid Category Id");
	    }

	    if (request == null) {
	        throw new ValidationException("Category request cannot be null");
	    }

	    if (request.getCategoryName() == null ||
	            request.getCategoryName().trim().isEmpty()) {

	        throw new ValidationException("Category Name is required");
	    }

	    if (request.getStatus() == null) {
	        throw new ValidationException("Status is required");
	    }

	    String categoryName = request.getCategoryName().trim();

	    // ================= FIND CATEGORY =================

	    Category category = categoryRepository.findById(categoryId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Category not found"));

	    // ================= DUPLICATE CHECK =================

	    categoryRepository.findByCategoryNameIgnoreCase(categoryName)
	            .ifPresent(existing -> {

	                if (!existing.getCategoryId().equals(categoryId)) {

	                    throw new DuplicateResourceException(
	                            "Category Name already exists");
	                }
	            });

	    // ================= UPDATE =================

	    category.setCategoryName(categoryName);

	    category.setStatus(request.getStatus());

	    category.setUpdatedBy(currentUserUtil.getCurrentUserId());

	    category.setUpdateOn(LocalDateTime.now());

	    // ================= SAVE =================

	    Category updatedCategory =
	            categoryRepository.save(category);

	    // ================= RESPONSE =================

	    return mapToResponse(updatedCategory);
	}
	
	@Override
	public List<CategoryResponse> getActiveCategories() {

	    return categoryRepository
	            .findByStatusOrderByCategoryNameAsc(Status.ACTIVE)
	            .stream()
	            .map(this::mapToResponse)
	            .toList();
	}
	
	private CategoryResponse mapToResponse(
	        Category category) {

	    CategoryResponse response =new CategoryResponse();

	    response.setCategoryId(category.getCategoryId());

	    response.setCategoryName(category.getCategoryName());

	    response.setStatus(category.getStatus());

	    response.setCreateOn(category.getCreateOn());

	    return response;
	}



	@Override
	@AuditAction(
		    actionName = "DELETE_CATEGORY",
		    actionScreen = "CATEGORIES",
		    actionScreenId = "#categoryId",
		    userId = "@currentUserUtil.getCurrentUserId()",
		    username = "@currentUserUtil.getCurrentUserName()",
		    details = "Category deleted successfully"
		)
	public void deleteCategory(Long categoryId) {
		
		if(categoryId ==null || categoryId<=0) {
			throw new ValidationException(" Invalid category id");
			
		}
		
		Category category=
				categoryRepository.findById(categoryId)
				.orElseThrow(()-> new ResourceNotFoundException("category not found "));
		
		categoryRepository.delete(category);
	}

	@Override
	public CategoryResponse changCategoryStatus(Long categoryId) {

	    // ========================= VALIDATION =========================

	    if (categoryId == null || categoryId <= 0) {
	        throw new ValidationException(
	                "Invalid category id");
	    }

	    // ========================= FIND =========================

	    Category category =
	            categoryRepository.findById(categoryId)
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "Category not found"));

	    // ========================= CHANGE STATUS =========================

	    if (category.getStatus() == Status.ACTIVE) {

	        category.setStatus(Status.INACTIVE);

	    } else {

	        category.setStatus(Status.ACTIVE);
	    }

	    // ========================= UPDATE DATE =========================

	    category.setUpdateOn(LocalDateTime.now());

	    // ========================= SAVE =========================

	    Category updatedCategory =
	            categoryRepository.save(category);

	    // ========================= RESPONSE =========================

	    CategoryResponse response =
	            new CategoryResponse();

	    response.setCategoryId(
	            updatedCategory.getCategoryId());

	    response.setCategoryName(
	            updatedCategory.getCategoryName());

	    response.setStatus(
	            updatedCategory.getStatus());

	    response.setCreateOn(
	            updatedCategory.getCreateOn());

	    return response;
	}

}

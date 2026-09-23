package com.induspathfinder.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.dto.request.CategoryRequest;
import com.induspathfinder.app.dto.response.CategoryResponse;
import com.induspathfinder.app.service.CategoryService;

@RestController
@RequestMapping("/api/v1/admin/categories")

@CrossOrigin(origins = "*")
public class CategoryController {
	
	@Autowired
    private CategoryService categoryService;

    // ==========================================================
    // Create Category
    // ==========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request) {

        System.out.println("Category Controller Called");

        CategoryResponse response =
                categoryService.createCategory(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    // ==========================================================
    // Get Category By Id
    // ==========================================================

//    @GetMapping("/{categoryId}")
//    @PreAuthorize("hasAnyRole('ADMIN')")
//    public ResponseEntity<CategoryResponse> getCategory(
//            @PathVariable Long categoryId) {
//
//        CategoryResponse response =
//                categoryService.getCategory(categoryId);
//
//        return ResponseEntity.ok(response);
//    }

    // ==========================================================
    // Get All Categories
    // ==========================================================

//    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN')")
//    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
//
//        List<CategoryResponse> response =
//                categoryService.getAllCategory();
//
//        return ResponseEntity.ok(response);
//    }
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<CategoryResponse>> getAllCategory(

            @RequestParam(defaultValue = "") String search,

            @RequestParam(required = false) String status,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "categoryId") String sortBy,

            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(

                categoryService.getAllCategory(
                        search,
                        status,
                        page,
                        size,
                        sortBy,
                        sortDir));
    }

    // ==========================================================
    // Update Category
    // ==========================================================

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryRequest request) {

        CategoryResponse response =
                categoryService.updateCategory(
                        categoryId,
                        request);

        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // Delete Category
    // ==========================================================

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long categoryId) {

        categoryService.deleteCategory(categoryId);

        return ResponseEntity.ok(
                "Category deleted successfully.");
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getActiveCategories() {

        List<CategoryResponse> response =
                categoryService.getActiveCategories();

        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // Change Category Status
    // ==========================================================

//    @PatchMapping("/{categoryId}/status")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<CategoryResponse> changeCategoryStatus(
//            @PathVariable Long categoryId) {
//
//        CategoryResponse response =
//                categoryService.changCategoryStatus(categoryId);
//
//        return ResponseEntity.ok(response);
//    }

}
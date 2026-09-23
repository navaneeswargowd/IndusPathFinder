package com.induspathfinder.app.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.request.OrganizationRequest;
import com.induspathfinder.app.dto.response.OrganizationResponse;
import com.induspathfinder.app.service.OrganizationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizationController {

    private final OrganizationService organizationService;

    // ==========================================================
    // Create Organization
    // Only ADMIN can create Organization
    // ==========================================================

    @PostMapping("/create")
   // @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<OrganizationResponse> createOrganization(
            @RequestBody OrganizationRequest request) {

        OrganizationResponse response =
                organizationService.createOrganization(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ==========================================================
    // Get Organization By Id
    // ADMIN & PROJECT_MANAGER
    // ==========================================================
//
//    @GetMapping("/{orgId}")
//    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
//    public ResponseEntity<OrganizationResponse> getOrganizationById(
//            @PathVariable Long orgId) {
//
//        OrganizationResponse response =
//                organizationService.organizationGetById(orgId);
//
//        return ResponseEntity.ok(response);
//    }

    // ==========================================================
    // Get All Organizations
    // ADMIN Only
    
    
    
    
    @GetMapping
    public ResponseEntity<Page<OrganizationResponse>> getAllOrganizations(

            @RequestParam(required = false) String search,

            @RequestParam(required = false) String status,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "orgId") String sortBy,

            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(

                organizationService.getAllOrganizations(
                        search,
                        status,
                        page,
                        size,
                        sortBy,
                        sortDir));
    }
    
    // ==========================================================

//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<List<OrganizationResponse>> getAllOrganizations() {
//
//        List<OrganizationResponse> response =
//                organizationService.getAllOrganizations();
//
//        return ResponseEntity.ok(response);
//    }

    
    // ==========================================================
    // Update Organization
    // ADMIN Only
    // ==========================================================

    @PutMapping("/{orgId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<OrganizationResponse> updateOrganization(
            @PathVariable Long orgId,
            @RequestBody OrganizationRequest request) {

        OrganizationResponse response =
                organizationService.updateOrganization(
                        orgId,
                        request);

        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // Delete Organization
    // ADMIN Only
    // ==========================================================

//    @DeleteMapping("/{orgId}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<String> deleteOrganization(
//            @PathVariable Long orgId) {
//
//        organizationService.deleteOrganization(orgId);
//
//        return ResponseEntity.ok(
//                "Organization deleted successfully.");
//    }

}
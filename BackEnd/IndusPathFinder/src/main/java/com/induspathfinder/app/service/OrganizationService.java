package com.induspathfinder.app.service;
import org.springframework.data.domain.Page;

import com.induspathfinder.app.dto.request.OrganizationRequest;
import com.induspathfinder.app.dto.response.OrganizationResponse;

public interface OrganizationService {

OrganizationResponse createOrganization(OrganizationRequest request);
	
	OrganizationResponse organizationGetById(Long orgId);
	
	//List<OrganizationResponse> getAllOrganizations();
	
	public Page<OrganizationResponse> getAllOrganizations(
	        String search,
	        String status,
	        int page,
	        int size,
	        String sortBy,
	        String sortDir);
	OrganizationResponse updateOrganization(Long orgId, OrganizationRequest request);
	
	void deleteOrganization(Long orgId);
	
	
}

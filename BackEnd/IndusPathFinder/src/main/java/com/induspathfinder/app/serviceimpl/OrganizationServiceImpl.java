package com.induspathfinder.app.serviceimpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.OrganizationRequest;
import com.induspathfinder.app.dto.response.OrganizationResponse;
import com.induspathfinder.app.entity.Category;
import com.induspathfinder.app.entity.Organization;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.enums.Role;
import com.induspathfinder.app.enums.Status;
import com.induspathfinder.app.exception.DuplicateResourceException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.CategoryRepository;
import com.induspathfinder.app.repository.OrganizationRepository;
import com.induspathfinder.app.repository.UserRepository;
import com.induspathfinder.app.service.OrganizationService;
import com.induspathfinder.app.util.CurrentUserUtil;
import com.induspathfinder.app.util.OtpUtil;
import com.induspathfinder.app.util.PasswordGenerator;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;

@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService{

	@Autowired
	private OrganizationRepository organizationRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private PasswordGenerator passwordGenerator;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private OtpUtil otpUtil;
	
	@Autowired
	private CurrentUserUtil currentUserUtil;
	
	@Override
	@AuditAction(
		    actionName = "UPDATE_ORGANIZATION",
		    actionScreen = "ORGANIZATIONS",
		    actionScreenId = "#organizationId",
		    userId = "@currentUserUtil.getCurrentUserId()",
		    username = "@currentUserUtil.getCurrentUserName()",
		    details = "Organization updated successfully"
		)
	public OrganizationResponse createOrganization(OrganizationRequest request) {
		
		if(request ==null) {
			throw new ValidationException("Organization request connot be null");
		}
		
		if(request.getCategoryId()==null) {
			throw new ValidationException("Category is required ");
		}
		
		if(request.getOrgName()==null || request.getOrgName().isBlank()) {
			throw new ValidationException("Organization name is required ");
			
		}
		
		if(request.getOrgEmail()==null || request.getOrgEmail().isBlank()) {
			throw new ValidationException("Organization Email is required");
		}
		
		if(request.getCin()==null || request.getCin().isBlank()) {
			throw new ValidationException("Cin is mustbe required ");
		}
		
		if(request.getRegNum()==null || request.getRegNum().isBlank()) {
			throw new ValidationException("Register Number is required ");
		}
		
		  // ================= DUPLICATE CHECK =================

        if (organizationRepository
                .findByOrgNameIgnoreCase(
                        request.getOrgName().trim())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Organization name already exists");
        }

        if (organizationRepository
                .findByOrgEmailIgnoreCase(
                        request.getOrgEmail().trim())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Organization email already exists");
        }

        if (organizationRepository
                .findByCinIgnoreCase(
                        request.getCin().trim())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "CIN already exists");
        }

        if (organizationRepository
                .findByRegNumIgnoreCase(
                        request.getRegNum().trim())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Registration number already exists");
        }
        
        // ================= CATEGORY =================
        
        Category category=
        		categoryRepository.findById(request.getCategoryId())
        		.orElseThrow(() ->new ResourceNotFoundException("Category not found "));

        // ================= ORGANIZATION =================
     // 1. Map Organization (Initial state)
        Organization organization = new Organization();
        organization.setCategory(category);
        organization.setOrgName(request.getOrgName().trim());
        organization.setCin(request.getCin().trim());
        organization.setRegNum(request.getRegNum().trim());
        organization.setOrgEmail(request.getOrgEmail().trim());
        organization.setOrgPhone(request.getOrgPhone());
        organization.setContact(request.getContact());
        organization.setPan(request.getPan());
        organization.setGst(request.getGst());
        organization.setAddress(request.getAddress());
        organization.setCity(request.getCity());
        organization.setDist(request.getDist());
        organization.setState(request.getState());
        organization.setCountry(request.getCountry());
        organization.setPin(request.getPin());
        organization.setLogo(request.getLogo());
        organization.setWebsite(request.getWebsite());
        organization.setStatus(Status.ACTIVE);
        organization.setCreateOn(LocalDateTime.now());

        // Save Organization first (to generate org_id)
        Organization savedOrganization = organizationRepository.saveAndFlush(organization);

        // 2. Map & Save User
        String temporaryPassword = otpUtil.generateOtp();

        User user = new User();
        user.setOrganization(savedOrganization);
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setUserName(request.getUserName().trim());
        user.setEmail(request.getEmail().trim());
        user.setMobile(request.getOrgPhone());
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        user.setRole(Role.PROJECT_MANAGER);
        user.setStatus(Status.ACTIVE);
        user.setCreateOn(LocalDateTime.now());

        // Save User first (to generate user_id)
        User savedUser = userRepository.saveAndFlush(user);

        // 3. Set createdBy with newly generated user_id
        Long newUserId = savedUser.getUserId();

        savedUser.setCreateBy(newUserId);
        savedOrganization.setCreateBy(newUserId);

        // 4. FORCE IMMEDIATE DATABASE UPDATE
        userRepository.saveAndFlush(savedUser);
        savedOrganization = organizationRepository.saveAndFlush(savedOrganization);

        // Debug Log
        System.out.println("Organization saved with createBy: " + savedOrganization.getCreateBy());

        // 5. Send Mail
        emailService.sendOrganizationCreatedMail(
                savedUser.getEmail(),
                savedUser.getUserName(),
                temporaryPassword);

        
//        emailService.sendLoginMail(
//	            savedUser.getEmail(),
//	            savedUser.getUserName(),
//	            temporaryPassword);

//        String temporaryPassword =passwordGenerator.generatePassword(12);
//        
//        // ================= INITIAL USER =================
//
//        User user = new User();
//
//        user.setOrganization(savedOrganization);
//
//        // Use organization details
//        user.setFirstName(request.getContact());
//
//        user.setLastName("");
//
//        user.setEmail(request.getOrgEmail().trim());
//
//        user.setMobile(request.getOrgPhone());
//
//       
//
//        /*
//         * NEVER save plain password.
//         */
//        user.setPassword(passwordEncoder.encode(temporaryPassword));
//
//        user.setRole(Role.PROJECT_MANAGER);
//
//        user.setStatus(Status.ACTIVE);
//
//        user.setCreateOn(LocalDateTime.now());
//
//        User savedUser = userRepository.save(user);
//        
//        // ================= EMAIL =================
//
//        /*
//           Send ONLY original temporary password.
//         
//           Never send:
//           passwordEncoder.encode(...)
//         */
//        emailService.sendOrganizationCreatedMail(
//                savedUser.getEmail(),
//                savedUser.getUserName(),
//                temporaryPassword);

        return mapToResponse(savedOrganization);
    
		
	}

	@Override
	public OrganizationResponse organizationGetById(Long orgId) {
		if(orgId==null ||orgId<=0 ) {
			throw new ValidationException("invalid Organization Id ");
		}
		
		Organization organization=
				organizationRepository.findById(orgId)
				.orElseThrow(()->
				new ResourceNotFoundException("Organization Not found "));
		
		
		 return mapToResponse(organization);
	}

//	@Override
//	public List<OrganizationResponse> getAllOrganizations() {
//		
//		return organizationRepository.findAll()
//                .stream()
//                .map(this::mapToResponse)
//                .toList();
//	}
	
	@Override
	public Page<OrganizationResponse> getAllOrganizations(
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

	    Specification<Organization> specification = (root, query, cb) -> {

	        List<Predicate> predicates = new ArrayList<>();

	        if (search != null && !search.trim().isEmpty()) {

	            Predicate orgName =
	                    cb.like(cb.lower(root.get("orgName")),
	                            "%" + search.toLowerCase() + "%");

	            Predicate email =
	                    cb.like(cb.lower(root.get("orgEmail")),
	                            "%" + search.toLowerCase() + "%");

	            Predicate city =
	                    cb.like(cb.lower(root.get("city")),
	                            "%" + search.toLowerCase() + "%");

	            predicates.add(
	                    cb.or(orgName, email, city));
	        }

	        if (status != null && !status.isBlank()) {

	            predicates.add(
	                    cb.equal(root.get("status"),
	                            Status.valueOf(status.toUpperCase())));
	        }

	        return cb.and(predicates.toArray(new Predicate[0]));
	    };

	    return organizationRepository
	            .findAll(specification, pageable)
	            .map(this::mapToResponse);
	}
	
	@Override
	public OrganizationResponse updateOrganization(
	        Long orgId,
	        OrganizationRequest request) {

	    // ======================= Validation =======================

	    if (orgId == null || orgId <= 0) {
	        throw new ValidationException(
	                "Organization id is required");
	    }

	    if (request == null) {
	        throw new ValidationException(
	                "Organization request cannot be null");
	    }

	    if (request.getCategoryId() == null) {
	        throw new ValidationException(
	                "Category is required");
	    }

	    if (request.getOrgName() == null ||
	            request.getOrgName().trim().isEmpty()) {

	        throw new ValidationException(
	                "Organization name is required");
	    }

	    if (request.getOrgEmail() == null ||
	            request.getOrgEmail().trim().isEmpty()) {

	        throw new ValidationException(
	                "Organization email is required");
	    }

	    // ======================= Find Organization =======================

	    Organization organization =
	            organizationRepository.findById(orgId)
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "Organization not found with id: "
	                                    + orgId));

	    // ======================= Duplicate Email =======================

	    organizationRepository
	            .findByOrgEmailIgnoreCase(
	                    request.getOrgEmail().trim())
	            .ifPresent(existing -> {

	                if (!existing.getOrgId().equals(orgId)) {

	                    throw new DuplicateResourceException(
	                            "Organization email already exists");
	                }
	            });

	    // ======================= Category =======================

	    Category category =
	            categoryRepository.findById(
	                    request.getCategoryId())
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "Category not found with id: "
	                                    + request.getCategoryId()));

	    // ======================= Update =======================

	    organization.setCategory(category);

	    organization.setOrgName(
	            request.getOrgName().trim());

	    organization.setOrgEmail(
	            request.getOrgEmail().trim());

	    organization.setOrgPhone(
	            request.getOrgPhone());

	    organization.setContact(
	            request.getContact());

	    organization.setPan(
	            request.getPan());

	    organization.setGst(
	            request.getGst());

	    organization.setAddress(
	            request.getAddress());

	    organization.setCity(
	            request.getCity());

	    organization.setDist(
	            request.getDist());

	    organization.setState(
	            request.getState());

	    organization.setCountry(
	            request.getCountry());

	    organization.setPin(
	            request.getPin());

	    organization.setLogo(
	            request.getLogo());

	    organization.setWebsite(
	            request.getWebsite());
	    organization.setUpdateBy(currentUserUtil.getCurrentUserId());

	    organization.setUpdateOn(
	            LocalDateTime.now());

	    // ======================= Save =======================

	    Organization updatedOrganization =
	            organizationRepository.save(organization);

	    // ======================= Email =======================

	    emailService.sendOrganizationUpdatedMail(
	            updatedOrganization.getOrgEmail(),
	            updatedOrganization.getOrgName()
	    );

	    // ======================= Response =======================

	    return mapToResponse(updatedOrganization);
	}

	
	@Override
	public void deleteOrganization(Long orgId) {

	    // ======================= Validation =======================

	    if (orgId == null || orgId <= 0) {
	        throw new ValidationException(
	                "Organization id is required");
	    }

	    // ======================= Find Organization =======================

	    Organization organization =
	            organizationRepository.findById(orgId)
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "Organization not found with id: "
	                                    + orgId));

	    // ======================= Store Email Details =======================

	    String organizationEmail =
	            organization.getOrgEmail();

	    String organizationName =
	            organization.getOrgName();

	    // ======================= Delete =======================

	    organizationRepository.delete(organization);

	    // ======================= Send Email =======================

	    if (organizationEmail != null &&
	            !organizationEmail.trim().isEmpty()) {

	        emailService.sendOrganizationDeletedMail(
	                organizationEmail,
	                organizationName
	        );
	    }
	}
	
	private OrganizationResponse mapToResponse(Organization organization) {

	    return OrganizationResponse.builder()
	            .orgId(organization.getOrgId())
	            .categoryName(
	                    organization.getCategory() != null
	                            ? organization.getCategory().getCategoryName()
	                            : null)
	            .orgName(organization.getOrgName())
	            .cin(organization.getCin())
	            .regNum(organization.getRegNum())
	            .orgEmail(organization.getOrgEmail())
	            .orgPhone(organization.getOrgPhone())
	            .contact(organization.getContact())
	            .pan(organization.getPan())
	            .gst(organization.getGst())
	            .address(organization.getAddress())
	            .city(organization.getCity())
	            .dist(organization.getDist())
	            .state(organization.getState())
	            .country(organization.getCountry())
	            .pin(organization.getPin())
	            .logo(organization.getLogo())
	            .website(organization.getWebsite())
	            .status(organization.getStatus())
	            .createOn(organization.getCreateOn())
	            .build();
	}
//	  private OrganizationResponse mapToResponse(Organization organization) {
//
//	        OrganizationResponse response =
//	                new OrganizationResponse();
//
//	        response.setOrgId(
//	                organization.getOrgId());
//
//	        response.setOrgName(
//	                organization.getOrgName());
//
//	        response.setCin(
//	                organization.getCin());
//
//	        response.setRegNum(
//	                organization.getRegNum());
//
//	        response.setOrgEmail(
//	                organization.getOrgEmail());
//
//	        response.setOrgPhone(
//	                organization.getOrgPhone());
//
//	        response.setContact(
//	                organization.getContact());
//
//	        response.setPan(
//	                organization.getPan());
//
//	        response.setGst(
//	                organization.getGst());
//
//	        response.setAddress(
//	                organization.getAddress());
//
//	        response.setCity(
//	                organization.getCity());
//
//	        response.setDist(
//	                organization.getDist());
//
//	        response.setState(
//	                organization.getState());
//
//	        response.setCountry(
//	                organization.getCountry());
//
//	        response.setPin(
//	                organization.getPin());
//
//	        response.setLogo(
//	                organization.getLogo());
//
//	        response.setWebsite(
//	                organization.getWebsite());
//
//	        response.setStatus(
//	                organization.getStatus());
//
//	        response.setCreateOn(
//	                organization.getCreateOn());
//
//	        return response;
//	    }

}

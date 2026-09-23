package com.induspathfinder.app.serviceimpl;
import com.induspathfinder.app.util.CurrentUserUtil;

import java.time.LocalDateTime;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.request.NotificationDeleteRequest;
import com.induspathfinder.app.dto.request.NotificationDetailsRequest;
import com.induspathfinder.app.dto.request.NotificationReadRequest;
import com.induspathfinder.app.dto.request.NotificationSearchRequest;
import com.induspathfinder.app.dto.response.ApiResponse;
import com.induspathfinder.app.dto.response.NotificationResponse;
import com.induspathfinder.app.entity.Notification;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.enums.NotificationStatus;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.mapper.NotificationMapper;
import com.induspathfinder.app.repository.NotificationRepository;
import com.induspathfinder.app.repository.UserRepository;
import com.induspathfinder.app.service.NotificationService;
import com.induspathfinder.app.specification.NotificationSpecification;
import com.induspathfinder.app.util.PaginationUtil;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private static final Logger LOGGER =
            LogManager.getLogger(
                    NotificationServiceImpl.class);

    private static final String DEFAULT_SORT_FIELD =
            "createdOn";

    private final NotificationRepository
            notificationRepository;

    private final NotificationMapper
            notificationMapper;
    private final UserRepository userRepository;
    
    private final CurrentUserUtil currentUserUtil;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            NotificationMapper notificationMapper , UserRepository userRepository ,CurrentUserUtil currentUserUtil ) {

        this.notificationRepository =
                notificationRepository;

        this.notificationMapper =
                notificationMapper;
        
        this.userRepository =
                userRepository;
        
        this.currentUserUtil =
                currentUserUtil;
    }

    @Override
    @Transactional
    @AuditAction(
        actionName = "CREATE_NOTIFICATION",
        actionScreen = "NOTIFICATIONS",
        userId = "#request.userId",
        details = "Notification created"
    )
    public NotificationResponse createNotification(
            NotificationCreateRequest request) {

        validateCreateRequest(request);

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: "
                                        + request.getUserId()));

        Notification notification =
                notificationMapper.toEntity(
                        request,
                        user);

        Notification savedNotification =
                notificationRepository.save(notification);

        LOGGER.info(
                "Notification created successfully. "
                        + "notificationId={}, userId={}",
                savedNotification.getNotificationId(),
                savedNotification.getUser().getUserId());

        return notificationMapper.toResponse(
                savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> searchNotifications(
            NotificationSearchRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        
//        Specification<Notification> specification =
//                NotificationSpecification
//                        .fromRequest(request);
        
        Long currentUserId =
                currentUserUtil.getCurrentUserId();

        request.setUserId(currentUserId);

        Specification<Notification> specification =
                NotificationSpecification
                        .fromRequest(request);

        String sortBy =
                request.getSortBy() == null
                        || request.getSortBy().isBlank()
                        ? DEFAULT_SORT_FIELD
                        : request.getSortBy().trim();

        Pageable pageable =
                PaginationUtil.createPageable(
                        request.getValidPage(),
                        request.getValidSize(),
                        sortBy,
                        request.getValidSortDirection());

        Page<Notification> notificationPage =
                notificationRepository.findAll(
                        specification,
                        pageable);

        LOGGER.info(
                "Notifications fetched for userId={}. "
                        + "page={}, size={}, totalElements={}",
                request.getUserId(),
                notificationPage.getNumber(),
                notificationPage.getSize(),
                notificationPage.getTotalElements());

        return notificationPage.map(
                notificationMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationDetails(
            NotificationDetailsRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        Notification notification =
                notificationRepository.findById(
                        request.getNotificationId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                MessageConstants
                                        .NOTIFICATION_NOT_FOUND));

        return notificationMapper.toResponse(
                notification);
    }

    @Override
    @Transactional
    @AuditAction(
    	    actionName = "MARK_NOTIFICATION_READ",
    	    actionScreen = "NOTIFICATIONS",
    	    actionScreenId = "#request.notificationId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Notification marked as read"
    	)
    public ApiResponse<Void> markAsRead(
            NotificationReadRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }
//
//        Notification notification =
//                notificationRepository
//                        .findByNotificationIdAndUser_UserId(
//                                request.getNotificationId(),
//                                request.getUserId())
        Long currentUserId =
                currentUserUtil.getCurrentUserId();

        Notification notification =
                notificationRepository
                        .findByNotificationIdAndUser_UserId(
                                request.getNotificationId(),
                                currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                MessageConstants
                                        .NOTIFICATION_NOT_FOUND));

        if (notification.getStatus()
                == NotificationStatus.READ) {

            LOGGER.info(
                    "Notification is already read. "
                            + "notificationId={}, userId={}",
                    notification.getNotificationId(),
                    notification.getUser().getUserId());

            return ApiResponse.success(
                    MessageConstants
                            .NOTIFICATION_MARKED_AS_READ);
        }

        notification.setStatus(
                NotificationStatus.READ);

        notification.setReadOn(
                LocalDateTime.now());

        notificationRepository.save(notification);

        LOGGER.info(
                "Notification marked as read. "
                        + "notificationId={}, userId={}",
                notification.getNotificationId(),
                notification.getUser().getUserId());

        return ApiResponse.success(
                MessageConstants
                        .NOTIFICATION_MARKED_AS_READ);
    }

    @Override
    @Transactional
    @AuditAction(
    	    actionName = "MARK_ALL_NOTIFICATIONS_READ",
    	    actionScreen = "NOTIFICATIONS",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "All notifications marked as read"
    	)
    public ApiResponse<Void> markAllAsRead(
            Long userId) {

        if (userId == null || userId <= 0) {
            throw new BadRequestException(
                    "Valid User ID is required");
        }

        int updatedRecords =
                notificationRepository
                        .markAllNotificationsAsRead(
                                userId,
                                NotificationStatus.READ,
                                LocalDateTime.now());

        LOGGER.info(
                "All notifications marked as read. "
                        + "userId={}, updatedRecords={}",
                userId,
                updatedRecords);

        return ApiResponse.success(
                MessageConstants
                        .ALL_NOTIFICATIONS_MARKED_AS_READ);
    }

    @Override
    @Transactional
    @AuditAction(
    	    actionName = "DELETE_NOTIFICATION",
    	    actionScreen = "NOTIFICATIONS",
    	    actionScreenId = "#request.notificationId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Notification deleted"
    	)
    public ApiResponse<Void> deleteNotification(
            NotificationDeleteRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        Notification notification =
                notificationRepository
                        .findByNotificationIdAndUser_UserId(
                                request.getNotificationId(),
                                request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                MessageConstants
                                        .NOTIFICATION_NOT_FOUND));

        notificationRepository.delete(notification);

        LOGGER.info(
                "Notification deleted successfully. "
                        + "notificationId={}, userId={}",
                notification.getNotificationId(),
                notification.getUser().getUserId());

        return ApiResponse.success(
                MessageConstants.NOTIFICATION_DELETED);
    }

    private void validateCreateRequest(
            NotificationCreateRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        if (request.getUserId() == null
                || request.getUserId() <= 0) {

            throw new BadRequestException(
                    "Valid User ID is required");
        }

        if (request.getTitle() == null
                || request.getTitle().isBlank()) {

            throw new BadRequestException(
                    "Notification title is required");
        }

        if (request.getMessage() == null
                || request.getMessage().isBlank()) {

            throw new BadRequestException(
                    "Notification message is required");
        }
    }
}
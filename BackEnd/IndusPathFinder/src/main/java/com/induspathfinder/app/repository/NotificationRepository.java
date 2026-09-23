

package com.induspathfinder.app.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.induspathfinder.app.entity.Notification;
import com.induspathfinder.app.enums.NotificationStatus;

public interface NotificationRepository
        extends JpaRepository<Notification, Long>,
        JpaSpecificationExecutor<Notification> {

    Optional<Notification>
    findByNotificationIdAndUser_UserId(
            Long notificationId,
            Long userId);

    Page<Notification> findByUser_UserId(
            Long userId,
            Pageable pageable);

    long countByUser_UserIdAndStatus(
            Long userId,
            NotificationStatus status);

    boolean existsByNotificationIdAndUser_UserId(
            Long notificationId,
            Long userId);

    @Modifying(
        clearAutomatically = true,
        flushAutomatically = true
    )
    @Query("""
        UPDATE Notification notification
           SET notification.status = :status,
               notification.readOn = :readOn
         WHERE notification.user.userId = :userId
           AND notification.status <> :status
        """)
    int markAllNotificationsAsRead(
            @Param("userId") Long userId,
            @Param("status") NotificationStatus status,
            @Param("readOn") LocalDateTime readOn);
}
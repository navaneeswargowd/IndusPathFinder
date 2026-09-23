package com.induspathfinder.app.entity;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.NotificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "notifications",
    indexes = {
        @Index(
            name = "idx_notification_user_id",
            columnList = "user_id"
        ),
        @Index(
            name = "idx_notification_status",
            columnList = "status"
        ),
        @Index(
            name = "idx_notification_created_on",
            columnList = "created_on"
        )
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    @Column(
        name = "title",
        nullable = false,
        length = 150
    )
    private String title;

    @Column(
        name = "message",
        nullable = false,
        length = 1000
    )
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false,
        length = 20
    )
    private NotificationStatus status;

    @Column(
        name = "created_on",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdOn;

    @Column(name = "read_on")
    private LocalDateTime readOn;

    @PrePersist
    public void prePersist() {

        if (status == null) {
            status = NotificationStatus.UNREAD;
        }

        if (createdOn == null) {
            createdOn = LocalDateTime.now();
        }
    }
}
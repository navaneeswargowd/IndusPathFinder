package com.induspathfinder.app.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    name = "audit_logs",
    indexes = {
        @Index(
            name = "idx_audit_user_id",
            columnList = "user_id"
        ),
        @Index(
            name = "idx_audit_action_name",
            columnList = "action_name"
        ),
        @Index(
            name = "idx_audit_action_screen",
            columnList = "action_screen"
        ),
        @Index(
            name = "idx_audit_username",
            columnList = "username"
        ),
        @Index(
            name = "idx_audit_action_date",
            columnList = "action_date"
        )
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = true)
    private User user;

    @Column(
        name = "action_name",
        nullable = false,
        length = 100
    )
    private String actionName;

    @Column(
        name = "action_screen",
        nullable = false,
        length = 100
    )
    private String actionScreen;

    @Column(name = "action_screen_id")
    private Long actionScreenId;

    @Column(
        name = "username",
        nullable = false,
        length = 100
    )
    private String username;

    @Column(
        name = "details",
        length = 2000
    )
    private String details;

    @Column(
        name = "action_date",
        nullable = false,
        updatable = false
    )
    private LocalDateTime actionDate;

    @PrePersist
    public void prePersist() {

        if (actionDate == null) {
            actionDate = LocalDateTime.now();
        }
    }
}
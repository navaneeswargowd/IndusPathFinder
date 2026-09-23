package com.induspathfinder.app.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.induspathfinder.app.enums.ActivityPriority;
import com.induspathfinder.app.enums.ActivityStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "act_id")
	    private Long actId;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "project_id", nullable = false)
	    private Project project;

	    @Column(name = "act_code", unique = true, length = 20)
	    private String actCode;

	    @Column(name = "act_name", nullable = false, length = 100)
	    private String actName;

	    @Column(name = "des", length=500)
	    private String description;

	    @Column(name = "dur", nullable = false)
	    private Integer duration;

	    @Column(name = "start_date", nullable = false)
	    private LocalDate startDate;

	    @Column(name = "end_date", nullable = false)
	    private LocalDate endDate;

	    @Enumerated(EnumType.STRING)
	    @Column(name = "priority", nullable = false)
	    private ActivityPriority priority;

	    @Enumerated(EnumType.STRING)
	    @Column(name = "status", nullable = false)
	    private ActivityStatus status;
	    
	    @Column(name = "created_by")
	    private Long createdBy;

	    @Column(name = "created_on",updatable = false)
	    private LocalDateTime createdOn;

	    @Column(name = "updated_by")
	    
	    private Long updatedBy;

	    @Column(name = "updated_on")
	    private LocalDateTime updatedOn;

}

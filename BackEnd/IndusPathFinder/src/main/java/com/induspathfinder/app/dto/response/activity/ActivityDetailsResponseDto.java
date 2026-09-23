package com.induspathfinder.app.dto.response.activity;

import java.time.LocalDate;

import com.induspathfinder.app.enums.ActivityPriority;
import com.induspathfinder.app.enums.ActivityStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDetailsResponseDto {
	private Long actId;

    private Long projectId;

    private String actCode;

    private String actName;

    private String description;

    private Integer duration;

    private LocalDate startDate;

    private LocalDate endDate;

    private ActivityPriority priority;

    private ActivityStatus status;

}

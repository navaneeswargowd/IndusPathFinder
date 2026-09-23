package com.induspathfinder.app.dto.response.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDeleteResponseDto {
	private Long actId;
	private String message;
	private boolean success;

}

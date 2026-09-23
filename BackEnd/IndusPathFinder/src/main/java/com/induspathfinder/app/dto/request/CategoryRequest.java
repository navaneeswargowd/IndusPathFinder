package com.induspathfinder.app.dto.request;

import com.induspathfinder.app.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryRequest {

	private String categoryName;
	
	private Status status;
}

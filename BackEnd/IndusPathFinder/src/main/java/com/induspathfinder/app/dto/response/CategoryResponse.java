package com.induspathfinder.app.dto.response;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
	
//	private Long categoryId;
//	
//	private String categoryName;
//	
//	private Status status;
//	
//	private LocalDateTime createOn;
//	
	
	private Long categoryId;

    private String categoryName;

    private Status status;

    private LocalDateTime createOn;

    private LocalDateTime updateOn;

}

package com.induspathfinder.app.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloatRequestDTO {

    /**
     * Project ID
     */
    private Long projectId;

}
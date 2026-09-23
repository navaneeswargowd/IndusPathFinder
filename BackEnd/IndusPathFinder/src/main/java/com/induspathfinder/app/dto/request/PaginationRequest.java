package com.induspathfinder.app.dto.request;

import org.springframework.data.domain.Sort;

import com.induspathfinder.app.constants.ApiConstants;
import com.induspathfinder.app.exception.BadRequestException;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {

    @Min(
        value = 0,
        message = "Page number cannot be negative"
    )
    private Integer page;

    @Min(
        value = 1,
        message = "Page size must be greater than zero"
    )
    @Max(
        value = ApiConstants.MAX_PAGE_SIZE,
        message = "Page size cannot exceed "
                + ApiConstants.MAX_PAGE_SIZE
    )
    private Integer size;

    private String sortBy;

    private String sortDirection;

    public Integer getValidPage() {

        return page == null
                ? ApiConstants.DEFAULT_PAGE_NUMBER
                : page;
    }

    public Integer getValidSize() {

        return size == null
                ? ApiConstants.DEFAULT_PAGE_SIZE
                : size;
    }

    public Sort.Direction getValidSortDirection() {

        if (sortDirection == null
                || sortDirection.isBlank()) {

            return Sort.Direction.DESC;
        }

        try {

            return Sort.Direction.fromString(
                    sortDirection.trim());

        } catch (IllegalArgumentException exception) {

            throw new BadRequestException(
                    "Sort direction must be ASC or DESC");
        }
    }
}
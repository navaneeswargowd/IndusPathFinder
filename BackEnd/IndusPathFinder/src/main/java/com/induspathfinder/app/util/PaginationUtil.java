package com.induspathfinder.app.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.induspathfinder.app.constants.ApiConstants;
import com.induspathfinder.app.exception.BadRequestException;

public final class PaginationUtil {

    private PaginationUtil() {
        throw new IllegalStateException(
                "Utility class cannot be instantiated");
    }

    public static Pageable createPageable(
            Integer page,
            Integer size,
            String sortBy,
            Sort.Direction direction) {

        int validPage =
                page == null
                        ? ApiConstants.DEFAULT_PAGE_NUMBER
                        : page;

        int validSize =
                size == null
                        ? ApiConstants.DEFAULT_PAGE_SIZE
                        : size;

        validatePagination(validPage, validSize);

        if (sortBy == null || sortBy.isBlank()) {
            return PageRequest.of(
                    validPage,
                    validSize);
        }

        Sort.Direction validDirection =
                direction == null
                        ? Sort.Direction.DESC
                        : direction;

        return PageRequest.of(
                validPage,
                validSize,
                Sort.by(validDirection, sortBy));
    }

    public static Pageable createPageable(
            Integer page,
            Integer size) {

        return createPageable(
                page,
                size,
                null,
                null);
    }

    private static void validatePagination(
            int page,
            int size) {

        if (page < 0) {
            throw new BadRequestException(
                    "Page number cannot be negative");
        }

        if (size <= 0) {
            throw new BadRequestException(
                    "Page size must be greater than zero");
        }

        if (size > ApiConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException(
                    "Page size cannot exceed "
                            + ApiConstants.MAX_PAGE_SIZE);
        }
    }
    
    
    public static Pageable getPageable(
            Integer page,
            Integer size,
            String sortBy,
            String direction) {

        page = page == null ? 0 : page;
        size = size == null ? 10 : size;

        sortBy = (sortBy == null || sortBy.isBlank())
                ? "projectId"
                : sortBy;

        direction = (direction == null || direction.isBlank())
                ? "asc"
                : direction;

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return PageRequest.of(page, size, sort);
    }
}
package com.induspathfinder.app.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

import com.induspathfinder.app.constants.ApplicationConstants;
import com.induspathfinder.app.exception.BadRequestException;


@Component
public final class DateUtil 
{

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern(
                    ApplicationConstants.DATE_FORMAT);

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern(
                    ApplicationConstants.DATE_TIME_FORMAT);
//
//    private DateUtil() {
//        throw new IllegalStateException(
//                "Utility class cannot be instantiated");
//    }

    
    public LocalDateTime getCurrentDateTime() 
    {

        return LocalDateTime.now();
    }

    public static String formatDate(LocalDate date) {

        if (date == null) {
            return null;
        }

        return date.format(DATE_FORMATTER);
    }

    public static String formatDateTime(
            LocalDateTime dateTime) {

        if (dateTime == null) {
            return null;
        }

        return dateTime.format(DATE_TIME_FORMATTER);
    }

    public static LocalDate parseDate(String date) {

        if (date == null || date.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(
                    date.trim(),
                    DATE_FORMATTER);
        } catch (Exception exception) {
            throw new BadRequestException(
                    "Invalid date. Expected format: "
                            + ApplicationConstants.DATE_FORMAT);
        }
    }

    public static LocalDateTime parseDateTime(
            String dateTime) 
    {

        if (dateTime == null || dateTime.isBlank()) {
            return null;
        }

        try {
            return LocalDateTime.parse(
                    dateTime.trim(),
                    DATE_TIME_FORMATTER);
        } catch (Exception exception) {
            throw new BadRequestException(
                    "Invalid date and time. Expected format: "
                            + ApplicationConstants.DATE_TIME_FORMAT);
        }
    }
}
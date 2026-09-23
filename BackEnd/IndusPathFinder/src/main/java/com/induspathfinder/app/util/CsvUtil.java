package com.induspathfinder.app.util;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.exception.ReportGenerationException;
import com.opencsv.CSVWriter;

public final class CsvUtil {

    private CsvUtil() {
        throw new IllegalStateException(
                "Utility class cannot be instantiated");
    }

    public static byte[] generateCsv(
            List<String> headers,
            List<List<Object>> rows) {

        validateData(headers, rows);

        try (
                StringWriter stringWriter =
                        new StringWriter();

                CSVWriter csvWriter =
                        new CSVWriter(stringWriter)
        ) {

            csvWriter.writeNext(
                    headers.toArray(String[]::new));

            for (List<Object> row : rows) {

                String[] values = row.stream()
                        .map(CsvUtil::convertToString)
                        .toArray(String[]::new);

                csvWriter.writeNext(values);
            }

            csvWriter.flush();

            return stringWriter
                    .toString()
                    .getBytes(java.nio.charset.StandardCharsets.UTF_8);

        } catch (IOException exception) {

            throw new ReportGenerationException(
                    MessageConstants.REPORT_GENERATION_FAILED,
                    exception);
        }
    }

    private static String convertToString(
            Object value) {

        return value == null
                ? ""
                : String.valueOf(value);
    }

    private static void validateData(
            List<String> headers,
            List<List<Object>> rows) {

        if (headers == null || headers.isEmpty()) {
            throw new ReportGenerationException(
                    "CSV headers cannot be empty");
        }

        if (rows == null) {
            throw new ReportGenerationException(
                    "CSV rows cannot be null");
        }
    }
}
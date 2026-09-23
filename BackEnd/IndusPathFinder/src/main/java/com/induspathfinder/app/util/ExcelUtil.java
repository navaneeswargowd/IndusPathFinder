package com.induspathfinder.app.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.exception.ReportGenerationException;

public final class ExcelUtil {

    private ExcelUtil() {
        throw new IllegalStateException(
                "Utility class cannot be instantiated");
    }

    public static byte[] generateExcel(
            String sheetName,
            List<String> headers,
            List<List<Object>> rows) {

        validateData(sheetName, headers, rows);

        try (
                XSSFWorkbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet = workbook.createSheet(sheetName);

            CellStyle headerStyle =
                    createHeaderStyle(workbook);

            createHeaderRow(
                    sheet,
                    headers,
                    headerStyle);

            createDataRows(sheet, rows);

            autoSizeColumns(
                    sheet,
                    headers.size());

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (IOException exception) {

            throw new ReportGenerationException(
                    MessageConstants.REPORT_GENERATION_FAILED,
                    exception);
        }
    }

    private static CellStyle createHeaderStyle(
            XSSFWorkbook workbook) {

        Font font = workbook.createFont();
        font.setBold(true);

        CellStyle style =
                workbook.createCellStyle();

        style.setFont(font);

        return style;
    }

    private static void createHeaderRow(
            Sheet sheet,
            List<String> headers,
            CellStyle headerStyle) {

        Row headerRow = sheet.createRow(0);

        for (int index = 0;
             index < headers.size();
             index++) {

            Cell cell =
                    headerRow.createCell(index);

            cell.setCellValue(headers.get(index));
            cell.setCellStyle(headerStyle);
        }
    }

    private static void createDataRows(
            Sheet sheet,
            List<List<Object>> rows) {

        int rowNumber = 1;

        for (List<Object> rowData : rows) {

            Row row = sheet.createRow(rowNumber++);

            for (int columnIndex = 0;
                 columnIndex < rowData.size();
                 columnIndex++) {

                Cell cell =
                        row.createCell(columnIndex);

                setCellValue(
                        cell,
                        rowData.get(columnIndex));
            }
        }
    }

    private static void setCellValue(
            Cell cell,
            Object value) {

        if (value == null) {
            cell.setCellValue("");
            return;
        }

        if (value instanceof Number number) {
            cell.setCellValue(
                    number.doubleValue());
            return;
        }

        if (value instanceof Boolean booleanValue) {
            cell.setCellValue(booleanValue);
            return;
        }

        cell.setCellValue(String.valueOf(value));
    }

    private static void autoSizeColumns(
            Sheet sheet,
            int columnCount) {

        for (int index = 0;
             index < columnCount;
             index++) {

            sheet.autoSizeColumn(index);
        }
    }

    private static void validateData(
            String sheetName,
            List<String> headers,
            List<List<Object>> rows) {

        if (sheetName == null || sheetName.isBlank()) {
            throw new ReportGenerationException(
                    "Excel sheet name cannot be empty");
        }

        if (headers == null || headers.isEmpty()) {
            throw new ReportGenerationException(
                    "Excel headers cannot be empty");
        }

        if (rows == null) {
            throw new ReportGenerationException(
                    "Excel rows cannot be null");
        }
    }
}
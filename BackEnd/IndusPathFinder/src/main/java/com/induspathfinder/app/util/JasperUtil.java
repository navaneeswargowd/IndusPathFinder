package com.induspathfinder.app.util;

import java.io.InputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.exception.ReportGenerationException;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public final class JasperUtil {

    private static final Logger LOGGER =
            LogManager.getLogger(JasperUtil.class);

    private JasperUtil() {
        throw new IllegalStateException(
                "Utility class cannot be instantiated");
    }

    public static byte[] generatePdf(
            String templatePath,
            Map<String, Object> parameters,
            Collection<?> reportData) {

        validateTemplatePath(templatePath);

        /*
         * JasperReports modifies the parameters map internally.
         * Always pass a mutable copy.
         */
        Map<String, Object> safeParameters =
                parameters == null
                        ? new HashMap<>()
                        : new HashMap<>(parameters);

        LOGGER.info(
                "Starting Jasper PDF generation. "
                        + "templatePath={}, records={}",
                templatePath,
                reportData == null
                        ? 0
                        : reportData.size());

        try (
                InputStream templateStream =
                        JasperUtil.class
                                .getClassLoader()
                                .getResourceAsStream(
                                        templatePath)
        ) {

            if (templateStream == null) {

                LOGGER.error(
                        "Jasper template was not found "
                                + "in classpath: {}",
                        templatePath);

                throw new ReportGenerationException(
                        "Jasper template not found: "
                                + templatePath);
            }

            LOGGER.info(
                    "Jasper template loaded successfully: {}",
                    templatePath);

            /*
             * Prints the actual JasperReports jar version
             * used at runtime.
             */
            Package jasperPackage =
                    JasperCompileManager.class
                            .getPackage();

            String jasperVersion =
                    jasperPackage
                            .getImplementationVersion();

            LOGGER.info(
                    "JasperReports runtime version={}",
                    jasperVersion);

            /*
             * Failure currently occurs around this line.
             */
            JasperReport jasperReport =
                    JasperCompileManager
                            .compileReport(
                                    templateStream);

            LOGGER.info(
                    "Jasper template compiled successfully: {}",
                    templatePath);

            JasperPrint jasperPrint;

            if (reportData == null
                    || reportData.isEmpty()) {

                LOGGER.debug(
                        "No report records found. "
                                + "Using JREmptyDataSource.");

                jasperPrint =
                        JasperFillManager
                                .fillReport(
                                        jasperReport,
                                        safeParameters,
                                        new JREmptyDataSource());

            } else {

                JRBeanCollectionDataSource dataSource =
                        new JRBeanCollectionDataSource(
                                reportData);

                LOGGER.debug(
                        "Using JRBeanCollectionDataSource. "
                                + "records={}",
                        reportData.size());

                jasperPrint =
                        JasperFillManager
                                .fillReport(
                                        jasperReport,
                                        safeParameters,
                                        dataSource);
            }

            byte[] pdfData =
                    JasperExportManager
                            .exportReportToPdf(
                                    jasperPrint);

            LOGGER.info(
                    "Jasper PDF generated successfully. "
                            + "templatePath={}, bytes={}",
                    templatePath,
                    pdfData.length);

            return pdfData;

        } catch (ReportGenerationException exception) {

            LOGGER.error(
                    "Jasper report generation failed: {}",
                    exception.getMessage(),
                    exception);

            throw exception;

        } catch (Exception exception) {

            LOGGER.error(
                    "Jasper report generation failed. "
                            + "templatePath={}, "
                            + "errorType={}, error={}",
                    templatePath,
                    exception.getClass().getName(),
                    exception.getMessage(),
                    exception);

            /*
             * IMPORTANT:
             * Print every nested cause.
             *
             * The actual JRXML parsing problem is usually
             * hidden below:
             *
             * JRException: Unable to load report
             */
            Throwable cause = exception;
            int causeLevel = 0;

            while (cause != null) {

                LOGGER.error(
                        "Jasper cause level {}: "
                                + "type={}, message={}",
                        causeLevel,
                        cause.getClass().getName(),
                        cause.getMessage());

                cause = cause.getCause();
                causeLevel++;
            }

            throw new ReportGenerationException(
                    MessageConstants
                            .REPORT_GENERATION_FAILED,
                    exception);
        }
    }

    private static void validateTemplatePath(
            String templatePath) {

        if (templatePath == null
                || templatePath.isBlank()) {

            throw new ReportGenerationException(
                    "Jasper template path cannot be empty");
        }
    }
}
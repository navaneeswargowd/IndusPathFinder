package com.induspathfinder.app.aop;

import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.expression.BeanFactoryResolver;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import com.induspathfinder.app.constants.ApplicationConstants;
import com.induspathfinder.app.service.AuditLogService;

@Aspect
@Component
public class AuditAspect {

    private static final Logger LOGGER =
            LogManager.getLogger(AuditAspect.class);

    private static final int MAX_DETAILS_LENGTH = 2000;

    private final AuditLogService auditLogService;

    private final BeanFactory beanFactory;

    private final ExpressionParser expressionParser =
            new SpelExpressionParser();

    public AuditAspect(
            AuditLogService auditLogService,
            BeanFactory beanFactory) {

        this.auditLogService = auditLogService;
        this.beanFactory = beanFactory;
    }

    @Around("@annotation(auditAction)")
    public Object auditMethod(
            ProceedingJoinPoint joinPoint,
            AuditAction auditAction)
            throws Throwable {

        MethodSignature methodSignature =
                (MethodSignature) joinPoint.getSignature();

        Method method =
                methodSignature.getMethod();

        StandardEvaluationContext context =
                createEvaluationContext(
                        methodSignature,
                        joinPoint.getArgs());

        try {

            /*
             * Executes the original business method.
             */
            Object result = joinPoint.proceed();

            /*
             * Makes the returned object available through
             * expressions such as:
             *
             * #result.projectId
             * #result.notificationId
             */
            context.setVariable("result", result);

            Long actionScreenId =
                    evaluateLongSafely(
                            auditAction.actionScreenId(),
                            context);

            Long userId =
                    evaluateLongSafely(
                            auditAction.userId(),
                            context);

            String username =
                    evaluateStringSafely(
                            auditAction.username(),
                            context);

            if (username == null
                    || username.isBlank()) {

                username =
                        ApplicationConstants.SYSTEM_USER;
            }

            String details =
                    evaluateDetailsSafely(
                            auditAction.details(),
                            context);

            saveAuditSafely(
                    auditAction.actionName(),
                    auditAction.actionScreen(),
                    actionScreenId,
                    userId,
                    username,
                    details);

            LOGGER.info(
                    "Audited successful method. "
                            + "class={}, method={}, "
                            + "action={}, screen={}, "
                            + "screenId={}, userId={}, username={}",
                    method.getDeclaringClass()
                            .getSimpleName(),
                    method.getName(),
                    auditAction.actionName(),
                    auditAction.actionScreen(),
                    actionScreenId,
                    userId,
                    username);

            return result;

        } catch (Throwable exception) {

            /*
             * Safely reads audit values even when the
             * business method fails.
             */
            Long actionScreenId =
                    evaluateLongSafely(
                            auditAction.actionScreenId(),
                            context);

            Long userId =
                    evaluateLongSafely(
                            auditAction.userId(),
                            context);

            String username =
                    evaluateStringSafely(
                            auditAction.username(),
                            context);

            if (username == null
                    || username.isBlank()) {

                username =
                        ApplicationConstants.SYSTEM_USER;
            }

            String failedDetails =
                    buildFailureDetails(
                            auditAction.details(),
                            exception);

            saveAuditSafely(
                    auditAction.actionName(),
                    auditAction.actionScreen(),
                    actionScreenId,
                    userId,
                    username,
                    failedDetails);

            LOGGER.error(
                    "Audited method failed. "
                            + "class={}, method={}, "
                            + "action={}, screen={}, "
                            + "screenId={}, userId={}, "
                            + "username={}, error={}",
                    method.getDeclaringClass()
                            .getSimpleName(),
                    method.getName(),
                    auditAction.actionName(),
                    auditAction.actionScreen(),
                    actionScreenId,
                    userId,
                    username,
                    exception.getMessage(),
                    exception);

            throw exception;
        }
    }

    private StandardEvaluationContext
    createEvaluationContext(
            MethodSignature methodSignature,
            Object[] arguments) {

        StandardEvaluationContext context =
                new StandardEvaluationContext();

        /*
         * Enables Spring bean expressions such as:
         *
         * @currentUserUtil.getCurrentUserId()
         * @currentUserUtil.getCurrentUserName()
         */
        context.setBeanResolver(
                new BeanFactoryResolver(beanFactory));

        String[] parameterNames =
                methodSignature.getParameterNames();

        if (parameterNames == null) {
            return context;
        }

        for (int index = 0;
             index < parameterNames.length;
             index++) {

            context.setVariable(
                    parameterNames[index],
                    arguments[index]);
        }

        return context;
    }

    private Long evaluateLong(
            String expression,
            StandardEvaluationContext context) {

        if (expression == null
                || expression.isBlank()) {

            return null;
        }

        Object value =
                expressionParser
                        .parseExpression(
                                expression.trim())
                        .getValue(context);

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(
                String.valueOf(value));
    }

    private String evaluateString(
            String expression,
            StandardEvaluationContext context) {

        if (expression == null
                || expression.isBlank()) {

            return null;
        }

        Object value =
                expressionParser
                        .parseExpression(
                                expression.trim())
                        .getValue(context);

        return value == null
                ? null
                : String.valueOf(value);
    }

    private String evaluateDetails(
            String details,
            StandardEvaluationContext context) {

        if (details == null
                || details.isBlank()) {

            return null;
        }

        String trimmedDetails =
                details.trim();

        /*
         * Evaluate SpEL only when details starts with:
         *
         * #  → method parameter/result variable
         * @  → Spring bean
         *
         * Otherwise treat details as normal text.
         */
        if (trimmedDetails.startsWith("#")
                || trimmedDetails.startsWith("@")) {

            return evaluateString(
                    trimmedDetails,
                    context);
        }

        return trimmedDetails;
    }

    private Long evaluateLongSafely(
            String expression,
            StandardEvaluationContext context) {

        try {

            return evaluateLong(
                    expression,
                    context);

        } catch (Exception exception) {

            LOGGER.warn(
                    "Unable to evaluate audit numeric "
                            + "expression. expression={}, error={}",
                    expression,
                    exception.getMessage());

            return null;
        }
    }

    private String evaluateStringSafely(
            String expression,
            StandardEvaluationContext context) {

        try {

            return evaluateString(
                    expression,
                    context);

        } catch (Exception exception) {

            LOGGER.warn(
                    "Unable to evaluate audit text "
                            + "expression. expression={}, error={}",
                    expression,
                    exception.getMessage());

            return null;
        }
    }

    private String evaluateDetailsSafely(
            String details,
            StandardEvaluationContext context) {

        try {

            return evaluateDetails(
                    details,
                    context);

        } catch (Exception exception) {

            LOGGER.warn(
                    "Unable to evaluate audit details. "
                            + "details={}, error={}",
                    details,
                    exception.getMessage());

            return limitDetails(details);
        }
    }

    private String buildFailureDetails(
            String details,
            Throwable exception) {

        String baseDetails =
                details == null
                        || details.isBlank()
                        ? "Operation failed"
                        : details.trim();

        String errorMessage =
                exception.getMessage() == null
                        || exception.getMessage().isBlank()
                        ? exception.getClass()
                                .getSimpleName()
                        : exception.getMessage();

        String completeDetails =
                baseDetails
                        + " | Status: FAILED"
                        + " | Error: "
                        + errorMessage;

        return limitDetails(
                completeDetails);
    }

    private String limitDetails(
            String details) {

        if (details == null) {
            return null;
        }

        if (details.length()
                <= MAX_DETAILS_LENGTH) {

            return details;
        }

        return details.substring(
                0,
                MAX_DETAILS_LENGTH);
    }

    private void saveAuditSafely(
            String actionName,
            String actionScreen,
            Long actionScreenId,
            Long userId,
            String username,
            String details) {

        try {

            auditLogService.saveAuditLog(
                    actionName,
                    actionScreen,
                    actionScreenId,
                    userId,
                    username,
                    limitDetails(details));

        } catch (Exception auditException) {

            /*
             * Audit failure must not break the main
             * business operation.
             */
            LOGGER.error(
                    "Unable to save audit log. "
                            + "action={}, screen={}, "
                            + "screenId={}, userId={}, "
                            + "username={}, error={}",
                    actionName,
                    actionScreen,
                    actionScreenId,
                    userId,
                    username,
                    auditException.getMessage(),
                    auditException);
        }
    }
}
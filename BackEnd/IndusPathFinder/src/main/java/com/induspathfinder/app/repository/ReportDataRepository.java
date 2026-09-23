package com.induspathfinder.app.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.induspathfinder.app.dto.response.ActivityReportRow;
import com.induspathfinder.app.dto.response.DependencyReportRow;
import com.induspathfinder.app.dto.response.ProjectReportRow;
import com.induspathfinder.app.util.DateUtil;

@Repository
public class ReportDataRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public ReportDataRepository(
            NamedParameterJdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ProjectReportRow> findProjectReportRows(
            Long projectId,
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        StringBuilder sql = new StringBuilder("""
                SELECT
                    p.project_id,
                    p.project_code,
                    p.project_name,
                    p.description,
                    p.start_date,
                    p.end_date,
                    p.priority,
                    p.status,
                    p.created_by,
                    p.created_on
                FROM project p
                WHERE p.project_id = :projectId
                """);

        Map<String, Object> parameters =
                new HashMap<>();

        parameters.put("projectId", projectId);

        appendDateConditions(
                sql,
                parameters,
                fromDate,
                toDate,
                "p.created_on");

        sql.append(" ORDER BY p.created_on DESC");

        return jdbcTemplate.query(
                sql.toString(),
                parameters,
                new ProjectReportRowMapper());
    }

    public List<ActivityReportRow> findActivityReportRows(
            Long projectId,
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        StringBuilder sql = new StringBuilder("""
                SELECT
                    a.act_id,
                    a.project_id,
                    p.project_code,
                    a.act_code,
                    a.act_name,
                    a.des AS description,
                    a.dur AS duration,
                    a.start_date,
                    a.end_date,
                    a.priority,
                    a.status
                FROM activity a
                INNER JOIN project p
                    ON p.project_id = a.project_id
                WHERE a.project_id = :projectId
                """);

        Map<String, Object> parameters =
                new HashMap<>();

        parameters.put("projectId", projectId);

        /*
         * Activity.createdOn is LocalDate and the database
         * column is created_on.
         */
        appendDateConditions(
                sql,
                parameters,
                fromDate,
                toDate,
                "a.created_on");

        sql.append(" ORDER BY a.act_code ASC");

        return jdbcTemplate.query(
                sql.toString(),
                parameters,
                new ActivityReportRowMapper());
    }

    public List<DependencyReportRow>
    findDependencyReportRows(
            Long projectId,
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        StringBuilder sql = new StringBuilder("""
                SELECT
                    d.dependency_id,
                    d.project_id,
                    p.project_code,

                    predecessor.act_id
                        AS predecessor_activity_id,

                    predecessor.act_code
                        AS predecessor_activity_code,

                    predecessor.act_name
                        AS predecessor_activity_name,

                    successor.act_id
                        AS successor_activity_id,

                    successor.act_code
                        AS successor_activity_code,

                    successor.act_name
                        AS successor_activity_name,

                    d.dependency_type

                FROM dependency d

                INNER JOIN project p
                    ON p.project_id = d.project_id

                INNER JOIN activity predecessor
                    ON predecessor.act_id =
                       d.predecessor_activity_id

                INNER JOIN activity successor
                    ON successor.act_id =
                       d.successor_activity_id

                WHERE d.project_id = :projectId
                """);

        Map<String, Object> parameters =
                new HashMap<>();

        parameters.put("projectId", projectId);

        appendDateConditions(
                sql,
                parameters,
                fromDate,
                toDate,
                "d.created_on");

        sql.append(" ORDER BY d.dependency_id ASC");

        return jdbcTemplate.query(
                sql.toString(),
                parameters,
                new DependencyReportRowMapper());
    }

    public boolean projectExists(Long projectId) {

        String sql = """
                SELECT COUNT(*)
                FROM project
                WHERE project_id = :projectId
                """;

        Long count = jdbcTemplate.queryForObject(
                sql,
                Map.of("projectId", projectId),
                Long.class);

        return count != null && count > 0;
    }

    private void appendDateConditions(
            StringBuilder sql,
            Map<String, Object> parameters,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            String dateColumn) {

        if (fromDate != null) {

            sql.append(" AND ")
                    .append(dateColumn)
                    .append(" >= :fromDate");

            parameters.put("fromDate", fromDate);
        }

        if (toDate != null) {

            sql.append(" AND ")
                    .append(dateColumn)
                    .append(" <= :toDate");

            parameters.put("toDate", toDate);
        }
    }

    private static class ProjectReportRowMapper
    implements RowMapper<ProjectReportRow> {

@Override
public ProjectReportRow mapRow(
        ResultSet resultSet,
        int rowNumber)
        throws SQLException {

    return ProjectReportRow.builder()
            .projectId(
                    resultSet.getLong(
                            "project_id"))
            .projectCode(
                    resultSet.getString(
                            "project_code"))
            .projectName(
                    resultSet.getString(
                            "project_name"))
            .description(
                    resultSet.getString(
                            "description"))
            .startDate(
                    formatDateColumn(
                            resultSet,
                            "start_date"))
            .endDate(
                    formatDateColumn(
                            resultSet,
                            "end_date"))
            .priority(
                    resultSet.getString(
                            "priority"))
            .status(
                    resultSet.getString(
                            "status"))
            .createdBy(
                    resultSet.getString(
                            "created_by"))
            .createdOn(
                    formatDateTimeColumn(
                            resultSet,
                            "created_on"))
            .build();
		}
}
    private static class ActivityReportRowMapper
            implements RowMapper<ActivityReportRow> {

        @Override
        public ActivityReportRow mapRow(
                ResultSet resultSet,
                int rowNumber)
                throws SQLException {

            Integer duration =
                    resultSet.getObject(
                            "duration",
                            Integer.class);

            return ActivityReportRow.builder()
                    .activityId(
                            resultSet.getLong("act_id"))
                    .projectId(
                            resultSet.getLong("project_id"))
                    .projectCode(
                            resultSet.getString(
                                    "project_code"))
                    .activityCode(
                            resultSet.getString(
                                    "act_code"))
                    .activityName(
                            resultSet.getString(
                                    "act_name"))
                    .description(
                            resultSet.getString(
                                    "description"))
                    .duration(duration)
                    .startDate(
                            formatDateColumn(
                                    resultSet,
                                    "start_date"))
                    .endDate(
                            formatDateColumn(
                                    resultSet,
                                    "end_date"))
                    .priority(
                            resultSet.getString(
                                    "priority"))
                    .status(
                            resultSet.getString(
                                    "status"))
                    .build();
        }
    }

    private static class DependencyReportRowMapper
            implements RowMapper<DependencyReportRow> {

        @Override
        public DependencyReportRow mapRow(
                ResultSet resultSet,
                int rowNumber)
                throws SQLException {

            return DependencyReportRow.builder()
                    .dependencyId(
                            resultSet.getLong(
                                    "dependency_id"))
                    .projectId(
                            resultSet.getLong(
                                    "project_id"))
                    .projectCode(
                            resultSet.getString(
                                    "project_code"))
                    .predecessorActivityId(
                            resultSet.getLong(
                                    "predecessor_activity_id"))
                    .predecessorActivityCode(
                            resultSet.getString(
                                    "predecessor_activity_code"))
                    .predecessorActivityName(
                            resultSet.getString(
                                    "predecessor_activity_name"))
                    .successorActivityId(
                            resultSet.getLong(
                                    "successor_activity_id"))
                    .successorActivityCode(
                            resultSet.getString(
                                    "successor_activity_code"))
                    .successorActivityName(
                            resultSet.getString(
                                    "successor_activity_name"))
                    .dependencyType(
                            resultSet.getString(
                                    "dependency_type"))
                    .build();
        }
    }

    private static String formatDateColumn(
            ResultSet resultSet,
            String columnName)
            throws SQLException {

        java.sql.Date date =
                resultSet.getDate(columnName);

        return date == null
                ? null
                : DateUtil.formatDate(
                        date.toLocalDate());
    }

    private static String formatDateTimeColumn(
            ResultSet resultSet,
            String columnName)
            throws SQLException {

        java.sql.Timestamp timestamp =
                resultSet.getTimestamp(columnName);

        return timestamp == null
                ? null
                : DateUtil.formatDateTime(
                        timestamp.toLocalDateTime());
    }
}
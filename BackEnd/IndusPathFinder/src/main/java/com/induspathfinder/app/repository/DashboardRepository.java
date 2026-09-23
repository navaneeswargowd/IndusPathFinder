package com.induspathfinder.app.repository;

import java.util.Map;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DashboardRepository(
            NamedParameterJdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    public long countOrganizations() {

        String sql = """
                SELECT COUNT(*)
                FROM organization
                """;

        Long count = jdbcTemplate.queryForObject(
                sql,
                Map.of(),
                Long.class);

        return count == null ? 0L : count;
    }

    public long countAllProjects() {

        String sql = """
                SELECT COUNT(*)
                FROM project
                """;

        Long count = jdbcTemplate.queryForObject(
                sql,
                Map.of(),
                Long.class);

        return count == null ? 0L : count;
    }

    public long countProjectsByUserId(Long userId) {

        String sql = """
                SELECT COUNT(*)
                FROM project
                WHERE user_id = :userId
                """;

        Long count = jdbcTemplate.queryForObject(
                sql,
                Map.of("userId", userId),
                Long.class);

        return count == null ? 0L : count;
    }

    public long countActivitiesByUserId(Long userId) {

        String sql = """
                SELECT COUNT(*)
                FROM activity a
                INNER JOIN project p
                    ON p.project_id = a.project_id
                WHERE p.user_id = :userId
                """;

        Long count = jdbcTemplate.queryForObject(
                sql,
                Map.of("userId", userId),
                Long.class);

        return count == null ? 0L : count;
    }

    public long countDependenciesByUserId(Long userId) {

        String sql = """
                SELECT COUNT(*)
                FROM dependency d
                INNER JOIN project p
                    ON p.project_id = d.project_id
                WHERE p.user_id = :userId
                """;

        Long count = jdbcTemplate.queryForObject(
                sql,
                Map.of("userId", userId),
                Long.class);

        return count == null ? 0L : count;
    }
}
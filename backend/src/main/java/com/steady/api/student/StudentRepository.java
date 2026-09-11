package com.steady.api.student;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class StudentRepository {
    private final JdbcTemplate jdbcTemplate;

    public StudentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void ensureExists(UUID studentId) {
        Integer count = jdbcTemplate.queryForObject("select count(*) from students where id = ?", Integer.class, studentId);
        if (count != null && count == 0) {
            jdbcTemplate.update("insert into students (id) values (?)", studentId);
        }
    }
}

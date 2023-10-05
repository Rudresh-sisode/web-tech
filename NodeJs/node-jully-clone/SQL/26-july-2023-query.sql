-- UPDATE attendance_tables
-- SET total_worked_hours = (
--   CASE
--     WHEN check_out_time IS NULL THEN NULL
--     ELSE EXTRACT(HOUR FROM COALESCE(check_out_time, check_in_time) - check_in_time) || ':' ||
--          EXTRACT(MINUTE FROM COALESCE(check_out_time, check_in_time) - check_in_time) || ':' ||
--          EXTRACT(SECOND FROM COALESCE(check_out_time, check_in_time) - check_in_time)
--   END
-- );

UPDATE attendance_tables
SET total_worked_hours = (
  CASE
    WHEN check_out_time IS NULL THEN NULL
    ELSE TO_CHAR(COALESCE(check_out_time, check_in_time) - check_in_time, 'HH24:MI:SS')
  END
);
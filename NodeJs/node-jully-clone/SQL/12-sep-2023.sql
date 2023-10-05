
SELECT "user_table"."email"
	,"user_table"."id",
	(SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 as cl
	,CASE 
		WHEN DATE IS NULL
			THEN 'ABSENT'
		WHEN check_out_time IS NULL
			THEN 'LEAVE'
		WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 >= 0
			AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 < 5
			THEN 'LEAVE'
		WHEN (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 >= 5
			AND (SUBSTRING(total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(total_worked_hours, 7, 2)::INTEGER) / 3600 < 9
			THEN 'HALF-DAY'
		ELSE 'PRESENT'
		END AS "attendance_tables.leaveStatus"
	,"attendance_tables"."id" AS "attendance_tables.attendanceId"
	,"employee_table"."first_name" AS "employee_table.employeeName"
	,"employee_table"."id" AS "employee_table.id"
FROM "user_tables" AS "user_table"
LEFT OUTER JOIN "attendance_tables" AS "attendance_tables" ON "user_table"."id" = "attendance_tables"."user_id"
	AND "attendance_tables"."date" = '2023-09-11 00:00:00.000 +05:30'
	AND "attendance_tables"."company_id" = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
LEFT OUTER JOIN "employee_tables" AS "employee_table" ON "user_table"."id" = "employee_table"."user_id"
WHERE 
(
		attendance_tables.DATE IS NULL
		OR attendance_tables.check_out_time IS NULL
		OR (
			(SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER) / 3600 >= 0 
			  AND (SUBSTRING(attendance_tables.total_worked_hours, 1, 2)::INTEGER * 3600 + SUBSTRING(attendance_tables.total_worked_hours, 4, 2)::INTEGER * 60 + SUBSTRING(attendance_tables.total_worked_hours, 7, 2)::INTEGER) / 3600 <9
			)
		)
	AND
	"user_table"."is_deleted" = false
	AND "user_table"."is_active" = true
	AND "user_table"."company_id" = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
	AND "user_table"."id" NOT IN (
		SELECT user_id
		FROM employee_leaves
		WHERE DATE = '2023-09-11 00:00:00+05:30'
			AND is_deleted = false
			AND company_id = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
		);

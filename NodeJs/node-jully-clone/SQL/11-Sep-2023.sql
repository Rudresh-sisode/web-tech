
-- SELECT "employee_leave"."reason"
-- 	,to_char(DATE, 'YYYY-MM-DD') AS "date"
-- 	,"employee_leave"."check_in" AS "checkIn"
-- 	,"employee_leave"."check_out" AS "checkOut"
-- 	,"employee_leave"."status"
-- 	,"employee_table"."emp_id" AS "employee_table.empId"
-- 	,"employee_table"."first_name" AS "employee_table.firstName"
-- 	,COUNT(CASE 
-- 			WHEN "employee_leave"."status" = 'ABSENT'
-- 				THEN 1
-- 			END) AS "absentCount"
-- 	,COUNT(CASE 
-- 			WHEN "employee_leave"."status" = 'HALF-DAY'
-- 				THEN 1
-- 			END) AS "halfDayCount",
-- 	COUNT( CASE
-- 		 WHEN "employee_leave"."status" = 'LEAVE'
-- 		 THEN 1)
-- FROM "employee_leaves" AS "employee_leave"
-- INNER JOIN "employee_tables" AS "employee_table" ON "employee_leave"."employee_id" = "employee_table"."id"
-- 	AND "employee_table"."company_id" = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- WHERE "employee_leave"."company_id" = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- 	AND "employee_leave"."is_deleted" = false
-- 	AND "employee_leave"."date" BETWEEN '2023-08-01 00:00:00.000 +05:30'
-- 		AND '2023-09-10 15:33:00.000 +05:30'
-- GROUP BY "employee_leave"."employee_id"
-- 	,"employee_leave"."reason"
-- 	,"date"
-- 	,"checkIn"
-- 	,"checkOut"
-- 	,"status"
-- 	,"employee_table.empId"
-- 	,"employee_table.firstName"
-- ORDER BY "date" ASC;


-- SELECT employee_table.emp_id, employee_table.first_name AS "employee_table.empId"
-- 	,COUNT(*) FILTER(WHERE employee_leave.STATUS = 'LEAVE') AS leaves
-- 	,COUNT(*) FILTER(WHERE employee_leave.STATUS = 'ABSENT') AS absents
-- 	,COUNT(*) FILTER(WHERE employee_leave.STATUS = 'HALF-DAY') AS half_days
-- FROM employee_leaves AS employee_leave
-- INNER JOIN employee_tables AS employee_table ON employee_leave.employee_id = employee_table.id
-- WHERE employee_leave.company_id = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- 	AND employee_leave.is_deleted = false
-- 	AND employee_leave.DATE BETWEEN '2023-08-01 00:00:00.000 +05:30'
-- 		AND '2023-09-10 15:33:00.000 +05:30'
-- 	AND employee_table.company_id = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- GROUP BY employee_table.id
-- ORDER BY employee_table.emp_id ASC;


-- SELECT employee_table.emp_id
-- 	,employee_table.first_name AS "employee_table.empId"
-- 	,COUNT(*) FILTER(WHERE employee_leave.STATUS = 'LEAVE') AS leaves
-- 	,COUNT(*) FILTER(WHERE employee_leave.STATUS = 'ABSENT') AS absents
-- 	,COUNT(*) FILTER(WHERE employee_leave.STATUS = 'HALF-DAY') * 0.5 + COUNT(*) FILTER(WHERE employee_leave.STATUS = 'leave') AS total_days,
-- -- 	COUNT()
-- FROM employee_leaves AS employee_leave
-- INNER JOIN employee_tables AS employee_table ON employee_leave.employee_id = employee_table.id
-- WHERE employee_leave.company_id = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- 	AND employee_leave.is_deleted = false
-- 	AND employee_leave.DATE BETWEEN '2023-08-01 00:00:00.000 +05:30'
-- 		AND '2023-09-10 15:33:00.000 +05:30'
-- 	AND employee_table.company_id = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- GROUP BY employee_table.emp_id
-- 	,employee_table.first_name
-- ORDER BY employee_table.emp_id ASC;

-- SELECT "employee_table"."emp_id" AS "employee_table.empId"
-- 	,"employee_table"."first_name" AS "employee_table.firstName"
-- 	,SUM(CASE 
-- 			WHEN employee_leave.STATUS = 'LEAVE'
-- 				THEN 1
-- 			WHEN employee_leave.STATUS = 'ABSENT'
-- 				THEN 1
-- 			WHEN employee_leave.STATUS = 'HALF-DAY'
-- 				THEN 0.5
-- 			ELSE 0
-- 			END) AS "totalLeaveDays"
-- 	,"employee_table"."user_id" AS "employee_table.userId",
-- -- 	 STRING_AGG(employee_leave.date::text, ',') AS "leavesDate"
-- STRING_AGG(TO_CHAR(employee_leave.date, 'YYYY-MM-DD'), ',') AS "leavesDate"
-- FROM "employee_leaves" AS "employee_leave"
-- INNER JOIN "employee_tables" AS "employee_table" ON "employee_leave"."employee_id" = "employee_table"."id"
-- 	AND "employee_table"."company_id" = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- WHERE "employee_leave"."company_id" = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
-- 	AND "employee_leave"."is_deleted" = false
-- 	AND "employee_leave"."date" BETWEEN '2023-09-01 00:00:00.000 +05:30'
-- 		AND '2023-09-14 16:36:13.000 +05:30'
-- GROUP BY "employee_table"."emp_id"
-- 	,"employee_table"."first_name"
-- 	,"employee_table"."user_id";

SELECT employee_table.emp_id AS "employee_table.empId", employee_table.first_name, employee_table.user_id
	,SUM(CASE 
			WHEN employee_leave.STATUS = 'LEAVE'
				THEN 1
			WHEN employee_leave.STATUS = 'ABSENT'
				THEN 1
			WHEN employee_leave.STATUS = 'HALF-DAY'
				THEN 0.5
			ELSE 0
			END) AS total_days
FROM employee_leaves AS employee_leave
INNER JOIN employee_tables AS employee_table ON employee_leave.employee_id = employee_table.id
WHERE employee_leave.company_id = 'bb269a10-0c45-11ee-af8e-fbdc6b6dd9aa'
	AND employee_leave.is_deleted = false
	AND employee_leave.DATE BETWEEN '2023-08-01 00:00:00.000 +05:30'
		AND '2023-09-10 15:33:00.000 +05:30'
	AND employee_table.company_id = employee_leave.company_id
GROUP BY employee_table.emp_id, employee_table.first_name, employee_table.user_id
ORDER BY employee_table.emp_id ASC;
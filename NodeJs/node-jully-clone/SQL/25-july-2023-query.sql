-- Add the last_name column to the first_name column
UPDATE employee_tables SET first_name = CONCAT(first_name, ' ', last_name);

-- Delete the last_name column
ALTER TABLE employee_tables DROP COLUMN last_name;

-- Delete the middle_name column
 ALTER TABLE employee_tables DROP COLUMN middle_name;
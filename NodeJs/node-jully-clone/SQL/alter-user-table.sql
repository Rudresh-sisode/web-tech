-- alter-user-table.sql


-- Add a new column to the existing table
ALTER TABLE existing_table ADD COLUMN temporary_password VARCHAR(256);

-- Add a new column to the existing table
ALTER TABLE existing_table ADD COLUMN temporary_password_expiry_date DATE;
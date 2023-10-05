-- To select the all resources which are assigned to a role with id 'bb1a16f0-0c45-11ee-af8e-fbdc6b6dd9aa'
-- geeta's role id is 'bb1a16f0-0c45-11ee-af8e-fbdc6b6dd9aa'
SELECT *
FROM resource_tables
WHERE id IN (
		SELECT (json_array_elements(PRIVILEGES) ->> 'resourceId')::uuid AS resourceId
		FROM role_tables
		WHERE id = 'bb1a16f0-0c45-11ee-af8e-fbdc6b6dd9aa'
		)




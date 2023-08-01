# Write your MySQL query statement below
DELETE FROM Person
WHERE id NOT IN (
  SELECT MIN(id)
  FROM (
    SELECT id, LOWER(email) AS email
    FROM Person
  ) t
  GROUP BY email
);
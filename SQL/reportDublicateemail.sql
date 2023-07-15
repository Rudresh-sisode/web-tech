-- Write an SQL query to report all the duplicate emails. Note that it's guaranteed that the email field is not NULL.
select email AS Email from Person GROUP BY email HAVING COUNT(*) > 1
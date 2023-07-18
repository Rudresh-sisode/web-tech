SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM (
  SELECT departmentId, MAX(salary) AS max_salary
  FROM (
    SELECT DISTINCT departmentId, salary
    FROM Employee
  ) AS unique_salaries
  GROUP BY departmentId
) AS department_max_salary
JOIN Employee AS e ON e.departmentId = department_max_salary.departmentId AND e.salary >= department_max_salary.max_salary
JOIN Department AS d ON d.id = e.departmentId
ORDER BY d.name, e.salary DESC
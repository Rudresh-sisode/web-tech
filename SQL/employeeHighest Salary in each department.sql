SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e 
INNER JOIN Department d ON e.departmentId = d.id WHERE 
( SELECT COUNT(DISTINCT salary) FROM Employee WHERE
 departmentId = e.departmentId AND 
 salary > e.salary 
) < 3
  ORDER BY Department, Salary DESC;
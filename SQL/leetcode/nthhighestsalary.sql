CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  DECLARE result INT;
  DECLARE OFF INT;
  SET OFF = N - 1;
  IF N < 1 THEN
    SET result = NULL;
  ELSE
    SET result = (
      SELECT DISTINCT salary
      FROM Employee
      ORDER BY salary DESC
      LIMIT 1 OFFSET OFF
    );
  END IF;
  RETURN result;
END
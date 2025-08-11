-- Write your PostgreSQL query statement below
select MAX(distinct salary) as SecondHighestSalary
from Employee
where salary not in (select max(distinct salary) from Employee)
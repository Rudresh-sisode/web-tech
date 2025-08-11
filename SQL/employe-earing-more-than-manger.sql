-- Write your PostgreSQL query statement below
select emp1.name as Employee from Employee emp1
join Employee emp2 on emp1.managerId = emp2.id
where emp1.salary > emp2.salary;
select d.name AS Department, e.name AS employees
e.salary AS salary from Employee e
inner join Department d on e.departmentId = d.id
where (e.departmentId, e.salary) in
(select departmentId, max(salary) from Employee group by departmentId)
-- inner join query
select u.email, e.first_name, e.last_name 
from employee_tables as e inner join user_tables as u on u.id = e.user_id;

--  inner join on multiple tables
select u.email, e.first_name, e.last_name, att.date, att.check_in_time as attenTime
from employee_tables as e inner join user_tables as u on u.id = e.user_id
inner join attendance_tables as att on e.id = att.employee_id;
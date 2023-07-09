select u.email, e.first_name, e.last_name 
from employee_tables as e inner join user_tables as u on u.id = e.user_id;
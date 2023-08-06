select request_at as Day, ROUND(count(case when status like 'cancel%' then 1 end) / count(*) * 100,2) as rate
from (
    select Date(request_at), status, client_id, driver_id from Trips t
    inner join   Users u1 on t.client_id = u1.users_id and u1.banned = 'NO'
    inner join Users u2 on t.driver_id = u2.users_id and u2.banned = 'NO'
    WHERE 
    t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
) as subquery
group by request_at;
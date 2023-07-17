delete from person where id NOT IN (
    select MIN(id) from person group by email
)
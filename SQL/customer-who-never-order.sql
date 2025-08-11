select c.name as Customers from customers c
left join orders o on o.customerId = c.id
where o.id is null
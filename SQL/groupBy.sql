SELECT customer_id, COUNT(*) as num_orders
FROM orders
GROUP BY customer_id;
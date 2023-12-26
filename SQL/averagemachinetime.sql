# Write your MySQL query statement below
SELECT t1.machine_id, ROUND(AVG(t2.timestamp - t1.timestamp), 3) as processing_time
    FROM 
        Activity AS t1
    INNER JOIN  
        Activity AS t2
            USING (machine_id, process_id)
    WHERE
        t1.activity_type = 'start' AND t2.activity_type='end'
    GROUP BY t1.machine_id
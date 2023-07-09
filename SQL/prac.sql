
-- select order by country
SELECT * FROM Customer ORDER BY Country;

-- insert query
INSERT INTO Customer (Name, Address, City, PostalCode, Country)
VALUES ('Cardinal', 'Skagen 21', 'Stavanger', '4006','Norway');

-- update query
UPDATE Customer SET ContactName = 'rudresh', City = 'Pune' WHERE CustomerID = 292;

-- delete query
DELETE FROM Customer WHERE CustomerId = 43;

--  limit query
SELECT * FROM Customer LIMIT 5;
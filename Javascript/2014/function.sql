
-- we creats the tables
CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    education VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- following is the function for trigger
CREATE OR REPLACE FUNCTION update_created_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Following is the trigger which calls the trigger method e.g update_created_at_column()
CREATE TRIGGER update_friends_timestamp
BEFORE INSERT ON friends
FOR EACH ROW
EXECUTE PROCEDURE update_created_at_column();


-- Now we are going to insert the values into the tables and 

INSERT INTO friends (first_name,education) values('sohame','B-tech computer engineer')

select * from friends;
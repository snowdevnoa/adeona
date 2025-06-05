-- Create a test table
CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL
);

-- Insert a sample row
INSERT INTO test_table (message)
VALUES ('Hello from Adeona DB!');

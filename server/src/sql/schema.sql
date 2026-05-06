CREATE TABLE users(
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL, 
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ 
BEGIN 
    NEW.updated_at= CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at_customers
BEFORE UPDATE ON customers
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

--INDEXES
CREATE INDEX idx_customers_user_id ON CUSTOMERS(user_id);
CREATE INDEX idx_customers_email ON CUSTOMERS(email);

-- unique email per user 
ALTER TABLE customers
ADD CONSTRAINT unique_user_email UNIQUE(user_id,email);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending','in_progress','completed')) DEFAULT 'pending', 
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TRIGGER

CREATE TRIGGER set_updated_at_jobs
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_jobs_user_id ON JOBS(user_id);
CREATE INDEX idx_jobs_customer_id ON JOBS(customer_id);
CREATE INDEX idx_jobs_status ON JOBS(status);


-- Create database (run this first)
CREATE DATABASE table_tracker;

-- Connect to table_tracker database, then run below:

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables configuration
CREATE TABLE tables_config (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    price_per_minute DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
);

-- Gaming sessions
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables_config(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    total_minutes INTEGER,
    total_amount DECIMAL(8,2),
    split_players INTEGER DEFAULT 1,
    amount_per_player DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tables
INSERT INTO tables_config (name, type, price_per_minute) VALUES
('Snooker Table 1', 'snooker', 3.00),
('Snooker Table 2', 'snooker', 4.00),
('Snooker Table 3', 'snooker', 4.50),
('Pool Table 1', 'pool', 2.00),
('Pool Table 2', 'pool', 2.00),
('Pool Table 3', 'pool', 2.50);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

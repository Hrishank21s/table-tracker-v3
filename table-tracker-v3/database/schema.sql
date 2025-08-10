-- Database schema for Table Tracker application

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables table (represents physical tables)
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    table_number INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'out_of_order')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (represents table usage sessions)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id),
    user_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration INTEGER, -- in minutes
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_tables_status ON tables(status);
CREATE INDEX idx_sessions_table_id ON sessions(table_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);

-- Sample data
INSERT INTO tables (table_number, capacity, status) VALUES
(1, 4, 'available'),
(2, 2, 'available'),
(3, 6, 'available'),
(4, 4, 'available'),
(5, 8, 'available');
CREATE TABLE financial_assets (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ticker VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    current_price NUMERIC(19,2) NOT NULL,
    yield_percentage NUMERIC(10,4) NOT NULL,
    last_update TIMESTAMP NOT NULL
);
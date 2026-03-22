CREATE TABLE users (
    id UUID PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_base64 TEXT,
    password_hash VARCHAR(255) NOT NULL,
    agency VARCHAR(10) NOT NULL,
    account BIGINT UNIQUE NOT NULL,
    verification_digit VARCHAR(2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
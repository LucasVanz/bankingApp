CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    balance DECIMAL(19,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    user_id UUID UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id)
);
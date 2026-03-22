CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    amount DECIMAL(19,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    wallet_id UUID NOT NULL,
    receiver_wallet_id UUID,
    financial_asset_id UUID,
    quantity_financial_asset DECIMAL(19,2),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_trans_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_trans_receiver FOREIGN KEY (receiver_wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_trans_asset FOREIGN KEY (financial_asset_id) REFERENCES financial_assets(id)
);
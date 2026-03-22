CREATE TABLE user_investiment (
    id UUID PRIMARY KEY,
    wallet_id UUID NOT NULL,
    financial_asset_id UUID NOT NULL,
    quantity DECIMAL(19,2) NOT NULL,
    avarage_price DECIMAL(19,2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_invest_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_invest_asset FOREIGN KEY (financial_asset_id) REFERENCES financial_assets(id)
);
INSERT INTO financial_assets (
    id,
    name,
    ticker,
    type,
    current_price,
    yield_percentage,
    last_update
) VALUES

-- =========================
-- RENDA FIXA (FIXED)
-- =========================

(gen_random_uuid(), 'Tesouro Selic 2029', 'SELIC2029', 'FIXED', 100.00, 11.25, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Tesouro IPCA+ 2035', 'IPCA2035', 'FIXED', 100.00, 6.10, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Tesouro Prefixado 2031', 'PRE2031', 'FIXED', 100.00, 10.80, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'CDB 110% CDI', 'CDB110', 'FIXED', 1000.00, 13.15, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'CDB 120% CDI', 'CDB120', 'FIXED', 1000.00, 14.20, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'LCI Banco XP', 'LCIXP', 'FIXED', 1000.00, 10.50, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'LCA Banco Inter', 'LCAINTER', 'FIXED', 1000.00, 10.80, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Debênture Petrobras', 'DEB-PETR', 'FIXED', 1000.00, 12.30, CURRENT_TIMESTAMP),

-- =========================
-- RENDA VARIÁVEL (VARIABLE)
-- =========================

(gen_random_uuid(), 'Petrobras PN', 'PETR4', 'VARIABLE', 36.80, 0.75, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Vale ON', 'VALE3', 'VARIABLE', 61.20, 0.68, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Itaú Unibanco PN', 'ITUB4', 'VARIABLE', 32.50, 0.92, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Banco do Brasil ON', 'BBAS3', 'VARIABLE', 49.30, 1.10, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Bradesco PN', 'BBDC4', 'VARIABLE', 14.80, 0.85, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'WEG ON', 'WEGE3', 'VARIABLE', 42.70, 0.30, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Ambev ON', 'ABEV3', 'VARIABLE', 13.20, 0.55, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Magazine Luiza ON', 'MGLU3', 'VARIABLE', 2.30, 0.00, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Eletrobras ON', 'ELET3', 'VARIABLE', 38.90, 0.95, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Suzano ON', 'SUZB3', 'VARIABLE', 54.10, 0.70, CURRENT_TIMESTAMP),

-- =========================
-- FUNDOS IMOBILIÁRIOS (ainda VARIABLE)
-- =========================

(gen_random_uuid(), 'FII HGLG11', 'HGLG11', 'VARIABLE', 165.00, 0.80, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'FII XPLG11', 'XPLG11', 'VARIABLE', 108.50, 0.75, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'FII KNRI11', 'KNRI11', 'VARIABLE', 140.20, 0.70, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'FII MXRF11', 'MXRF11', 'VARIABLE', 10.20, 0.95, CURRENT_TIMESTAMP);
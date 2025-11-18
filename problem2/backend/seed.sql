-- Seed fake data for tokens and pricings tables

-- Insert tokens
INSERT INTO tokens (id, symbol, display_name, created_at)
VALUES
  (gen_random_uuid(), 'BTC', 'Bitcoin', NOW()),
  (gen_random_uuid(), 'ETH', 'Ethereum', NOW()),
  (gen_random_uuid(), 'BNB', 'Binance Coin', NOW()),
  (gen_random_uuid(), 'SOL', 'Solana', NOW()),
  (gen_random_uuid(), 'ADA', 'Cardano', NOW()),
  (gen_random_uuid(), 'XRP', 'Ripple', NOW()),
  (gen_random_uuid(), 'DOGE', 'Dogecoin', NOW()),
  (gen_random_uuid(), 'DOT', 'Polkadot', NOW()),
  (gen_random_uuid(), 'MATIC', 'Polygon', NOW()),
  (gen_random_uuid(), 'AVAX', 'Avalanche', NOW()),
  (gen_random_uuid(), 'LINK', 'Chainlink', NOW()),
  (gen_random_uuid(), 'UNI', 'Uniswap', NOW()),
  (gen_random_uuid(), 'ATOM', 'Cosmos', NOW()),
  (gen_random_uuid(), 'LTC', 'Litecoin', NOW()),
  (gen_random_uuid(), 'ALGO', 'Algorand', NOW()),
  (gen_random_uuid(), 'VET', 'VeChain', NOW())
ON CONFLICT (symbol) DO NOTHING;

-- Insert pricings - simple INSERT with subquery
INSERT INTO pricings (id, token_id, base_price, currency, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'BTC'), '45000.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ETH'), '2800.98765432', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'BNB'), '350.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'SOL'), '120.45678901', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ADA'), '0.52345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'XRP'), '0.62345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'DOGE'), '0.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'DOT'), '7.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'MATIC'), '0.92345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'AVAX'), '38.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'LINK'), '15.62345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'UNI'), '6.52345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ATOM'), '10.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'LTC'), '72.12345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ALGO'), '0.22345678', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'VET'), '0.03345678', 'USD', NOW(), NOW())
ON CONFLICT (token_id) DO UPDATE
SET
  base_price = EXCLUDED.base_price,
  updated_at = NOW();

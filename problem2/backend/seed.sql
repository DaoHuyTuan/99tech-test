-- Seed fake data for tokens and pricings tables

-- Insert tokens from JSON data
INSERT INTO tokens (id, symbol, display_name, created_at)
VALUES
  (gen_random_uuid(), 'USDC', 'USD Coin', NOW()),
  (gen_random_uuid(), 'ETH', 'Ethereum', NOW()),
  (gen_random_uuid(), 'BLUR', 'BLUR', NOW()),
  (gen_random_uuid(), 'bNEO', 'bNEO', NOW()),
  (gen_random_uuid(), 'BUSD', 'Binance USD', NOW()),
  (gen_random_uuid(), 'USD', 'US Dollar', NOW()),
  (gen_random_uuid(), 'GMX', 'GMX', NOW()),
  (gen_random_uuid(), 'STEVMOS', 'STEVMOS', NOW()),
  (gen_random_uuid(), 'LUNA', 'Terra Luna', NOW()),
  (gen_random_uuid(), 'RATOM', 'RATOM', NOW()),
  (gen_random_uuid(), 'STRD', 'STRD', NOW()),
  (gen_random_uuid(), 'EVMOS', 'EVMOS', NOW()),
  (gen_random_uuid(), 'IBCX', 'IBCX', NOW()),
  (gen_random_uuid(), 'IRIS', 'IRIS', NOW()),
  (gen_random_uuid(), 'ampLUNA', 'ampLUNA', NOW()),
  (gen_random_uuid(), 'KUJI', 'KUJI', NOW()),
  (gen_random_uuid(), 'STOSMO', 'STOSMO', NOW()),
  (gen_random_uuid(), 'axlUSDC', 'Axelar USDC', NOW()),
  (gen_random_uuid(), 'ATOM', 'Cosmos', NOW()),
  (gen_random_uuid(), 'STATOM', 'STATOM', NOW()),
  (gen_random_uuid(), 'OSMO', 'Osmosis', NOW()),
  (gen_random_uuid(), 'rSWTH', 'rSWTH', NOW()),
  (gen_random_uuid(), 'STLUNA', 'STLUNA', NOW()),
  (gen_random_uuid(), 'LSI', 'LSI', NOW()),
  (gen_random_uuid(), 'OKB', 'OKB', NOW()),
  (gen_random_uuid(), 'OKT', 'OKT', NOW()),
  (gen_random_uuid(), 'SWTH', 'SWTH', NOW()),
  (gen_random_uuid(), 'USC', 'USC', NOW()),
  (gen_random_uuid(), 'WBTC', 'Wrapped Bitcoin', NOW()),
  (gen_random_uuid(), 'wstETH', 'Wrapped stETH', NOW()),
  (gen_random_uuid(), 'YieldUSD', 'YieldUSD', NOW()),
  (gen_random_uuid(), 'ZIL', 'Zilliqa', NOW())
ON CONFLICT (symbol) DO NOTHING;

-- Insert pricings from JSON data (using latest price for duplicates)
INSERT INTO pricings (id, token_id, base_price, currency, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'BLUR'), '0.20811525423728813', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'bNEO'), '7.1282679', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'BUSD'), '0.9998782611186441', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'USD'), '1', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ETH'), '1645.9337373737374', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'GMX'), '36.345114372881355', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'STEVMOS'), '0.07276706779661017', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'LUNA'), '0.40955638983050846', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'RATOM'), '10.250918915254237', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'STRD'), '0.7386553389830508', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'EVMOS'), '0.06246181355932203', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'IBCX'), '41.26811355932203', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'IRIS'), '0.0177095593220339', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ampLUNA'), '0.49548589830508477', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'KUJI'), '0.675', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'STOSMO'), '0.431318', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'USDC'), '0.9998782611186441', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'axlUSDC'), '0.989832', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ATOM'), '7.186657333333334', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'STATOM'), '8.512162050847458', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'OSMO'), '0.3772974333333333', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'rSWTH'), '0.00408771', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'STLUNA'), '0.44232210169491526', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'LSI'), '67.69661525423729', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'OKB'), '42.97562059322034', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'OKT'), '13.561577966101694', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'SWTH'), '0.004039850455012084', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'USC'), '0.994', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'WBTC'), '26002.82202020202', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'wstETH'), '1872.2579742372882', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'YieldUSD'), '1.0290847966101695', 'USD', NOW(), NOW()),
  (gen_random_uuid(), (SELECT id FROM tokens WHERE symbol = 'ZIL'), '0.01651813559322034', 'USD', NOW(), NOW())
ON CONFLICT (token_id) DO UPDATE
SET
  base_price = EXCLUDED.base_price,
  updated_at = NOW();

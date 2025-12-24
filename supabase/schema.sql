-- Listings table to store MLS data
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_key TEXT UNIQUE NOT NULL,
  listing_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'FL',
  zip TEXT,
  price TEXT NOT NULL,
  price_number NUMERIC NOT NULL,
  beds INTEGER NOT NULL DEFAULT 0,
  baths NUMERIC NOT NULL DEFAULT 0,
  sqft TEXT,
  sqft_number INTEGER DEFAULT 0,
  property_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'For Sale',
  year_built INTEGER,
  lot_size TEXT,
  parking TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  mls_number TEXT NOT NULL,
  listed_date TEXT,
  agent_id TEXT,
  office_name TEXT,
  is_agent_listing BOOLEAN DEFAULT FALSE,
  is_brokerage_listing BOOLEAN DEFAULT FALSE,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync log to track sync operations
CREATE TABLE IF NOT EXISTS sync_log (
  id SERIAL PRIMARY KEY,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  listings_synced INTEGER DEFAULT 0,
  photos_synced INTEGER DEFAULT 0,
  error_message TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price_number);
CREATE INDEX IF NOT EXISTS idx_listings_agent ON listings(is_agent_listing);
CREATE INDEX IF NOT EXISTS idx_listings_brokerage ON listings(is_brokerage_listing);
CREATE INDEX IF NOT EXISTS idx_listings_mls_number ON listings(mls_number);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_synced_at ON listings(synced_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to listings
CREATE POLICY "Allow public read access to listings"
  ON listings FOR SELECT
  USING (true);

-- Policy to allow service role to manage listings
CREATE POLICY "Allow service role to manage listings"
  ON listings FOR ALL
  USING (auth.role() = 'service_role');

-- Policy for sync_log (service role only)
CREATE POLICY "Allow service role to manage sync_log"
  ON sync_log FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anon to read sync_log status
CREATE POLICY "Allow public read access to sync_log"
  ON sync_log FOR SELECT
  USING (true);

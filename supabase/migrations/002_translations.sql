-- Translations cache table
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_lang VARCHAR(10) DEFAULT 'en',
  target_lang VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint to prevent duplicate translations
  UNIQUE(source_text, source_lang, target_lang)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup
ON translations(source_text, target_lang);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access (translations are public)
CREATE POLICY "Allow public read access" ON translations
  FOR SELECT USING (true);

-- Allow service role to insert
CREATE POLICY "Allow service role insert" ON translations
  FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- PIXEL-3.O — Supabase Production Database Setup (NON-DESTRUCTIVE)
-- SAFE TO RUN: Does NOT drop, truncate, or delete existing records.
-- ═══════════════════════════════════════════════════════════════

-- 1. REGISTRATIONS table (Created only if it does not already exist)
CREATE TABLE IF NOT EXISTS registrations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number  BIGINT GENERATED ALWAYS AS IDENTITY,
  registration_code    TEXT UNIQUE,           -- e.g. 'PIXEL-3.O-001'
  full_name            TEXT NOT NULL,
  college_name         TEXT NOT NULL,
  department           TEXT NOT NULL,
  phone                TEXT NOT NULL,
  email                TEXT NOT NULL,
  technical_event      TEXT,
  non_technical_event  TEXT,
  payment_id           TEXT,
  payment_status       TEXT DEFAULT 'Submitted',
  registration_status  TEXT DEFAULT 'Confirmed',
  total_members        INT DEFAULT 1,
  fee_per_head         INT DEFAULT 129,
  total_amount         INT,
  checkmate_interested TEXT,                  -- Comma-separated member indexes e.g. '1,3'
  filmforge_interested TEXT,                  -- Comma-separated member indexes e.g. '1,4'
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Safe non-destructive column additions in case registrations table already existed
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Submitted';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'Confirmed';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS total_members INT DEFAULT 1;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS fee_per_head INT DEFAULT 129;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS total_amount INT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS checkmate_interested TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS filmforge_interested TEXT;

-- 2. TEAM_MEMBERS table (Created only if it does not already exist)
CREATE TABLE IF NOT EXISTS team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL CHECK (event_type IN ('technical', 'non_technical')),
  event_name      TEXT NOT NULL,
  member_number   INT NOT NULL,
  member_name     TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIGGER: auto-generate registration_code = 'PIXEL-3.O-001', '002', etc.
CREATE OR REPLACE FUNCTION set_registration_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.registration_code IS NULL OR NEW.registration_code = '' THEN
    NEW.registration_code := 'PIXEL-3.O-' || LPAD(NEW.registration_number::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_registration_code ON registrations;
CREATE TRIGGER trigger_set_registration_code
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_code();

-- 4. Indexes for faster lookups (safe IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_reg_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_code  ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at);

-- 5. Row Level Security — allow public inserts & admin queries
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members  ENABLE ROW LEVEL SECURITY;

-- Allow public insert (Registration Form)
DROP POLICY IF EXISTS "allow_public_insert_registrations" ON registrations;
CREATE POLICY "allow_public_insert_registrations"
  ON registrations FOR INSERT TO anon WITH CHECK (true);

-- Allow reading registrations
DROP POLICY IF EXISTS "allow_read_registrations" ON registrations;
CREATE POLICY "allow_read_registrations"
  ON registrations FOR SELECT TO anon USING (true);

-- Allow public insert into team_members
DROP POLICY IF EXISTS "allow_public_insert_team_members" ON team_members;
CREATE POLICY "allow_public_insert_team_members"
  ON team_members FOR INSERT TO anon WITH CHECK (true);

-- Allow reading team members
DROP POLICY IF EXISTS "allow_read_team_members" ON team_members;
CREATE POLICY "allow_read_team_members"
  ON team_members FOR SELECT TO anon USING (true);

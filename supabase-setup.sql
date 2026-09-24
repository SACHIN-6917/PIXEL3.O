-- ═══════════════════════════════════════════════════════════════
-- PIXELO 3.O — Supabase Database Setup
-- Run this entire script in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. REGISTRATIONS table
CREATE TABLE IF NOT EXISTS registrations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number BIGINT GENERATED ALWAYS AS IDENTITY,
  registration_code   TEXT UNIQUE,           -- populated by trigger below
  full_name           TEXT NOT NULL,
  college_name        TEXT NOT NULL,
  department          TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT NOT NULL,
  technical_event     TEXT CHECK (technical_event IN ('PaperQuest', 'AI FilmForge', NULL)),
  non_technical_event TEXT CHECK (non_technical_event IN ('Checkmate', 'Mine Relay', NULL)),
  registration_status TEXT DEFAULT 'confirmed',
  created_at          TIMESTAMPTZ DEFAULT NOW(),

  -- At least one event must be selected
  CONSTRAINT at_least_one_event CHECK (
    technical_event IS NOT NULL OR non_technical_event IS NOT NULL
  )
);

-- 2. TEAM_MEMBERS table
CREATE TABLE IF NOT EXISTS team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL CHECK (event_type IN ('technical', 'non_technical')),
  event_name      TEXT NOT NULL,
  member_number   INT NOT NULL,
  member_name     TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRIGGER: auto-generate registration_code = 'PIXELO3.O-001', '002', etc.
CREATE OR REPLACE FUNCTION set_registration_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.registration_code := 'PIXELO3.O-' || LPAD(NEW.registration_number::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_set_registration_code
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_code();

-- 4. Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_reg_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_code  ON registrations(registration_code);

-- 5. Row Level Security — allow public inserts (registration form)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members  ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (registration form)
CREATE POLICY "allow_public_insert_registrations"
  ON registrations FOR INSERT TO anon WITH CHECK (true);

-- Allow reading own registration (by code)
CREATE POLICY "allow_read_own_registration"
  ON registrations FOR SELECT TO anon
  USING (true);  -- or restrict: USING (registration_code = current_setting('app.reg_code', true))

-- Allow INSERT into team_members
CREATE POLICY "allow_public_insert_team_members"
  ON team_members FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_read_team_members"
  ON team_members FOR SELECT TO anon USING (true);

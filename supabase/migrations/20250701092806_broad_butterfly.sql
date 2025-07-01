/*
  # Add realistic tournament and location data

  1. New Data
    - Sample locations for each region (North, South, Central)
    - Sample tournaments (both individual and team tournaments)
    - Realistic tournament details with varied classifications, dates, and statuses
  
  2. Structure
    - Creates locations first, then tournaments that reference those locations
    - Uses proper JSONB format for region_locations field
*/

-- First, ensure the locations table exists
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  region text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Then ensure the tournaments table exists
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  classification text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'Upcoming',
  region_locations jsonb DEFAULT '[]'::jsonb,
  is_team_tournament boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security if not already enabled
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create policies for locations table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow authenticated users to read locations') THEN
    CREATE POLICY "Allow authenticated users to read locations"
      ON locations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow authenticated users to insert locations') THEN
    CREATE POLICY "Allow authenticated users to insert locations"
      ON locations
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow authenticated users to update locations') THEN
    CREATE POLICY "Allow authenticated users to update locations"
      ON locations
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow authenticated users to delete locations') THEN
    CREATE POLICY "Allow authenticated users to delete locations"
      ON locations
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create policies for tournaments table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'tournaments' AND policyname = 'Allow authenticated users to read tournaments') THEN
    CREATE POLICY "Allow authenticated users to read tournaments"
      ON tournaments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'tournaments' AND policyname = 'Allow authenticated users to insert tournaments') THEN
    CREATE POLICY "Allow authenticated users to insert tournaments"
      ON tournaments
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'tournaments' AND policyname = 'Allow authenticated users to update tournaments') THEN
    CREATE POLICY "Allow authenticated users to update tournaments"
      ON tournaments
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'tournaments' AND policyname = 'Allow authenticated users to delete tournaments') THEN
    CREATE POLICY "Allow authenticated users to delete tournaments"
      ON tournaments
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Insert sample locations for each region
INSERT INTO locations (name, address, region, active)
VALUES
  -- North Region
  ('North Tennis Center', '123 North Street, North City', 'North', true),
  ('North Sports Complex', '456 North Avenue, North Town', 'North', true),
  ('North Indoor Arena', '789 North Boulevard, North City', 'North', true),
  ('North Community Courts', '101 North Road, North Village', 'North', true),
  
  -- South Region
  ('South Stadium', '123 South Street, South City', 'South', true),
  ('South Recreation Center', '456 South Avenue, South Town', 'South', true),
  ('South Tennis Academy', '789 South Boulevard, South City', 'South', true),
  ('South Beach Courts', '101 South Road, South Village', 'South', true),
  
  -- Central Region
  ('Central Tennis Club', '123 Central Street, Central City', 'Central', true),
  ('Central Sports Hub', '456 Central Avenue, Central Town', 'Central', true),
  ('Central Olympic Center', '789 Central Boulevard, Central City', 'Central', true),
  ('Central University Courts', '101 Central Road, Central Village', 'Central', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tournament data
INSERT INTO tournaments (name, classification, start_date, end_date, status, region_locations, is_team_tournament)
VALUES
  -- Individual Tournaments
  (
    'Summer Open 2025', 
    'Professional', 
    '2025-06-15', 
    '2025-06-30', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center", "North Sports Complex"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  ),
  (
    'Junior Championship', 
    'Junior', 
    '2025-07-10', 
    '2025-07-20', 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Tennis Club", "Central Sports Hub"]}
    ]'::jsonb,
    false
  ),
  (
    'Regional Masters', 
    'Professional', 
    '2025-05-01', 
    '2025-05-10', 
    'In Progress',
    '[
      {"region": "South", "locations": ["South Stadium", "South Recreation Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Spring Challenge', 
    'Amateur', 
    '2025-04-05', 
    '2025-04-15', 
    'Ended',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'Senior Invitational', 
    'Senior', 
    '2025-08-20', 
    '2025-08-30', 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Sports Hub"]}
    ]'::jsonb,
    false
  ),
  (
    'Winter Classic', 
    'Amateur', 
    '2025-01-15', 
    '2025-01-25', 
    'Ended',
    '[
      {"region": "North", "locations": ["North Indoor Arena"]}
    ]'::jsonb,
    false
  ),
  (
    'National Cup', 
    'Professional', 
    '2025-09-10', 
    '2025-09-25', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Youth Development Series', 
    'Junior', 
    '2025-03-01', 
    '2025-03-15', 
    'Not Active',
    '[
      {"region": "South", "locations": ["South Tennis Academy"]}
    ]'::jsonb,
    false
  ),
  
  -- Team Tournaments
  (
    'Regional Team Championship', 
    'Professional', 
    '2025-07-01', 
    '2025-07-15', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    true
  ),
  (
    'Corporate Team Challenge', 
    'Amateur', 
    '2025-06-01', 
    '2025-06-10', 
    'In Progress',
    '[
      {"region": "Central", "locations": ["Central Sports Hub"]}
    ]'::jsonb,
    true
  ),
  (
    'Junior Team Cup', 
    'Junior', 
    '2025-08-05', 
    '2025-08-15', 
    'Upcoming',
    '[
      {"region": "South", "locations": ["South Tennis Academy"]}
    ]'::jsonb,
    true
  ),
  (
    'Senior Team League', 
    'Senior', 
    '2025-05-15', 
    '2025-06-15', 
    'In Progress',
    '[
      {"region": "North", "locations": ["North Sports Complex"]},
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    true
  ),
  (
    'National Team Tournament', 
    'Professional', 
    '2025-10-01', 
    '2025-10-15', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    true
  ),
  (
    'Winter Team Challenge', 
    'Amateur', 
    '2025-02-10', 
    '2025-02-20', 
    'Ended',
    '[
      {"region": "Central", "locations": ["Central Sports Hub"]}
    ]'::jsonb,
    true
  ),
  (
    'School Teams Championship', 
    'Junior', 
    '2025-04-20', 
    '2025-04-30', 
    'Not Active',
    '[
      {"region": "South", "locations": ["South Stadium", "South Recreation Center"]}
    ]'::jsonb,
    true
  ),
  (
    'International Tennis Cup', 
    'Professional', 
    '2025-11-05', 
    '2025-11-20', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center", "North Sports Complex"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Beach Tennis Tournament', 
    'Amateur', 
    '2025-07-25', 
    '2025-07-30', 
    'Upcoming',
    '[
      {"region": "South", "locations": ["South Beach Courts"]}
    ]'::jsonb,
    false
  ),
  (
    'University Team League', 
    'Amateur', 
    '2025-09-01', 
    '2025-11-30', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Sports Complex"]},
      {"region": "Central", "locations": ["Central University Courts"]}
    ]'::jsonb,
    true
  ),
  (
    'Veterans Tournament', 
    'Senior', 
    '2025-06-10', 
    '2025-06-15', 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'Mixed Doubles Championship', 
    'Professional', 
    '2025-08-01', 
    '2025-08-10', 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  )
ON CONFLICT (id) DO NOTHING;
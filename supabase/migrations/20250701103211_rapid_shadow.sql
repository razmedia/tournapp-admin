/*
  # Tournament and Location Management Schema

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `address` (text, default empty)
      - `region` (text, not null)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
    - `tournaments`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `classification` (text, not null)
      - `start_date` (date, not null)
      - `end_date` (date, not null)
      - `status` (text, default 'Upcoming')
      - `region_locations` (jsonb, default empty array)
      - `is_team_tournament` (boolean, default false)
      - `active` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform CRUD operations

  3. Sample Data
    - Insert sample locations across different regions
    - Insert sample tournaments with various configurations
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  region text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
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

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read locations" ON public.locations;
DROP POLICY IF EXISTS "Allow authenticated users to insert locations" ON public.locations;
DROP POLICY IF EXISTS "Allow authenticated users to update locations" ON public.locations;
DROP POLICY IF EXISTS "Allow authenticated users to delete locations" ON public.locations;

DROP POLICY IF EXISTS "Allow authenticated users to read tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Allow authenticated users to insert tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Allow authenticated users to update tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Allow authenticated users to delete tournaments" ON public.tournaments;

-- Create RLS policies for locations table
CREATE POLICY "Allow authenticated users to read locations"
  ON public.locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert locations"
  ON public.locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update locations"
  ON public.locations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete locations"
  ON public.locations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for tournaments table
CREATE POLICY "Allow authenticated users to read tournaments"
  ON public.tournaments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert tournaments"
  ON public.tournaments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tournaments"
  ON public.tournaments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete tournaments"
  ON public.tournaments
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample locations (only if they don't already exist)
INSERT INTO public.locations (name, address, region, active) 
SELECT * FROM (VALUES
  ('North Tennis Center', '123 North Street, North City', 'North', true),
  ('North Sports Complex', '456 North Avenue, North Town', 'North', true),
  ('North Indoor Arena', '789 North Boulevard, North City', 'North', true),
  ('North Community Courts', '101 North Road, North Village', 'North', true),
  ('South Stadium', '123 South Street, South City', 'South', true),
  ('South Recreation Center', '456 South Avenue, South Town', 'South', true),
  ('South Tennis Academy', '789 South Boulevard, South City', 'South', true),
  ('South Beach Courts', '101 South Road, South Village', 'South', true),
  ('Central Tennis Club', '123 Central Street, Central City', 'Central', true),
  ('Central Sports Hub', '456 Central Avenue, Central Town', 'Central', true),
  ('Central Olympic Center', '789 Central Boulevard, Central City', 'Central', true),
  ('Central University Courts', '101 Central Road, Central Village', 'Central', true),
  ('East Tennis Complex', '123 East Street, East City', 'East', true),
  ('East Sports Arena', '456 East Avenue, East Town', 'East', true),
  ('West Tennis Club', '789 West Boulevard, West City', 'West', true),
  ('West Recreation Center', '101 West Road, West Village', 'West', true),
  ('Northeast Tennis Academy', '123 Northeast Street, Northeast City', 'Northeast', true),
  ('Northwest Sports Complex', '456 Northwest Avenue, Northwest Town', 'Northwest', true),
  ('Southeast Tennis Center', '789 Southeast Boulevard, Southeast City', 'Southeast', true),
  ('Southwest Sports Hub', '101 Southwest Road, Southwest Village', 'Southwest', true)
) AS v(name, address, region, active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.locations WHERE name = v.name
);

-- Insert sample tournaments (only if they don't already exist)
INSERT INTO public.tournaments (name, classification, start_date, end_date, status, region_locations, is_team_tournament)
SELECT * FROM (VALUES
  (
    'Summer Open 2025', 
    'Professional', 
    '2025-06-15'::date, 
    '2025-06-30'::date, 
    'Upcoming',
    '[{"region": "North", "locations": ["North Tennis Center", "North Sports Complex"]}, {"region": "South", "locations": ["South Stadium"]}]'::jsonb,
    false
  ),
  (
    'Junior Championship', 
    'Junior', 
    '2025-07-10'::date, 
    '2025-07-20'::date, 
    'Upcoming',
    '[{"region": "Central", "locations": ["Central Tennis Club", "Central Sports Hub"]}]'::jsonb,
    false
  ),
  (
    'Regional Team Championship', 
    'Professional', 
    '2025-07-01'::date, 
    '2025-07-15'::date, 
    'Upcoming',
    '[{"region": "North", "locations": ["North Tennis Center"]}, {"region": "South", "locations": ["South Stadium"]}]'::jsonb,
    true
  ),
  (
    'Corporate Team Challenge', 
    'Amateur', 
    '2025-06-01'::date, 
    '2025-06-10'::date, 
    'In Progress',
    '[{"region": "Central", "locations": ["Central Sports Hub"]}]'::jsonb,
    true
  ),
  (
    'Winter League Championship', 
    'Senior', 
    '2025-08-01'::date, 
    '2025-08-15'::date, 
    'Upcoming',
    '[{"region": "East", "locations": ["East Tennis Complex"]}, {"region": "West", "locations": ["West Tennis Club"]}]'::jsonb,
    false
  ),
  (
    'National Youth Tournament', 
    'Junior', 
    '2025-09-01'::date, 
    '2025-09-10'::date, 
    'Upcoming',
    '[{"region": "Northeast", "locations": ["Northeast Tennis Academy"]}, {"region": "Southeast", "locations": ["Southeast Tennis Center"]}]'::jsonb,
    false
  ),
  (
    'Regional Team Cup', 
    'Amateur', 
    '2025-05-15'::date, 
    '2025-05-25'::date, 
    'Ended',
    '[{"region": "Northwest", "locations": ["Northwest Sports Complex"]}, {"region": "Southwest", "locations": ["Southwest Sports Hub"]}]'::jsonb,
    true
  )
) AS v(name, classification, start_date, end_date, status, region_locations, is_team_tournament)
WHERE NOT EXISTS (
  SELECT 1 FROM public.tournaments WHERE name = v.name
);
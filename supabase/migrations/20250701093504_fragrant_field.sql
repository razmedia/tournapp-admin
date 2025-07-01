/*
  # Database Schema Setup for Tournament Management

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `address` (text, default empty)
      - `region` (text, required)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
    - `tournaments`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `classification` (text, required)
      - `start_date` (date, required)
      - `end_date` (date, required)
      - `status` (text, default 'Upcoming')
      - `region_locations` (jsonb, default empty array)
      - `is_team_tournament` (boolean, default false)
      - `active` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform CRUD operations

  3. Sample Data
    - Insert sample locations for each region
    - Insert sample tournaments with various statuses
*/

-- Create locations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  region text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create tournaments table if it doesn't exist
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

-- Create RLS policies for locations table (with IF NOT EXISTS check)
DO $$
BEGIN
  -- Locations policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'locations' 
    AND policyname = 'Allow authenticated users to read locations'
  ) THEN
    CREATE POLICY "Allow authenticated users to read locations"
      ON public.locations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'locations' 
    AND policyname = 'Allow authenticated users to insert locations'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert locations"
      ON public.locations
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'locations' 
    AND policyname = 'Allow authenticated users to update locations'
  ) THEN
    CREATE POLICY "Allow authenticated users to update locations"
      ON public.locations
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'locations' 
    AND policyname = 'Allow authenticated users to delete locations'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete locations"
      ON public.locations
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;

  -- Tournaments policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tournaments' 
    AND policyname = 'Allow authenticated users to read tournaments'
  ) THEN
    CREATE POLICY "Allow authenticated users to read tournaments"
      ON public.tournaments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tournaments' 
    AND policyname = 'Allow authenticated users to insert tournaments'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert tournaments"
      ON public.tournaments
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tournaments' 
    AND policyname = 'Allow authenticated users to update tournaments'
  ) THEN
    CREATE POLICY "Allow authenticated users to update tournaments"
      ON public.tournaments
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tournaments' 
    AND policyname = 'Allow authenticated users to delete tournaments'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete tournaments"
      ON public.tournaments
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Insert sample locations only if none exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.locations LIMIT 1) THEN
    INSERT INTO public.locations (name, address, region, active) VALUES
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
      ('Central University Courts', '101 Central Road, Central Village', 'Central', true);
  END IF;
END
$$;

-- Insert sample tournaments only if none exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.tournaments LIMIT 1) THEN
    INSERT INTO public.tournaments (name, classification, start_date, end_date, status, region_locations, is_team_tournament) VALUES
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
      );
  END IF;
END
$$;
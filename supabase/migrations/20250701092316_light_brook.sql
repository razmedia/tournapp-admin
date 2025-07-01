/*
  # Create tournaments and locations tables

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `address` (text, optional)
      - `region` (text, required)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
    - `tournaments`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `classification` (text, required)
      - `start_date` (date, required)
      - `end_date` (date, required)
      - `status` (text, required)
      - `region_locations` (jsonb, stores array of region/location objects)
      - `is_team_tournament` (boolean, default false)
      - `active` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read and manage data
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  region text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create tournaments table
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

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create policies for locations table
CREATE POLICY "Allow authenticated users to read locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete locations"
  ON locations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for tournaments table
CREATE POLICY "Allow authenticated users to read tournaments"
  ON tournaments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert tournaments"
  ON tournaments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tournaments"
  ON tournaments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete tournaments"
  ON tournaments
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert some sample locations for each region
INSERT INTO locations (name, address, region) VALUES
  ('North Arena', '123 North Street, North City', 'North'),
  ('North Sports Complex', '456 North Avenue, North Town', 'North'),
  ('South Stadium', '789 South Boulevard, South City', 'South'),
  ('South Recreation Center', '321 South Road, South Village', 'South'),
  ('Central Court', '654 Central Plaza, Central City', 'Central'),
  ('Central Sports Hub', '987 Central Drive, Central Town', 'Central')
ON CONFLICT DO NOTHING;
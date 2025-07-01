/*
  # Add sample tournament data
  
  1. New Data
    - Adds 15 realistic tournament entries with varied:
      - Names, classifications, dates, statuses
      - Region and location combinations
      - Both individual and team tournaments
  
  2. Data Structure
    - Follows the existing tournament schema
    - Uses proper JSONB format for region_locations
    - Includes realistic date ranges
*/

-- Add sample tournament data
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
      {"region": "North", "locations": ["North Arena", "North Sports Complex"]},
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
      {"region": "Central", "locations": ["Central Court", "Central Sports Hub"]}
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
      {"region": "North", "locations": ["North Arena"]},
      {"region": "Central", "locations": ["Central Court"]}
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
      {"region": "North", "locations": ["North Sports Complex"]}
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
      {"region": "North", "locations": ["North Arena"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Court"]}
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
      {"region": "South", "locations": ["South Recreation Center"]}
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
      {"region": "North", "locations": ["North Arena"]},
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
      {"region": "South", "locations": ["South Recreation Center"]}
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
      {"region": "Central", "locations": ["Central Court"]}
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
      {"region": "North", "locations": ["North Arena"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Court"]}
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
  )
ON CONFLICT (id) DO NOTHING;
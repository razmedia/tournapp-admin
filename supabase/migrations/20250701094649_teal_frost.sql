/*
  # Tournament Data Migration
  
  1. New Data
    - Comprehensive tournament data with realistic details
    - Various tournament types, classifications, and statuses
    - Regional distribution across multiple locations
  
  2. Structure
    - Individual and team tournaments
    - Different tournament statuses (Upcoming, In Progress, Ended, Not Active)
    - Multiple regions and locations
*/

-- Insert comprehensive tournament data
INSERT INTO tournaments (name, classification, start_date, end_date, status, region_locations, is_team_tournament)
VALUES
  -- Individual Tournaments - Professional
  (
    'Grand Slam Open 2025', 
    'Professional', 
    '2025-06-15'::date, 
    '2025-06-30'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center", "North Sports Complex"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  ),
  (
    'International Masters Series', 
    'Professional', 
    '2025-08-10'::date, 
    '2025-08-25'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Olympic Center"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  ),
  (
    'National Championship', 
    'Professional', 
    '2025-05-01'::date, 
    '2025-05-15'::date, 
    'In Progress',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Premier Tennis Classic', 
    'Professional', 
    '2025-03-10'::date, 
    '2025-03-25'::date, 
    'Ended',
    '[
      {"region": "South", "locations": ["South Stadium", "South Tennis Academy"]}
    ]'::jsonb,
    false
  ),
  
  -- Individual Tournaments - Amateur
  (
    'Regional Amateur Open', 
    'Amateur', 
    '2025-07-05'::date, 
    '2025-07-15'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Community Courts"]},
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'City Tennis Challenge', 
    'Amateur', 
    '2025-04-20'::date, 
    '2025-04-30'::date, 
    'Ended',
    '[
      {"region": "South", "locations": ["South Recreation Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Summer Club Tournament', 
    'Amateur', 
    '2025-06-01'::date, 
    '2025-06-10'::date, 
    'In Progress',
    '[
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'Recreational Tennis Series', 
    'Amateur', 
    '2025-09-05'::date, 
    '2025-09-20'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Community Courts"]},
      {"region": "South", "locations": ["South Beach Courts"]}
    ]'::jsonb,
    false
  ),
  
  -- Individual Tournaments - Junior
  (
    'Junior Elite Championship', 
    'Junior', 
    '2025-07-10'::date, 
    '2025-07-20'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Tennis Club", "Central Sports Hub"]}
    ]'::jsonb,
    false
  ),
  (
    'Youth Development Series', 
    'Junior', 
    '2025-05-15'::date, 
    '2025-06-15'::date, 
    'In Progress',
    '[
      {"region": "South", "locations": ["South Tennis Academy"]},
      {"region": "North", "locations": ["North Sports Complex"]}
    ]'::jsonb,
    false
  ),
  (
    'Junior Talent Cup', 
    'Junior', 
    '2025-08-01'::date, 
    '2025-08-10'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]}
    ]'::jsonb,
    false
  ),
  (
    'School Championship', 
    'Junior', 
    '2025-04-10'::date, 
    '2025-04-20'::date, 
    'Ended',
    '[
      {"region": "Central", "locations": ["Central University Courts"]}
    ]'::jsonb,
    false
  ),
  
  -- Individual Tournaments - Senior
  (
    'Senior Masters Tournament', 
    'Senior', 
    '2025-06-20'::date, 
    '2025-06-30'::date, 
    'Upcoming',
    '[
      {"region": "South", "locations": ["South Recreation Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Veterans Championship', 
    'Senior', 
    '2025-09-15'::date, 
    '2025-09-25'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'Senior Classic', 
    'Senior', 
    '2025-05-05'::date, 
    '2025-05-15'::date, 
    'In Progress',
    '[
      {"region": "Central", "locations": ["Central Sports Hub"]}
    ]'::jsonb,
    false
  ),
  (
    'Legends Cup', 
    'Senior', 
    '2025-03-01'::date, 
    '2025-03-10'::date, 
    'Ended',
    '[
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  ),
  
  -- Team Tournaments - Professional
  (
    'Elite Team Championship', 
    'Professional', 
    '2025-07-01'::date, 
    '2025-07-20'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    true
  ),
  (
    'National Team Cup', 
    'Professional', 
    '2025-10-01'::date, 
    '2025-10-15'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    true
  ),
  (
    'Professional Team League', 
    'Professional', 
    '2025-04-01'::date, 
    '2025-06-30'::date, 
    'In Progress',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    true
  ),
  (
    'International Team Challenge', 
    'Professional', 
    '2025-02-15'::date, 
    '2025-03-01'::date, 
    'Ended',
    '[
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    true
  ),
  
  -- Team Tournaments - Amateur
  (
    'Corporate Team Challenge', 
    'Amateur', 
    '2025-06-01'::date, 
    '2025-06-15'::date, 
    'In Progress',
    '[
      {"region": "Central", "locations": ["Central Sports Hub"]}
    ]'::jsonb,
    true
  ),
  (
    'Community Team Tournament', 
    'Amateur', 
    '2025-08-10'::date, 
    '2025-08-25'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Community Courts"]},
      {"region": "South", "locations": ["South Recreation Center"]}
    ]'::jsonb,
    true
  ),
  (
    'Club Team Championship', 
    'Amateur', 
    '2025-05-10'::date, 
    '2025-05-25'::date, 
    'In Progress',
    '[
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    true
  ),
  (
    'Recreational Team League', 
    'Amateur', 
    '2025-03-15'::date, 
    '2025-04-15'::date, 
    'Ended',
    '[
      {"region": "North", "locations": ["North Community Courts"]},
      {"region": "South", "locations": ["South Beach Courts"]}
    ]'::jsonb,
    true
  ),
  
  -- Team Tournaments - Junior
  (
    'Junior Team Cup', 
    'Junior', 
    '2025-07-15'::date, 
    '2025-07-30'::date, 
    'Upcoming',
    '[
      {"region": "South", "locations": ["South Tennis Academy"]}
    ]'::jsonb,
    true
  ),
  (
    'School Teams Championship', 
    'Junior', 
    '2025-09-10'::date, 
    '2025-09-25'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central University Courts"]}
    ]'::jsonb,
    true
  ),
  (
    'Youth Team Development League', 
    'Junior', 
    '2025-05-01'::date, 
    '2025-06-15'::date, 
    'In Progress',
    '[
      {"region": "North", "locations": ["North Sports Complex"]},
      {"region": "South", "locations": ["South Tennis Academy"]}
    ]'::jsonb,
    true
  ),
  (
    'Junior Club Team Tournament', 
    'Junior', 
    '2025-03-05'::date, 
    '2025-03-20'::date, 
    'Ended',
    '[
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    true
  ),
  
  -- Team Tournaments - Senior
  (
    'Senior Team League', 
    'Senior', 
    '2025-06-15'::date, 
    '2025-07-15'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    true
  ),
  (
    'Veterans Team Cup', 
    'Senior', 
    '2025-08-15'::date, 
    '2025-08-30'::date, 
    'Upcoming',
    '[
      {"region": "South", "locations": ["South Recreation Center"]}
    ]'::jsonb,
    true
  ),
  (
    'Senior Club Team Championship', 
    'Senior', 
    '2025-04-15'::date, 
    '2025-04-30'::date, 
    'Ended',
    '[
      {"region": "Central", "locations": ["Central Sports Hub"]}
    ]'::jsonb,
    true
  ),
  (
    'Legends Team Tournament', 
    'Senior', 
    '2025-05-20'::date, 
    '2025-06-05'::date, 
    'In Progress',
    '[
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    true
  ),
  
  -- Special Tournaments
  (
    'Mixed Doubles Championship', 
    'Professional', 
    '2025-09-01'::date, 
    '2025-09-10'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Olympic Center"]}
    ]'::jsonb,
    false
  ),
  (
    'Charity Tennis Tournament', 
    'Amateur', 
    '2025-07-25'::date, 
    '2025-07-30'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]},
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'Beach Tennis Championship', 
    'Amateur', 
    '2025-08-05'::date, 
    '2025-08-10'::date, 
    'Upcoming',
    '[
      {"region": "South", "locations": ["South Beach Courts"]}
    ]'::jsonb,
    false
  ),
  (
    'Indoor Winter Tournament', 
    'Professional', 
    '2025-01-10'::date, 
    '2025-01-20'::date, 
    'Ended',
    '[
      {"region": "North", "locations": ["North Indoor Arena"]}
    ]'::jsonb,
    false
  ),
  (
    'University Championship', 
    'Amateur', 
    '2025-10-15'::date, 
    '2025-10-30'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central University Courts"]}
    ]'::jsonb,
    true
  ),
  (
    'Night Tennis Series', 
    'Professional', 
    '2025-07-20'::date, 
    '2025-07-25'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  ),
  (
    'Family Doubles Tournament', 
    'Amateur', 
    '2025-06-25'::date, 
    '2025-06-30'::date, 
    'Upcoming',
    '[
      {"region": "Central", "locations": ["Central Tennis Club"]}
    ]'::jsonb,
    false
  ),
  (
    'Wheelchair Tennis Open', 
    'Professional', 
    '2025-09-20'::date, 
    '2025-09-30'::date, 
    'Upcoming',
    '[
      {"region": "North", "locations": ["North Tennis Center"]},
      {"region": "South", "locations": ["South Stadium"]}
    ]'::jsonb,
    false
  )
ON CONFLICT (id) DO NOTHING;
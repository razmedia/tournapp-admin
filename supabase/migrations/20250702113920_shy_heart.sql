-- Create a temporary function to verify connection
DO $$
BEGIN
  -- This is just a simple check to verify the connection is working
  RAISE NOTICE 'Connection to Supabase database is working properly';
END
$$;

-- The migration is successful if this point is reached
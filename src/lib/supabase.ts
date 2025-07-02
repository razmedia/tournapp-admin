import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) && 
  supabaseAnonKey.length > 0;

if (!hasValidCredentials) {
  console.error('Missing or invalid Supabase environment variables. Please check your .env file or environment configuration.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Create a dummy client with placeholder values if credentials are missing
// This prevents the URL constructor error while allowing the app to load
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

export const supabase = createClient(
  hasValidCredentials ? supabaseUrl : fallbackUrl,
  hasValidCredentials ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => hasValidCredentials;

// Helper function to check connection status
export const checkSupabaseConnection = async () => {
  if (!hasValidCredentials) {
    return {
      connected: false,
      count: null,
      error: 'Supabase credentials are not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    };
  }

  try {
    const { count, error } = await supabase
      .from('locations')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    
    return {
      connected: true,
      count,
      error: null
    };
  } catch (error: any) {
    console.error('Supabase connection error:', error);
    return {
      connected: false,
      count: null,
      error: error.message || 'Unknown error occurred'
    };
  }
};
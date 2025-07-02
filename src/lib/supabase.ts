import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or environment configuration.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper function to check connection status
export const checkSupabaseConnection = async () => {
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
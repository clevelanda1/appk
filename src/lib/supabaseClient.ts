import { createClient } from '@supabase/supabase-js';

// Get environment variables with hardcoded fallbacks for production
// Important: Replace these with YOUR actual Supabase values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jeqdkscpxmeemmgrojr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcWRrc2NweG1lZW1tZ3JvanIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDYyNjk1NCwiZXhwIjoyMDE2MjAyOTU0fQ.eyJhbGciOiJJIUzI1NiIsInR5cCI6IkpXVCJ9';

// Debug logging - helpful for troubleshooting
console.log('Supabase initialization:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  environment: import.meta.env.MODE || 'unknown'
});

// Create Supabase client with retries and timeouts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'applepay-prank-auth-token'
  },
  global: {
    headers: { 'x-application-name': 'apple-pay-prank' }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add connection test function
export const testSupabaseConnection = async () => {
  try {
    // Simple connectivity test
    await fetch(`${supabaseUrl}/auth/v1/`, {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      }
    });
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};

// Run test on load
testSupabaseConnection();

// Add auth state change logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state change:', event);
  if (event === 'SIGNED_IN' && session?.user) {
    console.log('User signed in successfully');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Auth token refreshed');
  }
});
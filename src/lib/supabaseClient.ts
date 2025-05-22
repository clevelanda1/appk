// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Use environment variables with hardcoded fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ieqdkscpxmeemmgrrojr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcWRrc2NweG1lZW1tZ3Jyb2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0Njk1MjIsImV4cCI6MjA2MzA0NTUyMn0.RwM1EqZ0sPRdKQsSnNRw9m9HTtaXNuL4z6xs9Fs6Png';

// Debug logging to verify correct values are being used
console.log('=== SUPABASE CLIENT INITIALIZATION ===');
console.log('Environment URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Fallback URL:', 'https://ieqdkscpxmeemmgrrojr.supabase.co');
console.log('Final URL being used:', supabaseUrl);
console.log('Has anon key:', !!supabaseAnonKey);
console.log('Environment mode:', import.meta.env.MODE);
console.log('Current hostname:', window.location.hostname);

// Validate the URL format
if (!supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
} else {
  console.log('✅ Supabase URL format is valid');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'apple-pay-prank-auth'
  },
  global: {
    headers: {
      'x-application-name': 'apple-pay-prank'
    }
  }
});

// Test function to verify connectivity (lightweight version)
export const testSupabaseConnection = async () => {
  console.log('=== TESTING SUPABASE CONNECTION ===');
  
  try {
    // Only test Supabase client session (skip direct fetch tests that may have CORS issues)
    const { data, error } = await supabase.auth.getSession();
    if (error && !error.message.includes('session_not_found')) {
      console.log('⚠️ Auth session test returned error:', error.message);
      return false;
    } else {
      console.log('✅ Supabase client is working correctly');
      return true;
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};

// Run lightweight connection test
testSupabaseConnection();

// Log auth state changes for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state change:', event);
  if (session) {
    console.log('👤 User:', session.user.email);
  }
});
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (!mounted) return;
        
        if (error) {
          console.warn('Session check error:', error.message);
          // Don't sign out on error, just proceed without session
          setUser(null);
          setIsPremium(false);
          setLoading(false);
          setSessionChecked(true);
          return;
        }

        if (session?.user) {
          console.log('Existing session found, auto-logging in user:', session.user.email);
          setUser(session.user);
          
          // Check premium status in background
          checkPremiumStatus(session.user.id).catch(err => {
            console.warn('Premium status check failed:', err);
            setIsPremium(false);
          });
          
          localStorage.setItem('lastLoginCheck', new Date().toISOString());
        } else {
          console.log('No existing session found');
          setUser(null);
          setIsPremium(false);
        }
        
      } catch (error) {
        console.warn('Auth initialization failed:', error);
        if (mounted) {
          setUser(null);
          setIsPremium(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'no user');
      
      if (!mounted) return;

      // Always update loading state
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(false);
        setSessionChecked(true);
      }

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user);
            localStorage.setItem('lastLoginTime', new Date().toISOString());
            // Check premium status without blocking
            checkPremiumStatus(session.user.id).catch(console.warn);
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          setIsPremium(false);
          localStorage.removeItem('lastLoginTime');
          localStorage.removeItem('lastLoginCheck');
          break;
          
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user);
            checkPremiumStatus(session.user.id).catch(console.warn);
          }
          break;
          
        default:
          setUser(session?.user ?? null);
          if (session?.user) {
            checkPremiumStatus(session.user.id).catch(console.warn);
          } else {
            setIsPremium(false);
          }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Simplified session refresh - only for PWA
  useEffect(() => {
    if (!user || !sessionChecked) return;

    // Only run periodic checks for PWA or if explicitly enabled
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone || 
                  document.referrer.includes('android-app://');
    
    if (!isPWA) return; // Skip for regular web

    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && user) {
          console.log('Session expired, signing out user');
          await signOut();
        }
      } catch (error) {
        console.warn('Session check error:', error);
      }
    }, 10 * 60 * 1000); // Check every 10 minutes instead of 5

    return () => clearInterval(refreshInterval);
  }, [user, sessionChecked]);

  // Simplified visibility change handler
  useEffect(() => {
    if (!user) return;

    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone;
    
    if (!isPWA) return; // Only for PWA

    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('PWA became visible, checking session...');
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.log('Session invalid on app focus, signing out');
            await signOut();
          }
        } catch (error) {
          console.warn('Session check on visibility change failed:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const checkPremiumStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsPremium(false);
      return;
    }

    try {
      console.log('Checking premium status for user:', userId);
      
      // Check if user has any completed orders
      const { data: orders, error } = await supabase
        .from('stripe_orders')
        .select('status')
        .eq('status', 'completed')
        .not('payment_status', 'eq', 'unpaid');

      if (error) throw error;

      // User is premium if they have at least one completed order
      const premium = orders && orders.length > 0;
      setIsPremium(premium);
      
      console.log('Premium status:', premium);
      
      // Store premium status with timestamp
      localStorage.setItem('premiumStatus', JSON.stringify({
        isPremium: premium,
        checkedAt: new Date().toISOString(),
        userId
      }));
      
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error, data: null };
      }

      if (data.user) {
        console.log('Sign in successful for:', data.user.email);
        
        // Check premium status immediately after sign in
        await checkPremiumStatus(data.user.id);
        
        // Store successful login
        localStorage.setItem('lastSuccessfulLogin', new Date().toISOString());
      }
      
      return { error: null, data };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign up error:', error);
      } else {
        console.log('Sign up successful for:', email);
      }
      
      return { error, data };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error, data: null };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/pricing`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
      } else {
        console.log('Google sign in initiated');
      }
      
      return { error };
    } catch (error) {
      console.error('Google sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear state immediately regardless of API response
      setUser(null);
      setIsPremium(false);
      
      // Clear all related localStorage items
      localStorage.removeItem('lastSelectedContact');
      localStorage.removeItem('bankName');
      localStorage.removeItem('cardLastFour');
      localStorage.removeItem('lastLoginTime');
      localStorage.removeItem('lastLoginCheck');
      localStorage.removeItem('lastSuccessfulLogin');
      localStorage.removeItem('premiumStatus');
      
      console.log('User signed out and localStorage cleared');
      
      return { error };
    } catch (error) {
      console.error('Sign out exception:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setIsPremium(false);
      return { error };
    }
  };

  // Helper function to check if user session is fresh
  const isSessionFresh = () => {
    const lastLogin = localStorage.getItem('lastLoginTime');
    if (!lastLogin) return false;
    
    const loginTime = new Date(lastLogin);
    const now = new Date();
    const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    
    // Consider session fresh if login was within last 24 hours
    return hoursSinceLogin < 24;
  };

  return {
    user,
    loading,
    isPremium,
    sessionChecked,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isSessionFresh
  };
}
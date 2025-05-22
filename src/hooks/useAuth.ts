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
    let initTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Add timeout protection
        const timeoutPromise = new Promise((_, reject) => {
          initTimeout = setTimeout(() => {
            reject(new Error('Auth initialization timeout'));
          }, 8000); // 8 second timeout
        });

        const sessionPromise = supabase.auth.getSession();
        
        // Race between session check and timeout
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        // Clear timeout if we got here
        if (initTimeout) clearTimeout(initTimeout);
        
        const { data: { session }, error } = result as any;
        
        if (!mounted) return;

        if (error) {
          console.warn('Session check error (non-fatal):', error.message);
          // Don't block - just proceed without session
          setUser(null);
          setIsPremium(false);
        } else if (session?.user) {
          console.log('Existing session found:', session.user.email);
          setUser(session.user);
          
          // Check premium status in background (non-blocking)
          checkPremiumStatus(session.user.id).catch(err => {
            console.warn('Premium check failed (non-fatal):', err);
            setIsPremium(false);
          });
          
          localStorage.setItem('lastLoginCheck', new Date().toISOString());
        } else {
          console.log('No existing session');
          setUser(null);
          setIsPremium(false);
        }
        
      } catch (error) {
        console.warn('Auth initialization failed (non-fatal):', error);
        if (mounted) {
          setUser(null);
          setIsPremium(false);
        }
      } finally {
        if (mounted) {
          console.log('Auth initialization complete');
          setLoading(false);
          setSessionChecked(true);
        }
        if (initTimeout) clearTimeout(initTimeout);
      }
    };

    // Force completion after 10 seconds regardless
    const forceComplete = setTimeout(() => {
      if (mounted && (loading || !sessionChecked)) {
        console.warn('Force completing auth initialization due to timeout');
        setLoading(false);
        setSessionChecked(true);
        setUser(null);
        setIsPremium(false);
      }
    }, 10000);

    // Initialize auth
    initializeAuth();

    // Listen for auth state changes (simplified)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      
      if (!mounted) return;

      // Ensure loading states are cleared
      setLoading(false);
      setSessionChecked(true);

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('User signed in:', session.user.email);
            setUser(session.user);
            localStorage.setItem('lastLoginTime', new Date().toISOString());
            
            // Check premium status (non-blocking)
            checkPremiumStatus(session.user.id).catch(err => {
              console.warn('Premium check on sign in failed:', err);
              setIsPremium(false);
            });
          }
          break;
          
        case 'SIGNED_OUT':
          console.log('User signed out');
          setUser(null);
          setIsPremium(false);
          localStorage.removeItem('lastLoginTime');
          localStorage.removeItem('lastLoginCheck');
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          if (session?.user) {
            setUser(session.user);
            checkPremiumStatus(session.user.id).catch(console.warn);
          }
          break;
          
        default:
          // Handle any other auth events
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
      if (initTimeout) clearTimeout(initTimeout);
      clearTimeout(forceComplete);
    };
  }, []);

  // Simplified session refresh - only for PWA
  useEffect(() => {
    if (!user || !sessionChecked) return;

    // Detect if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone || 
                  document.referrer.includes('android-app://');
    
    // Only do periodic checks for PWA
    if (!isPWA) {
      console.log('Web browser detected - skipping periodic session checks');
      return;
    }

    console.log('PWA detected - enabling session monitoring');
    
    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && user) {
          console.log('PWA: Session expired, signing out');
          await signOut();
        }
      } catch (error) {
        console.warn('PWA session check failed:', error);
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [user, sessionChecked]);

  const checkPremiumStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsPremium(false);
      return;
    }

    try {
      console.log('Checking premium status...');
      
      // Add timeout to premium check
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Premium check timeout')), 5000);
      });

      const queryPromise = supabase
        .from('stripe_orders')
        .select('status')
        .eq('status', 'completed')
        .not('payment_status', 'eq', 'unpaid');

      const { data: orders, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) throw error;

      const premium = orders && orders.length > 0;
      setIsPremium(premium);
      console.log('Premium status:', premium);
      
    } catch (error) {
      console.warn('Premium status check failed:', error);
      setIsPremium(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error, data: null };
      }

      console.log('Sign in successful');
      return { error: null, data };
      
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      return { error, data };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error, data: null };
    }
  };

  const signInWithGoogle = async () => {
    try {      
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
      
      return { error };
    } catch (error) {
      console.error('Google sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      
      const { error } = await supabase.auth.signOut();
      
      // Clear state immediately
      setUser(null);
      setIsPremium(false);
      
      // Clear localStorage
      localStorage.removeItem('lastSelectedContact');
      localStorage.removeItem('bankName');
      localStorage.removeItem('cardLastFour');
      localStorage.removeItem('lastLoginTime');
      localStorage.removeItem('lastLoginCheck');
      localStorage.removeItem('lastSuccessfulLogin');
      localStorage.removeItem('premiumStatus');
      
      return { error };
    } catch (error) {
      console.error('Sign out exception:', error);
      // Clear state anyway
      setUser(null);
      setIsPremium(false);
      return { error };
    }
  };

  return {
    user,
    loading,
    isPremium,
    sessionChecked,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };
}
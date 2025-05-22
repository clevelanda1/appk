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
    let forceCompleteTimeout: NodeJS.Timeout;

    console.log('useAuth: Starting initialization...');

    // CRITICAL: Force complete after 5 seconds no matter what
    forceCompleteTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('FORCE COMPLETING AUTH - preventing infinite loop');
        setLoading(false);
        setSessionChecked(true);
        // Don't change user state here - let it be whatever it is
      }
    }, 5000); // Reduced to 5 seconds

    const initializeAuth = async () => {
      try {
        console.log('useAuth: Getting session...');
        
        // Much shorter timeout - 3 seconds max
        const timeoutPromise = new Promise((_, reject) => {
          initTimeout = setTimeout(() => {
            reject(new Error('Session check timeout after 3s'));
          }, 3000);
        });

        const sessionPromise = supabase.auth.getSession();
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (initTimeout) clearTimeout(initTimeout);
        
        const { data: { session }, error } = result as any;
        
        if (!mounted) return;

        if (error) {
          console.warn('Session error:', error.message);
          setUser(null);
          setIsPremium(false);
        } else if (session?.user) {
          console.log('Found session for:', session.user.email);
          setUser(session.user);
          
          // Premium check in background - don't await
          checkPremiumStatus(session.user.id);
        } else {
          console.log('No session found');
          setUser(null);
          setIsPremium(false);
        }
        
      } catch (error) {
        console.warn('Auth init failed:', error);
        if (mounted) {
          setUser(null);
          setIsPremium(false);
        }
      } finally {
        if (mounted) {
          console.log('useAuth: Initialization complete');
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Simplified auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth event:', event);
      
      // Always ensure loading is false after any auth event
      setLoading(false);
      setSessionChecked(true);

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user);
            checkPremiumStatus(session.user.id);
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          setIsPremium(false);
          break;
          
        default:
          setUser(session?.user ?? null);
          if (session?.user) {
            checkPremiumStatus(session.user.id);
          } else {
            setIsPremium(false);
          }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (initTimeout) clearTimeout(initTimeout);
      if (forceCompleteTimeout) clearTimeout(forceCompleteTimeout);
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
      
      // Short timeout for premium check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const { data: orders, error } = await supabase
        .from('stripe_orders')
        .select('status')
        .eq('status', 'completed')
        .not('payment_status', 'eq', 'unpaid')
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) throw error;

      const premium = orders && orders.length > 0;
      setIsPremium(premium);
      console.log('Premium status:', premium);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Premium check timed out');
      } else {
        console.warn('Premium check failed:', error);
      }
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
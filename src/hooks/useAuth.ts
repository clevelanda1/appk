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
    
    const initAuth = async () => {
      console.log('🔄 Starting auth check...');
      
      try {
        // Simple session check with short timeout
        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 4000)
          )
        ]) as any;

        if (!mounted) return;

        if (session?.user) {
          console.log('✅ Found session:', session.user.email);
          setUser(session.user);
          
          // Check premium in background - don't wait for it
          checkPremium(session.user.id);
        } else {
          console.log('❌ No session found');
          setUser(null);
          setIsPremium(false);
        }

      } catch (error) {
        console.warn('⚠️ Auth check failed:', error);
        if (mounted) {
          setUser(null);
          setIsPremium(false);
        }
      }

      // Always complete loading regardless of outcome
      if (mounted) {
        console.log('✅ Auth check complete');
        setLoading(false);
        setSessionChecked(true);
      }
    };

    // Force complete after 3 seconds no matter what
    const forceComplete = setTimeout(() => {
      if (mounted && loading) {
        console.warn('🚨 FORCE COMPLETE: Auth taking too long');
        setLoading(false);
        setSessionChecked(true);
      }
    }, 3000);

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('🔔 Auth event:', event);
      
      // Always clear loading on any auth event
      setLoading(false);
      setSessionChecked(true);

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        checkPremium(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsPremium(false);
      } else {
        setUser(session?.user || null);
        if (session?.user) {
          checkPremium(session.user.id);
        } else {
          setIsPremium(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(forceComplete);
    };
  }, []);

  // Simple premium check - don't block anything
  const checkPremium = async (userId: string) => {
    try {
      console.log('🔍 Checking premium...');
      
      const { data, error } = await Promise.race([
        supabase
          .from('stripe_orders')
          .select('status')
          .eq('status', 'completed')
          .not('payment_status', 'eq', 'unpaid'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('premium timeout')), 3000)
        )
      ]) as any;

      if (error) throw error;

      const premium = data && data.length > 0;
      setIsPremium(premium);
      console.log('💎 Premium status:', premium);

    } catch (error) {
      console.warn('⚠️ Premium check failed:', error);
      setIsPremium(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Signing in...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error, data };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    return { error, data };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/pricing`
      }
    });

    return { error };
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    
    const { error } = await supabase.auth.signOut();
    
    setUser(null);
    setIsPremium(false);
    
    // Clear storage
    localStorage.removeItem('lastSelectedContact');
    localStorage.removeItem('bankName');
    localStorage.removeItem('cardLastFour');

    return { error };
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
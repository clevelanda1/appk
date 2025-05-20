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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user?.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsPremium(false);
      return;
    }

    try {
      // Check if user has any completed orders
      const { data: orders, error } = await supabase
        .from('stripe_orders')
        .select('status')
        .eq('status', 'completed')
        .not('payment_status', 'eq', 'unpaid');

      if (error) throw error;

      // User is premium if they have at least one completed order
      setIsPremium(orders && orders.length > 0);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!error && data.user) {
      // Check premium status immediately after sign in
      await checkPremiumStatus(data.user.id);
    }
    
    return { error, data };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
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
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    // Make sure user state is cleared
    setUser(null);
    setIsPremium(false);
    
    // Clear all related localStorage items
    localStorage.removeItem('lastSelectedContact');
    localStorage.removeItem('bankName');
    localStorage.removeItem('cardLastFour');
    
    return { error };
  };

  return {
    user,
    loading,
    isPremium,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };
}
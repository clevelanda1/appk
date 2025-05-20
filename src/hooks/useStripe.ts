import { useState } from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../lib/supabaseClient';

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription') => {
    try {
      setLoading(true);
      setError(null);

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Please sign in to continue with checkout');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/dashboard`,
          cancel_url: `${window.location.origin}/pricing`,
          mode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (!url) throw new Error('No checkout URL received');

      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const purchaseLifetimeAccess = async () => {
    await createCheckoutSession(
      STRIPE_PRODUCTS.LIFETIME_ACCESS.priceId,
      STRIPE_PRODUCTS.LIFETIME_ACCESS.mode
    );
  };

  return {
    loading,
    error,
    purchaseLifetimeAccess,
  };
}
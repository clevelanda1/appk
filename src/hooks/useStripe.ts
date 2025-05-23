import { useState } from "react";
import { STRIPE_PRODUCTS } from "../stripe-config";
import { supabase } from "../lib/supabaseClient";

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (
    priceId: string,
    mode: "payment" | "subscription"
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Debug logging
      console.log("Environment check:", {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        priceId: priceId,
        mode: mode,
      });

      // Get the current session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw new Error("Failed to get session");
      }

      console.log("Session check:", {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        hasUser: !!session?.user,
        userId: session?.user?.id,
      });

      if (!session?.access_token) {
        throw new Error("Please sign in to continue with checkout");
      }

      const requestUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/stripe-checkout`;
      console.log("Making request to:", requestUrl);

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/dashboard`,
          cancel_url: `${window.location.origin}/pricing`,
          mode,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      console.log("Checkout URL received:", url);

      if (!url) throw new Error("No checkout URL received");

      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
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

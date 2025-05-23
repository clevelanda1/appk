import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0'
  }
});
const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
// Helper function to create responses with CORS headers
function corsResponse(body, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
    'Access-Control-Max-Age': '86400'
  };
  if (status === 204) {
    return new Response(null, {
      status,
      headers
    });
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  });
}
Deno.serve(async (req)=>{
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }
    if (req.method !== 'POST') {
      return corsResponse({
        error: 'Method not allowed'
      }, 405);
    }
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return corsResponse({
        error: 'Missing stripe-signature header'
      }, 400);
    }
    const body = await req.text();
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return corsResponse({
        error: `Webhook signature verification failed: ${error.message}`
      }, 400);
    }
    EdgeRuntime.waitUntil(handleEvent(event));
    return corsResponse({
      received: true
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return corsResponse({
      error: error.message
    }, 500);
  }
});
async function handleEvent(event) {
  const stripeData = event?.data?.object ?? {};
  if (!stripeData) {
    return;
  }
  if (!('customer' in stripeData)) {
    return;
  }
  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }
  const { customer: customerId } = stripeData;
  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;
    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData;
      isSubscription = mode === 'subscription';
      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }
    const { mode, payment_status } = stripeData;
    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        const { id: checkout_session_id, payment_intent, amount_subtotal, amount_total, currency, metadata } = stripeData;
        // Extract user_id from metadata
        const user_id = metadata?.user_id;
        if (!user_id) {
          console.error('No user_id found in checkout session metadata');
          return;
        }
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          user_id: user_id,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed'
        });
        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }
        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}, user: ${user_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}
async function syncCustomerFromStripe(customerId) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: [
        'data.default_payment_method'
      ]
    });
    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert({
        customer_id: customerId,
        subscription_status: 'not_started'
      }, {
        onConflict: 'customer_id'
      });
      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }
    const subscription = subscriptions.data[0];
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert({
      customer_id: customerId,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0].price.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      ...subscription.default_payment_method && typeof subscription.default_payment_method !== 'string' ? {
        payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
        payment_method_last4: subscription.default_payment_method.card?.last4 ?? null
      } : {},
      status: subscription.status
    }, {
      onConflict: 'customer_id'
    });
    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}

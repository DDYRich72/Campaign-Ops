import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

// Disable body parsing — Stripe needs the raw body to verify signature
export const config = { api: { bodyParser: false } };

async function upsertSubscription(
  supabase: ReturnType<typeof createServerClient>,
  {
    clerkUserId,
    stripeCustomerId,
    stripeSubscriptionId,
    planKey,
    status,
    currentPeriodEnd,
  }: {
    clerkUserId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    planKey: string;
    status: string;
    currentPeriodEnd: string | null;
  }
) {
  await supabase
    .from('subscriptions')
    .upsert(
      {
        clerk_user_id: clerkUserId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        plan_key: planKey,
        status,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'clerk_user_id' }
    );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const clerkUserId = session.metadata?.clerk_user_id;
        const planKey = session.metadata?.plan_key;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (!clerkUserId || !planKey) {
          console.error('Missing metadata on checkout.session.completed', session.id);
          break;
        }

        // Fetch the subscription to get period end
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const currentPeriodEnd = new Date(stripeSub.current_period_end * 1000).toISOString();

        await upsertSubscription(supabase, {
          clerkUserId,
          stripeCustomerId,
          stripeSubscriptionId,
          planKey,
          status: 'active',
          currentPeriodEnd,
        });
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const clerkUserId = sub.metadata?.clerk_user_id;
        const planKey = sub.metadata?.plan_key;

        if (!clerkUserId || !planKey) {
          // Try to look up by stripe_subscription_id
          const { data } = await supabase
            .from('subscriptions')
            .select('clerk_user_id, plan_key')
            .eq('stripe_subscription_id', sub.id)
            .maybeSingle();
          if (!data) break;

          await upsertSubscription(supabase, {
            clerkUserId: data.clerk_user_id,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            planKey: data.plan_key,
            status: sub.status,
            currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          });
          break;
        }

        await upsertSubscription(supabase, {
          clerkUserId,
          stripeCustomerId: sub.customer as string,
          stripeSubscriptionId: sub.id,
          planKey,
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      default:
        // Unhandled event type — ignore silently
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

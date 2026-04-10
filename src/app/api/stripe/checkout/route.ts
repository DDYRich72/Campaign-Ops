import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { PLANS } from '@/lib/plans';
import type { PlanKey } from '@/lib/plans';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { planKey?: string };
  const planKey = body.planKey as PlanKey | undefined;

  if (!planKey || !PLANS[planKey]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const plan = PLANS[planKey];
  if (!plan.stripePriceId) {
    return NextResponse.json(
      { error: 'Stripe price not configured for this plan. Add STRIPE_PRICE_* to .env.local' },
      { status: 500 }
    );
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      customer_email: email,
      metadata: { clerk_user_id: userId, plan_key: planKey },
      subscription_data: {
        metadata: { clerk_user_id: userId, plan_key: planKey },
      },
      success_url: `${baseUrl}/billing?success=1`,
      cancel_url: `${baseUrl}/billing?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    console.error('Stripe checkout error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

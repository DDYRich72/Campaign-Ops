import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY ?? '';

export const stripe = new Stripe(key, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    STRIPE_PRICE_STARTER: process.env.STRIPE_PRICE_STARTER ?? 'NOT SET',
    STRIPE_PRICE_GROWTH: process.env.STRIPE_PRICE_GROWTH ?? 'NOT SET',
    STRIPE_PRICE_AGENCY: process.env.STRIPE_PRICE_AGENCY ?? 'NOT SET',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'NOT SET',
  });
}

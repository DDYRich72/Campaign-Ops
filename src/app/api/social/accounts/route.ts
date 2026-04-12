import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/social/accounts
 * Returns connected social accounts for the current user
 */

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  
  const { data: accounts, error } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('is_active', true)
    .order('platform', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }

  return NextResponse.json({ accounts });
}

/**
 * DELETE /api/social/accounts?id=<uuid>
 * Disconnects a social account
 */

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('id');

  if (!accountId) {
    return NextResponse.json({ error: 'Account ID required' }, { status: 400 });
  }

  const supabase = createServerClient();
  
  const { error } = await supabase
    .from('social_accounts')
    .update({ is_active: false })
    .eq('id', accountId)
    .eq('clerk_user_id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

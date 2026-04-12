import { processScheduledPosts } from '@/lib/social';
import { NextResponse } from 'next/server';

/**
 * Cron job endpoint: /api/cron/process-posts
 * 
 * Set up with Vercel Cron:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/process-posts",
 *       "schedule": "*/5 * * * *"
 *     }
 *   ]
 * }
 * 
 * Runs every 5 minutes to check for and post scheduled content.
 */

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Require CRON_SECRET in production
  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processScheduledPosts();
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Cron job failed:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

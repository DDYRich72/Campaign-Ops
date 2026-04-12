import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { exchangeBufferCode, getBufferProfiles } from '@/lib/social';
import { encrypt } from '@/lib/encryption';

/**
 * Buffer OAuth Callback
 * Handles the redirect back from Buffer with authorization code
 */

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Buffer OAuth error:', error);
    redirect('/settings?social_error=true');
  }

  if (!code) {
    redirect('/settings?social_error=missing_code');
  }

  try {
    // Exchange code for access token
    const { access_token } = await exchangeBufferCode(code);
    
    // Get user's Buffer profiles (connected social accounts)
    const profiles = await getBufferProfiles(access_token);
    
    const supabase = createServerClient();
    
    // Save each connected profile
    for (const profile of profiles) {
      // Map Buffer service names to our platform names
      const platformMap: Record<string, string> = {
        'twitter': 'twitter',
        'linkedin': 'linkedin',
        'facebook': 'facebook',
        'instagram': 'instagram',
        'tiktok': 'tiktok',
        'google': 'google',
        'pinterest': 'pinterest',
        'mastodon': 'mastodon',
        'startPage': 'startpage',
      };

      const { error: upsertError } = await supabase
        .from('social_accounts')
        .upsert(
          {
            clerk_user_id: userId,
            platform: platformMap[profile.service] || profile.service,
            account_name: profile.service_username || profile.formatted_username,
            account_handle: profile.formatted_username,
            avatar_url: profile.avatar_https,
            buffer_token: encrypt(access_token),
            buffer_account_id: profile.id,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'clerk_user_id,platform,account_handle',
          }
        );
      
      if (upsertError) {
        console.error('Failed to save social account:', upsertError);
      }
    }

    redirect('/settings?social_connected=true');
  } catch (err) {
    console.error('Failed to connect Buffer:', err);
    redirect('/settings?social_error=connection_failed');
  }
}

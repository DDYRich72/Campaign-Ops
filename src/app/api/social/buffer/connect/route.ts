import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Buffer OAuth Initiation
 * Redirects user to Buffer to authorize Campaign-Ops
 */

export async function GET() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clientId = process.env.BUFFER_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/buffer/callback`;
  
  const authUrl = `https://bufferapp.com/oauth2/authorize?` + new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: 'code',
  });

  redirect(authUrl);
}

import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import type { BusinessProfileRow } from '@/lib/supabase/types';
import { ProfileForm } from './ProfileForm';

export const metadata = { title: 'Business Profile — Campaign Operator' };

export default async function ProfilePage() {
  const { userId } = await auth();

  let profile: BusinessProfileRow | null = null;
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('clerk_user_id', userId!)
      .single();
    profile = (data as BusinessProfileRow) ?? null;
  } catch {
    // No profile yet — form starts empty
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Business Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your profile pre-fills new campaigns so you don&apos;t have to re-enter the same details every time.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}

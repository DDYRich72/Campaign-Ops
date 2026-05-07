import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateImage, storeImageInSupabase } from '@/lib/image-generation';
import { NextResponse } from 'next/server';
import type { FullContentItem } from '@/lib/supabase/types';

/**
 * POST /api/campaigns/[id]/content/image
 *
 * Two modes based on Content-Type:
 *
 * application/json  — regenerate via AI provider
 *   { action: 'regenerate', day: number, platform: string }
 *
 * multipart/form-data — upload user's own image
 *   FormData fields: action='upload', day, platform, file (image file)
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();

  // Load campaign
  const { data: campaignData } = await supabase
    .from('campaigns')
    .select('full_content_json')
    .eq('id', params.id)
    .eq('clerk_user_id', userId)
    .single();

  if (!campaignData?.full_content_json) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  const contentType = request.headers.get('content-type') ?? '';
  let day: number;
  let platform: string;
  let newImageUrl: string;

  if (contentType.includes('multipart/form-data')) {
    // ── Upload own image ──────────────────────────────────────────────────────
    const formData = await request.formData();
    day = Number(formData.get('day'));
    platform = String(formData.get('platform'));
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 });
    }

    const sanitizedPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const ext = file.name.split('.').pop() ?? 'png';
    const filename = `${params.id}/${sanitizedPlatform}-day-${day}-${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('campaign-images')
      .upload(filename, file, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(uploadData.path);

    newImageUrl = publicUrlData.publicUrl;
  } else {
    // ── Regenerate via AI provider ────────────────────────────────────────────
    const body = await request.json();
    day = Number(body.day);
    platform = String(body.platform);

    // Find the visual prompt for this day
    const items = campaignData.full_content_json as FullContentItem[];
    const item = items.find(i => i.day === day && i.platform === platform);

    if (!item?.visual_prompt) {
      return NextResponse.json({ error: 'No visual prompt found for this item' }, { status: 400 });
    }

    try {
      const generated = await generateImage({ prompt: item.visual_prompt, style: 'vivid' });
      newImageUrl = await storeImageInSupabase({
        imageUrl: generated.url,
        campaignId: params.id,
        day,
        platform,
      });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Image generation failed' },
        { status: 500 }
      );
    }
  }

  // Update full_content_json with new image URL
  const updatedContent = (campaignData.full_content_json as FullContentItem[]).map(item =>
    item.day === day && item.platform === platform
      ? { ...item, image_url: newImageUrl, image_error: undefined }
      : item
  );

  const { error: saveError } = await supabase
    .from('campaigns')
    .update({ full_content_json: updatedContent })
    .eq('id', params.id)
    .eq('clerk_user_id', userId);

  if (saveError) {
    return NextResponse.json({ error: 'Failed to save image URL' }, { status: 500 });
  }

  return NextResponse.json({ image_url: newImageUrl });
}

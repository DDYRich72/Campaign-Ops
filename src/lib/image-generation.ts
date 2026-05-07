'use server';

/**
 * Image Generation Service
 * Generates social media images via the configured image provider.
 * To swap providers, set IMAGE_PROVIDER env var (see src/lib/image-provider.ts).
 */

import { getImageProvider } from '@/lib/image-provider';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Generate an image from a visual prompt using the active provider
 */
export async function generateImage({
  prompt,
  style = 'vivid',
}: {
  prompt: string;
  style?: 'vivid' | 'natural';
}): Promise<{ url: string; revised_prompt?: string }> {
  try {
    return await getImageProvider().generate({ prompt, style });
  } catch (err) {
    console.error('Image generation failed:', err);
    throw new Error(err instanceof Error ? err.message : 'Image generation failed');
  }
}

/**
 * Download image from URL and upload to Supabase Storage
 */
export async function storeImageInSupabase({
  imageUrl,
  campaignId,
  day,
  platform,
}: {
  imageUrl: string;
  campaignId: string;
  day: number;
  platform: string;
}): Promise<string> {
  try {
    // Download the image
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error('Failed to download generated image');
    
    const imageBlob = await imageRes.blob();
    
    // Generate filename
    const sanitizedPlatform = platform.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${campaignId}/${sanitizedPlatform}-day-${day}-${Date.now()}.png`;
    
    const supabase = createServerClient();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('campaign-images')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('campaign-images')
      .getPublicUrl(data.path);
    
    return publicUrl.publicUrl;
  } catch (err) {
    console.error('Failed to store image:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to store image');
  }
}

/**
 * Generate and store images for all items in a campaign
 * Called after full content generation
 */
export async function generateCampaignImages({
  campaignId,
  contentItems,
  onProgress,
}: {
  campaignId: string;
  clerkUserId: string;
  contentItems: Array<{
    day: number;
    platform: string;
    visual_prompt: string;
  }>;
  onProgress?: (completed: number, total: number) => void;
}) {
  const results: Array<{
    day: number;
    platform: string;
    image_url: string | null;
    error: string | null;
  }> = [];
  
  // Process in batches of 3 to avoid rate limits
  const batchSize = 3;
  
  for (let i = 0; i < contentItems.length; i += batchSize) {
    const batch = contentItems.slice(i, i + batchSize);
    
    const batchResults = await Promise.allSettled(
      batch.map(async (item) => {
        try {
          // Skip if no visual prompt
          if (!item.visual_prompt) {
            return {
              day: item.day,
              platform: item.platform,
              image_url: null,
              error: 'No visual prompt provided',
            };
          }
          
          // Generate image
          const generated = await generateImage({
            prompt: item.visual_prompt,
            style: 'vivid',
          });
          
          // Store in Supabase
          const storedUrl = await storeImageInSupabase({
            imageUrl: generated.url,
            campaignId,
            day: item.day,
            platform: item.platform,
          });
          
          return {
            day: item.day,
            platform: item.platform,
            image_url: storedUrl,
            error: null,
          };
        } catch (err) {
          console.error(`Failed to generate image for day ${item.day}:`, err);
          return {
            day: item.day,
            platform: item.platform,
            image_url: null,
            error: err instanceof Error ? err.message : 'Unknown error',
          };
        }
      })
    );
    
    // Collect results
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          day: 0,
          platform: '',
          image_url: null,
          error: result.reason?.message || 'Failed',
        });
      }
    });
    
    // Report progress
    onProgress?.(Math.min(i + batchSize, contentItems.length), contentItems.length);
    
    // Rate limit delay between batches
    if (i + batchSize < contentItems.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

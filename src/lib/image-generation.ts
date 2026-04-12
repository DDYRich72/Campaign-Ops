'use server';

/**
 * Image Generation Service
 * Uses DALL-E 3 to generate social media images from visual prompts
 */

import { openai } from '@/lib/openai';
import { createServerClient } from '@/lib/supabase/server';

const DALLE_MODEL = 'dall-e-3';
const IMAGE_SIZE = '1024x1024'; // 1024x1024, 1024x1792, or 1792x1024
const IMAGE_QUALITY = 'standard'; // 'standard' or 'hd'

interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

/**
 * Generate an image using DALL-E 3 from a visual prompt
 */
export async function generateImage({
  prompt,
  style = 'vivid', // 'vivid' (hyper-real, dramatic) or 'natural' (more subdued)
}: {
  prompt: string;
  style?: 'vivid' | 'natural';
}): Promise<GeneratedImage> {
  try {
    const response = await openai.images.generate({
      model: DALLE_MODEL,
      prompt,
      size: IMAGE_SIZE as '1024x1024',
      quality: IMAGE_QUALITY,
      style,
      n: 1,
      response_format: 'url',
    });

    const imageUrl = response.data[0]?.url;
    const revisedPrompt = response.data[0]?.revised_prompt;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    return { url: imageUrl, revised_prompt: revisedPrompt };
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
  clerkUserId,
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
  const supabase = createServerClient();
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

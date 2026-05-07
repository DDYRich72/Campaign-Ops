/**
 * Image Generation Provider Abstraction
 *
 * To swap providers, set IMAGE_PROVIDER env var:
 *   IMAGE_PROVIDER=dalle     (default — OpenAI DALL-E 3)
 *   IMAGE_PROVIDER=stability (future — Stability AI)
 *   IMAGE_PROVIDER=flux      (future — Black Forest Labs Flux)
 *
 * To add a new provider:
 *   1. Implement the ImageProvider interface below
 *   2. Add a case to getImageProvider()
 *   3. Set IMAGE_PROVIDER in your env
 */

import { openai } from '@/lib/openai';

export interface ImageGenerationOptions {
  prompt: string;
  style?: 'vivid' | 'natural';
}

export interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

export interface ImageProvider {
  generate(options: ImageGenerationOptions): Promise<GeneratedImage>;
}

// ── DALL-E 3 (default) ────────────────────────────────────────────────────────

class DalleProvider implements ImageProvider {
  async generate({ prompt, style = 'vivid' }: ImageGenerationOptions): Promise<GeneratedImage> {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      style,
      n: 1,
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned from DALL-E');

    return {
      url: imageUrl,
      revised_prompt: response.data?.[0]?.revised_prompt,
    };
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function getImageProvider(): ImageProvider {
  const provider = process.env.IMAGE_PROVIDER ?? 'dalle';
  switch (provider) {
    case 'dalle':
    default:
      return new DalleProvider();
    // Future providers:
    // case 'stability': return new StabilityProvider();
    // case 'flux':      return new FluxProvider();
  }
}

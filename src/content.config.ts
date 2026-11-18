import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';
const localized = z.object({ ca: z.string(), es: z.string() });
const services = defineCollection({
  loader: file('src/content/services.json'),
  schema: z.object({
    order: z.number(),
    slug: localized,
    title: localized,
    summary: localized,
    audience: localized,
    scope: localized,
    documents: localized,
    status: z.literal('pending'),
  }),
});
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({ lang: z.enum(['ca', 'es']) }),
});
const categories = defineCollection({
  loader: file('src/content/categories.json'),
  schema: z.object({
    order: z.number().int().min(1).max(6),
    slug: localized,
    title: localized,
    summary: localized,
    metaDescription: localized,
    intro: localized,
    audience: localized,
    scope: localized,
    documents: localized,
    imageAlt: localized,
    items: z
      .array(
        z.object({ id: z.string(), title: localized, description: localized }),
      )
      .min(1),
  }),
});
export const collections = { services, about, categories };

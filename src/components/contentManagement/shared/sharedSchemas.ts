import { z } from "zod";

export const imageSchema = z.union([z.string(), z.instanceof(File)]);

export const openGraphSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
  images: z.array(z.string()).optional(),
  ogImage: imageSchema.optional(), // Support both array of URLs and single image upload
});

export const twitterSchema = z.object({
  card: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  twitterImage: imageSchema.optional(), // Support both array of URLs and single image upload
});

export const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().optional(),
  openGraph: openGraphSchema,
  twitter: twitterSchema,
});

export const jsonLdItemSchema = z.object({
  type: z.string(),
  data: z.any(),
});

export const jsonLdSchema = z.array(jsonLdItemSchema).default([]);

export type SEOData = z.infer<typeof seoSchema>;
export type JSONLDData = z.infer<typeof jsonLdSchema>;

import { z } from "zod";

// Schema Definitions
export const heroSchema = z.object({
  image: z.string().url().or(z.literal("")).optional(),
  alt: z.string().optional(),
  h1: z.string().optional(),
  p: z.string().optional(),
  btn: z.string().optional(),
});

export const serviceSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("serviceSection"),
  service: z.string().optional(),
  subService: z.string().optional(),
  infoCards: z
    .array(
      z.object({
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

export const dedicatedServiceSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("dedicatedServiceSection"),
  img: z.string().url().or(z.literal("")).optional(),
  textRich: z.string().optional(),
});

export const corporateServiceOfferingsSchema = z.object({
  id: z.string().optional(),
  type: z.literal("corporateServiceOfferings"),
  serviceCards: z
    .array(
      z.object({
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        button: z.string().optional(),
        btnTitle: z.string().optional(),
      }),
    )
    .optional(),
});

export const corporateServicesAndFeaturesSchema = z.object({
  id: z.string().optional(),
  type: z.literal("corporateServicesAndFeatures"),
  infoCards: z
    .array(
      z.object({
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        height: z.number().optional(),
        width: z.number().optional(),
        orientation: z.enum(["vertical", "horizontal"]).optional(),
      }),
    )
    .optional(),
});

export const whoWeSupportSchema = z.object({
  id: z.string().optional(),
  type: z.literal("whoWeSupport"),
  imageCards: z
    .array(
      z.object({
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().or(z.array(z.string())).optional(),
        button: z.string().optional(),
        btnTitle: z.string().optional(),
      }),
    )
    .optional(),
});

export const ourGlobalReachSchema = z.object({
  id: z.string().optional(),
  type: z.literal("ourGlobalReach"),
  imageCards: z
    .array(
      z.object({
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().or(z.array(z.string())).optional(),
        button: z.string().optional(),
        btnTitle: z.string().optional(),
      }),
    )
    .optional(),
});

export const contactForServiceSchema = z.object({
  id: z.string().optional(),
  type: z.literal("contactForService"),
  textRich: z.string().optional(),
  btn: z.string().optional(),
  btnTitle: z.string().optional(),
});

export const contentBlockSchema = z.union([
  serviceSectionSchema,
  dedicatedServiceSectionSchema,
  corporateServiceOfferingsSchema,
  corporateServicesAndFeaturesSchema,
  whoWeSupportSchema,
  ourGlobalReachSchema,
  contactForServiceSchema,
]);

export const openGraphSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().or(z.literal("")).optional(),
  images: z.array(z.string().url()).optional(),
  siteName: z.string().optional(),
  type: z.string().optional(),
});

export const twitterSchema = z.object({
  card: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const jsonLdDataSchema = z
  .object({
    "@context": z.url().default("https://schema.org"),
    "@type": z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    url: z.url().optional(),
    image: z.union([z.url(), z.array(z.url())]).optional(),
    logo: z.url().optional(),
    contactPoint: z
      .array(
        z.object({
          "@type": z.literal("ContactPoint"),
          telephone: z.string(),
          contactType: z.string(),
          areaServed: z.union([z.string(), z.array(z.string())]).optional(),
          availableLanguage: z
            .union([z.string(), z.array(z.string())])
            .optional(),
        }),
      )
      .optional(),
    sameAs: z.array(z.string().url()).optional(),
  })
  .strict()
  .catchall(z.any());

export const jsonLdSchema = z
  .any()
  .transform((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [];
  })
  .pipe(
    z.array(
      z.object({
        type: z.enum([
          "Organization",
          "WebSite",
          "WebPage",
          "Service",
          "LocalBusiness",
          "FAQPage",
          "BlogPosting",
          "BreadcrumbList",
          "Product",
          "Event",
          "Person",
          "Article",
        ]),
        data: jsonLdDataSchema,
      }),
    ),
  )
  .default([]);

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  openGraph: openGraphSchema.optional(),
  twitter: twitterSchema.optional(),
  jsonLd: jsonLdSchema.optional(),
});

export const pageTemplateSchema = z.object({
  pageName: z
    .string()
    .refine((v) => v.trim() !== "", { message: "Page name is required" }),
  slug: z
    .string()
    .max(100)
    .refine((v) => v.trim() !== "", { message: "Slug is required" }),
  hero: heroSchema,
  content: z.array(contentBlockSchema).min(1).optional(),
  seo: seoSchema.optional(),
  isActive: z.boolean().default(true).optional(),
});

export type PageTemplateFormData = z.infer<typeof pageTemplateSchema>;

// Extended type for API responses that includes timestamps (not used in form submission)
export type PageTemplateWithTimestamps = PageTemplateFormData & {
  createdAt?: string;
  updatedAt?: string;
};

// Component Props Interfaces
export interface ServiceSectionBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

export interface CorporateServiceOfferingsBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

export interface CorporateServicesAndFeaturesBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

export interface ImageCardsBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

export interface LabeledEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  [key: string]: any;
}

export interface LabeledTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

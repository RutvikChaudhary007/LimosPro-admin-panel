import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Link2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
import { FeaturesAddonInput } from "@/components/common/FeaturesAddonInput";
import { RouteItemsInput } from "@/components/common/RouteItemsInput";
import LanguageSelector from "@/components/language/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { uid } from "@/utils/pagebuilder.utils";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

// Image schema - supports string, File, or object with src/alt
const imageSchema = z.union([
  z.string(),
  z.instanceof(File),
  z
    .object({
      id: z.string().optional(),
      url: z.string().optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
    })
    .optional(),
]);

// Stat schema for globalCoverage
const statSchema = z.object({
  id: z.string().optional(),
  icon: imageSchema.optional(),
  iconAlt: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
  link: z.string().optional(),
});

// Global coverage schema
const globalCoverageSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description1: z.string().optional(),
  description2: z.string().optional(),
  image: z
    .object({
      src: imageSchema.optional(),
      alt: z.string().optional(),
    })
    .optional(),
  stats: z.array(statSchema).optional(),
});

// City routes schema - single object with optional fields for better compatibility
const cityRoutesSchema = z.discriminatedUnion("cityRoutesEnabled", [
  z.object({
    cityRoutesEnabled: z.literal(true),
    headingTop: z.string().optional(),
    headingBottom: z.string().optional(),
    description1: z.string().optional(),
    description2: z.string().optional(),
    topCities: z.string().optional(),
    seeAll: z.string().optional(),
    seeAllLink: z.string().optional(),
    topRoutes: z.string().optional(),
    topRoutesSeeAllLink: z.string().optional(),
    topRoutesSeeAll: z.string().optional(),
    cityCards: z
      .array(
        z.object({
          id: z.string().optional(),
          src: imageSchema.optional(),
          title: z.string().optional(),
          alt: z.string().optional(),
          description: z.string().optional(),
          url: z.string().optional(),
        }),
      )
      .optional(),
    routeCards: z
      .array(
        z.object({
          id: z.string().optional(),
          from: z.string().optional(),
          to: z.string().optional(),
          time: z.string().optional(),
          distance: z.string().optional(),
        }),
      )
      .optional(),
  }),
  z.object({
    cityRoutesEnabled: z.literal(false),
  }),
]);

// Services section schema
const servicesSectionSchema = z.object({
  service: z.string().optional(),
  subservice: z.string().optional(),
  infoCards: z
    .array(
      z.object({
        id: z.string().optional(),
        src: imageSchema.optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

const premiumFleetSchema = z.object({
  p1: z.string().optional(),
  p2: z.string().optional(),
  h2: z.string().optional(),
  priceCards: z
    .array(
      z.object({
        id: z.string().optional(),
        src: imageSchema.optional(),
        alt: z.string().optional(),
        priceInfo: z.string().optional(),
        rating: z.string().optional(),
        CarInfo: z.string().optional(),
        buttonText: z.string().optional(),
        buttonLink: z.string().optional(),
        features: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

const whyUsSchema = z.object({
  heroSectionText: z
    .object({
      src: imageSchema.optional(),
      alt: z.string().optional(),
    })
    .optional(),
  p: z.string().optional(),
  h2: z.string().optional(),
  featureList: z.array(z.string()).optional(),
});

const imageCardWithTextSideSchema = z.object({
  imageLeft: z.boolean().default(false),
  src: imageSchema.optional(),
  alt: z.string().optional(),
  t1: z.string().optional(),
  t2: z.string().optional(),
  description: z.string().optional(),
});

const downloadSchema = z.object({
  h2: z.string().optional(),
  p: z.string().optional(),
  list: z.array(z.string()).optional(),
  qr: z
    .object({
      src: imageSchema.optional(),
      alt: z.string().optional(),
    })
    .optional(),
  appStore: z
    .object({
      src: imageSchema.optional(),
      alt: z.string().optional(),
      link: z.string().optional(),
    })
    .optional(),
  playStore: z
    .object({
      src: imageSchema.optional(),
      alt: z.string().optional(),
      link: z.string().optional(),
    })
    .optional(),
  image: z
    .object({
      src: imageSchema.optional(),
      alt: z.string().optional(),
      fig: z.string().optional(),
    })
    .optional(),
});

const topRouteSchema = z.discriminatedUnion("isRoutes", [
  z.object({
    isRoutes: z.literal(true),
    title: z.string(),
    seeAllLink: z.string(),
    label: z.array(
      z.object({
        name: z.string(),
        url: z.string().optional(),
        items: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            url: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
  z.object({
    isRoutes: z.literal(false),
  }),
]);
// Content schema for a single language - with defaults for safe initialization
const contentSchema = z.object({
  services: servicesSectionSchema.default({
    service: "",
    subservice: "",
    infoCards: [],
  }),
  premiumFleet: premiumFleetSchema.default({
    p1: "",
    p2: "",
    h2: "",
    priceCards: [],
  }),
  cityRoutes: cityRoutesSchema.default({ cityRoutesEnabled: false }),
  topRoutes: topRouteSchema.default({ isRoutes: false }),
  useCase: servicesSectionSchema.default({
    service: "",
    subservice: "",
    infoCards: [],
  }),
  whyUs: whyUsSchema.default({ p: "", h2: "", featureList: [] }),
  globalCoverage: globalCoverageSchema.default({
    eyebrow: "",
    title: "",
    description1: "",
    description2: "",
    stats: [],
  }),
  serviceInGlobalCities: z
    .object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema.default({
        imageLeft: false,
      }),
    })
    .default({ imageCardWithTextOnSide: { imageLeft: false } }),
  LongDistanceCarService: z
    .object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema.default({
        imageLeft: true,
      }),
    })
    .default({ imageCardWithTextOnSide: { imageLeft: true } }),
  faq: z
    .object({
      heading: z.string().optional(),
      faqCards: z
        .array(
          z.object({
            id: z.string().optional(),
            question: z.string().optional(),
            answer: z.string().optional(),
          }),
        )
        .optional(),
    })
    .default({ heading: "", faqCards: [] }),
  download: downloadSchema.default({ h2: "", p: "" }),
});

// Main schema with content wrapper
const multiLangServiceSchema = z.object({
  isActive: z.boolean().default(true),
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  content: z.record(z.string(), contentSchema),
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type ServiceFormData = z.infer<typeof multiLangServiceSchema>;

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: ServiceFormData) => void;
  type: string;
}

/**
 * Get empty content for a single language
 */
const getEmptyLanguageContent = () => ({
  services: { service: "", subservice: "", infoCards: [] },
  cityRoutes: {
    cityRoutesEnabled: false,
  },
  topRoutes: {
    isRoutes: false as const,
  },
  useCase: { service: "", subservice: "", infoCards: [] },
  premiumFleet: { p1: "", p2: "", h2: "", priceCards: [] },
  whyUs: { heroSectionText: undefined, p: "", h2: "", featureList: [] },
  globalCoverage: {
    eyebrow: "",
    title: "",
    description1: "",
    description2: "",
    image: undefined,
    stats: [],
  },
  serviceInGlobalCities: {
    imageCardWithTextOnSide: {
      imageLeft: false,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  LongDistanceCarService: {
    imageCardWithTextOnSide: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  faq: { heading: "", faqCards: [] },
  download: {
    h2: "",
    p: "",
    qr: undefined,
    appStore: undefined,
    playStore: undefined,
    image: undefined,
    list: undefined,
  },
});

const getEmptySeo = () => ({
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  canonicalUrl: "",
  openGraph: {},
  twitter: {},
});

const getEmptyJsonLd = () => [];

const normalizeServiceData = (data: any): ServiceFormData => {
  if (!data)
    return {
      isActive: true,
      pageName: "",
      slug: "",
      defaultLanguage: "en",
      availableLanguages: ["en"],
      content: {
        en: getEmptyLanguageContent(),
      },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  // If already in new format with content wrapper
  if (data.content && typeof data.content === "object") {
    const languages = data.availableLanguages || ["en"];
    const content: Record<string, any> = {};

    languages.forEach((lang: string) => {
      if (data.content[lang]) {
        content[lang] = {
          ...getEmptyLanguageContent(),
          ...data.content[lang],
        };
        // Ensure cityRoutesEnabled is always explicitly set
        if (
          content[lang].cityRoutes &&
          typeof content[lang].cityRoutes.cityRoutesEnabled !== "boolean"
        ) {
          content[lang].cityRoutes.cityRoutesEnabled = false;
        }
        // Data migration for topRoutes: convert values to items
        if (content[lang].topRoutes && content[lang].topRoutes.label) {
          content[lang].topRoutes.label = content[lang].topRoutes.label.map(
            (lbl: any) => {
              if (lbl.values && !lbl.items) {
                const { values, ...rest } = lbl;
                return {
                  ...rest,
                  items: values.map((val: string) => ({
                    id: uid(),
                    name: val,
                    url: "",
                  })),
                };
              }
              return lbl;
            },
          );
        }
      } else {
        content[lang] = getEmptyLanguageContent();
      }
    });

    // Extract Shared SEO/JSON-LD
    let sharedSeo = data.seo;
    let sharedJsonLd = data.jsonLd;

    if (
      sharedSeo &&
      (sharedSeo.en ||
        sharedSeo[DEFAULT_LANGUAGE] ||
        Object.keys(sharedSeo).length > 0)
    ) {
      if (!sharedSeo.metaTitle && !sharedSeo.metaDescription) {
        sharedSeo =
          sharedSeo[DEFAULT_LANGUAGE] ||
          sharedSeo.en ||
          Object.values(sharedSeo)[0] ||
          getEmptySeo();
      }
    } else {
      sharedSeo = getEmptySeo();
    }

    if (
      sharedJsonLd &&
      !Array.isArray(sharedJsonLd) &&
      (sharedJsonLd.en || sharedJsonLd[DEFAULT_LANGUAGE])
    ) {
      sharedJsonLd =
        sharedJsonLd[DEFAULT_LANGUAGE] ||
        sharedJsonLd.en ||
        Object.values(sharedJsonLd)[0] ||
        getEmptyJsonLd();
    } else if (!sharedJsonLd) {
      sharedJsonLd = getEmptyJsonLd();
    }

    return {
      isActive: typeof data.isActive === "boolean" ? data.isActive : true,
      pageName: data.pageName || "",
      slug: data.slug || "",
      defaultLanguage: data.defaultLanguage || "en",
      availableLanguages: languages,
      content,
      seo: sharedSeo,
      jsonLd: sharedJsonLd,
    };
  }

  // Old format - convert to new format with content wrapper
  const languages = data.availableLanguages || ["en"];
  const content: Record<string, any> = {};

  const sections = [
    "services",
    "cityRoutes",
    "useCase",
    "premiumFleet",
    "whyUs",
    "globalCoverage",
    "serviceInGlobalCities",
    "LongDistanceCarService",
    "faq",
    "download",
    "topRoutes",
  ] as const;

  languages.forEach((lang: string) => {
    content[lang] = getEmptyLanguageContent();

    sections.forEach((section) => {
      // Check for data in section[lang] OR section (if it's old format and lang is en)
      let sectionData = data[section]?.[lang];
      if (!sectionData && lang === "en" && data[section] && !data[section].en) {
        sectionData = data[section];
      }

      if (sectionData) {
        content[lang][section] = sectionData;
      }
    });

    // Data migration for topRoutes: convert values to items
    if (content[lang].topRoutes && content[lang].topRoutes.label) {
      content[lang].topRoutes.label = content[lang].topRoutes.label.map(
        (lbl: any) => {
          if (lbl.values && !lbl.items) {
            const { values, ...rest } = lbl;
            return {
              ...rest,
              items: values.map((val: string) => ({
                id: uid(),
                name: val,
                url: "",
              })),
            };
          }
          return lbl;
        },
      );
    }

    // Ensure cityRoutesEnabled is always explicitly set for old format conversion
    if (
      content[lang].cityRoutes &&
      typeof content[lang].cityRoutes.cityRoutesEnabled !== "boolean"
    ) {
      content[lang].cityRoutes.cityRoutesEnabled = false;
    }
  });

  // Extract Shared SEO/JSON-LD
  let sharedSeo = data.seo;
  let sharedJsonLd = data.jsonLd;

  if (
    sharedSeo &&
    (sharedSeo.en ||
      sharedSeo[DEFAULT_LANGUAGE] ||
      Object.keys(sharedSeo).length > 0)
  ) {
    if (!sharedSeo.metaTitle && !sharedSeo.metaDescription) {
      sharedSeo =
        sharedSeo[DEFAULT_LANGUAGE] ||
        sharedSeo.en ||
        Object.values(sharedSeo)[0] ||
        getEmptySeo();
    }
  } else {
    sharedSeo = getEmptySeo();
  }

  if (
    sharedJsonLd &&
    !Array.isArray(sharedJsonLd) &&
    (sharedJsonLd.en || sharedJsonLd[DEFAULT_LANGUAGE])
  ) {
    sharedJsonLd =
      sharedJsonLd[DEFAULT_LANGUAGE] ||
      sharedJsonLd.en ||
      Object.values(sharedJsonLd)[0] ||
      getEmptyJsonLd();
  } else if (!sharedJsonLd) {
    sharedJsonLd = getEmptyJsonLd();
  }

  return {
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    pageName: data.pageName || "",
    slug: data.slug || "",
    defaultLanguage: data.defaultLanguage || "en",
    availableLanguages: languages,
    content,
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
  };
};

interface LanguageFieldsProps {
  selectedLanguage: LanguageCode;
  activeTab: "general" | "seo" | "jsonld";
  form: any;
  metaKeywordsData: any;
}

function LanguageFields({
  selectedLanguage,
  activeTab,
  form,
  metaKeywordsData,
}: LanguageFieldsProps) {
  const { control, register, watch, setValue } = form;

  const routeDetailsLabelCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.topRoutes.label` as any,
  });

  const cityCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.cityRoutes.cityCards` as any,
  });

  const routeCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.cityRoutes.routeCards` as any,
  });

  const infoCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.services.infoCards` as any,
  });

  const useCaseInfoCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.useCase.infoCards` as any,
  });

  const priceCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.premiumFleet.priceCards` as any,
  });

  const faqCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.faq.faqCards` as any,
  });

  const globalCoverageStats = useFieldArray({
    control,
    name: `content.${selectedLanguage}.globalCoverage.stats` as any,
  });

  // Add this effect to reinitialize arrays when enabling
  useEffect(() => {
    const subscription = watch((value: any, { name }: { name: string }) => {
      if (name === `content.${selectedLanguage}.cityRoutes.cityRoutesEnabled`) {
        const isEnabled =
          value?.content?.[selectedLanguage]?.cityRoutes?.cityRoutesEnabled;

        if (
          isEnabled &&
          !cityCards.fields.length &&
          !routeCards.fields.length
        ) {
          // Initialize arrays if they don't exist
          setValue(
            `content.${selectedLanguage}.cityRoutes.cityCards` as any,
            [],
          );
          setValue(
            `content.${selectedLanguage}.cityRoutes.routeCards` as any,
            [],
          );
        }
      }
      if (name === `content.${selectedLanguage}.topRoutes.isRoutes`) {
        const isRouteEnabled =
          value?.content?.[selectedLanguage]?.topRoutes?.isRoutes;

        if (isRouteEnabled && !routeDetailsLabelCards.fields.length) {
          // Initialize arrays if they don't exist
          setValue(`content.${selectedLanguage}.topRoutes.label` as any, []);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, selectedLanguage]);

  return (
    <div className="space-y-8">
      {activeTab === "general" && (
        <div className="space-y-8">
          {/* Services Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Services & InfoCards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Service</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.services.service` as any,
                        )}
                        placeholder="e.g. Services"
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Subservice</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.services.subservice` as any,
                        )}
                        placeholder="e.g. Airport Transfers"
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Info Cards</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      infoCards.append({
                        id: uid(),
                        src: "",
                        alt: "",
                        title: "",
                        description: "",
                      })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add Info Card
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {infoCards.fields.map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            Card #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => infoCards.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <Controller
                          name={
                            `content.${selectedLanguage}.services.infoCards.${index}.src` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <UploadWithUrlV2
                              value={field.value}
                              onChange={field.onChange}
                              title="Image"
                            />
                          )}
                        />
                        <Field>
                          <FieldLabel>Alt Text</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.services.infoCards.${index}.alt` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.services.infoCards.${index}.title` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.services.infoCards.${index}.description` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Routes Details */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Routes Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Checkbox Toggle */}
                <Field>
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name={
                        `content.${selectedLanguage}.topRoutes.isRoutes` as any
                      }
                      render={({ field }) => (
                        <Checkbox
                          id={`RoutesDeatilsToggle-${selectedLanguage}`}
                          className="w-4 max-w-4"
                          checked={field.value === true}
                          onCheckedChange={(val) => {
                            const isEnabled = val === true;

                            if (!isEnabled) {
                              // When disabled, set to false and clear all data
                              setValue(
                                `content.${selectedLanguage}.topRoutes` as any,
                                {
                                  isRoutes: false,
                                },
                                { shouldValidate: true, shouldDirty: true },
                              );

                              // Clear field arrays
                              routeDetailsLabelCards.replace([]);
                            } else {
                              // When enabled, initialize with full structure
                              setValue(
                                `content.${selectedLanguage}.topRoutes` as any,
                                {
                                  isRoutes: true,
                                  title: "",
                                  seeAllLink: "",
                                  label: [
                                    {
                                      name: "",
                                      url: "",
                                      items: [],
                                    },
                                  ],
                                },
                                { shouldValidate: true, shouldDirty: true },
                              );
                            }

                            field.onChange(isEnabled);
                          }}
                        />
                      )}
                    />
                    <FieldLabel
                      htmlFor={`RoutesDeatilsToggle-${selectedLanguage}`}
                      className="gap-0 mb-0 cursor-pointer text-base-black"
                    >
                      Enable Top Routes Section
                    </FieldLabel>
                  </div>
                  <FieldDescription>
                    Toggle to show/hide Top routes content on this page
                  </FieldDescription>
                </Field>

                {/* Show Top Routes Content Only When Enabled */}
                {watch(
                  `content.${selectedLanguage}.topRoutes.isRoutes` as any,
                ) === true && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Title</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.topRoutes.title` as any,
                            )}
                            placeholder="Airport Transfer"
                          />
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel>SeeAll Link</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.topRoutes.seeAllLink` as any,
                            )}
                            placeholder="https://example.com"
                          />
                        </InputGroup>
                      </Field>
                    </div>

                    <Separator />

                    {/* Top Routes */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h4 className="font-bold">Routes Cards</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outlinePrimary"
                          onClick={() =>
                            routeDetailsLabelCards.append({
                              id: uid(),
                              name: "",
                              url: "",
                              items: [],
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Route Details
                        </Button>
                      </div>
                      {routeDetailsLabelCards.fields.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {routeDetailsLabelCards.fields.map((field, idx) => (
                            <Card key={field.id} className="border-dashed">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-xs font-bold text-gray-400 uppercase">
                                    Route #{idx + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      routeDetailsLabelCards.remove(idx)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <Field>
                                  <FieldLabel>Route Name</FieldLabel>
                                  <InputGroup>
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.topRoutes.label.${idx}.name` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <InputGroupInput
                                          {...field}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value);
                                            const slug = generateSlug(value);
                                            setValue(
                                              `content.${selectedLanguage}.topRoutes.label.${idx}.url` as any,
                                              slug ? `/${slug}` : "",
                                              {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                              },
                                            );
                                          }}
                                          placeholder="Dubai"
                                        />
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Route URL / Slug</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.topRoutes.label.${idx}.url` as any,
                                      )}
                                      placeholder="/dubai-airport-transfer"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Route Items (Nested)</FieldLabel>
                                  <Controller
                                    name={
                                      `content.${selectedLanguage}.topRoutes.label.${idx}.items` as any
                                    }
                                    control={control}
                                    render={({ field }) => (
                                      <RouteItemsInput
                                        value={field.value}
                                        onChange={field.onChange}
                                      />
                                    )}
                                  />
                                </Field>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                          No route details added. Click "Add Route Details" to
                          create one.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </CardBody>
          </Card>

          {/* City Routes */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>City Routes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Checkbox Toggle */}
                <Field>
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name={
                        `content.${selectedLanguage}.cityRoutes.cityRoutesEnabled` as any
                      }
                      render={({ field }) => (
                        <Checkbox
                          id={`cityRoutesToggle-${selectedLanguage}`}
                          className="w-4 max-w-4"
                          checked={field.value === true}
                          onCheckedChange={(val) => {
                            const isEnabled = val === true;

                            if (!isEnabled) {
                              // When disabled, set to false and clear all data
                              setValue(
                                `content.${selectedLanguage}.cityRoutes` as any,
                                {
                                  cityRoutesEnabled: false,
                                },
                                { shouldValidate: true, shouldDirty: true },
                              );

                              // Clear field arrays
                              cityCards.replace([]);
                              routeCards.replace([]);
                            } else {
                              // When enabled, initialize with full structure
                              setValue(
                                `content.${selectedLanguage}.cityRoutes` as any,
                                {
                                  cityRoutesEnabled: true,
                                  headingTop: "",
                                  headingBottom: "",
                                  description1: "",
                                  description2: "",
                                  topCities: "",
                                  seeAll: "",
                                  seeAllLink: "",
                                  topRoutes: "",
                                  topRoutesSeeAllLink: "",
                                  topRoutesSeeAll: "",
                                  cityCards: [],
                                  routeCards: [],
                                },
                                { shouldValidate: true, shouldDirty: true },
                              );
                            }

                            field.onChange(isEnabled);
                          }}
                        />
                      )}
                    />
                    <FieldLabel
                      htmlFor={`cityRoutesToggle-${selectedLanguage}`}
                      className="gap-0 mb-0 cursor-pointer text-base-black"
                    >
                      Enable City Routes Section
                    </FieldLabel>
                  </div>
                  <FieldDescription>
                    Toggle to show/hide city routes content on this page
                  </FieldDescription>
                </Field>

                {/* Show City Routes Content Only When Enabled */}
                {watch(
                  `content.${selectedLanguage}.cityRoutes.cityRoutesEnabled` as any,
                ) === true && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Heading Top</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.headingTop` as any,
                            )}
                            placeholder="Luxury Travel"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Heading Bottom</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.headingBottom` as any,
                            )}
                            placeholder="Major Cities & Airports"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Description 1</FieldLabel>
                        <Controller
                          name={
                            `content.${selectedLanguage}.cityRoutes.description1` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <TinyEditorRHF
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Description 2</FieldLabel>
                        <Controller
                          name={
                            `content.${selectedLanguage}.cityRoutes.description2` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <TinyEditorRHF
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Top Cities Text</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.topCities` as any,
                            )}
                            placeholder="Top Cities"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>See All Text</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.seeAll` as any,
                            )}
                            placeholder="See All"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Top Cities See All Link</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.seeAllLink` as any,
                            )}
                            placeholder="/city-to-city"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Top Routes Text</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.topRoutes` as any,
                            )}
                            placeholder="Top City-to-City Routes"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Top Routes See All Text</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.topRoutesSeeAll` as any,
                            )}
                            placeholder="See All"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Top Routes See All Link</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.cityRoutes.topRoutesSeeAllLink` as any,
                            )}
                            placeholder="/city-to-city"
                          />
                        </InputGroup>
                      </Field>
                    </div>

                    <Separator />

                    {/* City Cards */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h4 className="font-bold">City Cards</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outlinePrimary"
                          onClick={() =>
                            cityCards.append({
                              id: uid(),
                              src: "",
                              title: "",
                              alt: "",
                              description: "",
                              url: "",
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add City
                        </Button>
                      </div>
                      {cityCards.fields.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {cityCards.fields.map((field, idx) => (
                            <Card key={field.id} className="border-dashed">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-xs font-bold text-gray-400 uppercase">
                                    City #{idx + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => cityCards.remove(idx)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <Controller
                                  name={
                                    `content.${selectedLanguage}.cityRoutes.cityCards.${idx}.src` as any
                                  }
                                  control={control}
                                  render={({ field }) => (
                                    <UploadWithUrlV2
                                      value={field.value}
                                      onChange={field.onChange}
                                      title="City Image"
                                    />
                                  )}
                                />
                                <Field>
                                  <FieldLabel>Image Alt Text</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.cityRoutes.cityCards.${idx}.alt` as any,
                                      )}
                                      placeholder="A picture of Dubai buildings"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>City Name</FieldLabel>
                                  <InputGroup>
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.cityRoutes.cityCards.${idx}.title` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <InputGroupInput
                                          {...field}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value);
                                            const slug = generateSlug(value);
                                            setValue(
                                              `content.${selectedLanguage}.cityRoutes.cityCards.${idx}.url` as any,
                                              slug ? `/${slug}` : "",
                                              {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                              },
                                            );
                                          }}
                                          placeholder="Dubai"
                                        />
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>City URL / Slug</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.cityRoutes.cityCards.${idx}.url` as any,
                                      )}
                                      placeholder="/dubai"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Description</FieldLabel>
                                  <Textarea
                                    {...register(
                                      `content.${selectedLanguage}.cityRoutes.cityCards.${idx}.description` as any,
                                    )}
                                    placeholder="26 routes to/from this city"
                                  />
                                </Field>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                          No city cards added. Click "Add City" to create one.
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Route Cards */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h4 className="font-bold">Route Cards</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outlinePrimary"
                          onClick={() =>
                            routeCards.append({
                              id: uid(),
                              from: "",
                              to: "",
                              time: "",
                              distance: "",
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Route
                        </Button>
                      </div>
                      {routeCards.fields.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {routeCards.fields.map((field, idx) => (
                            <Card key={field.id} className="border-dashed">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-xs font-bold text-gray-400 uppercase">
                                    Route #{idx + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => routeCards.remove(idx)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Field>
                                    <FieldLabel>From</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cityRoutes.routeCards.${idx}.from` as any,
                                        )}
                                        placeholder="New York"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>To</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cityRoutes.routeCards.${idx}.to` as any,
                                        )}
                                        placeholder="Philadelphia"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Time</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cityRoutes.routeCards.${idx}.time` as any,
                                        )}
                                        placeholder="1h 50m"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Distance</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cityRoutes.routeCards.${idx}.distance` as any,
                                        )}
                                        placeholder="59 mi"
                                      />
                                    </InputGroup>
                                  </Field>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                          No route cards added. Click "Add Route" to create one.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </CardBody>
          </Card>

          {/* Use Case Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Use Case & InfoCards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Service</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.useCase.service` as any,
                        )}
                        placeholder="e.g. Use Case"
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Subservice</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.useCase.subservice` as any,
                        )}
                        placeholder="e.g. Business Travel"
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Info Cards</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      useCaseInfoCards.append({
                        id: uid(),
                        src: "",
                        alt: "",
                        title: "",
                        description: "",
                      })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add Info Card
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {useCaseInfoCards.fields.map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            Card #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => useCaseInfoCards.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <Controller
                          name={
                            `content.${selectedLanguage}.useCase.infoCards.${index}.src` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <UploadWithUrlV2
                              value={field.value}
                              onChange={field.onChange}
                              title="Image"
                            />
                          )}
                        />
                        <Field>
                          <FieldLabel>Alt Text</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.useCase.infoCards.${index}.alt` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.useCase.infoCards.${index}.title` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.useCase.infoCards.${index}.description` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Premium Fleet */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Premium Fleet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Paragraph 1</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.premiumFleet.p1` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Heading (H2)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.premiumFleet.h2` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Controller
                  name={`content.${selectedLanguage}.premiumFleet.p2` as any}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Paragraph 2 (HTML)</FieldLabel>
                      <TinyEditorRHF
                        value={field.value as string}
                        onChange={field.onChange}
                      />
                    </Field>
                  )}
                />
                <Separator />
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Price Cards</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      priceCards.append({
                        id: uid(),
                        src: "",
                        alt: "",
                        priceInfo: "",
                        rating: "",
                        CarInfo: "",
                        buttonText: "",
                        buttonLink: "",
                        features: [],
                      })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add Price Card
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {priceCards.fields.map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            Price Card #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => priceCards.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <Controller
                          name={
                            `content.${selectedLanguage}.premiumFleet.priceCards.${index}.src` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <UploadWithUrlV2
                              value={field.value}
                              onChange={field.onChange}
                              title="Image"
                            />
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel>Alt Text</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.premiumFleet.priceCards.${index}.alt` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Price Info</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.premiumFleet.priceCards.${index}.priceInfo` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Rating</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.premiumFleet.priceCards.${index}.rating` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Car Info</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.premiumFleet.priceCards.${index}.CarInfo` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Button Text</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.premiumFleet.priceCards.${index}.buttonText` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Button Link</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.premiumFleet.priceCards.${index}.buttonLink` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel>Features</FieldLabel>
                          <Controller
                            name={
                              `content.${selectedLanguage}.premiumFleet.priceCards.${index}.features` as any
                            }
                            control={control}
                            render={({ field }) => (
                              <FeaturesAddonInput
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </Field>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Why Us Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Why Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name={
                    `content.${selectedLanguage}.whyUs.heroSectionText.src` as any
                  }
                  control={control}
                  render={({ field }) => (
                    <UploadWithUrlV2
                      value={field.value}
                      onChange={field.onChange}
                      title="Why Us Hero Image"
                    />
                  )}
                />
                <Field>
                  <FieldLabel>Alt Image Text</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(
                        `content.${selectedLanguage}.whyUs.heroSectionText.alt` as any,
                      )}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Heading (H2)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(
                        `content.${selectedLanguage}.whyUs.h2` as any,
                      )}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Paragraph</FieldLabel>
                  <Textarea
                    {...register(`content.${selectedLanguage}.whyUs.p` as any)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Feature List (One per line)</FieldLabel>
                  <Controller
                    name={
                      `content.${selectedLanguage}.whyUs.featureList` as any
                    }
                    control={control}
                    render={({ field }) => (
                      <FeaturesAddonInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Field>
              </CardContent>
            </CardBody>
          </Card>

          {/* Global Coverage Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Global Coverage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Eyebrow</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.globalCoverage.eyebrow` as any,
                        )}
                        placeholder="e.g. Worldwide Service"
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.globalCoverage.title` as any,
                        )}
                        placeholder="e.g. Global Coverage"
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Description 1</FieldLabel>
                  <Textarea
                    {...register(
                      `content.${selectedLanguage}.globalCoverage.description1` as any,
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Description 2</FieldLabel>
                  <Textarea
                    {...register(
                      `content.${selectedLanguage}.globalCoverage.description2` as any,
                    )}
                  />
                </Field>
                <Controller
                  name={
                    `content.${selectedLanguage}.globalCoverage.image.src` as any
                  }
                  control={control}
                  render={({ field }) => (
                    <UploadWithUrlV2
                      value={field.value}
                      onChange={field.onChange}
                      title="Global Coverage Image"
                    />
                  )}
                />
                <Field>
                  <FieldLabel>Image Alt Text</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(
                        `content.${selectedLanguage}.globalCoverage.image.alt` as any,
                      )}
                    />
                  </InputGroup>
                </Field>
                <Separator />
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Stats</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      globalCoverageStats.append({
                        id: uid(),
                        icon: "",
                        iconAlt: "",
                        label: "",
                        value: "",
                        link: "",
                      })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add Stat
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {globalCoverageStats.fields.map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            Stat #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => globalCoverageStats.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <Controller
                          name={
                            `content.${selectedLanguage}.globalCoverage.stats.${index}.icon` as any
                          }
                          control={control}
                          render={({ field }) => (
                            <UploadWithUrlV2
                              value={field.value}
                              onChange={field.onChange}
                              title="Icon"
                            />
                          )}
                        />
                        <Field>
                          <FieldLabel>Icon Alt Text</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.globalCoverage.stats.${index}.iconAlt` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Label</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.globalCoverage.stats.${index}.label` as any,
                              )}
                              placeholder="e.g. Cities"
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Value</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.globalCoverage.stats.${index}.value` as any,
                              )}
                              placeholder="e.g. 500+"
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Link (Optional)</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.globalCoverage.stats.${index}.link` as any,
                              )}
                              placeholder="e.g. /destinations"
                            />
                          </InputGroup>
                        </Field>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Image Cards Sections */}
          {[
            {
              id: "LongDistanceCarService",
              label: "Long Distance Car Service",
            },
            { id: "serviceInGlobalCities", label: "Shuttle booking" },
          ].map((section) => (
            <Card key={section.id}>
              <CardBody>
                <CardHeader>
                  <CardTitle>{section.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    name={
                      `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.src` as any
                    }
                    control={control}
                    render={({ field }) => (
                      <UploadWithUrlV2
                        value={field.value}
                        onChange={field.onChange}
                        title="Section Image"
                      />
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Alt Image Text</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.alt` as any,
                          )}
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Title 1</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.t1` as any,
                          )}
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Title 2</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.t2` as any,
                          )}
                        />
                      </InputGroup>
                    </Field>
                  </div>
                  <Controller
                    name={
                      `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.description` as any
                    }
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <TinyEditorRHF
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </Field>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${section.id}-left-${selectedLanguage}`}
                      checked={watch(
                        `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.imageLeft` as any,
                      )}
                      onCheckedChange={(v) =>
                        setValue(
                          `content.${selectedLanguage}.${section.id}.imageCardWithTextOnSide.imageLeft` as any,
                          v === true,
                        )
                      }
                    />
                    <label
                      htmlFor={`${section.id}-left-${selectedLanguage}`}
                      className="text-sm"
                    >
                      Image on Left?
                    </label>
                  </div>
                </CardContent>
              </CardBody>
            </Card>
          ))}

          {/* FAQ Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    onClick={() =>
                      faqCards.append({ id: uid(), question: "", answer: "" })
                    }
                    variant="outlinePrimary"
                    size="sm"
                  >
                    Add FAQ
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel>FAQ Section Heading</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(
                        `content.${selectedLanguage}.faq.heading` as any,
                      )}
                      placeholder="The Most Asked Questions"
                    />
                  </InputGroup>
                </Field>

                <Separator />
                {faqCards.fields.map((field, index) => (
                  <Card key={field.id} className="border-dashed">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-bold">
                          FAQ #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => faqCards.remove(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <Field>
                        <FieldLabel>Question</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `content.${selectedLanguage}.faq.faqCards.${index}.question` as any,
                            )}
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Answer</FieldLabel>
                        <Textarea
                          {...register(
                            `content.${selectedLanguage}.faq.faqCards.${index}.answer` as any,
                          )}
                        />
                      </Field>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </CardBody>
          </Card>

          {/* Download Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Download App Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Heading (H2)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.download.h2` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${selectedLanguage}.download.p` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Features</FieldLabel>
                    <Controller
                      name={`content.${selectedLanguage}.download.list` as any}
                      control={control}
                      render={({ field }) => (
                        <FeaturesAddonInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <Card className="p-2">
                    <CardTitle className="mb-2 text-xs">Qr Code</CardTitle>
                    <Controller
                      name={
                        `content.${selectedLanguage}.download.qr.src` as any
                      }
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrlV2
                          value={field.value}
                          onChange={field.onChange}
                          title="Icon"
                        />
                      )}
                    />
                    <Field>
                      <FieldLabel>Alt Text</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.download.qr.alt` as any,
                          )}
                          placeholder="Alt text"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                  <Card className="p-2">
                    <CardTitle className="mb-2 text-xs">App Store</CardTitle>
                    <Controller
                      name={
                        `content.${selectedLanguage}.download.appStore.src` as any
                      }
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrlV2
                          value={field.value}
                          onChange={field.onChange}
                          title="Icon"
                        />
                      )}
                    />
                    <Field>
                      <FieldLabel>Alt Text</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.download.appStore.alt` as any,
                          )}
                          placeholder="Alt text"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Link</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.download.appStore.link` as any,
                          )}
                          placeholder="Link"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                  <Card className="p-2">
                    <CardTitle className="mb-2 text-xs">Play Store</CardTitle>
                    <Controller
                      name={
                        `content.${selectedLanguage}.download.playStore.src` as any
                      }
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrlV2
                          value={field.value}
                          onChange={field.onChange}
                          title="Icon"
                        />
                      )}
                    />
                    <Field>
                      <FieldLabel>Alt Text</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.download.playStore.alt` as any,
                          )}
                          placeholder="Alt text"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Link</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.download.playStore.link` as any,
                          )}
                          placeholder="Link"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                  <Card className="p-2">
                    <CardTitle className="mb-2 text-xs">Main Image</CardTitle>
                    <Controller
                      name={
                        `content.${selectedLanguage}.download.image.src` as any
                      }
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrlV2
                          value={field.value}
                          onChange={field.onChange}
                          title="Image"
                        />
                      )}
                    />
                    <Field>
                      <FieldLabel>Fig Caption</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `content.${selectedLanguage}.download.image.fig` as any,
                          )}
                          placeholder="Fig Caption"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                </div>
              </CardContent>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === "seo" && (
        <SEOSection form={form} metaKeywordsData={metaKeywordsData} />
      )}

      {activeTab === "jsonld" && <JSONLDSection form={form} />}
    </div>
  );
}

export default function ServiceForm({
  initialData,
  onSubmit,
  type,
}: ServiceFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );
  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  const normalizedData = useMemo(
    () => normalizeServiceData(initialData),
    [initialData],
  );

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(multiLangServiceSchema) as any,
    defaultValues: normalizedData,
  });

  const { handleSubmit, watch, setValue, getValues } = form;
  const availableLanguages = watch("availableLanguages") || ["en"];

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);

    const currentData = getValues();
    const content = currentData.content || {};

    // Initialize content for new language if not exists
    if (!content[lang]) {
      setValue(`content.${lang}`, getEmptyLanguageContent());
    }

    if (!availableLanguages.includes(lang)) {
      setValue("availableLanguages", [...availableLanguages, lang]);
    }

    // Switch to general if switching to non-en and currently on restricted tabs
    if (lang !== "en" && (activeTab === "seo" || activeTab === "jsonld")) {
      setActiveTab("general");
    }
  };

  const onHandleSubmit: SubmitHandler<ServiceFormData> = (data) => {
    const submissionData = structuredClone(data);

    // Remove empty placeholder price cards so DB only stores meaningful cards.
    Object.keys(submissionData.content || {}).forEach((lang) => {
      const cards = submissionData.content?.[lang]?.premiumFleet?.priceCards;
      if (!Array.isArray(cards)) return;

      submissionData.content[lang].premiumFleet.priceCards = cards.filter(
        (card: any) => {
          const hasSrc =
            card?.src instanceof File ||
            (typeof card?.src === "string" && card.src.trim() !== "");
          const hasPriceInfo =
            typeof card?.priceInfo === "string" && card.priceInfo.trim() !== "";
          const hasRating =
            typeof card?.rating === "string" && card.rating.trim() !== "";
          const hasCarInfo =
            typeof card?.CarInfo === "string" && card.CarInfo.trim() !== "";
          const hasButtonText =
            typeof card?.buttonText === "string" &&
            card.buttonText.trim() !== "";
          const hasButtonLink =
            typeof card?.buttonLink === "string" &&
            card.buttonLink.trim() !== "";
          const hasFeatures =
            Array.isArray(card?.features) &&
            card.features.some(
              (feature: any) =>
                typeof feature === "string" && feature.trim() !== "",
            );

          return (
            hasSrc ||
            hasPriceInfo ||
            hasRating ||
            hasCarInfo ||
            hasButtonText ||
            hasButtonLink ||
            hasFeatures
          );
        },
      );
    });

    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });
    onSubmit(formData as any);
  };

  const handleSyncSlug = () => {
    const currentTitle = form.getValues("pageName");
    if (currentTitle) {
      form.setValue("slug", generateSlug(currentTitle), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-6">
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Service Page - Multi-Language</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selector & Status */}
              <div className="space-y-4">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  availableLanguages={LANGUAGE_CODES}
                />
              </div>

              {/* Shared Fields */}
              <Card>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Page Details (Shared)</CardTitle>
                    <CardAction>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Active</span>
                        <Controller
                          name="isActive"
                          control={form.control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="pageName">
                          Page Name (Title){" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="pageName"
                            type="text"
                            placeholder="e.g. Airport Transfers"
                            {...form.register("pageName")}
                          />
                          <InputGroupAddon>
                            <IconFileText className="w-4 h-4" />
                          </InputGroupAddon>
                        </InputGroup>
                        {form.formState.errors.pageName && (
                          <FormMessage>
                            {form.formState.errors.pageName.message}
                          </FormMessage>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="slug">
                          Slug (URL) <span className="text-red-500">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="slug"
                            type="text"
                            placeholder="e.g. airport-transfers"
                            {...form.register("slug")}
                          />
                          <InputGroupAddon>
                            <Link2 className="w-4 h-4" />
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              onClick={handleSyncSlug}
                              size="icon-sm"
                              tooltip="Regenerate slug from title"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {form.formState.errors.slug && (
                          <FormMessage>
                            {form.formState.errors.slug.message}
                          </FormMessage>
                        )}
                      </Field>
                    </div>
                  </CardContent>
                </CardBody>
              </Card>

              {/* Tab Navigation */}
              <div className="flex gap-8">
                <Button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "general"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  General ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  variant="ghost"
                  spacing="sm"
                  disabled={selectedLanguage !== "en"}
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "seo"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  } ${selectedLanguage !== "en" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  SEO (Shared)
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("jsonld")}
                  variant="ghost"
                  spacing="sm"
                  disabled={selectedLanguage !== "en"}
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "jsonld"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  } ${selectedLanguage !== "en" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  JSON-LD (Shared)
                </Button>
              </div>

              <LanguageFields
                key={selectedLanguage}
                selectedLanguage={selectedLanguage}
                activeTab={activeTab}
                form={form}
                metaKeywordsData={metaKeywordsData}
              />
            </CardContent>
          </CardBody>
        </Card>

        {/* Form Actions */}
        <Card className="sticky z-10 bottom-6 bg-base-white/80 backdrop-blur">
          <CardBody className="p-4">
            <CardContent className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outlinePrimary"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
              <Button type="submit">Submit {type}</Button>
            </CardContent>
          </CardBody>
        </Card>
      </form>
    </FormProvider>
  );
}

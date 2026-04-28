/**
 * ================================
 * v4 - Refactored with Modular Components
 * ================================
 */

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Copy, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
import LanguageSelector from "@/components/language/LanguageSelector";
import BusinessPreviewRenderer from "@/components/pagebuilder/partials/BusinessPreviewRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
// import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import { useSticky } from "@/hooks/useSticky";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import {
  contentBlockSchema,
  // pageTemplateSchema,
  heroSchema,
  // type PageTemplateFormData,
  type PageTemplateWithTimestamps,
  type Sections,
} from "@/types/pagebuilder.types";
import { jsonToFormData } from "@/utils/formData.utils";
import { formatDateTime, uid } from "@/utils/pagebuilder.utils.tsx";
import { safeZodResolver } from "@/utils/safeZodResolver";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../contentManagement/shared/JSONLDSection";
import { SEOSection } from "../contentManagement/shared/SEOSection";
import {
  jsonLdSchema as sharedJsonLdSchema,
  seoSchema as sharedSeoSchema,
} from "../contentManagement/shared/sharedSchemas";
import { Badge } from "../ui/badge";
import {
  BookRideSectionBlock,
  FaqSectionBlock,
  LayoutBlock,
  PremiumFleetSectionBlock,
  ServiceSectionBlock,
  // ContactForServiceBlock,
  // CorporateServiceOfferingsBlock,
  SideImageSectionBlock,
  SortableItem,
} from ".";

export const keywordSuggestions = [
  "SEO",
  "Search Engine Optimization",
  "Social Media",
  "Social Marketing",
  "Marketing",
  "Market Research",
  "Google",
  "Google Ads",
  "Google Analytics",
  "Content",
  "Content Writing",
  "Content Strategy",
  "Copywriting",
  "Conversion Rate",
  "Campaign Management",
  "Customer Engagement",
  "Email Marketing",
  "Ecommerce",
  "Brand Strategy",
  "Business Growth",
];

export const multiLangPageTemplateSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean(),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  hero: z.record(z.string(), heroSchema),
  content: z
    .preprocess(
      (val) => {
        // If content is an array, convert to record format
        if (Array.isArray(val)) {
          return { [DEFAULT_LANGUAGE]: val };
        }
        // If content is an object/record, ensure each language value is an array
        if (val && typeof val === "object") {
          const normalized: Record<string, any[]> = {};
          Object.entries(val).forEach(([key, value]) => {
            normalized[key] = Array.isArray(value) ? value : [];
          });
          return normalized;
        }
        return { [DEFAULT_LANGUAGE]: [] };
      },
      z.record(z.string(), z.array(contentBlockSchema)),
    )
    .default({ [DEFAULT_LANGUAGE]: [] }),
  seo: sharedSeoSchema,
  jsonLd: sharedJsonLdSchema,
  sequence: z.coerce.number().optional().default(0),
});

export type MultiLangPageTemplateFormData = z.infer<
  typeof multiLangPageTemplateSchema
>;

const getEmptyLanguageContent = () => ({
  pageName: "",
  slug: "",
  defaultLanguage: "en",
  availableLanguages: [],
  hero: {
    image: "",
    alt: "",
    h1: "",
    h2: "",
    btn: "",
    btnLink: "",
  },
  content: [],
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

const normalizeTemplateData = (data: any): MultiLangPageTemplateFormData => {
  if (!data)
    return {
      pageName: "",
      slug: "",
      isActive: true,
      defaultLanguage: DEFAULT_LANGUAGE,
      availableLanguages: [DEFAULT_LANGUAGE],
      hero: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent().hero },
      content: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent().content },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
      sequence: 0,
    };

  const languages = data.availableLanguages || [DEFAULT_LANGUAGE];
  const defaultLang = data.defaultLanguage || DEFAULT_LANGUAGE;

  // Extract Shared SEO/JSON-LD
  let sharedSeo = data.seo;
  let sharedJsonLd = data.jsonLd;

  // Normalize SEO
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

  // Normalize JSON-LD
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

  const normalized: MultiLangPageTemplateFormData = {
    pageName: data.pageName || "",
    slug: data.slug || "",
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    defaultLanguage: defaultLang,
    availableLanguages: languages,
    hero: {},
    content: {},
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
    sequence: typeof data.sequence === "number" ? data.sequence : 0,
  };

  languages.forEach((lang: string) => {
    // 1. Handle Hero Isolation
    let langHero: {
      image: string;
      alt: string;
      h1: string;
      h2: string;
      btn: string;
      btnLink: string;
    };
    if (
      data.hero &&
      typeof data.hero === "object" &&
      !Array.isArray(data.hero) &&
      data.hero[lang]
    ) {
      // Already a record with this language
      langHero = data.hero[lang];
    } else if (lang === defaultLang && data.hero && !data.hero[lang]) {
      // Old format, map to default language
      langHero = data.hero;
    } else {
      langHero = getEmptyLanguageContent().hero;
    }
    normalized.hero[lang] = structuredClone(
      langHero || getEmptyLanguageContent().hero,
    );

    // 2. Handle Content Isolation
    let langContent: any;
    if (
      data.content &&
      typeof data.content === "object" &&
      !Array.isArray(data.content) &&
      Array.isArray(data.content[lang])
    ) {
      // New format: content is a record with arrays
      langContent = data.content[lang];
    } else if (lang === defaultLang && Array.isArray(data.content)) {
      // Old format: content itself is an array
      langContent = data.content;
    } else {
      langContent = getEmptyLanguageContent().content;
    }
    normalized.content[lang] = structuredClone(langContent || []);
  });

  return normalized;
};

export default function PageTemplateEditor({
  initialData,
  onSubmit,
}: {
  initialData?: PageTemplateWithTimestamps;
  onSubmit: (data: MultiLangPageTemplateFormData) => void;
}) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "content" | "seo" | "jsonld"
  >("general");

  const normalizedData = useMemo(
    () => normalizeTemplateData(initialData),
    [initialData],
  );

  const form = useForm<MultiLangPageTemplateFormData>({
    resolver: safeZodResolver(multiLangPageTemplateSchema) as any,
    defaultValues: normalizedData,
    shouldUnregister: false,
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = form;

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  const [mediaOpen, setMediaOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaCb, setMediaCb] = useState<null | ((url: string) => void)>(null);
  const [apiOpen, setApiOpen] = useState(false);

  // Log validation errors
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors);
  }
  // const availableLanguages = watch("availableLanguages") || [DEFAULT_LANGUAGE];

  // Field Arrays for selected language
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: `content.${selectedLanguage}` as any,
    keyName: "_key",
  });

  const ensureLanguageExists = (lang: LanguageCode) => {
    const values = getValues();

    const nextHero = values.hero?.[lang] ?? getEmptyLanguageContent().hero;
    const nextContent = Array.isArray(values.content?.[lang])
      ? values.content?.[lang]
      : getEmptyLanguageContent().content;

    // Always set with a clone to avoid shared references across languages.
    setValue(`hero.${lang}` as any, structuredClone(nextHero), {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue(`content.${lang}` as any, structuredClone(nextContent), {
      shouldDirty: false,
      shouldValidate: false,
    });
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    const values = getValues();
    // console.log("values=>>", values);
    ensureLanguageExists(lang);

    const currentLanguages = values.availableLanguages || [DEFAULT_LANGUAGE];
    if (!currentLanguages.includes(lang)) {
      setValue("availableLanguages", [...currentLanguages, lang], {
        shouldDirty: true,
        shouldValidate: false,
      });
    }

    setSelectedLanguage(lang);

    if (
      lang !== DEFAULT_LANGUAGE &&
      ["general", "seo", "jsonld"].includes(activeTab)
    ) {
      setActiveTab("hero");
    }
  };

  //   const handleLanguageChange = (lang: LanguageCode) => {
  //     setSelectedLanguage(lang);
  //     const values = getValues();
  //     console.log("currentData=>", values);

  //     ["hero", "content"].forEach((section) => {
  //   const sectionData = values[section as keyof PageTemplateFormData];

  //   if (!sectionData || !(sectionData as any)[lang]) {
  //     const empty = getEmptyLanguageContent();
  //     setValue(
  //       `${section}.${lang}` as any,
  //       (empty as any)[section],
  //       { shouldDirty: false }
  //     );
  //   }
  // });

  //   // if (!values.hero || !values.hero[lang]) {
  //   //   setValue(`hero.${lang}`, getEmptyLanguageContent().hero, {
  //   //     shouldDirty: false,
  //   //     shouldValidate: false,
  //   //   });
  //   // }

  //   // // CONTENT
  //   // if (!values.content || !values.content[lang]) {
  //   //   setValue(`content.${lang}`, getEmptyLanguageContent().content, {
  //   //     shouldDirty: false,
  //   //     shouldValidate: false,
  //   //   });
  //   // }

  //     if (!availableLanguages.includes(lang)) {
  //       setValue("availableLanguages", [...availableLanguages, lang], { shouldDirty: true, shouldValidate: false });
  //     }

  //     // Switch to content if switching to non-default and currently on shared tabs
  //     if (lang !== DEFAULT_LANGUAGE && (activeTab === "general" || activeTab === "seo" || activeTab === "jsonld")) {
  //       setActiveTab("hero");
  //     }
  //   };

  useEffect(() => {
    // This effect ensures each block has an ID, but it's now per-language.
    const c = getValues().content?.[selectedLanguage];
    if (Array.isArray(c) && c.length > 0) {
      const needsId = c.some((b: any) => !b.id);
      if (needsId) {
        const next = c.map((b: any) => ({ id: b.id || uid(), ...b }));
        setValue(`content.${selectedLanguage}` as any, next as any, {
          shouldValidate: false,
        });
      }
    }
  }, [selectedLanguage, getValues, setValue]);

  useEffect(() => {
    // Keep field array in sync when switching languages
    const next = getValues().content?.[selectedLanguage];
    replace(Array.isArray(next) ? next : []);
  }, [selectedLanguage, getValues, replace]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Increased distance for better UX
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item: any) => item._key === active.id);
      const newIndex = fields.findIndex((item: any) => item._key === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  // ... rest of your component code remains the same until the content tab ...
  const openMedia = (cb: (url: string) => void) => {
    setMediaCb(() => cb);
    setMediaOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaCb) mediaCb(url);
    setMediaOpen(false);
    setMediaCb(null);
  };

  const watched = watch();

  // Real-time normalization: ensure content is always a record, never an array
  useEffect(() => {
    if (Array.isArray(watched.content)) {
      console.error(
        "Content became an array! Converting back to record...",
        watched.content,
      );
      const languages = watched.availableLanguages || [DEFAULT_LANGUAGE];
      const contentRecord: Record<string, Sections[]> = {};

      languages.forEach((lang) => {
        if (
          lang === DEFAULT_LANGUAGE ||
          lang === (watched as any).defaultLanguage
        ) {
          contentRecord[lang] = watched.content?.[lang] ?? [];
        } else {
          contentRecord[lang] = [];
        }
      });
      setValue("content", contentRecord, { shouldValidate: false });
    } else if (watched.content && typeof watched.content === "object") {
      // Also check each language value
      const languages = watched.availableLanguages || [DEFAULT_LANGUAGE];
      languages.forEach((lang: string) => {
        const langContent = watched.content[lang];
        if (langContent && !Array.isArray(langContent)) {
          console.error(`content[${lang}] is not an array!`, langContent);
          setValue(`content.${lang}` as any, [], { shouldValidate: false });
        }
      });
    }
  }, [watched.content, watched.availableLanguages, setValue]);

  const handleSyncSlug = () => {
    const currentTitle = getValues("pageName");
    if (currentTitle) {
      setValue("slug", generateSlug(currentTitle), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    const previousTitle = watched.pageName || "";
    const currentSlug = watched.slug || "";
    const previousAutoSlug = previousTitle ? generateSlug(previousTitle) : "";

    const shouldSyncSlug = !currentSlug || currentSlug === previousAutoSlug;
    if (shouldSyncSlug) {
      setValue("slug", generateSlug(newTitle), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Robustly derive preview content by combining 'fields' (correct order)
  // with 'watched.content' (live values) using the stable 'id'.
  const currentLangContent = watched.content?.[selectedLanguage] || [];
  const previewContent = fields.map((field: any) => {
    const liveValue = currentLangContent.find((c: any) => c.id === field.id);
    return liveValue || field;
  });

  const previewData = {
    ...watched,
    hero: watched.hero?.[selectedLanguage] || getEmptyLanguageContent().hero,
    content: previewContent,
    seo: watched.seo || getEmptySeo(),
    jsonLd: watched.jsonLd || getEmptyJsonLd(),
  };

  const onHandleSubmit = (data: any) => {
    console.log("onHandleSubmit raw data=>>", data);

    // Ensure content is a record with array values for all availableLanguages
    const normalizedData = { ...data };
    const langs = normalizedData.availableLanguages || [DEFAULT_LANGUAGE];

    // 1. Basic normalization (ensure arrays)
    if (
      normalizedData.content &&
      typeof normalizedData.content === "object" &&
      !Array.isArray(normalizedData.content)
    ) {
      langs.forEach((lang: string) => {
        const langContent = (normalizedData.content as any)[lang];
        if (langContent && !Array.isArray(langContent)) {
          (normalizedData.content as any)[lang] = [];
        } else if (!langContent) {
          (normalizedData.content as any)[lang] = [];
        }
      });
    }

    // 2. Filter out empty non-default languages
    // Keep DEFAULT_LANGUAGE always. For others, check if they have content.
    const finalHero: Record<string, any> = {};
    const finalContent: Record<string, any[]> = {};

    langs.forEach((lang: string) => {
      const hero = normalizedData.hero?.[lang];
      const content = (normalizedData.content as any)?.[lang] || [];

      const isHeroEmpty =
        !hero || (!hero.image && !hero.h1 && !hero.h2 && !hero.btn);
      const isContentEmpty = content.length === 0;

      // Keep if it's the default language OR if it has actual data
      if (lang === DEFAULT_LANGUAGE || !isHeroEmpty || !isContentEmpty) {
        if (hero) finalHero[lang] = hero;
        finalContent[lang] = content;
      }
    });

    normalizedData.hero = finalHero;
    normalizedData.content = finalContent;
    // Also update availableLanguages to only include those with data (plus default)
    normalizedData.availableLanguages = Object.keys(finalContent);

    console.log("onHandleSubmit filtered data=>>", normalizedData);

    const formData = jsonToFormData(normalizedData, { fileKeyMode: "path" });
    onSubmit(formData as any);
  };

  // Sticky hook for the Block Adder panel
  const { stickyRef, sentinelRef } = useSticky(100, 768, activeTab);
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>{watched.pageName || "Untitled Page"}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {initialData?.updatedAt ? (
                    <span>
                      Last Modified {formatDateTime(initialData.updatedAt)}
                    </span>
                  ) : (
                    <span>Draft Page</span>
                  )}
                </CardDescription>
                <CardAction className="flex items-center gap-3">
                  <Button type="button" onClick={() => setApiOpen(true)}>
                    API
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outlinePrimary"
                  >
                    {showPreview ? "Back to Editor" : "Live Preview"}
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="">
                {/* Language Selector */}
                <div className="mb-6">
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                    availableLanguages={LANGUAGE_CODES}
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-8">
                  <div className="flex gap-8">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("general")}
                      variant="ghost"
                      spacing="sm"
                      disabled={selectedLanguage !== DEFAULT_LANGUAGE}
                      className={`capitalize border-b-2 rounded-none transition ${
                        activeTab === "general"
                          ? "border-base-black font-semibold text-primary"
                          : "border-transparent text-gray-500"
                      } ${selectedLanguage !== DEFAULT_LANGUAGE ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      General (Shared)
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("hero")}
                      variant="ghost"
                      spacing="sm"
                      className={`capitalize border-b-2 rounded-none transition ${
                        activeTab === "hero"
                          ? "border-base-black font-semibold text-primary"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      Hero ({selectedLanguage.toUpperCase()})
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("content")}
                      variant="ghost"
                      spacing="sm"
                      className={`capitalize border-b-2 rounded-none transition ${
                        activeTab === "content"
                          ? "border-base-black font-semibold text-primary"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      Content ({selectedLanguage.toUpperCase()})
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("seo")}
                      variant="ghost"
                      spacing="sm"
                      disabled={selectedLanguage !== DEFAULT_LANGUAGE}
                      className={`capitalize border-b-2 rounded-none transition ${
                        activeTab === "seo"
                          ? "border-base-black font-semibold text-primary"
                          : "border-transparent text-gray-500"
                      } ${selectedLanguage !== DEFAULT_LANGUAGE ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      SEO (Shared)
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("jsonld")}
                      variant="ghost"
                      spacing="sm"
                      disabled={selectedLanguage !== DEFAULT_LANGUAGE}
                      className={`capitalize border-b-2 rounded-none transition ${
                        activeTab === "jsonld"
                          ? "border-base-black font-semibold text-primary"
                          : "border-transparent text-gray-500"
                      } ${selectedLanguage !== DEFAULT_LANGUAGE ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      JSON-LD (Shared)
                    </Button>
                  </div>
                </div>

                <Separator orientation="horizontal" className="mb-6 " />

                {/* Main Content */}
                <div className="">
                  {/* Editor Panel */}
                  <div
                    className={`transition-all duration-300 ${
                      showPreview ? "hidden" : "w-full"
                    }`}
                  >
                    <div className="w-full space-y-6">
                      {/* General Tab */}
                      {activeTab === "general" && (
                        <div className="space-y-6">
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>Page Title & Slug</CardTitle>
                              </CardHeader>
                              <CardContent className="flex gap-4">
                                <Field>
                                  <FieldLabel
                                    htmlFor="pageName"
                                    className="text-base-black gap-0"
                                  >
                                    Title{" "}
                                    <span className="text-base-danger">*</span>
                                  </FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      id="pageName"
                                      type="text"
                                      placeholder="Enter page title"
                                      {...register("pageName", {
                                        onChange: handleTitleChange,
                                      })}
                                      className={
                                        errors.pageName
                                          ? "border-base-danger"
                                          : ""
                                      }
                                    />
                                  </InputGroup>
                                  <FieldDescription>
                                    Enter the Title here.
                                  </FieldDescription>
                                  {errors.pageName && (
                                    <FormMessage>
                                      {errors.pageName.message}
                                    </FormMessage>
                                  )}
                                </Field>

                                <Field>
                                  <FieldLabel
                                    htmlFor="slug"
                                    className="text-base-black gap-0"
                                  >
                                    Slug{" "}
                                    <span className="text-base-danger">*</span>
                                  </FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      id="slug"
                                      type="text"
                                      placeholder="Enter page slug"
                                      {...register("slug")}
                                      className={
                                        errors.slug ? "border-base-danger" : ""
                                      }
                                    />
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        onClick={handleSyncSlug}
                                        size="icon-sm"
                                        tooltip="Regenerate slug from title"
                                        className="hover:bg-transparent"
                                      >
                                        <RefreshCw />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <FieldDescription>
                                    Enter the Slug here.
                                  </FieldDescription>
                                  {errors.slug && (
                                    <FormMessage>
                                      {errors.slug.message}
                                    </FormMessage>
                                  )}
                                </Field>

                                <Field>
                                  <FieldLabel
                                    htmlFor="sequence"
                                    className="text-base-black gap-0"
                                  >
                                    Menu Sequence
                                  </FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      id="sequence"
                                      type="number"
                                      placeholder="0"
                                      {...register("sequence")}
                                      className={
                                        errors.sequence
                                          ? "border-base-danger"
                                          : ""
                                      }
                                    />
                                  </InputGroup>
                                  <FieldDescription>
                                    Menu item display order (ascending).
                                  </FieldDescription>
                                  {errors.sequence && (
                                    <FormMessage>
                                      {errors.sequence.message}
                                    </FormMessage>
                                  )}
                                </Field>
                              </CardContent>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* Hero Tab */}
                      {activeTab === "hero" && (
                        <div
                          key={`hero-${selectedLanguage}`}
                          className="space-y-6"
                        >
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>
                                  Hero Section ({selectedLanguage.toUpperCase()}
                                  )
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`hero.${selectedLanguage}.image`}
                                    >
                                      Hero Image URL
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `hero.${selectedLanguage}.image` as any
                                      }
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`hero.${selectedLanguage}.image`}
                                            type="text"
                                            placeholder="https://..."
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`hero.${selectedLanguage}.alt`}
                                    >
                                      Alt Text
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `hero.${selectedLanguage}.alt` as any
                                      }
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`hero.${selectedLanguage}.alt`}
                                            type="text"
                                            placeholder="Image description"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`hero.${selectedLanguage}.h1`}
                                    >
                                      Heading 1
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `hero.${selectedLanguage}.h1` as any
                                      }
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`hero.${selectedLanguage}.h1`}
                                            type="text"
                                            placeholder="Hero heading"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`hero.${selectedLanguage}.h2`}
                                    >
                                      Heading 2
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `hero.${selectedLanguage}.h2` as any
                                      }
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`hero.${selectedLanguage}.h2`}
                                            type="text"
                                            placeholder="Hero sub heading"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`hero.${selectedLanguage}.btn`}
                                    >
                                      Button Text
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `hero.${selectedLanguage}.btn` as any
                                      }
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`hero.${selectedLanguage}.btn`}
                                            type="text"
                                            placeholder="Button label"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`hero.${selectedLanguage}.btnLink`}
                                    >
                                      Button Link
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `hero.${selectedLanguage}.btnLink` as any
                                      }
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`hero.${selectedLanguage}.btnLink`}
                                            type="text"
                                            placeholder="Button link"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                </div>
                              </CardContent>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* Content Tab */}
                      {activeTab === "content" && (
                        <div
                          key={`content-${selectedLanguage}`}
                          className="flex flex-col md:flex-row gap-6 h-full"
                        >
                          <div className="w-full [992px]:w-3/4 lg:w-7/12 xl:w-9/12 flex flex-col gap-3">
                            <h3 className="text-xl font-bold leading-[120%] font-montserrat">
                              Content Blocks
                            </h3>
                            {fields.length === 0 ? (
                              <div className="flex-1 text-center border border-dashed border-base-gray rounded p-2 grid place-content-center">
                                <p className="text-base-gray">
                                  No blocks added yet. Use the sidebar to add
                                  your first block.
                                </p>
                              </div>
                            ) : (
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                              >
                                <div className="space-y-4">
                                  <SortableContext
                                    items={fields.map((f: any) => f._key)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    {fields.map((field: any, index: number) => {
                                      const type = field.type;
                                      return (
                                        <SortableItem
                                          key={field._key}
                                          id={field._key}
                                        >
                                          <LayoutBlock
                                            block={{ type }}
                                            index={index}
                                            onRemove={() => remove(index)}
                                            onMoveUp={() =>
                                              move(index, index - 1)
                                            }
                                            onMoveDown={() =>
                                              move(index, index + 1)
                                            }
                                            canMoveUp={index > 0}
                                            canMoveDown={
                                              index < fields.length - 1
                                            }
                                          >
                                            {type === "serviceSection" && (
                                              <ServiceSectionBlock
                                                selectedLanguage={
                                                  selectedLanguage
                                                }
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type === "sideImageSection" && (
                                              <SideImageSectionBlock
                                                selectedLanguage={
                                                  selectedLanguage
                                                }
                                                blockIndex={index}
                                              />
                                            )}
                                            {type === "faqSection" && (
                                              <FaqSectionBlock
                                                selectedLanguage={
                                                  selectedLanguage
                                                }
                                                blockIndex={index}
                                              />
                                            )}
                                            {type === "bookRideSection" && (
                                              <BookRideSectionBlock
                                                selectedLanguage={
                                                  selectedLanguage
                                                }
                                                blockIndex={index}
                                              />
                                            )}
                                            {type === "premiumFleetSection" && (
                                              <PremiumFleetSectionBlock
                                                selectedLanguage={
                                                  selectedLanguage
                                                }
                                                blockIndex={index}
                                              />
                                            )}
                                            {/* {type ===
                                              "dedicatedServiceSection" && (
                                              <DedicatedServiceSectionBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type ===
                                              "corporateServiceOfferings" && (
                                              <CorporateServiceOfferingsBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type ===
                                              "corporateServicesAndFeatures" && (
                                              <CorporateServicesAndFeaturesBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type === "imageCards" && (
                                              <ImageCardsBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type === "whoWeSupport" && (
                                              <ImageCardsBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type === "ourGlobalReach" && (
                                              <ImageCardsBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
                                            )}
                                            {type === "contactForService" && (
                                              <ContactForServiceBlock
                                                blockIndex={index}
                                              />
                                            )} */}
                                          </LayoutBlock>
                                        </SortableItem>
                                      );
                                    })}
                                  </SortableContext>
                                </div>
                              </DndContext>
                            )}
                          </div>

                          {/* Block Selector Sidebar */}
                          <div className="w-full [992px]:w-1/4 lg:w-5/12 xl:w-3/12">
                            <div ref={sentinelRef} className="h-px"></div>
                            <Card ref={stickyRef}>
                              <CardBody>
                                <CardHeader>
                                  <CardTitle>Add Blocks</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "serviceSection",
                                        service: "",
                                        subService: "",
                                        infoCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Service Section Block
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "sideImageSection",
                                        src: "",
                                        alt: "",
                                        headingTop: "",
                                        headingBottom: "",
                                        description: "",
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Side Image Section Block
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "bookRideSection",
                                        heading: "",
                                        description: "",
                                        btn: "",
                                        btnLink: "",
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Book Ride Section Block
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "premiumFleetSection",
                                        serviceCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Premium Fleet Section Block
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "faqSection",
                                        heading: "",
                                        faqCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + FAQ Section Block
                                  </Button>
                                  {/* <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "dedicatedServiceSection",
                                        img: "",
                                        textRich: "",
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Dedicated Service
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "corporateServiceOfferings",
                                        serviceCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Corporate Offerings
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "corporateServicesAndFeatures",
                                        infoCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Features
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "whoWeSupport",
                                        imageCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Who We Support
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "contactForService",
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Contact CTA
                                  </Button> */}
                                </CardContent>
                              </CardBody>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* SEO Tab */}
                      {activeTab === "seo" && (
                        <SEOSection
                          form={form}
                          // selectedLanguage={selectedLanguage}
                          metaKeywordsData={metaKeywordsData}
                        />
                      )}

                      {/* JSON-LD Tab */}
                      {activeTab === "jsonld" && (
                        <JSONLDSection
                          form={form}
                          // selectedLanguage={selectedLanguage}
                        />
                      )}
                    </div>
                    <Separator className="my-6" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => reset()}
                        variant="outlinePrimary"
                      >
                        Reset
                      </Button>
                      <Button type="submit">Submit</Button>
                    </div>
                  </div>
                  {/* Live Preview Panel */}
                  {showPreview && (
                    <div className="w-full bg-background p-0 overflow-y-auto">
                      <div className="border-b border-border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h2 className="text-lg font-bold">Preview Mode</h2>
                            <p className="text-sm text-base-gray">
                              Viewing: {watched.pageName || "Untitled Page"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge>Preview Mode</Badge>
                            <Button
                              onClick={() => setShowPreview(false)}
                              variant="outlinePrimary"
                              spacing="sm"
                            >
                              Back to Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Render the actual preview */}
                      <BusinessPreviewRenderer
                        data={previewData}
                        language={selectedLanguage}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Media Library Modal */}
          {mediaOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-11/12 md:w-2/3 max-h-3/4 overflow-auto">
                <CardHeader>
                  <CardTitle>Media Library</CardTitle>
                  <CardAction>
                    <Button
                      onClick={() => setMediaOpen(false)}
                      variant="outline"
                      spacing="sm"
                    >
                      Close
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      "https://placehold.co/800/400",
                      "https://placehold.co/1200/630",
                      "https://placehold.co/600/400",
                    ].map((s) => (
                      <div
                        key={s}
                        className="border border-border p-2 rounded text-center"
                      >
                        <img
                          src={s}
                          alt="media"
                          className="w-full h-28 object-cover rounded mb-2"
                        />
                        <Button
                          onClick={() => handleMediaSelect(s)}
                          variant="outline"
                          spacing="sm"
                          size="sm"
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* API Preview Modal */}
          {apiOpen && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setApiOpen(false)}
            >
              <Card
                className="w-full sm:max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <CardBody className="p-2">
                  <CardHeader>
                    <CardTitle>API Output</CardTitle>
                    <CardAction className="flex gap-2">
                      <Button
                        type="button"
                        variant="outlineNavBtnPrimary"
                        size="lg"
                        spacing="sm"
                        className="w-8"
                        tooltip="Copy Json"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(JSON.stringify(getValues(), null, 2))
                            .then(() => {
                              toast.success("Copied to clipboard!");
                              setApiOpen(false);
                            })
                            .catch((err) => {
                              console.error("Failed to copy: ", err);
                              toast.error("Failed to copy to clipboard");
                            });
                        }}
                      >
                        <Copy />
                      </Button>
                      <Button
                        type="button"
                        variant="outlineNavBtnDestructive"
                        size="lg"
                        spacing="sm"
                        className="w-8"
                        tooltip="Close"
                        onClick={() => setApiOpen(false)}
                      >
                        <X />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded border border-base-gray bg-muted/40 overflow-hidden">
                      <pre className="text-xs p-3 max-h-[55vh] overflow-auto">
                        {JSON.stringify(getValues(), null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

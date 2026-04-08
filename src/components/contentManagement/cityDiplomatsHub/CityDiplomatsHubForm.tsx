import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Building2,
  Clock,
  Globe,
  Plane,
  Plus,
  Route,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
import LanguageSelector from "@/components/language/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

const imageSchema = z.object({
  src: z.any().optional(), // allow Object or String
  alt: z.string().optional(),
});

const heroSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: imageSchema.optional(),
});

const breadCrumbSchema = z.object({
  label: z.string().optional(),
  href: z.string().optional(),
});

const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const whyChooseSchema = z.object({
  headingTop: z.string().optional(),
  headingBottom: z.string().optional(),
  description: z.string().optional(),
  infoCards: z
    .array(
      z.object({
        src: z.any().optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

const trustBlockItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const faqItemSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
});

const statSchema = z.object({
  icon: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
});

const globalCoverageSchema = z.object({
  title: z.string().optional(),
  description1: z.string().optional(),
  description2: z.string().optional(),
  stats: z.array(statSchema).optional(),
  image: imageSchema.optional(),
});

const sectionItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("benefits"),
    items: z.array(sectionItemSchema),
  }),
  z.object({
    type: z.literal("cta"),
    title: z.string().optional(),
    description: z.string().optional(),
    buttonLabel: z.string().optional(),
    buttonLink: z.string().optional(),
  }),
]);

const segmentLinkSchema = z.object({
  label: z.string().optional(),
  href: z.string().optional(),
});

// Language section schema
const languageSectionSchema = z.object({
  hero: heroSchema.optional(),
  breadCrumb: z.array(breadCrumbSchema).optional(),
  intro: introSchema.optional(),
  whyChoose: whyChooseSchema.optional(),
  globalCoverage: globalCoverageSchema.optional(),
  sections: z.array(sectionSchema).optional(),
  segmentLinks: z.object({
    title: z.string().optional(),
    items: z.array(segmentLinkSchema).optional(),
  }),
  trustBlock: z.array(trustBlockItemSchema).optional(),
  faqs: z.array(faqItemSchema).optional(),
});

// Main schema
const cityDiplomatsHubSchema = z.object({
  isActive: z.boolean().default(true),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  content: z.record(z.string(), languageSectionSchema),
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type CityDiplomatsHubFormData = z.infer<typeof cityDiplomatsHubSchema>;

interface CityDiplomatsHubFormProps {
  initialData?: any;
  onSubmit: (data: CityDiplomatsHubFormData) => void;
  type: string;
}

const getEmptyLanguageContent = () => ({
  hero: {
    title: "",
    description: "",
    image: { src: null, alt: "" },
  },
  breadCrumb: [],
  intro: {
    title: "",
    description: "",
  },
  whyChoose: {
    headingTop: "",
    headingBottom: "",
    description: "",
    infoCards: [],
  },
  globalCoverage: {
    title: "",
    description1: "",
    description2: "",
    stats: [],
    image: { src: "", alt: "" },
  },
  sections: [],
  segmentLinks: {
    title: "",
    items: [],
  },
  trustBlock: [],
  faqs: [],
});

// Helper to get empty SEO/JSON-LD
const getEmptySeo = () => ({
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  canonicalUrl: "",
  openGraph: {},
  twitter: {},
});

const getEmptyJsonLd = () => [];

const normalizeCityDiplomatsHubData = (data: any): CityDiplomatsHubFormData => {
  if (!data) {
    return {
      isActive: true,
      availableLanguages: [DEFAULT_LANGUAGE],
      defaultLanguage: DEFAULT_LANGUAGE,
      content: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent() },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };
  }

  const languages = data.availableLanguages || [DEFAULT_LANGUAGE];

  // Extract Shared SEO/JSON-LD
  let sharedSeo = data.seo;
  let sharedJsonLd = data.jsonLd;

  if (
    sharedSeo &&
    !sharedSeo.metaTitle &&
    !sharedSeo.metaDescription &&
    (sharedSeo.en || sharedSeo[DEFAULT_LANGUAGE])
  ) {
    sharedSeo =
      sharedSeo[DEFAULT_LANGUAGE] ||
      sharedSeo.en ||
      Object.values(sharedSeo)[0] ||
      getEmptySeo();
  } else if (!sharedSeo) {
    sharedSeo = getEmptySeo();
  }

  // Ensure nested SEO objects exist
  if (!sharedSeo.openGraph) sharedSeo.openGraph = {};
  if (!sharedSeo.twitter) sharedSeo.twitter = {};

  if (sharedJsonLd && !Array.isArray(sharedJsonLd)) {
    sharedJsonLd =
      sharedJsonLd[DEFAULT_LANGUAGE] ||
      sharedJsonLd.en ||
      Object.values(sharedJsonLd)[0] ||
      getEmptyJsonLd();
  } else if (!sharedJsonLd) {
    sharedJsonLd = getEmptyJsonLd();
  }

  const normalized: CityDiplomatsHubFormData = {
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    availableLanguages: languages,
    defaultLanguage: data.defaultLanguage || DEFAULT_LANGUAGE,
    content: {},
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
  };
  languages.forEach((lang: string) => {
    const contentData = data.content?.[lang] || getEmptyLanguageContent();
    normalized.content[lang] = contentData;
  });

  return normalized;
};

export default function CityDiplomatsHubForm({
  initialData,
  onSubmit,
  type,
}: CityDiplomatsHubFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "hero"
    | "intro"
    | "whyChoose"
    | "globalCoverage"
    | "sections"
    | "segmentLinks"
    | "trustBlock"
    | "faqs"
    | "seo"
    | "jsonld"
  >("general");

  const normalizedData = useMemo(
    () => normalizeCityDiplomatsHubData(initialData),
    [initialData],
  );

  const form = useForm<CityDiplomatsHubFormData>({
    resolver: zodResolver(cityDiplomatsHubSchema) as any,
    defaultValues: normalizedData,
    mode: "onSubmit",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  // Debug: Log validation errors
  useEffect(() => {
    console.log("getValues:", getValues());
    if (Object.keys(errors).length > 0) {
      console.error("CityDiplomatsHubForm validation errors:", errors);
    }
  }, [errors]);

  const availableLanguages = watch("availableLanguages") || ["en"];

  const contentByLanguage =
    useWatch({
      control,
      name: "content",
    }) || {};

  // BreadCrumb array handling
  const breadCrumbItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.breadCrumb,
  )
    ? contentByLanguage[selectedLanguage].breadCrumb
    : [];
  const addBreadCrumb = () => {
    const path = `content.${selectedLanguage}.breadCrumb` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { label: "", href: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const removeBreadCrumb = (index: number) => {
    const path = `content.${selectedLanguage}.breadCrumb` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // infoCards array handling
  const infoCardItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.whyChoose?.infoCards,
  )
    ? contentByLanguage[selectedLanguage].whyChoose.infoCards
    : [];
  const addInfoCard = () => {
    const path = `content.${selectedLanguage}.whyChoose.infoCards` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { label: "", href: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const removeInfoCard = (index: number) => {
    const path = `content.${selectedLanguage}.whyChoose.infoCards` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // Sections array handling
  const sectionItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.sections,
  )
    ? contentByLanguage[selectedLanguage].sections
    : [];

  const hasBenefitsSection = sectionItems.some(
    (s: any) => s?.type === "benefits",
  );
  const hasCtaSection = sectionItems.some((s: any) => s?.type === "cta");

  const addSection = (type: "benefits" | "cta") => {
    const path = `content.${selectedLanguage}.sections` as any;
    const current = getValues(path) || [];

    const newSection =
      type === "benefits"
        ? {
            type: "benefits" as const,
            items: [{ title: "", description: "", icon: "" }],
          }
        : {
            type: "cta" as const,
            title: "",
            description: "",
            buttonLabel: "",
            buttonLink: "",
          };

    setValue(path, [...current, newSection], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const removeSection = (index: number) => {
    const path = `content.${selectedLanguage}.sections` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addSectionItem = (sectionIndex: number) => {
    const path =
      `content.${selectedLanguage}.sections.${sectionIndex}.items` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { title: "", description: "", icon: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    const path =
      `content.${selectedLanguage}.sections.${sectionIndex}.items` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== itemIndex),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const updateSectionType = (index: number, newType: "benefits" | "cta") => {
    const path = `content.${selectedLanguage}.sections` as any;
    const current = getValues(path) || [];
    const updatedSection =
      newType === "benefits"
        ? {
            type: "benefits" as const,
            items: [{ title: "", description: "", icon: "" }],
          }
        : {
            type: "cta" as const,
            title: "",
            description: "",
            buttonLabel: "",
            buttonLink: "",
          };
    const updated = [...current];
    updated[index] = updatedSection;
    setValue(path, updated, { shouldDirty: true, shouldTouch: true });
  };

  // Stats array handling
  const statItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.globalCoverage?.stats,
  )
    ? contentByLanguage[selectedLanguage].globalCoverage.stats
    : [];

  const addStat = () => {
    const path = `content.${selectedLanguage}.globalCoverage.stats` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { icon: "", label: "", value: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const removeStat = (index: number) => {
    const path = `content.${selectedLanguage}.globalCoverage.stats` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // Segment Links array handling
  const segmentLinkItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.segmentLinks?.items,
  )
    ? contentByLanguage[selectedLanguage].segmentLinks?.items
    : [];

  const addSegmentLink = () => {
    const path = `content.${selectedLanguage}.segmentLinks.items` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { label: "", href: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const removeSegmentLink = (index: number) => {
    const path = `content.${selectedLanguage}.segmentLinks.items` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // Trust Block array handling
  const trustBlockItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.trustBlock,
  )
    ? contentByLanguage[selectedLanguage].trustBlock
    : [];

  const addTrustBlockItem = () => {
    const path = `content.${selectedLanguage}.trustBlock` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { title: "", description: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const removeTrustBlockItem = (index: number) => {
    const path = `content.${selectedLanguage}.trustBlock` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // FAQ array handling
  const faqItems = Array.isArray(contentByLanguage?.[selectedLanguage]?.faqs)
    ? contentByLanguage[selectedLanguage].faqs
    : [];

  const addFaqItem = () => {
    const path = `content.${selectedLanguage}.faqs` as any;
    const current = getValues(path) || [];
    setValue(path, [...current, { question: "", answer: "" }], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const removeFaqItem = (index: number) => {
    const path = `content.${selectedLanguage}.faqs` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const onHandleSubmit = (data: CityDiplomatsHubFormData) => {
    console.log("onHandleSubmit called with data:", data);

    const submissionData: CityDiplomatsHubFormData = {
      ...data,
      content: { ...(data.content || {}) },
    };

    // Convert to FormData for file handling
    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });

    onSubmit(formData as any);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    const currentData = getValues();
    if (!currentData.content?.[lang]) {
      const empty = getEmptyLanguageContent();
      setValue(`content.${lang}` as any, empty);
    }
    if (!availableLanguages.includes(lang)) {
      setValue("availableLanguages", [...availableLanguages, lang]);
    }

    // Switch to general if switching to non-en and currently on restricted tabs
    if (lang !== "en" && (activeTab === "seo" || activeTab === "jsonld")) {
      setActiveTab("general");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        className="space-y-6"
      >
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>City Diplomats Hub Page</CardTitle>
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

              {/* Tabs */}
              <div className="flex gap-4 flex-wrap">
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
                  BreadCrumb ({selectedLanguage.toUpperCase()})
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
                  onClick={() => setActiveTab("intro")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "intro"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Intro ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("sections")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "sections"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Sections ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("whyChoose")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "whyChoose"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Why Choose ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("globalCoverage")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "globalCoverage"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Global Coverage ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("trustBlock")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "trustBlock"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Trust Block ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("segmentLinks")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "segmentLinks"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Segment Links ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("faqs")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "faqs"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  FAQs ({selectedLanguage.toUpperCase()})
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

              {/* Tab Content */}
              <div className="pt-4" key={selectedLanguage}>
                {activeTab === "general" && (
                  <div className="space-y-8">
                    {/* Breadcrumb Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Breadcrumb Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <h4 className="font-bold">Breadcrumb Section</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addBreadCrumb}
                            >
                              Add Breadcrumb
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {breadCrumbItems.map((_: any, index: number) => (
                              <Card
                                key={`${selectedLanguage}-breadcrumb-${index}`}
                                className="border border-muted"
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                    <span className="text-xs font-bold text-gray-400 px-2">
                                      BREADCRUMB #{index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeBreadCrumb(index)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Field>
                                      <FieldLabel>Label</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.breadCrumb.${index}.label` as any,
                                          )}
                                          placeholder="Breadcrumb Label"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Url</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.breadCrumb.${index}.href` as any,
                                          )}
                                          placeholder="Breadcrumb Url"
                                        />
                                      </InputGroup>
                                    </Field>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {breadCrumbItems.length === 0 && (
                              <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                                No breadcrumb added. Click &quot;Add
                                Breadcrumb&quot; to create one.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {activeTab === "hero" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.hero.title` as any,
                              )}
                              placeholder="Hero Title"
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.hero.description` as any,
                              )}
                              placeholder="Hero Description"
                            />
                          </InputGroup>
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Controller
                            name={
                              `content.${selectedLanguage}.hero.image.src` as any
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
                          <Field className="col-span-full">
                            <FieldLabel>Image Alt</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.hero.image.alt` as any,
                                )}
                                placeholder="Image Alt"
                              />
                            </InputGroup>
                          </Field>
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "intro" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Intro Section</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.intro.title` as any,
                              )}
                              placeholder="Intro Title"
                            />
                          </InputGroup>
                        </Field>
                        <Controller
                          control={control}
                          name={
                            `content.${selectedLanguage}.intro.description` as any
                          }
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
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "whyChoose" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Why Choose Section</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Heading Top</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.whyChoose.headingTop` as any,
                                )}
                                placeholder="Heading Top"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Heading Bottom</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.whyChoose.headingBottom` as any,
                                )}
                                placeholder="Heading Bottom"
                              />
                            </InputGroup>
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <InputGroup>
                            <Textarea
                              {...register(
                                `content.${selectedLanguage}.whyChoose.description` as any,
                              )}
                              placeholder="Description"
                            />
                          </InputGroup>
                        </Field>
                        <div className="flex justify-between">
                          <h4 className="font-bold">Info Cards</h4>
                          <Button type="button" size="sm" onClick={addInfoCard}>
                            Add Card
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {infoCardItems.map((_: any, index: number) => (
                            <Card
                              key={`${selectedLanguage}-breadcrumb-${index}`}
                              className="border border-muted"
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                  <span className="text-xs font-bold text-gray-400 px-2">
                                    CARD #{index + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeInfoCard(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div>
                                  <Controller
                                    name={
                                      `content.${selectedLanguage}.whyChoose.infoCards.${index}.src` as any
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
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel>Label</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.whyChoose.infoCards.${index}.alt` as any,
                                        )}
                                        placeholder="Breadcrumb image alt"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.whyChoose.infoCards.${index}.title` as any,
                                        )}
                                        placeholder="Title"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field className="col-span-full">
                                    <FieldLabel>Description</FieldLabel>
                                    <InputGroup>
                                      <Textarea
                                        {...register(
                                          `content.${selectedLanguage}.whyChoose.infoCards.${index}.description` as any,
                                        )}
                                        placeholder="Description"
                                      />
                                    </InputGroup>
                                  </Field>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {infoCardItems.length === 0 && (
                            <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                              No info card added. Click &quot;Add Info
                              Card&quot; to create one.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "globalCoverage" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Global Coverage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `content.${selectedLanguage}.globalCoverage.title` as any,
                              )}
                              placeholder="Title"
                            />
                          </InputGroup>
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                          <Field>
                            <FieldLabel>Description 1</FieldLabel>
                            <InputGroup>
                              <Textarea
                                {...register(
                                  `content.${selectedLanguage}.globalCoverage.description1` as any,
                                )}
                                placeholder="Description 1"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Description 2</FieldLabel>
                            <InputGroup>
                              <Textarea
                                {...register(
                                  `content.${selectedLanguage}.globalCoverage.description2` as any,
                                )}
                                placeholder="Description 2"
                              />
                            </InputGroup>
                          </Field>
                        </div>
                        <div className="space-y-4">
                          <Controller
                            name={
                              `content.${selectedLanguage}.globalCoverage.image.src` as any
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
                            <FieldLabel>Image Alt</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.globalCoverage.image.alt` as any,
                                )}
                                placeholder="Image Alt"
                              />
                            </InputGroup>
                          </Field>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <h4 className="font-bold">Stats</h4>
                          <Button type="button" size="sm" onClick={addStat}>
                            Add Stat
                          </Button>
                        </div>
                        {statItems.map((_: any, index: number) => (
                          <Card key={`stat-${index}`} className="border p-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-xs font-bold text-gray-400">
                                STAT #{index + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStat(index)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Field>
                                <FieldLabel>Icon</FieldLabel>
                                <Controller
                                  control={control}
                                  name={
                                    `content.${selectedLanguage}.globalCoverage.stats.${index}.icon` as any
                                  }
                                  render={({ field }) => (
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      value={field.value}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Icon" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="globe">
                                          <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />{" "}
                                            <span>Globe</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="building2">
                                          <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            <span>Building</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="plane">
                                          <div className="flex items-center gap-2">
                                            <Plane className="w-4 h-4" />
                                            <span>Plane</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="route">
                                          <div className="flex items-center gap-2">
                                            <Route className="w-4 h-4" />
                                            <span>Route</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </Field>
                              <Field>
                                <FieldLabel>Label</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.globalCoverage.stats.${index}.label` as any,
                                    )}
                                    placeholder="Countries"
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
                                    placeholder="100+"
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                          </Card>
                        ))}
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "trustBlock" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Trust Block</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <h4 className="font-bold">Trust Block Items</h4>
                          <Button
                            type="button"
                            size="sm"
                            onClick={addTrustBlockItem}
                          >
                            Add Trust Block
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {trustBlockItems.map((_: any, index: number) => (
                            <Card
                              key={`${selectedLanguage}-trust-${index}`}
                              className="border border-muted"
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                  <span className="text-xs font-bold text-gray-400 px-2">
                                    TRUST BLOCK #{index + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTrustBlockItem(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                  <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.trustBlock.${index}.title` as any,
                                        )}
                                        placeholder="Trust Block Title"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <InputGroup>
                                      <Textarea
                                        {...register(
                                          `content.${selectedLanguage}.trustBlock.${index}.description` as any,
                                        )}
                                        placeholder="Trust Block Description"
                                      />
                                    </InputGroup>
                                  </Field>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {trustBlockItems.length === 0 && (
                            <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                              No trust blocks added. Click &quot;Add Trust
                              Block&quot; to create one.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "sections" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Sections</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold">Dynamic Sections</h4>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addSection("benefits")}
                              disabled={hasBenefitsSection}
                              title={
                                hasBenefitsSection
                                  ? "Only one Benefits section allowed"
                                  : "Add Benefits Section"
                              }
                            >
                              + Benefits Section
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addSection("cta")}
                              disabled={hasCtaSection}
                              title={
                                hasCtaSection
                                  ? "Only one CTA section allowed"
                                  : "Add CTA Section"
                              }
                            >
                              + CTA Section
                            </Button>
                          </div>
                        </div>
                        {(hasBenefitsSection || hasCtaSection) && (
                          <p className="text-xs text-gray-500">
                            Note: Only one section of each type is allowed.
                            {hasBenefitsSection && hasCtaSection
                              ? " Both sections have been added."
                              : hasBenefitsSection
                                ? " Add a CTA section to complete the page."
                                : " Add a Benefits section to complete the page."}
                          </p>
                        )}

                        <div className="space-y-6">
                          {sectionItems.map((section: any, index: number) => (
                            <Card
                              key={`${selectedLanguage}-section-${index}`}
                              className="border border-muted"
                            >
                              <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-3 rounded-t border-b">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                      Section #{index + 1}
                                    </span>
                                    <select
                                      value={section?.type || "benefits"}
                                      onChange={(e) => {
                                        const newType = e.target.value as
                                          | "benefits"
                                          | "cta";
                                        // Prevent changing to a type that already exists
                                        if (
                                          newType === "benefits" &&
                                          hasBenefitsSection &&
                                          section?.type !== "benefits"
                                        ) {
                                          alert(
                                            "A Benefits section already exists",
                                          );
                                          return;
                                        }
                                        if (
                                          newType === "cta" &&
                                          hasCtaSection &&
                                          section?.type !== "cta"
                                        ) {
                                          alert("A CTA section already exists");
                                          return;
                                        }
                                        updateSectionType(index, newType);
                                      }}
                                      className="text-xs border rounded px-2 py-1 bg-white"
                                    >
                                      <option value="benefits">Benefits</option>
                                      <option value="cta">CTA</option>
                                    </select>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSection(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>

                                {section?.type === "benefits" ? (
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <h5 className="font-semibold text-sm text-gray-700">
                                        Benefit Items
                                      </h5>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => addSectionItem(index)}
                                      >
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                        Item
                                      </Button>
                                    </div>
                                    <div className="space-y-3">
                                      {section?.items?.map(
                                        (_: any, itemIndex: number) => (
                                          <Card
                                            key={itemIndex}
                                            className="border border-gray-200 bg-gray-50/50"
                                          >
                                            <CardContent className="p-3 space-y-3">
                                              <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-gray-500">
                                                  Item #{itemIndex + 1}
                                                </span>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    removeSectionItem(
                                                      index,
                                                      itemIndex,
                                                    )
                                                  }
                                                >
                                                  <X className="w-3 h-3 text-red-500" />
                                                </Button>
                                              </div>
                                              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                                <Field>
                                                  <FieldLabel>Icon</FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={
                                                      `content.${selectedLanguage}.sections.${index}.items.${itemIndex}.icon` as any
                                                    }
                                                    render={({ field }) => (
                                                      <Select
                                                        onValueChange={
                                                          field.onChange
                                                        }
                                                        defaultValue={
                                                          field.value
                                                        }
                                                        value={field.value}
                                                      >
                                                        <SelectTrigger className="w-full">
                                                          <SelectValue placeholder="Select Icon" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          <SelectItem value="globe">
                                                            <div className="flex items-center gap-2">
                                                              <Globe className="w-4 h-4" />{" "}
                                                              <span>Globe</span>
                                                            </div>
                                                          </SelectItem>
                                                          <SelectItem value="building2">
                                                            <div className="flex items-center gap-2">
                                                              <Clock className="w-4 h-4" />
                                                              <span>Clock</span>
                                                            </div>
                                                          </SelectItem>
                                                          <SelectItem value="plane">
                                                            <div className="flex items-center gap-2">
                                                              <Banknote className="w-4 h-4" />
                                                              <span>
                                                                Banknote
                                                              </span>
                                                            </div>
                                                          </SelectItem>
                                                        </SelectContent>
                                                      </Select>
                                                    )}
                                                  />
                                                </Field>
                                                <Field className="md:col-span-2">
                                                  <FieldLabel className="text-xs">
                                                    Title
                                                  </FieldLabel>
                                                  <InputGroup>
                                                    <InputGroupInput
                                                      {...register(
                                                        `content.${selectedLanguage}.sections.${index}.items.${itemIndex}.title` as any,
                                                      )}
                                                      placeholder="Benefit title"
                                                      className="h-8 text-sm"
                                                    />
                                                  </InputGroup>
                                                </Field>
                                              </div>
                                              <Field>
                                                <FieldLabel className="text-xs">
                                                  Description
                                                </FieldLabel>
                                                <InputGroup>
                                                  <Textarea
                                                    {...register(
                                                      `content.${selectedLanguage}.sections.${index}.items.${itemIndex}.description` as any,
                                                    )}
                                                    placeholder="Describe this benefit..."
                                                    className="text-sm min-h-[60px]"
                                                  />
                                                </InputGroup>
                                              </Field>
                                            </CardContent>
                                          </Card>
                                        ),
                                      )}
                                      {(!section?.items ||
                                        section.items.length === 0) && (
                                        <div className="text-center py-4 text-gray-400 text-sm border border-dashed rounded">
                                          No items added. Click &quot;Add
                                          Item&quot; to create one.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <Field>
                                      <FieldLabel>Title</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.sections.${index}.title` as any,
                                          )}
                                          placeholder="CTA Section Title"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Description</FieldLabel>
                                      <InputGroup>
                                        <Textarea
                                          {...register(
                                            `content.${selectedLanguage}.sections.${index}.description` as any,
                                          )}
                                          placeholder="Describe your call to action..."
                                        />
                                      </InputGroup>
                                    </Field>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Field>
                                        <FieldLabel>Button Label</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.sections.${index}.buttonLabel` as any,
                                            )}
                                            placeholder="e.g., Get Started"
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Button Link</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.sections.${index}.buttonLink` as any,
                                            )}
                                            placeholder="/contact or https://..."
                                          />
                                        </InputGroup>
                                      </Field>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                          {sectionItems.length === 0 && (
                            <div className="py-12 text-center text-gray-500 border border-dashed rounded bg-gray-50">
                              <p className="mb-2">No sections added yet.</p>
                              <p className="text-sm">
                                Click &quot;Benefits Section&quot; or &quot;CTA
                                Section&quot; to add one.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "segmentLinks" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Segment Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.segmentLinks.title` as any,
                                )}
                                placeholder="Segment Title"
                              />
                            </InputGroup>
                          </Field>
                        </div>

                        <div className="flex justify-between">
                          <h4 className="font-bold">Links</h4>
                          <Button
                            type="button"
                            size="sm"
                            onClick={addSegmentLink}
                          >
                            Add Link
                          </Button>
                        </div>
                        {segmentLinkItems.map((_: any, index: number) => (
                          <div
                            key={`seg-${index}`}
                            className="flex gap-2 items-center"
                          >
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.segmentLinks.items.${index}.label` as any,
                                )}
                                placeholder="Label"
                              />
                            </InputGroup>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.segmentLinks.items.${index}.href` as any,
                                )}
                                placeholder="/link"
                              />
                            </InputGroup>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSegmentLink(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "faqs" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>FAQs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <h4 className="font-bold">FAQ Items</h4>
                          <Button type="button" size="sm" onClick={addFaqItem}>
                            Add FAQ
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {faqItems.map((_: any, index: number) => (
                            <Card
                              key={`${selectedLanguage}-faq-${index}`}
                              className="border border-muted"
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                  <span className="text-xs font-bold text-gray-400 px-2">
                                    FAQ #{index + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFaqItem(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <Field>
                                  <FieldLabel>Question</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.faqs.${index}.question` as any,
                                      )}
                                      placeholder="FAQ Question"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Answer</FieldLabel>
                                  <InputGroup>
                                    <Textarea
                                      {...register(
                                        `content.${selectedLanguage}.faqs.${index}.answer` as any,
                                      )}
                                      placeholder="FAQ Answer"
                                    />
                                  </InputGroup>
                                </Field>
                              </CardContent>
                            </Card>
                          ))}
                          {faqItems.length === 0 && (
                            <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                              No FAQs added. Click &quot;Add FAQ&quot; to create
                              one.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "seo" && (
                  <SEOSection form={form} metaKeywordsData={metaKeywordsData} />
                )}

                {activeTab === "jsonld" && <JSONLDSection form={form} />}
              </div>
            </CardContent>
          </CardBody>
        </Card>

        {/* Global Save */}
        <Card className="sticky bottom-6 z-10 bg-base-white/90 backdrop-blur shadow-2xl border-t">
          <CardBody className="p-4">
            <CardContent className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={watch("isActive")}
                  onChange={(e) => setValue("isActive", e.target.checked)}
                  id="isActive"
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-semibold">
                  Active Page
                </label>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outlinePrimary"
                  onClick={() => form.reset()}
                >
                  Discard Changes
                </Button>
                <Button type="submit" size="lg" className="px-8">
                  {type}
                </Button>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      </form>
    </FormProvider>
  );
}

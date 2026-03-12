import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, Plane, Route, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
import LanguageSelector from "@/components/language/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
// import UploadWithUrl from "@/components/ui/upload-with-url";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
// import { uid } from "@/utils/pagebuilder.utils";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

// Language-specific content schema for Home Page is handled via z.any() record
// for maximum flexibility with multi-language blocks while maintaining top-level structure.

// const heroSchema = z.object({
//   heroSectionText: z.object({ src: z.string().optional(), alt: z.string().optional(), height: z.string().optional(), gradient: z.string().optional() }).optional(),
//   p1: z.string().optional(),
//   p2: z.string().optional(),
//   description: z.string().optional(),
//   btn1: z.string().optional(),
//   btn2: z.string().optional(),
// });

const multiLangHomeSchema = z.object({
  isActive: z.boolean().default(true),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  // hero: z.record(z.string(), heroSchema),
  content: z.record(z.string(), z.any()), // everything else
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type HomeFormData = z.infer<typeof multiLangHomeSchema>;

interface HomeFormProps {
  initialData?: any;
  onSubmit: (data: HomeFormData) => void;
  type: string;
}

const getEmptyLanguageContent = () => ({
  content: {
    // SECTION 2
    services: {
      overview: {
        premium: "",
        title: "",
        description: "",
        cards: [
          {
            src: "",
            title: "",
            alt: "",
            description: "",
            button: "",
            buttonLink: "",
          },
        ],
      },
    },
    // SECTION 3
    GlobalCoverage: {
      eyebrow: "",
      title: "",
      description1: "",
      description2: "",
      stats: [
        { icon: "globe", iconAlt: "", label: "", value: "" },
        { icon: "building2", iconAlt: "", label: "", value: "" },
        { icon: "plane", iconAlt: "", label: "", value: "" },
        { icon: "route", iconAlt: "", label: "", value: "" },
      ],
      image: { src: "", alt: "" },
    },
    // SECTION 4
    HighlyPopularServices: {
      eyebrow: "",
      title: "",
      description: "",
      cards: [
        {
          title: "",
          href: "",
          image: { src: "", alt: "" },
        },
      ],
    },
    // SECTION 5
    CityRoutes: {
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
      citycards: [{ src: "", title: "", alt: "", description: "" }],
      routeCards: [{ from: "", to: "", time: "", distance: "" }],
    },
    // SECTION 6 (New)
    CityToCityFleetCarousel: {
      eyebrow: "",
      title: "",
      description: "",
      footnote: "",
      vehicles: [
        {
          title: "",
          icon: { src: "", alt: "" },
          details: [],
        },
      ],
    },
    // SECTION 7
    SafetyAndPrivacy: {
      cards: [{ title: "", src: "", alt: "", description: "" }],
    },
    // SECTION 8 & 9
    CorporateGroundTransportation: {
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
      italicText: "",
      images: [],
    },
    MeetingsAndSpecialEvents: {
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
      italicText: "",
      images: [],
    },
    // SECTION 10
    BookARide: {
      title: "",
      description: "",
      Button: "",
      buttonLink: "",
    },
    // SECTION 11
    DownloadOptions: {
      Heading: "",
      Description: "",
      image: { src: "", alt: "" },
      qrImage: { src: "", alt: "" },
      apps: [{ image: "", url: "", alt: "" }],
      QRAlt: "",
      AppStoreAlt: "",
      PlayStoreAlt: "",
      list: [],
    },
    Testimonial: {
      Heading: "",
      src: "",
      alt: "",
      TestimonialCards: [
        {
          rating: "",
          Quote: "",
          Name: "",
          Position: "",
          alt: "",
          src: "",
        },
      ],
    },
    // SECTION 12
    FAQ: {
      Heading: "",
      title: "",
      description: "",
      cta: { label: "", href: "" },
      items: [{ Question: "", Answer: "" }],
    },
  },
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

const normalizeHomeData = (data: any): HomeFormData => {
  if (!data)
    return {
      isActive: true,
      availableLanguages: [DEFAULT_LANGUAGE],
      defaultLanguage: DEFAULT_LANGUAGE,
      // hero: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent().hero },
      content: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent().content },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  const languages = data.availableLanguages || [DEFAULT_LANGUAGE];

  // Extract Shared SEO/JSON-LD from 'en' or first available if legacy format
  let sharedSeo = data.seo;
  let sharedJsonLd = data.jsonLd;

  // Check if seo is keyed by language (legacy)
  if (
    sharedSeo &&
    (sharedSeo.en ||
      sharedSeo[DEFAULT_LANGUAGE] ||
      Object.keys(sharedSeo).length > 0)
  ) {
    // validation: if it has 'metaTitle' directly, it's already new format. If it has 'en', it's old.
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

  // Ensure nested SEO objects exist to prevent validation errors
  if (!sharedSeo.openGraph) {
    sharedSeo.openGraph = {};
  }
  if (!sharedSeo.twitter) {
    sharedSeo.twitter = {};
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

  const normalized: HomeFormData = {
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    availableLanguages: languages,
    defaultLanguage: data.defaultLanguage || DEFAULT_LANGUAGE,
    // hero: {},
    content: {},
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
  };

  languages.forEach((lang: string) => {
    // legacy check
    const heroData = data.hero?.[lang];
    if (!heroData && lang === "en" && data.hero && !data.hero.en) {
      // maybe flattened
      // actually schema expects header/etc. Check if existing data structure matches
    }

    // normalized.hero[lang] = heroData || getEmptyLanguageContent().hero;
    let contentData = data.content?.[lang] || getEmptyLanguageContent().content;

    // Map legacy servicesOverview -> services.overview, then always drop legacy key.
    if (contentData.servicesOverview) {
      const legacyOverview = contentData.servicesOverview;
      const normalizedLegacyOverview = {
        ...legacyOverview,
        cards: legacyOverview?.cards || legacyOverview?.serviceCards || [],
      };

      if (!contentData.services?.overview) {
        contentData = {
          ...contentData,
          services: {
            ...(contentData.services || {}),
            overview: normalizedLegacyOverview,
          },
        };
      } else if (
        (!contentData.services.overview.cards ||
          contentData.services.overview.cards.length === 0) &&
        normalizedLegacyOverview.cards.length > 0
      ) {
        contentData = {
          ...contentData,
          services: {
            ...(contentData.services || {}),
            overview: {
              ...contentData.services.overview,
              cards: normalizedLegacyOverview.cards,
            },
          },
        };
      }

      delete contentData.servicesOverview;
    }

    // Bridge backend/lowercase keys to the current form keys.
    if (
      contentData.corporateGroundTransportation &&
      !contentData.CorporateGroundTransportation
    ) {
      contentData.CorporateGroundTransportation =
        contentData.corporateGroundTransportation;
    }
    if (
      contentData.meetingsAndSpecialEvents &&
      !contentData.MeetingsAndSpecialEvents
    ) {
      contentData.MeetingsAndSpecialEvents =
        contentData.meetingsAndSpecialEvents;
    }

    // Normalize DownloadOptions.list to object array for useFieldArray
    if (
      contentData.DownloadOptions?.list &&
      Array.isArray(contentData.DownloadOptions.list) &&
      contentData.DownloadOptions.list.length > 0
    ) {
      if (typeof contentData.DownloadOptions.list[0] === "string") {
        contentData.DownloadOptions.list = contentData.DownloadOptions.list.map(
          (item: string) => ({ value: item }),
        );
      }
    }

    // Normalize gallery image arrays to object shape: { src, alt }.
    ["CorporateGroundTransportation", "MeetingsAndSpecialEvents"].forEach(
      (sectionKey) => {
        const section = contentData?.[sectionKey];
        if (!section) return;
        if (!Array.isArray(section.images)) {
          section.images = [];
          return;
        }
        section.images = section.images.map((item: any) => {
          if (typeof item === "string") return { src: item, alt: "" };
          if (item instanceof File) return { src: item, alt: "" };
          if (item && typeof item === "object") {
            return {
              src: item.src ?? "",
              alt: item.alt ?? "",
            };
          }
          return { src: "", alt: "" };
        });
      },
    );

    normalized.content[lang] = contentData;
  });

  return normalized;
};

export default function HomeForm({
  initialData,
  onSubmit,
  type,
}: HomeFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );

  const normalizedData = useMemo(
    () => normalizeHomeData(initialData),
    [initialData],
  );

  const form = useForm<HomeFormData>({
    resolver: zodResolver(multiLangHomeSchema) as any,
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

  // Debug: Log validation errors in production
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("HomeForm validation errors:", errors);
    }
  }, [errors]);

  // const formData = watch();
  const availableLanguages = watch("availableLanguages") || ["en"];

  // Field Arrays for selected language
  const serviceCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.services.overview.cards` as any,
  });
  const globalCoverageStats = useFieldArray({
    control,
    name: `content.${selectedLanguage}.GlobalCoverage.stats` as any,
  });
  const highlyPopularCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.HighlyPopularServices.cards` as any,
  });
  const cityCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.CityRoutes.citycards` as any,
  });
  const routeCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.CityRoutes.routeCards` as any,
  });
  const fleetVehicles = useFieldArray({
    control,
    name: `content.${selectedLanguage}.CityToCityFleetCarousel.vehicles` as any,
  });
  const safetyCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.SafetyAndPrivacy.cards` as any,
  });
  const corpImages = useFieldArray({
    control,
    name: `content.${selectedLanguage}.CorporateGroundTransportation.images` as any,
  });
  const meetingsImages = useFieldArray({
    control,
    name: `content.${selectedLanguage}.MeetingsAndSpecialEvents.images` as any,
  });
  const appList = useFieldArray({
    control,
    name: `content.${selectedLanguage}.DownloadOptions.apps` as any,
  });
  const downloadList = useFieldArray({
    control,
    name: `content.${selectedLanguage}.DownloadOptions.list` as any,
  });
  // Testimonial
  const testimonialCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.Testimonial.TestimonialCards` as any,
  });
  const faqItems = useFieldArray({
    control,
    name: `content.${selectedLanguage}.FAQ.items` as any,
  });

  const onHandleSubmit = (data: HomeFormData) => {
    console.log("onHandleSubmit called with data:", data);

    // Build a mutable copy while preserving original File references
    const submissionData: HomeFormData = {
      ...data,
      content: { ...(data.content || {}) },
    };

    // Convert DownloadOptions.list back to string array for all languages
    if (submissionData.content) {
      Object.keys(submissionData.content).forEach((lang) => {
        submissionData.content[lang] = {
          ...(submissionData.content[lang] || {}),
        };

        // Do not persist legacy duplicate structure.
        delete submissionData.content[lang]?.servicesOverview;
        delete submissionData.content[lang]?.corporateGroundTransportation;
        delete submissionData.content[lang]?.meetingsAndSpecialEvents;

        const dlOptions = submissionData.content[lang]?.DownloadOptions;
        if (dlOptions?.list && Array.isArray(dlOptions.list)) {
          // If it's an object array (managed by useFieldArray), extract value
          if (
            dlOptions.list.length > 0 &&
            typeof dlOptions.list[0] === "object" &&
            dlOptions.list[0] !== null &&
            "value" in dlOptions.list[0]
          ) {
            dlOptions.list = dlOptions.list.map((item: any) => item.value);
          }
        }
      });
    }

    // Convert to FormData for file handling
    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });

    // Log FormData contents (FormData doesn't display properly with console.log)
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(
          `${key}:`,
          typeof value === "string" && value.length > 100
            ? value.substring(0, 100) + "..."
            : value,
        );
      }
    }

    onSubmit(formData as any);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    const currentData = getValues();
    if (!currentData.content?.[lang]) {
      const empty = getEmptyLanguageContent();
      setValue(`content.${lang}` as any, empty.content);
      // setValue(`hero.${lang}` as any, empty.hero);
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
              <CardTitle>Home Page </CardTitle>
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

              {/* Tab Content with key to force clean re-render */}
              <div className="pt-4" key={selectedLanguage}>
                {activeTab === "general" && (
                  <div className="space-y-8">
                    {/* Services Overview */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Services Overview (Section 2)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Premium Tag</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.services.overview.premium` as any,
                                )}
                                placeholder="Premium"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.services.overview.title` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={control}
                            name={
                              `content.${selectedLanguage}.services.overview.description` as any
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
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Service Cards
                              </h3>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  serviceCards.append({
                                    src: "",
                                    title: "",
                                    alt: "",
                                    description: "",
                                    button: "BOOK NOW",
                                    buttonLink: "",
                                  })
                                }
                              >
                                Add Card
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {serviceCards.fields.map((field, index) => (
                                <Card key={field.id} className="border-dashed">
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                      <span className="text-xs font-bold text-gray-400 px-2">
                                        CARD #{index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          serviceCards.remove(index)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.services.overview.cards.${index}.src` as any
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
                                            `content.${selectedLanguage}.services.overview.cards.${index}.alt` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Title</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.services.overview.cards.${index}.title` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Description</FieldLabel>
                                      <Textarea
                                        {...register(
                                          `content.${selectedLanguage}.services.overview.cards.${index}.description` as any,
                                        )}
                                      />
                                    </Field>
                                    <Field>
                                      <FieldLabel>Button Label</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.services.overview.cards.${index}.button` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Button Link</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.services.overview.cards.${index}.buttonLink` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Global Coverage */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Global Coverage (Section 3)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Eyebrow</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.GlobalCoverage.eyebrow` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.GlobalCoverage.title` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel>Description 1</FieldLabel>
                            <Textarea
                              {...register(
                                `content.${selectedLanguage}.GlobalCoverage.description1` as any,
                              )}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Description 2</FieldLabel>
                            <Textarea
                              {...register(
                                `content.${selectedLanguage}.GlobalCoverage.description2` as any,
                              )}
                            />
                          </Field>
                          <Controller
                            name={
                              `content.${selectedLanguage}.GlobalCoverage.image.src` as any
                            }
                            control={control}
                            render={({ field }) => (
                              <UploadWithUrlV2
                                value={field.value}
                                onChange={field.onChange}
                                title="Cover Image"
                              />
                            )}
                          />
                          <Field>
                            <FieldLabel>Image Alt Text</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.GlobalCoverage.image.alt` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">Stats</h3>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  globalCoverageStats.append({
                                    icon: "globe",
                                    iconAlt: "",
                                    label: "",
                                    value: "",
                                    link: "",
                                  })
                                }
                              >
                                Add Stat
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {globalCoverageStats.fields.map(
                                (field, index) => (
                                  <Card
                                    key={field.id}
                                    className="border-dashed"
                                  >
                                    <CardContent className="p-4 space-y-3">
                                      <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                        <span className="text-xs font-bold text-gray-400 px-2">
                                          STAT #{index + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            globalCoverageStats.remove(index)
                                          }
                                        >
                                          <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <Field className="col-span-2">
                                          <FieldLabel>Icon Name</FieldLabel>
                                          {/* <InputGroup> */}
                                          <Controller
                                            control={control}
                                            name={
                                              `content.${selectedLanguage}.GlobalCoverage.stats.${index}.icon` as any
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
                                                      <Building2 className="w-4 h-4" />{" "}
                                                      <span>Building</span>
                                                    </div>
                                                  </SelectItem>
                                                  <SelectItem value="plane">
                                                    <div className="flex items-center gap-2">
                                                      <Plane className="w-4 h-4" />{" "}
                                                      <span>Plane</span>
                                                    </div>
                                                  </SelectItem>
                                                  <SelectItem value="route">
                                                    <div className="flex items-center gap-2">
                                                      <Route className="w-4 h-4" />{" "}
                                                      <span>Route</span>
                                                    </div>
                                                  </SelectItem>
                                                </SelectContent>
                                              </Select>
                                            )}
                                          />
                                          {/* </InputGroup> */}
                                        </Field>
                                        <Field className="col-span-2">
                                          <FieldLabel>Icon Alt</FieldLabel>
                                          <InputGroup>
                                            <InputGroupInput
                                              {...register(
                                                `content.${selectedLanguage}.GlobalCoverage.stats.${index}.iconAlt` as any,
                                              )}
                                            />
                                          </InputGroup>
                                        </Field>
                                      </div>
                                      <Field>
                                        <FieldLabel>Label</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.GlobalCoverage.stats.${index}.label` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Value</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.GlobalCoverage.stats.${index}.value` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Link</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            placeholder="/destinations or /routes"
                                            {...register(
                                              `content.${selectedLanguage}.GlobalCoverage.stats.${index}.link` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                    </CardContent>
                                  </Card>
                                ),
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Highly Popular Services */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>
                            Highly Popular Services (Section 4)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Eyebrow</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.HighlyPopularServices.eyebrow` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.HighlyPopularServices.title` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Controller
                              name={
                                `content.${selectedLanguage}.HighlyPopularServices.description` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <TinyEditorRHF
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </Field>
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Service Cards
                              </h3>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  highlyPopularCards.append({
                                    title: "",
                                    href: "",
                                    image: { src: "", alt: "" },
                                  })
                                }
                              >
                                Add Card
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {highlyPopularCards.fields.map((field, index) => (
                                <Card key={field.id} className="border-dashed">
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                      <span className="text-xs font-bold text-gray-400 px-2">
                                        CARD #{index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          highlyPopularCards.remove(index)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.HighlyPopularServices.cards.${index}.image.src` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <UploadWithUrlV2
                                          value={field.value}
                                          onChange={field.onChange}
                                          title="Card Image"
                                        />
                                      )}
                                    />
                                    <Field>
                                      <FieldLabel>Image Alt Text</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.HighlyPopularServices.cards.${index}.image.alt` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Title</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.HighlyPopularServices.cards.${index}.title` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Link (href)</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.HighlyPopularServices.cards.${index}.href` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* City Routes */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>City Routes (Section 5)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Heading Top</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityRoutes.headingTop` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Heading Bottom</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityRoutes.headingBottom` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Description 1</FieldLabel>
                              <Controller
                                name={
                                  `content.${selectedLanguage}.CityRoutes.description1` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <TinyEditorRHF
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </Field>
                            <Field>
                              <FieldLabel>Description 2</FieldLabel>
                              <Controller
                                name={
                                  `content.${selectedLanguage}.CityRoutes.description2` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <TinyEditorRHF
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </Field>
                            <Field>
                              <FieldLabel>Top Cities</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityRoutes.topCities` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Top Routes</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityRoutes.topRoutes` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Top Cities See All Link</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityRoutes.seeAllLink` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Top Routes See All Link</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityRoutes.topRoutesSeeAllLink` as any,
                                  )}
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
                                onClick={() =>
                                  cityCards.append({
                                    src: "",
                                    title: "",
                                    alt: "",
                                    description: "",
                                  })
                                }
                              >
                                Add City
                              </Button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                              {cityCards.fields.map((field, idx) => (
                                <Card key={field.id}>
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-xs font-bold uppercase text-gray-400">
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
                                        `content.${selectedLanguage}.CityRoutes.citycards.${idx}.src` as any
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
                                      <FieldLabel>Image Alt Text</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.CityRoutes.citycards.${idx}.alt` as any,
                                          )}
                                          placeholder="Image Alt Text"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Title</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.CityRoutes.citycards.${idx}.title` as any,
                                          )}
                                          placeholder="Title"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Description</FieldLabel>
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.CityRoutes.citycards.${idx}.description` as any
                                        }
                                        control={control}
                                        render={({ field }) => (
                                          <TinyEditorRHF
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
                          </div>
                          <Separator />
                          {/* Route Cards */}
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <h4 className="font-bold">Route Cards</h4>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  routeCards.append({
                                    from: "",
                                    to: "",
                                    time: "",
                                    distance: "",
                                  })
                                }
                              >
                                Add Route
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {routeCards.fields.map((field, idx) => (
                                <Card key={field.id}>
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-xs font-bold uppercase text-gray-400">
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
                                    <Field>
                                      <FieldLabel>From</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.CityRoutes.routeCards.${idx}.from` as any,
                                          )}
                                          placeholder="From"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>To</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.CityRoutes.routeCards.${idx}.to` as any,
                                          )}
                                          placeholder="To"
                                        />
                                      </InputGroup>
                                    </Field>

                                    <Field>
                                      <FieldLabel>Time</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.CityRoutes.routeCards.${idx}.time` as any,
                                          )}
                                          placeholder="Time"
                                        />
                                      </InputGroup>
                                    </Field>

                                    <Field>
                                      <FieldLabel>Distance</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.CityRoutes.routeCards.${idx}.distance` as any,
                                          )}
                                          placeholder="Distance"
                                        />
                                      </InputGroup>
                                    </Field>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* City To City Fleet Carousel (New Section 6) */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>City To City Fleet (Section 6)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Eyebrow</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityToCityFleetCarousel.eyebrow` as any,
                                  )}
                                  placeholder="Eyebrow"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.CityToCityFleetCarousel.title` as any,
                                  )}
                                  placeholder="Title"
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Controller
                              name={
                                `content.${selectedLanguage}.CityToCityFleetCarousel.description` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <TinyEditorRHF
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Footnote</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.CityToCityFleetCarousel.footnote` as any,
                                )}
                                placeholder="Footnote"
                              />
                            </InputGroup>
                          </Field>
                          <Separator />
                          <div className="flex justify-between">
                            <h4 className="font-bold">Vehicles</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                fleetVehicles.append({
                                  title: "",
                                  icon: { src: "", alt: "" },
                                  details: [],
                                })
                              }
                            >
                              Add Vehicle
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {fleetVehicles.fields.map((field, idx) => (
                              <Card
                                key={field.id}
                                className="border border-muted"
                              >
                                <CardContent className="p-4 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="font-bold">
                                      Vehicle #{idx + 1}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => fleetVehicles.remove(idx)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.CityToCityFleetCarousel.vehicles.${idx}.title` as any,
                                      )}
                                      placeholder="Vehicle Title"
                                    />
                                  </InputGroup>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.CityToCityFleetCarousel.vehicles.${idx}.icon.src` as any
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
                                    </div>
                                    <div className="space-y-2">
                                      <Field>
                                        <FieldLabel>Icon Alt Text</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.CityToCityFleetCarousel.vehicles.${idx}.icon.alt` as any,
                                            )}
                                            placeholder="Icon Alt Text"
                                          />
                                        </InputGroup>
                                      </Field>
                                      <FieldLabel>
                                        Details (Comma Separated)
                                      </FieldLabel>
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.CityToCityFleetCarousel.vehicles.${idx}.details` as any
                                        }
                                        control={control}
                                        render={({ field }) => (
                                          <Textarea
                                            value={
                                              Array.isArray(field.value)
                                                ? field.value.join(", ")
                                                : field.value
                                            }
                                            onChange={(e) =>
                                              field.onChange(
                                                e.target.value
                                                  .split(",")
                                                  .map((s: string) => s.trim()),
                                              )
                                            }
                                            placeholder="e.g. 2 Bags, 3 Passengers"
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Secondary Sections */}
                    <div className="space-y-8">
                      {/* Safety & Privacy (Section 7) */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Safety & Privacy (Section 7)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {safetyCards.fields.map((field, index) => (
                              <Card
                                key={field.id}
                                className="border-dashed bg-gray-50/30"
                              >
                                <CardContent className="p-3 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">
                                      ITEM #{index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => safetyCards.remove(index)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <Controller
                                    name={
                                      `content.${selectedLanguage}.SafetyAndPrivacy.cards.${index}.src` as any
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
                                    <FieldLabel>Image Alt Text</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        placeholder="Alt Text"
                                        {...register(
                                          `content.${selectedLanguage}.SafetyAndPrivacy.cards.${index}.alt` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        placeholder="Title"
                                        {...register(
                                          `content.${selectedLanguage}.SafetyAndPrivacy.cards.${index}.title` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.SafetyAndPrivacy.cards.${index}.description` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <TinyEditorRHF
                                          value={field.value}
                                          onChange={field.onChange}
                                        />
                                      )}
                                    />
                                  </Field>
                                </CardContent>
                              </Card>
                            ))}
                          </CardContent>
                          <CardFooter>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                safetyCards.append({
                                  title: "",
                                  src: "",
                                  alt: "",
                                  description: "",
                                })
                              }
                            >
                              Add Card
                            </Button>
                          </CardFooter>
                        </CardBody>
                      </Card>

                      {/* Corporate & Meetings (Sections 8 & 9) */}
                      {[
                        {
                          id: "CorporateGroundTransportation",
                          label: "Corporate Ground (Section 8)",
                          imagesArray: corpImages,
                        },
                        {
                          id: "MeetingsAndSpecialEvents",
                          label: "Meetings & Special Events (Section 9)",
                          imagesArray: meetingsImages,
                        },
                      ].map((section) => (
                        <Card key={section.id}>
                          <CardBody>
                            <CardHeader>
                              <CardTitle>{section.label}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <Field>
                                  {" "}
                                  <FieldLabel>Title 1</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.${section.id}.t1` as any,
                                      )}
                                      placeholder="Title 1"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Title 2</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.${section.id}.t2` as any,
                                      )}
                                      placeholder="Title 2"
                                    />
                                  </InputGroup>
                                </Field>
                              </div>
                              <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Controller
                                  name={
                                    `content.${selectedLanguage}.${section.id}.description` as any
                                  }
                                  control={control}
                                  render={({ field }) => (
                                    <TinyEditorRHF
                                      value={field.value}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              </Field>
                              <Field>
                                <FieldLabel>Italic Text</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.italicText` as any,
                                    )}
                                    placeholder="Italic Text"
                                  />
                                </InputGroup>
                              </Field>

                              <Controller
                                name={
                                  `content.${selectedLanguage}.${section.id}.src` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <UploadWithUrlV2
                                    value={field.value}
                                    onChange={field.onChange}
                                    title="Main Image"
                                  />
                                )}
                              />
                              <Field>
                                <FieldLabel>Image Alt Text</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.alt` as any,
                                    )}
                                    placeholder="Image Alt"
                                  />
                                </InputGroup>
                              </Field>

                              <Separator />
                              <div className="flex justify-between">
                                <h4 className="font-bold">Gallery Images</h4>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    (section.imagesArray as any).append({
                                      src: "",
                                      alt: "",
                                    })
                                  }
                                >
                                  Add Image
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {(section.imagesArray as any).fields.map(
                                  (field: any, idx: number) => (
                                    <Card
                                      key={field.id}
                                      className="border p-2 rounded"
                                    >
                                      <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between mb-2">
                                          <span className="text-xs">
                                            Image #{idx + 1}
                                          </span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              (
                                                section.imagesArray as any
                                              ).remove(idx)
                                            }
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </Button>
                                        </div>
                                        <Controller
                                          name={
                                            `content.${selectedLanguage}.${section.id}.images.${idx}.src` as any
                                          }
                                          control={control}
                                          render={({ field }) => (
                                            <UploadWithUrlV2
                                              value={field.value}
                                              onChange={field.onChange}
                                              title="Gallery Image"
                                            />
                                          )}
                                        />
                                        <Field>
                                          <FieldLabel>
                                            Image Alt Text
                                          </FieldLabel>
                                          <InputGroup>
                                            <InputGroupInput
                                              {...register(
                                                `content.${selectedLanguage}.${section.id}.images.${idx}.alt` as any,
                                              )}
                                              placeholder="Image Alt"
                                            />
                                          </InputGroup>
                                        </Field>
                                      </CardContent>
                                    </Card>
                                  ),
                                )}
                              </div>
                            </CardContent>
                          </CardBody>
                        </Card>
                      ))}

                      {/* Book A Ride (Section 10) */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Book A Ride (Section 10)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.BookARide.title` as any,
                                  )}
                                  placeholder="Title"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Description</FieldLabel>
                              <Controller
                                name={
                                  `content.${selectedLanguage}.BookARide.description` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <TinyEditorRHF
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Button Label</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.BookARide.Button` as any,
                                    )}
                                    placeholder="Button Label"
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Button Link</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.BookARide.buttonLink` as any,
                                    )}
                                    placeholder="Button Link"
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                          </CardContent>
                        </CardBody>
                      </Card>

                      {/* Download Options (Section 11) */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Download Options (Section 11)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Field>
                              <FieldLabel>Heading</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.DownloadOptions.Heading` as any,
                                  )}
                                  placeholder="Heading"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Description</FieldLabel>
                              <Controller
                                name={
                                  `content.${selectedLanguage}.DownloadOptions.Description` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <TinyEditorRHF
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                {/* <Field><FieldLabel>Main Image</FieldLabel> */}
                                <Controller
                                  name={
                                    `content.${selectedLanguage}.DownloadOptions.image.src` as any
                                  }
                                  control={control}
                                  render={({ field }) => (
                                    <UploadWithUrlV2
                                      value={field.value}
                                      onChange={field.onChange}
                                      title="Main Image"
                                    />
                                  )}
                                />
                                {/* </Field> */}
                                <Field>
                                  <FieldLabel>Image Alt Text</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.DownloadOptions.image.alt` as any,
                                      )}
                                      placeholder="Main Image Alt"
                                    />
                                  </InputGroup>
                                </Field>
                              </div>
                              <div>
                                {/* <Field><FieldLabel>QR Image</FieldLabel> */}
                                <Controller
                                  name={
                                    `content.${selectedLanguage}.DownloadOptions.qrImage.src` as any
                                  }
                                  control={control}
                                  render={({ field }) => (
                                    <UploadWithUrlV2
                                      value={field.value}
                                      onChange={field.onChange}
                                      title="QR Image"
                                    />
                                  )}
                                />
                                {/* </Field> */}
                                <Field>
                                  <FieldLabel>QR Image Alt Text</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.DownloadOptions.QRAlt` as any,
                                      )}
                                      placeholder="QR Image Alt"
                                    />
                                  </InputGroup>
                                </Field>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <h4 className="font-bold">App Buttons</h4>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  appList.append({
                                    image: "",
                                    url: "",
                                    alt: "",
                                  })
                                }
                              >
                                Add App
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {appList.fields.map((field, idx) => (
                                <Card key={field.id}>
                                  <CardBody className="p-4 space-y-3">
                                    <div className="flex-1 space-y-2">
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.DownloadOptions.apps.${idx}.image` as any
                                        }
                                        control={control}
                                        render={({ field }) => (
                                          <UploadWithUrlV2
                                            value={field.value}
                                            onChange={field.onChange}
                                            title="Store Icon"
                                          />
                                        )}
                                      />
                                      <Field>
                                        <FieldLabel>URL</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.DownloadOptions.apps.${idx}.url` as any,
                                            )}
                                            placeholder="URL"
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Alt</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.DownloadOptions.apps.${idx}.alt` as any,
                                            )}
                                            placeholder="Alt"
                                          />
                                        </InputGroup>
                                      </Field>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => appList.remove(idx)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </CardBody>
                                </Card>
                              ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <h4 className="font-bold">List Items</h4>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  downloadList.append({ value: "" })
                                }
                              >
                                Add Item
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {downloadList.fields.map((field, idx) => (
                                <Card key={field.id}>
                                  <CardBody className="p-4 space-y-3">
                                    <Field>
                                      <FieldLabel>Feature Item</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.DownloadOptions.list.${idx}.value` as any,
                                          )}
                                          placeholder="Feature Item"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => downloadList.remove(idx)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </CardBody>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </CardBody>
                      </Card>

                      {/* Testimonial */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Testimonials</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.Testimonial.Heading` as any,
                                )}
                                placeholder="Heading"
                              />
                            </InputGroup>
                            <Controller
                              name={
                                `content.${selectedLanguage}.Testimonial.src` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrlV2
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="Main Image"
                                />
                              )}
                            />
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.Testimonial.alt` as any,
                                )}
                                placeholder="Image Alt"
                              />
                            </InputGroup>

                            <div className="flex justify-between mt-4">
                              <h4 className="font-bold">Testimonial Cards</h4>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  testimonialCards.append({
                                    rating: "",
                                    Quote: "",
                                    Name: "",
                                    Position: "",
                                    alt: "",
                                    src: "",
                                  })
                                }
                              >
                                Add Testimonial
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {testimonialCards.fields.map((field, idx) => (
                                <Card
                                  key={field.id}
                                  className="border border-muted"
                                >
                                  <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="font-bold">
                                        Testimonial #{idx + 1}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          testimonialCards.remove(idx)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Field>
                                        <FieldLabel>Name</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.Testimonial.TestimonialCards.${idx}.Name` as any,
                                            )}
                                            placeholder="Name"
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Position</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.Testimonial.TestimonialCards.${idx}.Position` as any,
                                            )}
                                            placeholder="Position"
                                          />
                                        </InputGroup>
                                      </Field>
                                    </div>
                                    <Field>
                                      <FieldLabel>Quote</FieldLabel>
                                      <InputGroup>
                                        <Textarea
                                          {...register(
                                            `content.${selectedLanguage}.Testimonial.TestimonialCards.${idx}.Quote` as any,
                                          )}
                                          placeholder="Quote"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Rating</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.Testimonial.TestimonialCards.${idx}.rating` as any,
                                          )}
                                          placeholder="Rating (1-5)"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.Testimonial.TestimonialCards.${idx}.src` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <UploadWithUrlV2
                                          value={field.value}
                                          onChange={field.onChange}
                                          title="Avatar"
                                        />
                                      )}
                                    />
                                    <Field>
                                      <FieldLabel>Avatar Alt</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.Testimonial.TestimonialCards.${idx}.alt` as any,
                                          )}
                                          placeholder="Avatar Alt"
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

                      {/* FAQ (Section 12) */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>FAQs (Section 12)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Field>
                              <FieldLabel>Heading</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.FAQ.Heading` as any,
                                  )}
                                  placeholder="Heading"
                                />
                              </InputGroup>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Title</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.FAQ.title` as any,
                                    )}
                                    placeholder="Title"
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Controller
                                  name={
                                    `content.${selectedLanguage}.FAQ.description` as any
                                  }
                                  control={control}
                                  render={({ field }) => (
                                    <TinyEditorRHF
                                      value={field.value}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>CTA Label</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.FAQ.cta.label` as any,
                                    )}
                                    placeholder="CTA Label"
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>CTA Link</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.FAQ.cta.href` as any,
                                    )}
                                    placeholder="CTA Link"
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <h4 className="font-bold">FAQ Items</h4>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  faqItems.append({ Question: "", Answer: "" })
                                }
                              >
                                Add Item
                              </Button>
                            </div>
                            <div className="space-y-4">
                              {faqItems.fields.map((field, idx) => (
                                <Card
                                  key={field.id}
                                  className="border border-muted"
                                >
                                  <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="font-bold">
                                        FAQ #{idx + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => faqItems.remove(idx)}
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel>Question</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.FAQ.items.${idx}.Question` as any,
                                          )}
                                          placeholder="Question"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Answer</FieldLabel>
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.FAQ.items.${idx}.Answer` as any
                                        }
                                        control={control}
                                        render={({ field }) => (
                                          <TinyEditorRHF
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
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <SEOSection
                    form={form}
                    // selectedLanguage is removed/undefined for shared SEO
                    metaKeywordsData={metaKeywordsData}
                  />
                )}

                {activeTab === "jsonld" && (
                  <JSONLDSection
                    form={form}
                    // selectedLanguage is removed/undefined for shared JSON-LD
                  />
                )}
              </div>
            </CardContent>
          </CardBody>
        </Card>

        {/* Global Save */}
        <Card className="sticky bottom-6 z-10 bg-base-white/90 backdrop-blur shadow-2xl border-t">
          <CardBody className="p-4">
            <CardContent className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={watch("isActive")}
                  onCheckedChange={(v) => setValue("isActive", v === true)}
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

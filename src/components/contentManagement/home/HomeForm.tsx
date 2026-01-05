import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrl from "@/components/ui/upload-with-url";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { uid } from "@/utils/pagebuilder.utils";
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
  // hero: {
  //   heroSectionText: { src: "", alt: "", height: "", gradient: "" },
  //   p1: "", p2: "", description: "", btn1: "", btn2: ""
  // },
  content: {
    servicesOverview: {
      paragraph: "",
      h2: "",
      description: "",
      serviceCards: [],
    },
    GlobalCoverage: {
      eyebrow: "",
      title: "",
      description1: "",
      description2: "",
      stats: [{ label: "", value: "" }],
      img: { src: "", alt: "" },
    },
    cityRoutes: {
      paragraph: "",
      h2: "",
      description: "",
      cities: { h3: "", link: "", cityCards: [] },
      routes: { h3: "", link: "", routeCards: [] },
    },
    HighlyPopularServices: {
      eyebrow: "",
      title: "",
      description: "",
      cards: [{ title: "", href: "", img: { src: "", alt: "" } }],
    },
    safetyAndPrivacy: { infoCards: [] },
    corporateGroundTransportation: {
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
      imageLeft: false,
    },
    meetingsAndSpecialEvents: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
    bookARide: { h2: "", p: "", btn: "" },
    downloadOptions: {
      h2: "",
      p: "",
      appStoreLink: "",
      playStoreLink: "",
      image: { src: "", alt: "" },
    },
    testimonial: {
      testimonialCard: {
        h2: "",
        Quote: "",
        Name: "",
        Position: "",
        src: "",
        alt: "",
      },
      image: { src: "", alt: "" },
    },
    faq: {
      eyebrow: "",
      title: "",
      description: "",
      cta: { label: "", href: "" },
      faqCards: [{ question: "", answer: "" }],
    },
  },
  // seo and jsonLd removed from language content
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
    normalized.content[lang] =
      data.content?.[lang] || getEmptyLanguageContent().content;
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
  });

  const { control, register, handleSubmit, watch, setValue, getValues } = form;
  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  // const formData = watch();
  const availableLanguages = watch("availableLanguages") || ["en"];

  // Field Arrays for selected language
  const serviceCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.servicesOverview.serviceCards` as any,
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
    name: `content.${selectedLanguage}.cityRoutes.cities.cityCards` as any,
  });
  const routeCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.cityRoutes.routes.routeCards` as any,
  });
  const safetyCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.safetyAndPrivacy.infoCards` as any,
  });
  const faqCards = useFieldArray({
    control,
    name: `content.${selectedLanguage}.faq.faqCards` as any,
  });

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

  const onHandleSubmit = (data: HomeFormData) => {
    onSubmit(data);
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
                          <CardTitle>Services Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Heading (H2)</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.servicesOverview.h2` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.servicesOverview.paragraph` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={control}
                            name={
                              `content.${selectedLanguage}.servicesOverview.description` as any
                            }
                            render={({ field }) => (
                              <Field>
                                <FieldLabel>Description (Rich Text)</FieldLabel>
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
                                    id: uid(),
                                    src: "",
                                    alt: "",
                                    title: "",
                                    description: "",
                                    button: "",
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
                                        `content.${selectedLanguage}.servicesOverview.serviceCards.${index}.src` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <UploadWithUrl
                                          value={field.value}
                                          onChange={field.onChange}
                                          title="Image"
                                        />
                                      )}
                                    />
                                    <Field>
                                      <FieldLabel>Title</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.servicesOverview.serviceCards.${index}.title` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Description</FieldLabel>
                                      <Textarea
                                        {...register(
                                          `content.${selectedLanguage}.servicesOverview.serviceCards.${index}.description` as any,
                                        )}
                                      />
                                    </Field>
                                    <Field>
                                      <FieldLabel>Button Label</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.servicesOverview.serviceCards.${index}.button` as any,
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
                          <CardTitle>Global Coverage</CardTitle>
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
                              `content.${selectedLanguage}.GlobalCoverage.img.src` as any
                            }
                            control={control}
                            render={({ field }) => (
                              <UploadWithUrl
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
                                  `content.${selectedLanguage}.GlobalCoverage.img.alt` as any,
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
                                    label: "",
                                    value: "",
                                  })
                                }
                              >
                                Add Stat
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <CardTitle>Highly Popular Services</CardTitle>
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
                            <Textarea
                              {...register(
                                `content.${selectedLanguage}.HighlyPopularServices.description` as any,
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
                                    img: { src: "", alt: "" },
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
                                        `content.${selectedLanguage}.HighlyPopularServices.cards.${index}.img.src` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <UploadWithUrl
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
                                            `content.${selectedLanguage}.HighlyPopularServices.cards.${index}.img.alt` as any,
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
                          <CardTitle>City Routes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Small Heading</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.cityRoutes.paragraph` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Title (H2)</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.cityRoutes.h2` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {/* Cities Section */}
                            <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                              <h4 className="text-lg font-bold border-b pb-2">
                                Cities Overview
                              </h4>
                              <Field>
                                <FieldLabel>City Heading (H3)</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.cityRoutes.cities.h3` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Link</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.cityRoutes.cities.link` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>

                              <div className="flex justify-between items-center pt-2">
                                <label
                                  htmlFor="cityCards"
                                  className="text-sm font-semibold"
                                >
                                  City Cards
                                </label>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outlinePrimary"
                                  onClick={() =>
                                    cityCards.append({
                                      id: uid(),
                                      src: "",
                                      alt: "",
                                      title: "",
                                      description: "",
                                    })
                                  }
                                >
                                  Add City
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {cityCards.fields.map((field, index) => (
                                  <Card key={field.id} className="bg-white">
                                    <CardContent className="p-3 space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold">
                                          #{index + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            cityCards.remove(index)
                                          }
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.cityRoutes.cities.cityCards.${index}.src` as any
                                        }
                                        control={control}
                                        render={({ field }) => (
                                          <UploadWithUrl
                                            value={field.value}
                                            onChange={field.onChange}
                                            title="Image"
                                          />
                                        )}
                                      />
                                      <InputGroup>
                                        <InputGroupInput
                                          placeholder="City Name"
                                          {...register(
                                            `content.${selectedLanguage}.cityRoutes.cities.cityCards.${index}.title` as any,
                                          )}
                                        />
                                      </InputGroup>
                                      <Textarea
                                        placeholder="Description"
                                        rows={2}
                                        {...register(
                                          `content.${selectedLanguage}.cityRoutes.cities.cityCards.${index}.description` as any,
                                        )}
                                      />
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            {/* Routes Section */}
                            <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                              <h4 className="text-lg font-bold border-b pb-2">
                                Popular Routes
                              </h4>
                              <Field>
                                <FieldLabel>Route Heading (H3)</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.cityRoutes.routes.h3` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Link</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.cityRoutes.routes.link` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>

                              <div className="flex justify-between items-center pt-2">
                                <label
                                  htmlFor="routeCards"
                                  className="text-sm font-semibold"
                                >
                                  Route Cards
                                </label>
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
                                  Add Route
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {routeCards.fields.map((field, index) => (
                                  <Card key={field.id} className="bg-white">
                                    <CardContent className="p-3 space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold">
                                          #{index + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            routeCards.remove(index)
                                          }
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <InputGroup>
                                          <InputGroupInput
                                            placeholder="From"
                                            {...register(
                                              `content.${selectedLanguage}.cityRoutes.routes.routeCards.${index}.from` as any,
                                            )}
                                          />
                                        </InputGroup>
                                        <InputGroup>
                                          <InputGroupInput
                                            placeholder="To"
                                            {...register(
                                              `content.${selectedLanguage}.cityRoutes.routes.routeCards.${index}.to` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <InputGroup>
                                          <InputGroupInput
                                            placeholder="Time"
                                            {...register(
                                              `content.${selectedLanguage}.cityRoutes.routes.routeCards.${index}.time` as any,
                                            )}
                                          />
                                        </InputGroup>
                                        <InputGroup>
                                          <InputGroupInput
                                            placeholder="Distance"
                                            {...register(
                                              `content.${selectedLanguage}.cityRoutes.routes.routeCards.${index}.distance` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Hero Section (was Find Yours) */}
                    {/* <Card>
                      <CardBody>
                        <CardHeader><CardTitle>Hero Section (Banner)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <Controller
                              name={`hero.${selectedLanguage}.heroSectionText.src` as any}
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrl value={field.value} onChange={field.onChange} title="Banner Background" />
                              )}
                           />
                           <div className="grid grid-cols-2 gap-4">
                              <Field><FieldLabel>Overlay Gradient</FieldLabel><InputGroup><InputGroupInput {...register(`hero.${selectedLanguage}.heroSectionText.gradient` as any)} /></InputGroup></Field>
                              <Field><FieldLabel>Height (CSS class)</FieldLabel><InputGroup><InputGroupInput {...register(`hero.${selectedLanguage}.heroSectionText.height` as any)} /></InputGroup></Field>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <Field><FieldLabel>Heading 1</FieldLabel><InputGroup><InputGroupInput {...register(`hero.${selectedLanguage}.p1` as any)} /></InputGroup></Field>
                              <Field><FieldLabel>Heading 2</FieldLabel><InputGroup><InputGroupInput {...register(`hero.${selectedLanguage}.p2` as any)} /></InputGroup></Field>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <Field><FieldLabel>Button 1</FieldLabel><InputGroup><InputGroupInput {...register(`hero.${selectedLanguage}.btn1` as any)} /></InputGroup></Field>
                              <Field><FieldLabel>Button 2</FieldLabel><InputGroup><InputGroupInput {...register(`hero.${selectedLanguage}.btn2` as any)} /></InputGroup></Field>
                           </div>
                           <Controller
                              control={control}
                              name={`hero.${selectedLanguage}.description` as any}
                              render={({ field }) => (
                                <Field><FieldLabel>Rich Text Description</FieldLabel><TinyEditorRHF value={field.value || ""} onChange={field.onChange} /></Field>
                              )}
                           />
                        </CardContent>
                      </CardBody>
                    </Card> */}

                    {/* Secondary Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Safety & Privacy */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Safety & Privacy</CardTitle>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                safetyCards.append({
                                  id: uid(),
                                  src: "",
                                  alt: "",
                                  title: "",
                                  description: "",
                                })
                              }
                            >
                              Add Card
                            </Button>
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
                                      `content.${selectedLanguage}.safetyAndPrivacy.infoCards.${index}.src` as any
                                    }
                                    control={control}
                                    render={({ field }) => (
                                      <UploadWithUrl
                                        value={field.value}
                                        onChange={field.onChange}
                                        title="Image"
                                      />
                                    )}
                                  />
                                  <InputGroup>
                                    <InputGroupInput
                                      placeholder="Title"
                                      {...register(
                                        `content.${selectedLanguage}.safetyAndPrivacy.infoCards.${index}.title` as any,
                                      )}
                                    />
                                  </InputGroup>
                                  <Textarea
                                    placeholder="Description"
                                    {...register(
                                      `content.${selectedLanguage}.safetyAndPrivacy.infoCards.${index}.description` as any,
                                    )}
                                  />
                                </CardContent>
                              </Card>
                            ))}
                          </CardContent>
                        </CardBody>
                      </Card>

                      {/* Book A Ride */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Book A Ride</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.bookARide.h2` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Description</FieldLabel>
                              <Textarea
                                {...register(
                                  `content.${selectedLanguage}.bookARide.p` as any,
                                )}
                              />
                            </Field>
                            <Field>
                              <FieldLabel>Button Label</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.bookARide.btn` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </CardContent>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Side Image Sections */}
                    {[
                      {
                        id: "corporateGroundTransportation",
                        label: "Corporate Ground Transportation",
                      },
                      {
                        id: "meetingsAndSpecialEvents",
                        label: "Meetings & Special Events",
                      },
                    ].map((section) => (
                      <Card key={section.id}>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>{section.label}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Controller
                              name={
                                `content.${selectedLanguage}.${section.id}.src` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrl
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="Section Image"
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
                                />
                              </InputGroup>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Title Layer 1</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.t1` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Title Layer 2</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.t2` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Field>
                              <FieldLabel>Short Description</FieldLabel>
                              <Textarea
                                {...register(
                                  `content.${selectedLanguage}.${section.id}.description` as any,
                                )}
                              />
                            </Field>
                            <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10 w-fit">
                              <Checkbox
                                id={`${section.id}_left_${selectedLanguage}`}
                                checked={watch(
                                  `content.${selectedLanguage}.${section.id}.imageLeft` as any,
                                )}
                                onCheckedChange={(v) =>
                                  setValue(
                                    `content.${selectedLanguage}.${section.id}.imageLeft` as any,
                                    v === true,
                                  )
                                }
                              />
                              <label
                                htmlFor={`${section.id}_left_${selectedLanguage}`}
                                className="text-sm font-medium"
                              >
                                Image on Left?
                              </label>
                            </div>
                          </CardContent>
                        </CardBody>
                      </Card>
                    ))}

                    {/* Download & Partners */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>Download Options</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.downloadOptions.h2` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Controller
                              control={control}
                              name={
                                `content.${selectedLanguage}.downloadOptions.p` as any
                              }
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Rich Text Description</FieldLabel>
                                  <TinyEditorRHF
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                  />
                                </Field>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Field>
                                <FieldLabel>App Store URL</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.downloadOptions.appStoreLink` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Play Store URL</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.downloadOptions.playStoreLink` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Controller
                              name={
                                `content.${selectedLanguage}.downloadOptions.image.src` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrl
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="Mobile Mockup/Image"
                                />
                              )}
                            />
                            <Field>
                              <FieldLabel>Image Alt Text</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.downloadOptions.image.alt` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </CardContent>
                        </CardBody>
                      </Card>

                      {/* FAQ Section */}
                      <Card>
                        <CardBody>
                          <CardHeader>
                            <CardTitle>FAQs</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Eyebrow</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.faq.eyebrow` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Title</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.faq.title` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Field>
                              <FieldLabel>Description</FieldLabel>
                              <Textarea
                                {...register(
                                  `content.${selectedLanguage}.faq.description` as any,
                                )}
                              />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>CTA Label</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.faq.cta.label` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>CTA Link</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.faq.cta.href` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">
                                  FAQ Cards
                                </h3>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    faqCards.append({
                                      question: "",
                                      answer: "",
                                    })
                                  }
                                >
                                  Add FAQ
                                </Button>
                              </div>
                              <div className="space-y-4">
                                {faqCards.fields.map((field, index) => (
                                  <Card
                                    key={field.id}
                                    className="border-dashed"
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
                              </div>
                            </div>
                          </CardContent>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Testimonial */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Testimonial Section</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4 border-r pr-6">
                            <h4 className="font-bold underline">
                              Author Details
                            </h4>
                            <Field>
                              <FieldLabel>Card Heading</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.testimonial.testimonialCard.h2` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Quote Text</FieldLabel>
                              <Textarea
                                {...register(
                                  `content.${selectedLanguage}.testimonial.testimonialCard.Quote` as any,
                                )}
                              />
                            </Field>
                            <div className="grid grid-cols-2 gap-2">
                              <Field>
                                <FieldLabel>Name</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.testimonial.testimonialCard.Name` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Position</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.testimonial.testimonialCard.Position` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Controller
                              name={
                                `content.${selectedLanguage}.testimonial.testimonialCard.src` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrl
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="Author Avatar"
                                />
                              )}
                            />
                            <Field>
                              <FieldLabel>Avatar Alt Text</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.testimonial.testimonialCard.alt` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-bold underline">Main Visual</h4>
                            <Controller
                              name={
                                `content.${selectedLanguage}.testimonial.image.src` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrl
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="Large Section Image"
                                />
                              )}
                            />
                            <Field>
                              <FieldLabel>Section Image Alt Text</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.testimonial.image.alt` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>
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

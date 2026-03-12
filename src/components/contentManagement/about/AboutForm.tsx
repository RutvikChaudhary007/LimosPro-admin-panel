import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Link2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
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
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
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

const imageSchema = z.union([z.string(), z.instanceof(File)]);

// Language-specific content schemas
const languageContentSchema = z.object({
  h1: z.string().optional(),
  p: z.string().optional(),
  btn: z
    .object({
      text: z.string().optional(),
      link: z.string().optional(),
    })
    .optional(),
  src: imageSchema.optional(),
  alt: z.string().optional(),
});

const ourStorySchema = z.object({
  p1: z.string().optional(),
  p2: z.string().optional(),
  p3: z.string().optional(),
  p4: z.string().optional(),
  h2: z.string().optional(),
});

const ourOfferingsSchema = z.object({
  h2: z.string().optional(),
  p: z.string().optional(),
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

const ourValuesSchema = z.object({
  p1: z.string().optional(),
  p2: z.string().optional(),
  h2: z.string().optional(),
  faqCards: z
    .array(
      z.object({
        id: z.string().optional(),
        question: z.string().optional(),
        answer: z.string().optional(),
      }),
    )
    .optional(),
});

const ourPeersSchema = z.object({
  h2: z.string().optional(),
  h3: z.string().optional(),
  p: z.string().optional(),
  comparisonCards: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        color: z.string().optional(),
        features: z
          .array(
            z.object({
              text: z.string().optional(),
              available: z.boolean().default(true),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

// Shared schemas are imported from ../shared/sharedSchemas.ts

// Multi-language schema
const aboutSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  hero: z.record(z.string(), languageContentSchema),
  ourStory: z.record(z.string(), ourStorySchema),
  ourOfferings: z.record(z.string(), ourOfferingsSchema),
  ourValues: z.record(z.string(), ourValuesSchema),
  ourPeers: z.record(z.string(), ourPeersSchema),
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type AboutFormData = z.infer<typeof aboutSchema>;

interface AboutFormProps {
  initialData?: any;
  onSubmit: (data: AboutFormData) => void;
  type: string;
}

// Helper to get empty content for a language
const getEmptyLanguageContent = () => ({
  hero: { h1: "", p: "", btn: { text: "", link: "" }, src: "", alt: "" },
  ourStory: { p1: "", p2: "", p3: "", p4: "", h2: "" },
  ourOfferings: { h2: "", p: "", infoCards: [] },
  ourValues: { p1: "", p2: "", h2: "", faqCards: [] },
  ourPeers: { h2: "", h3: "", p: "", comparisonCards: [] },
  // seo: { metaTitle: "", metaDescription: "", metaKeywords: [], canonicalUrl: "", openGraph: {}, twitter: {} },
  // jsonLd: [],
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

const normalizeAboutData = (data: any): AboutFormData => {
  if (!data)
    return {
      pageName: "",
      slug: "about",
      availableLanguages: ["en"],
      defaultLanguage: "en",
      isActive: true,
      hero: { en: getEmptyLanguageContent().hero },
      ourStory: { en: getEmptyLanguageContent().ourStory },
      ourOfferings: { en: getEmptyLanguageContent().ourOfferings },
      ourValues: { en: getEmptyLanguageContent().ourValues },
      ourPeers: { en: getEmptyLanguageContent().ourPeers },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  const languages = data.availableLanguages || ["en"];
  const sections = [
    "hero",
    "ourStory",
    "ourOfferings",
    "ourValues",
    "ourPeers",
  ] as const;

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

  const normalized: AboutFormData = {
    pageName: data.pageName || "",
    slug: data.slug || "",
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    availableLanguages: languages,
    defaultLanguage: data.defaultLanguage || "en",
    hero: {},
    ourStory: {},
    ourOfferings: {},
    ourValues: {},
    ourPeers: {},
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
  };

  languages.forEach((lang: string) => {
    sections.forEach((section) => {
      // Check for data in section[lang] OR section (if it's old format and lang is en)
      let sectionData = data[section]?.[lang];

      if (!sectionData && lang === "en") {
        const oldHero = data.hero || data.heroSectionAbout;
        if (section === "hero" && oldHero && !oldHero.en) sectionData = oldHero;
        else if (data[section] && !data[section].en)
          sectionData = data[section];
      }

      if (sectionData) {
        (normalized[section] as any)[lang] = sectionData;
      } else {
        (normalized[section] as any)[lang] = (getEmptyLanguageContent() as any)[
          section
        ];
      }
    });
  });

  return normalized;
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
  const { control, register } = form;

  const infoCards = useFieldArray({
    control,
    name: `ourOfferings.${selectedLanguage}.infoCards` as any,
  });
  const faqCards = useFieldArray({
    control,
    name: `ourValues.${selectedLanguage}.faqCards` as any,
  });
  const comparisonCards = useFieldArray({
    control,
    name: `ourPeers.${selectedLanguage}.comparisonCards` as any,
  });

  return (
    <div className="space-y-8">
      {activeTab === "general" && (
        <div className="space-y-8">
          {/* Hero Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor={`hero-h1-${selectedLanguage}`}>
                    Heading (H1)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={`hero-h1-${selectedLanguage}`}
                      {...register(`hero.${selectedLanguage}.h1` as any)}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`hero-p-${selectedLanguage}`}>
                    Paragraph
                  </FieldLabel>
                  <Textarea
                    id={`hero-p-${selectedLanguage}`}
                    {...register(`hero.${selectedLanguage}.p` as any)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor={`hero-btn-text-${selectedLanguage}`}>
                      Button Text
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`hero-btn-text-${selectedLanguage}`}
                        {...register(
                          `hero.${selectedLanguage}.btn.text` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`hero-btn-link-${selectedLanguage}`}>
                      Button Link
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`hero-btn-link-${selectedLanguage}`}
                        {...register(
                          `hero.${selectedLanguage}.btn.link` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Controller
                  name={`hero.${selectedLanguage}.src` as any}
                  control={control}
                  render={({ field }) => (
                    <UploadWithUrlV2
                      value={field.value}
                      onChange={field.onChange}
                      title="Hero Image"
                    />
                  )}
                />
                <Field>
                  <FieldLabel htmlFor={`hero-alt-${selectedLanguage}`}>
                    Alt Text
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={`hero-alt-${selectedLanguage}`}
                      {...register(`hero.${selectedLanguage}.alt` as any)}
                    />
                  </InputGroup>
                </Field>
              </CardContent>
            </CardBody>
          </Card>

          {/* Our Story */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor={`story-h2-${selectedLanguage}`}>
                    Heading (H2)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={`story-h2-${selectedLanguage}`}
                      {...register(`ourStory.${selectedLanguage}.h2` as any)}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`story-p1-${selectedLanguage}`}>
                    Paragraph 1
                  </FieldLabel>
                  <Textarea
                    id={`story-p1-${selectedLanguage}`}
                    {...register(`ourStory.${selectedLanguage}.p1` as any)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`story-p2-${selectedLanguage}`}>
                    Paragraph 2
                  </FieldLabel>
                  <Textarea
                    id={`story-p2-${selectedLanguage}`}
                    {...register(`ourStory.${selectedLanguage}.p2` as any)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`story-p3-${selectedLanguage}`}>
                    Paragraph 3
                  </FieldLabel>
                  <Textarea
                    id={`story-p3-${selectedLanguage}`}
                    {...register(`ourStory.${selectedLanguage}.p3` as any)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`story-p4-${selectedLanguage}`}>
                    Paragraph 4
                  </FieldLabel>
                  <Textarea
                    id={`story-p4-${selectedLanguage}`}
                    {...register(`ourStory.${selectedLanguage}.p4` as any)}
                  />
                </Field>
              </CardContent>
            </CardBody>
          </Card>

          {/* Our Offerings */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Our Offerings</CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    variant="outlinePrimary"
                    size="sm"
                    onClick={() =>
                      infoCards.append({
                        id: uid(),
                        src: "",
                        alt: "",
                        title: "",
                        description: "",
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Card
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor={`offerings-h2-${selectedLanguage}`}>
                    Heading (H2)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={`offerings-h2-${selectedLanguage}`}
                      {...register(
                        `ourOfferings.${selectedLanguage}.h2` as any,
                      )}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`offerings-p-${selectedLanguage}`}>
                    Paragraph
                  </FieldLabel>
                  <Textarea
                    id={`offerings-p-${selectedLanguage}`}
                    {...register(`ourOfferings.${selectedLanguage}.p` as any)}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(infoCards.fields || []).map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold uppercase text-gray-400">
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
                            `ourOfferings.${selectedLanguage}.infoCards.${index}.src` as any
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
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `ourOfferings.${selectedLanguage}.infoCards.${index}.title` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <Textarea
                            {...register(
                              `ourOfferings.${selectedLanguage}.infoCards.${index}.description` as any,
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

          {/* Our Values / FAQs */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Our Values (FAQs)</CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    variant="outlinePrimary"
                    size="sm"
                    onClick={() =>
                      faqCards.append({ id: uid(), question: "", answer: "" })
                    }
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add FAQ
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel>Heading (H2)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(`ourValues.${selectedLanguage}.h2` as any)}
                    />
                  </InputGroup>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Paragraph 1</FieldLabel>
                    <Textarea
                      {...register(`ourValues.${selectedLanguage}.p1` as any)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Paragraph 2</FieldLabel>
                    <Textarea
                      {...register(`ourValues.${selectedLanguage}.p2` as any)}
                    />
                  </Field>
                </div>
                <div className="space-y-4">
                  {(faqCards.fields || []).map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase text-gray-400">
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
                                `ourValues.${selectedLanguage}.faqCards.${index}.question` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Answer</FieldLabel>
                          <Textarea
                            {...register(
                              `ourValues.${selectedLanguage}.faqCards.${index}.answer` as any,
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

          {/* Our Peers / Comparison */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Our Peers (Comparison)</CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    variant="outlinePrimary"
                    size="sm"
                    onClick={() =>
                      comparisonCards.append({
                        id: uid(),
                        title: "",
                        color: "#000000",
                        features: [],
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Column
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Heading (H2)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(`ourPeers.${selectedLanguage}.h2` as any)}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Heading (H3)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(`ourPeers.${selectedLanguage}.h3` as any)}
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Paragraph</FieldLabel>
                  <Textarea
                    {...register(`ourPeers.${selectedLanguage}.p` as any)}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(comparisonCards.fields || []).map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase text-gray-400">
                            Column #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => comparisonCards.remove(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `ourPeers.${selectedLanguage}.comparisonCards.${index}.title` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Color</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                type="color"
                                {...register(
                                  `ourPeers.${selectedLanguage}.comparisonCards.${index}.color` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                        </div>

                        <PeersFeatures
                          control={control}
                          register={register}
                          selectedLanguage={selectedLanguage}
                          cardIndex={index}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === "seo" && (
        <SEOSection
          form={form}
          // selectedLanguage={selectedLanguage}
          metaKeywordsData={metaKeywordsData}
        />
      )}

      {activeTab === "jsonld" && (
        <JSONLDSection
          form={form}
          // selectedLanguage={selectedLanguage}
        />
      )}
    </div>
  );
}

function PeersFeatures({
  control,
  register,
  selectedLanguage,
  cardIndex,
}: {
  control: any;
  register: any;
  selectedLanguage: string;
  cardIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `ourPeers.${selectedLanguage}.comparisonCards.${cardIndex}.features` as any,
  });

  return (
    <div className="mt-4 space-y-3 border-t pt-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase">Features</span>
        <Button
          type="button"
          variant="outlinePrimary"
          size="sm"
          onClick={() => append({ text: "", available: true })}
        >
          <Plus className="w-3 h-3 mr-1" /> Add Feature
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((feature, fIdx) => (
          <div key={feature.id} className="flex gap-2 items-center">
            <input
              type="checkbox"
              {...register(
                `ourPeers.${selectedLanguage}.comparisonCards.${cardIndex}.features.${fIdx}.available` as any,
              )}
            />
            <InputGroup className="flex-1">
              <InputGroupInput
                placeholder="Feature text"
                {...register(
                  `ourPeers.${selectedLanguage}.comparisonCards.${cardIndex}.features.${fIdx}.text` as any,
                )}
              />
            </InputGroup>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(fIdx)}
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutForm({
  initialData,
  onSubmit,
  type,
}: AboutFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );
  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  // Use memo to ensure normalization only happens once on component mount or initialData change
  const normalizedData = useMemo(
    () => normalizeAboutData(initialData),
    [initialData],
  );

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema) as any,
    defaultValues: normalizedData,
  });

  const { handleSubmit, watch, setValue, getValues } = form;

  // const formData = watch();
  const availableLanguages = watch("availableLanguages") || ["en"];

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);

    const currentData = getValues();
    const sections = [
      "hero",
      "ourStory",
      "ourOfferings",
      "ourValues",
      "ourPeers",
    ];

    sections.forEach((section) => {
      const sectionData = currentData[section as keyof AboutFormData];
      if (!sectionData || !(sectionData as any)[lang]) {
        const emptyContent = getEmptyLanguageContent();
        setValue(
          `${section}.${lang}` as any,
          emptyContent[section as keyof typeof emptyContent],
        );
      }
    });

    if (!availableLanguages.includes(lang)) {
      setValue("availableLanguages", [...availableLanguages, lang]);
    }

    // Switch to general if switching to non-en and currently on restricted tabs
    if (lang !== "en" && (activeTab === "seo" || activeTab === "jsonld")) {
      setActiveTab("general");
    }
  };

  const onHandleSubmit: SubmitHandler<AboutFormData> = (data) => {
    const formData = jsonToFormData(data, { fileKeyMode: "path" });
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
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        className="space-y-6"
      >
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>About Page - Multi-Language</CardTitle>
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

              {/* Shared Page Title & Slug Section */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="pageName">
                          Page Name (Title){" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="pageName"
                            {...form.register("pageName")}
                            placeholder="e.g. About Us"
                          />
                          <InputGroupAddon>
                            <IconFileText className="w-4 h-4" />
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="slug">
                          Slug (URL) <span className="text-red-500">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="slug"
                            {...form.register("slug")}
                            placeholder="e.g. about-us"
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
        <Card className="sticky bottom-6 z-10 bg-base-white/80 backdrop-blur">
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

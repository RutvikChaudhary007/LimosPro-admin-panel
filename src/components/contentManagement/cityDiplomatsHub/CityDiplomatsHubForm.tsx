import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
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
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

// Card item schema
const cardItemSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  image: z.string().optional(),
  alt: z.string().optional(),
  btnTitle: z.string().optional(),
  btnLink: z.string().optional(),
});

// Intro schema
const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  btnTitle: z.string().optional(),
  btnLink: z.string().optional(),
});

// Breadcrumb schema
const breadCrumbSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
});

// Trust block schema
const trustBlockItemSchema = z.object({
  image: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

// FAQ schema
const faqItemSchema = z.object({
  ques: z.string().optional(),
  answer: z.string().optional(),
});

// Language section schema
const languageSectionSchema = z.object({
  breadCrumb: breadCrumbSchema.optional(),
  intro: introSchema.optional(),
  cards: z.array(cardItemSchema).optional(),
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
  breadCrumb: {
    title: "",
    description: "",
    link: "",
  },
  intro: {
    title: "",
    description: "",
    btnTitle: "",
    btnLink: "",
  },
  cards: [],
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
    "general" | "intro" | "cards" | "trustBlock" | "faqs" | "seo" | "jsonld"
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

  // Cards array handling
  const cardItems = Array.isArray(contentByLanguage?.[selectedLanguage]?.cards)
    ? contentByLanguage[selectedLanguage].cards
    : [];

  // Trust Block items
  const trustBlockItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.trustBlock,
  )
    ? contentByLanguage[selectedLanguage].trustBlock
    : [];

  // FAQ items
  const faqItems = Array.isArray(contentByLanguage?.[selectedLanguage]?.faqs)
    ? contentByLanguage[selectedLanguage].faqs
    : [];

  // Add/Remove card
  const addCardItem = () => {
    const path = `content.${selectedLanguage}.cards` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      [
        ...current,
        {
          title: "",
          subTitle: "",
          image: "",
          alt: "",
          btnTitle: "",
          btnLink: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeCardItem = (index: number) => {
    const path = `content.${selectedLanguage}.cards` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // Add/Remove trust block
  const addTrustBlockItem = () => {
    const path = `content.${selectedLanguage}.trustBlock` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      [
        ...current,
        {
          image: "",
          alt: "",
          title: "",
          description: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
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

  // Add/Remove FAQ
  const addFaqItem = () => {
    const path = `content.${selectedLanguage}.faqs` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      [
        ...current,
        {
          ques: "",
          answer: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
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
                  General ({selectedLanguage.toUpperCase()})
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
                  onClick={() => setActiveTab("cards")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "cards"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Cards ({selectedLanguage.toUpperCase()})
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field>
                              <FieldLabel>Title</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.breadCrumb.title` as any,
                                  )}
                                  placeholder="Breadcrumb Title"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Description</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.breadCrumb.description` as any,
                                  )}
                                  placeholder="Breadcrumb Description"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Link</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.breadCrumb.link` as any,
                                  )}
                                  placeholder="/breadcrumb-link"
                                />
                              </InputGroup>
                            </Field>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>
                  </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Button Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.intro.btnTitle` as any,
                                )}
                                placeholder="Learn More"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Button Link</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.intro.btnLink` as any,
                                )}
                                placeholder="/link"
                              />
                            </InputGroup>
                          </Field>
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                )}

                {activeTab === "cards" && (
                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>Cards</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <h4 className="font-bold">Card Items</h4>
                          <Button type="button" size="sm" onClick={addCardItem}>
                            Add Card
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {cardItems.map((_: any, index: number) => (
                            <Card
                              key={`${selectedLanguage}-card-${index}`}
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
                                    onClick={() => removeCardItem(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cards.${index}.title` as any,
                                        )}
                                        placeholder="Card Title"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Sub Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cards.${index}.subTitle` as any,
                                        )}
                                        placeholder="Card Sub Title"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Image URL</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cards.${index}.image` as any,
                                        )}
                                        placeholder="https://..."
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Alt Text</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cards.${index}.alt` as any,
                                        )}
                                        placeholder="Image description"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Button Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cards.${index}.btnTitle` as any,
                                        )}
                                        placeholder="View More"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Button Link</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.cards.${index}.btnLink` as any,
                                        )}
                                        placeholder="/link"
                                      />
                                    </InputGroup>
                                  </Field>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {cardItems.length === 0 && (
                            <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                              No cards added. Click "Add Card" to create one.
                            </div>
                          )}
                        </div>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel>Image URL</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.trustBlock.${index}.image` as any,
                                        )}
                                        placeholder="https://..."
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>Alt Text</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.trustBlock.${index}.alt` as any,
                                        )}
                                        placeholder="Image description"
                                      />
                                    </InputGroup>
                                  </Field>
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
                                      <InputGroupInput
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
                              No trust blocks added. Click "Add Trust Block" to
                              create one.
                            </div>
                          )}
                        </div>
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
                                        `content.${selectedLanguage}.faqs.${index}.ques` as any,
                                      )}
                                      placeholder="FAQ Question"
                                    />
                                  </InputGroup>
                                </Field>
                                <Controller
                                  control={control}
                                  name={
                                    `content.${selectedLanguage}.faqs.${index}.answer` as any
                                  }
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel>Answer</FieldLabel>
                                      <TinyEditorRHF
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                      />
                                    </Field>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          ))}
                          {faqItems.length === 0 && (
                            <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                              No FAQs added. Click "Add FAQ" to create one.
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

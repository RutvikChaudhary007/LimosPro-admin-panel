import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
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
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
// import UploadWithUrl from "@/components/ui/upload-with-url";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

// City item schema
const cityItemSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  country: z.string().optional(),
  countrySlug: z.string().optional(),
  countryCode: z.string().optional(),
  faqs: z.any().optional(),
});

// Intro schema
const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

// Language section schema
const languageSectionSchema = z.object({
  intro: introSchema.optional(),
  sections: z.any().optional(),
  cities: z.array(cityItemSchema).optional(),
});

// Main schema
const citiesHubSchema = z.object({
  isActive: z.boolean().default(true),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  content: z.record(z.string(), languageSectionSchema),
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type CitiesHubFormData = z.infer<typeof citiesHubSchema>;

interface CitiesHubFormProps {
  initialData?: any;
  onSubmit: (data: CitiesHubFormData) => void;
  type: string;
}

const getEmptyLanguageContent = () => ({
  intro: {
    title: "",
    description: "",
  },
  sections: [],
  cities: [
    {
      name: "",
      slug: "",
      country: "",
      countrySlug: "",
      countryCode: "",
      faqs: [],
    },
  ],
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

const normalizeCitiesHubData = (data: any): CitiesHubFormData => {
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

  const normalized: CitiesHubFormData = {
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

export default function CitiesHubForm({
  initialData,
  onSubmit,
  type,
}: CitiesHubFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );

  const normalizedData = useMemo(
    () => normalizeCitiesHubData(initialData),
    [initialData],
  );

  const form = useForm<CitiesHubFormData>({
    resolver: zodResolver(citiesHubSchema) as any,
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
      console.error("CitiesHubForm validation errors:", errors);
    }
  }, [errors]);

  const availableLanguages = watch("availableLanguages") || ["en"];

  // Field Arrays for selected language
  const cityItems = useFieldArray({
    control,
    name: `content.${selectedLanguage}.cities` as any,
  });

  const onHandleSubmit = (data: CitiesHubFormData) => {
    console.log("onHandleSubmit called with data:", data);

    const submissionData: CitiesHubFormData = {
      ...data,
      content: { ...(data.content || {}) },
    };

    // Convert to FormData for file handling
    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });

    // Log FormData contents
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
              <CardTitle>Cities Hub Page</CardTitle>
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

              {/* Tab Content */}
              <div className="pt-4" key={selectedLanguage}>
                {activeTab === "general" && (
                  <div className="space-y-8">
                    {/* Intro Section */}
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
                                placeholder="Cities Hub Title"
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

                    {/* Cities Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Cities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <h4 className="font-bold">City Items</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                cityItems.append({
                                  name: "",
                                  slug: "",
                                  country: "",
                                  countrySlug: "",
                                  countryCode: "",
                                  faqs: [],
                                })
                              }
                            >
                              Add City
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {cityItems.fields.map((field, index) => (
                              <Card
                                key={field.id}
                                className="border border-muted"
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                    <span className="text-xs font-bold text-gray-400 px-2">
                                      CITY #{index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => cityItems.remove(index)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                      <FieldLabel>City Name</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.cities.${index}.name` as any,
                                          )}
                                          placeholder="City Name"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Slug</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.cities.${index}.slug` as any,
                                          )}
                                          placeholder="city-slug"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Country</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.cities.${index}.country` as any,
                                          )}
                                          placeholder="Country Name"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Country Slug</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.cities.${index}.countrySlug` as any,
                                          )}
                                          placeholder="country-slug"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Country Code</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.cities.${index}.countryCode` as any,
                                          )}
                                          placeholder="US"
                                        />
                                      </InputGroup>
                                    </Field>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {cityItems.fields.length === 0 && (
                              <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                                No cities added. Click "Add City" to create one.
                              </div>
                            )}
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

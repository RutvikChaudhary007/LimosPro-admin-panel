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

// Cities item schema
const topCitiesItemSchema = z.object({
  title: z.string().optional(),
  items: z.any().optional(),
});

// const citiesWeServeItemSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().optional(),
//   slug: z.string().optional(),
//   iata: z.string().optional(),
//   airportCode: z.string().optional(),
//   airportName: z.string().optional(),
//   countryCode: z.string().optional(),
//   countrySlug: z.string().optional(),
// });

// const citiesWeServeSchema = z.object({
//   title: z.string().optional(),
//   items: z.array(citiesWeServeItemSchema),
// });

// Cities within country schema
const cityInCountrySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  iata: z.string().optional(),
  airportCode: z.string().optional(),
  airportName: z.string().optional(),
  countryCode: z.string().optional(),
  countrySlug: z.string().optional(),
});

// CountriesWeServe item schema
const countriesWeServeItemSchema = z.object({
  countryName: z.string().optional(),
  countrySlug: z.string().optional(),
  countryCode: z.string().optional(),
  cities: z.array(cityInCountrySchema).optional(),
});

// Top CountriesWeServe section schema
const countriesWeServeSchema = z.object({
  title: z.string().optional(),
  items: z.array(countriesWeServeItemSchema).optional(),
});

const breadCrumbSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
});

// Intro schema
const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

// Language section schema
const languageSectionSchema = z.object({
  intro: introSchema.optional(),
  breadCrumb: breadCrumbSchema.optional(),
  countriesWeServe: countriesWeServeSchema.optional(),
  sections: z.any().optional(),
  topCities: topCitiesItemSchema.optional(),
  // citiesWeServe: citiesWeServeSchema.optional(),
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
  topCities: {
    title: "",
    items: [],
  },
  countriesWeServe: {
    title: "",
    items: [
      {
        countryName: "",
        countrySlug: "",
        countryCode: "",
        cities: [],
      },
    ],
  },
  // citiesWeServe: {
  //   title: "",
  //   items: [
  //     {
  //       id: "",
  //       name: "",
  //       slug: "",
  //       iata: "",
  //       airportCode: "",
  //       airportName: "",
  //       countryCode: "",
  //       countrySlug: "",
  //     },
  //   ],
  // },
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

  const contentByLanguage =
    useWatch({
      control,
      name: "content",
    }) || {};

  const countriesWeServeItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.countriesWeServe?.items,
  )
    ? contentByLanguage[selectedLanguage].countriesWeServe.items
    : [];

  // const citiesWeServeItems = Array.isArray(
  //   contentByLanguage?.[selectedLanguage]?.citiesWeServe?.items,
  // )
  //   ? contentByLanguage[selectedLanguage].citiesWeServe.items
  //   : [];

  const topCitiesItems = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.topCities?.items,
  )
    ? contentByLanguage[selectedLanguage].topCities.items
    : [];

  const addTopCityItem = () => {
    const path = `content.${selectedLanguage}.topCities.items` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      [
        ...current,
        {
          cityName: "",
          url: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeTopCityItem = (index: number) => {
    const path = `content.${selectedLanguage}.topCities.items` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addCountriesWeServeItem = () => {
    const path = `content.${selectedLanguage}.countriesWeServe.items` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      [
        ...current,
        {
          countryName: "",
          countrySlug: "",
          countryCode: "",
          cities: [],
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addCityToCountry = (countryIndex: number) => {
    const path =
      `content.${selectedLanguage}.countriesWeServe.items.${countryIndex}.cities` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      [
        ...current,
        {
          id: "",
          name: "",
          slug: "",
          iata: "",
          airportCode: "",
          airportName: "",
          countryCode: "",
          countrySlug: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeCityFromCountry = (countryIndex: number, cityIndex: number) => {
    const path =
      `content.${selectedLanguage}.countriesWeServe.items.${countryIndex}.cities` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== cityIndex),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeCountriesWeServeItem = (index: number) => {
    const path = `content.${selectedLanguage}.countriesWeServe.items` as any;
    const current = getValues(path) || [];
    setValue(
      path,
      current.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  // const addCitiesWeServeItem = () => {
  //   const path = `content.${selectedLanguage}.citiesWeServe.items` as any;
  //   const current = getValues(path) || [];
  //   setValue(
  //     path,
  //     [
  //       ...current,
  //       {
  //         id: "",
  //         name: "",
  //         slug: "",
  //         iata: "",
  //         airportCode: "",
  //         airportName: "",
  //         countryCode: "",
  //         countrySlug: "",
  //       },
  //     ],
  //     { shouldDirty: true, shouldTouch: true },
  //   );
  // };

  // const removeCitiesWeServeItem = (index: number) => {
  //   const path = `content.${selectedLanguage}.citiesWeServe.items` as any;
  //   const current = getValues(path) || [];
  //   setValue(
  //     path,
  //     current.filter((_: any, idx: number) => idx !== index),
  //     { shouldDirty: true, shouldTouch: true },
  //   );
  // };

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

                    {/* Top Cities Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Top Cities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Section Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.topCities.title` as any,
                                )}
                                placeholder="Top Cities"
                              />
                            </InputGroup>
                          </Field>
                          <div className="flex justify-between">
                            <h4 className="font-bold">City Items</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addTopCityItem}
                            >
                              Add City Item
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {topCitiesItems.map((_: any, index: number) => (
                              <Card
                                key={`${selectedLanguage}-top-city-${index}`}
                                className="border border-muted"
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                    <span className="text-xs font-bold text-gray-400 px-2">
                                      TOP CITY #{index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTopCityItem(index)}
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
                                            `content.${selectedLanguage}.topCities.items.${index}.cityName` as any,
                                          )}
                                          placeholder="City Name"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>URL</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.topCities.items.${index}.url` as any,
                                          )}
                                          placeholder="/city-slug"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Country Code</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.topCities.items.${index}.countryCode` as any,
                                          )}
                                          placeholder="e.g, us"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>City Slug</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.topCities.items.${index}.slug` as any,
                                          )}
                                          placeholder="e.g, /city-slug"
                                        />
                                      </InputGroup>
                                    </Field>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {topCitiesItems.length === 0 && (
                              <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                                No top cities added. Click "Add City Item" to
                                create one.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/*  Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-4">
                            <Card
                              key={`${selectedLanguage}-city`}
                              className="border border-muted"
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <Field className="col-span-full">
                                    <FieldLabel>Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `content.${selectedLanguage}.sections.title` as any,
                                        )}
                                        placeholder="e.g., City Name"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Controller
                                    control={control}
                                    name={
                                      `content.${selectedLanguage}.sections.description` as any
                                    }
                                    render={({ field }) => (
                                      <Field className="col-span-full">
                                        <FieldLabel>Description</FieldLabel>
                                        <TinyEditorRHF
                                          value={field.value || ""}
                                          onChange={field.onChange}
                                        />
                                      </Field>
                                    )}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Countries We Serve Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Countries We Serve</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Country Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.countriesWeServe.title` as any,
                                )}
                                placeholder="e.g., Countries We Serve"
                              />
                            </InputGroup>
                          </Field>
                          <div className="flex justify-between">
                            <h4 className="font-bold">Countries Items</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addCountriesWeServeItem}
                            >
                              Add Country Item
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {countriesWeServeItems.map(
                              (_: any, index: number) => {
                                const citiesInCountry =
                                  watch(
                                    `content.${selectedLanguage}.countriesWeServe.items.${index}.cities` as any,
                                  ) || [];
                                return (
                                  <Card
                                    key={`${selectedLanguage}-countriesWeServe-${index}`}
                                    className="border border-muted"
                                  >
                                    <CardContent className="p-4 space-y-3">
                                      <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                        <span className="text-xs font-bold text-gray-400 px-2">
                                          Country #{index + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeCountriesWeServeItem(index)
                                          }
                                        >
                                          <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4">
                                        <Field>
                                          <FieldLabel>Country Name</FieldLabel>
                                          <InputGroup>
                                            <InputGroupInput
                                              {...register(
                                                `content.${selectedLanguage}.countriesWeServe.items.${index}.countryName` as any,
                                              )}
                                              placeholder="e.g, United States"
                                            />
                                          </InputGroup>
                                        </Field>
                                        <Field>
                                          <FieldLabel>Country Slug</FieldLabel>
                                          <InputGroup>
                                            <InputGroupInput
                                              {...register(
                                                `content.${selectedLanguage}.countriesWeServe.items.${index}.countrySlug` as any,
                                              )}
                                              placeholder="e.g, us"
                                            />
                                          </InputGroup>
                                        </Field>
                                        <Field>
                                          <FieldLabel>Country Code</FieldLabel>
                                          <InputGroup>
                                            <InputGroupInput
                                              {...register(
                                                `content.${selectedLanguage}.countriesWeServe.items.${index}.countryCode` as any,
                                              )}
                                              placeholder="e.g, US"
                                            />
                                          </InputGroup>
                                        </Field>
                                      </div>

                                      {/* Nested Cities in Country */}
                                      <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between items-center mb-3">
                                          <h5 className="font-semibold text-sm text-gray-600">
                                            Cities in this Country (
                                            {citiesInCountry.length})
                                          </h5>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              addCityToCountry(index)
                                            }
                                          >
                                            Add City
                                          </Button>
                                        </div>
                                        <div className="space-y-3">
                                          {citiesInCountry.map(
                                            (_: any, cityIndex: number) => (
                                              <Card
                                                key={`city-${index}-${cityIndex}`}
                                                className="border border-gray-200 bg-gray-50"
                                              >
                                                <CardContent className="p-3 space-y-2">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-gray-500">
                                                      City #{cityIndex + 1}
                                                    </span>
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        removeCityFromCountry(
                                                          index,
                                                          cityIndex,
                                                        )
                                                      }
                                                    >
                                                      <Trash2 className="w-3 h-3 text-red-500" />
                                                    </Button>
                                                  </div>
                                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        ID
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.id` as any,
                                                          )}
                                                          placeholder="City ID"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        Name
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.name` as any,
                                                          )}
                                                          placeholder="City Name"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        Slug
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.slug` as any,
                                                          )}
                                                          placeholder="city-slug"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        IATA
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.iata` as any,
                                                          )}
                                                          placeholder="JFK"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        Airport Code
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.airportCode` as any,
                                                          )}
                                                          placeholder="JFK"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        Airport Name
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.airportName` as any,
                                                          )}
                                                          placeholder="Airport Name"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        Country Code
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.countryCode` as any,
                                                          )}
                                                          placeholder="US"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                    <Field>
                                                      <FieldLabel className="text-xs">
                                                        Country Slug
                                                      </FieldLabel>
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          {...register(
                                                            `content.${selectedLanguage}.countriesWeServe.items.${index}.cities.${cityIndex}.countrySlug` as any,
                                                          )}
                                                          placeholder="us"
                                                          className="h-8 text-sm"
                                                        />
                                                      </InputGroup>
                                                    </Field>
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            ),
                                          )}
                                          {citiesInCountry.length === 0 && (
                                            <div className="py-4 text-center text-gray-400 text-sm border border-dashed rounded">
                                              No cities added. Click "Add City"
                                              to add cities to this country.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              },
                            )}
                            {countriesWeServeItems.length === 0 && (
                              <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                                No country added. Click "Add Country Item" to
                                create one.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Cities We Serve Section */}
                    {/*  <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Cities We Serve List</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>City Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.citiesWeServe.title` as any,
                                )}
                                placeholder="e.g., United States"
                              />
                            </InputGroup>
                          </Field>
                          <div className="flex justify-between">
                            <h4 className="font-bold">Cities Items</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addCitiesWeServeItem}
                            >
                              Add City Item
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {citiesWeServeItems.map((_: any, index: number) => (
                              <Card
                                key={`${selectedLanguage}-city-item-${index}`}
                                className="border border-muted"
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                                    <span className="text-xs font-bold text-gray-400 px-2">
                                      City #{index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeCitiesWeServeItem(index)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Field>
                                      <FieldLabel>ID</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.id` as any,
                                          )}
                                          placeholder="City ID"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Name</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.name` as any,
                                          )}
                                          placeholder="e.g, Austin"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Slug</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.slug` as any,
                                          )}
                                          placeholder="e.g, austin"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>IATA</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.iata` as any,
                                          )}
                                          placeholder="e.g, JFK"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Airport Code</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.airportCode` as any,
                                          )}
                                          placeholder="e.g, JFK"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Airport Name</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.airportName` as any,
                                          )}
                                          placeholder="e.g, John F. Kennedy"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Country Code</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.countryCode` as any,
                                          )}
                                          placeholder="e.g, US"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Country Slug</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...register(
                                            `content.${selectedLanguage}.citiesWeServe.items.${index}.countrySlug` as any,
                                          )}
                                          placeholder="e.g, us"
                                        />
                                      </InputGroup>
                                    </Field>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {citiesWeServeItems.length === 0 && (
                              <div className="py-8 text-center text-gray-500 border border-dashed rounded">
                                No cities added. Click "Add City Item" to create
                                one.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card> */}
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

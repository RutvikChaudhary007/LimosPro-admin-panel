import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Link2, Plus, RefreshCw, Trash2, X } from "lucide-react";
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
import LanguageSelector from "@/components/language/LanguageSelector";
import { Badge } from "@/components/ui/badge";
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
import UploadWithUrl from "@/components/ui/upload-with-url";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { uid } from "@/utils/pagebuilder.utils";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

const imageSchema = z.union([z.string(), z.instanceof(File)]);

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
    citycards: z
      .array(
        z.object({
          id: z.string().optional(),
          src: imageSchema.optional(),
          title: z.string().optional(),
          alt: z.string().optional(),
          description: z.string().optional(),
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

// Language-specific schemas for Service
const serviceItemSchema = z.object({
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

// Shared schemas are imported from ../shared/sharedSchemas.tsimageLeft

const multiLangServiceSchema = z.object({
  isActive: z.boolean().default(true),
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  services: z.record(z.string(), serviceItemSchema),
  cityRoutes: z.record(z.string(), cityRoutesSchema),
  premiumFleet: z.record(z.string(), premiumFleetSchema),
  whyUs: z.record(z.string(), whyUsSchema),
  serviceInGlobalCities: z.record(
    z.string(),
    z.object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema,
    }),
  ),
  LongDistanceCarService: z.record(
    // Add this
    z.string(),
    z.object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema,
    }),
  ),
  // airportService: z.record(
  //   z.string(),
  //   z.object({
  //     imageCardWithTextOnSide: imageCardWithTextSideSchema,
  //   }),
  // ),
  // shuttleBooking: z.record(
  //   z.string(),
  //   z.object({
  //     imageCardWithTextOnSide: imageCardWithTextSideSchema,
  //   }),
  // ),
  faq: z.record(
    z.string(),
    z.object({
      heading: z.string(),
      faqCards: z
        .array(
          z.object({
            id: z.string().optional(),
            question: z.string().optional(),
            answer: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
  download: z.record(z.string(), downloadSchema),
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type ServiceFormData = z.infer<typeof multiLangServiceSchema>;

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: ServiceFormData) => void;
  type: string;
}

const getEmptyLanguageContent = () => ({
  services: { service: "", subservice: "", infoCards: [] },
  cityRoutes: {
    cityRoutesEnabled: false,
  },
  premiumFleet: { p1: "", p2: "", h2: "", priceCards: [] },
  whyUs: { heroSectionText: undefined, p: "", h2: "", featureList: [] },
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
    // Add this
    imageCardWithTextOnSide: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  // airportService: {
  //   imageCardWithTextOnSide: {
  //     imageLeft: true,
  //     src: "",
  //     alt: "",
  //     t1: "",
  //     t2: "",
  //     description: "",
  //   },
  // },
  // shuttleBooking: {
  //   imageCardWithTextOnSide: {
  //     imageLeft: true,
  //     src: "",
  //     alt: "",
  //     t1: "",
  //     t2: "",
  //     description: "",
  //   },
  // },
  faq: { heading: "", faqCards: [] },
  download: {
    h2: "",
    p: "",
    qr: undefined,
    appStore: undefined,
    playStore: undefined,
    image: undefined,
  },
  // seo: { metaTitle: "", metaDescription: "", metaKeywords: [], canonicalUrl: "", openGraph: undefined, twitter: undefined },
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

const normalizeServiceData = (data: any): ServiceFormData => {
  if (!data)
    return {
      isActive: true,
      pageName: "",
      slug: "",
      defaultLanguage: "en",
      availableLanguages: ["en"],
      services: { en: getEmptyLanguageContent().services },
      cityRoutes: { en: getEmptyLanguageContent().cityRoutes },
      premiumFleet: { en: getEmptyLanguageContent().premiumFleet },
      whyUs: { en: getEmptyLanguageContent().whyUs },
      serviceInGlobalCities: {
        en: getEmptyLanguageContent().serviceInGlobalCities,
      },
      LongDistanceCarService: {
        en: getEmptyLanguageContent().LongDistanceCarService,
      },
      faq: { en: getEmptyLanguageContent().faq },
      download: { en: getEmptyLanguageContent().download },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  // If already in multi-language format, ensure ALL available languages are present in all records
  const languages = data.availableLanguages || ["en"];
  const sections = [
    "services",
    "cityRoutes",
    "premiumFleet",
    "whyUs",
    "serviceInGlobalCities",
    "LongDistanceCarService",
    "faq",
    "download",
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

  const normalized: ServiceFormData = {
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    pageName: data.pageName || "",
    slug: data.slug || "",
    defaultLanguage: data.defaultLanguage || "en",
    availableLanguages: languages,
    services: {},
    cityRoutes: {},
    premiumFleet: {},
    whyUs: {},
    serviceInGlobalCities: {},
    LongDistanceCarService: {},
    faq: {},
    download: {},
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
  };

  languages.forEach((lang: string) => {
    sections.forEach((section) => {
      // Check for data in section[lang] OR section (if it's old format and lang is en)
      let sectionData = data[section]?.[lang];
      if (!sectionData && lang === "en" && data[section] && !data[section].en) {
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

interface FeaturesAddonInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function FeaturesAddonInput({
  value = [],
  onChange,
  placeholder = "Add a feature...",
}: FeaturesAddonInputProps) {
  const [localInput, setLocalInput] = useState("");

  const handleAdd = () => {
    const trimmed = localInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setLocalInput("");
    }
  };

  return (
    <div className="space-y-3">
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <InputGroupButton
          className="bg-base-primary text-white rounded"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
        </InputGroupButton>
      </InputGroup>
      <div className="flex flex-wrap gap-2">
        {value.map((item, idx) => (
          <Badge key={idx} className="flex items-center gap-1 py-1 px-2">
            <span className="text-xs">{item}</span>
            <button
              type="button"
              className="ml-1 h-auto p-0 hover:text-red-500 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(value.filter((_, i) => i !== idx));
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

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

  const cityCards = useFieldArray({
    control,
    name: `cityRoutes.${selectedLanguage}.citycards` as any,
  });

  const routeCards = useFieldArray({
    control,
    name: `cityRoutes.${selectedLanguage}.routeCards` as any,
  });

  const infoCards = useFieldArray({
    control,
    name: `services.${selectedLanguage}.infoCards` as any,
  });
  const priceCards = useFieldArray({
    control,
    name: `premiumFleet.${selectedLanguage}.priceCards` as any,
  });
  const faqCards = useFieldArray({
    control,
    name: `faq.${selectedLanguage}.faqCards` as any,
  });

  // Add this effect to reinitialize arrays when enabling
  useEffect(() => {
    const subscription = watch((value: any, { name }: { name: string }) => {
      if (name === `cityRoutes.${selectedLanguage}.cityRoutesEnabled`) {
        const isEnabled =
          value?.cityRoutes?.[selectedLanguage]?.cityRoutesEnabled;

        if (
          isEnabled &&
          !cityCards.fields.length &&
          !routeCards.fields.length
        ) {
          // Initialize arrays if they don't exist
          setValue(`cityRoutes.${selectedLanguage}.citycards` as any, []);
          setValue(`cityRoutes.${selectedLanguage}.routeCards` as any, []);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Service</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `services.${selectedLanguage}.service` as any,
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
                          `services.${selectedLanguage}.subservice` as any,
                        )}
                        placeholder="e.g. Airport Transfers"
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {infoCards.fields.map((field, index) => (
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
                            `services.${selectedLanguage}.infoCards.${index}.src` as any
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
                          <FieldLabel>Alt Text</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `services.${selectedLanguage}.infoCards.${index}.alt` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `services.${selectedLanguage}.infoCards.${index}.title` as any,
                              )}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...register(
                                `services.${selectedLanguage}.infoCards.${index}.description` as any,
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
                        `cityRoutes.${selectedLanguage}.cityRoutesEnabled` as any
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
                                `cityRoutes.${selectedLanguage}` as any,
                                {
                                  cityRoutesEnabled: false,
                                },
                                { shouldValidate: true },
                              );

                              // Clear field arrays
                              cityCards.replace([]);
                              routeCards.replace([]);
                            } else {
                              // When enabled, initialize with full structure
                              setValue(
                                `cityRoutes.${selectedLanguage}` as any,
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
                                  citycards: [],
                                  routeCards: [],
                                },
                                { shouldValidate: true },
                              );
                            }

                            field.onChange(isEnabled);
                          }}
                        />
                      )}
                    />
                    <FieldLabel
                      htmlFor={`cityRoutesToggle-${selectedLanguage}`}
                      className="text-base-black gap-0 cursor-pointer mb-0"
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
                  `cityRoutes.${selectedLanguage}.cityRoutesEnabled` as any,
                ) === true && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Heading Top</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...register(
                              `cityRoutes.${selectedLanguage}.headingTop` as any,
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
                              `cityRoutes.${selectedLanguage}.headingBottom` as any,
                            )}
                            placeholder="Major Cities & Airports"
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Description 1</FieldLabel>
                        <Controller
                          name={
                            `cityRoutes.${selectedLanguage}.description1` as any
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
                            `cityRoutes.${selectedLanguage}.description2` as any
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
                              `cityRoutes.${selectedLanguage}.topCities` as any,
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
                              `cityRoutes.${selectedLanguage}.seeAll` as any,
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
                              `cityRoutes.${selectedLanguage}.seeAllLink` as any,
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
                              `cityRoutes.${selectedLanguage}.topRoutes` as any,
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
                              `cityRoutes.${selectedLanguage}.topRoutesSeeAll` as any,
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
                              `cityRoutes.${selectedLanguage}.topRoutesSeeAllLink` as any,
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
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add City
                        </Button>
                      </div>
                      {cityCards.fields.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {cityCards.fields.map((field, idx) => (
                            <Card key={field.id} className="border-dashed">
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
                                    `cityRoutes.${selectedLanguage}.citycards.${idx}.src` as any
                                  }
                                  control={control}
                                  render={({ field }) => (
                                    <UploadWithUrl
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
                                        `cityRoutes.${selectedLanguage}.citycards.${idx}.alt` as any,
                                      )}
                                      placeholder="A picture of Dubai buildings"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>City Name</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `cityRoutes.${selectedLanguage}.citycards.${idx}.title` as any,
                                      )}
                                      placeholder="Dubai"
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Description</FieldLabel>
                                  <Textarea
                                    {...register(
                                      `cityRoutes.${selectedLanguage}.citycards.${idx}.description` as any,
                                    )}
                                    placeholder="26 routes to/from this city"
                                  />
                                </Field>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 border border-dashed rounded">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {routeCards.fields.map((field, idx) => (
                            <Card key={field.id} className="border-dashed">
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
                                <div className="grid grid-cols-2 gap-3">
                                  <Field>
                                    <FieldLabel>From</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...register(
                                          `cityRoutes.${selectedLanguage}.routeCards.${idx}.from` as any,
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
                                          `cityRoutes.${selectedLanguage}.routeCards.${idx}.to` as any,
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
                                          `cityRoutes.${selectedLanguage}.routeCards.${idx}.time` as any,
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
                                          `cityRoutes.${selectedLanguage}.routeCards.${idx}.distance` as any,
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
                        <div className="text-center py-8 text-gray-500 border border-dashed rounded">
                          No route cards added. Click "Add Route" to create one.
                        </div>
                      )}
                    </div>
                  </>
                )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Paragraph 1</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `premiumFleet.${selectedLanguage}.p1` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Heading (H2)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `premiumFleet.${selectedLanguage}.h2` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                </div>
                <Controller
                  name={`premiumFleet.${selectedLanguage}.p2` as any}
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
                <div className="flex justify-between items-center">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {priceCards.fields.map((field, index) => (
                    <Card key={field.id} className="border-dashed">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold uppercase text-gray-400">
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
                            `premiumFleet.${selectedLanguage}.priceCards.${index}.src` as any
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
                        <div className="grid grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel>Alt Text</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `premiumFleet.${selectedLanguage}.priceCards.${index}.alt` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Price Info</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `premiumFleet.${selectedLanguage}.priceCards.${index}.priceInfo` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Rating</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `premiumFleet.${selectedLanguage}.priceCards.${index}.rating` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Car Info</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `premiumFleet.${selectedLanguage}.priceCards.${index}.CarInfo` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Button Text</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `premiumFleet.${selectedLanguage}.priceCards.${index}.buttonText` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Button Link</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `premiumFleet.${selectedLanguage}.priceCards.${index}.buttonLink` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel>Features</FieldLabel>
                          <Controller
                            name={
                              `premiumFleet.${selectedLanguage}.priceCards.${index}.features` as any
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
                  name={`whyUs.${selectedLanguage}.heroSectionText.src` as any}
                  control={control}
                  render={({ field }) => (
                    <UploadWithUrl
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
                        `whyUs.${selectedLanguage}.heroSectionText.alt` as any,
                      )}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Heading (H2)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(`whyUs.${selectedLanguage}.h2` as any)}
                    />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Paragraph</FieldLabel>
                  <Textarea
                    {...register(`whyUs.${selectedLanguage}.p` as any)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Feature List (One per line)</FieldLabel>
                  <Controller
                    name={`whyUs.${selectedLanguage}.featureList` as any}
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

          {/* Image Cards Sections */}
          {[
            { id: "serviceInGlobalCities", label: "Service In Global Cities" },
            {
              id: "LongDistanceCarService",
              label: "Long Distance Car Service",
            },
            // { id: "shuttleBooking", label: "Shuttle Booking" },
          ].map((section) => (
            <Card key={section.id}>
              <CardBody>
                <CardHeader>
                  <CardTitle>{section.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    name={
                      `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.src` as any
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
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Alt Image Text</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.alt` as any,
                          )}
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Title 1</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.t1` as any,
                          )}
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Title 2</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.t2` as any,
                          )}
                        />
                      </InputGroup>
                    </Field>
                  </div>
                  <Controller
                    name={
                      `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.description` as any
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
                        `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.imageLeft` as any,
                      )}
                      onCheckedChange={(v) =>
                        setValue(
                          `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.imageLeft` as any,
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
                      {...register(`faq.${selectedLanguage}.heading` as any)}
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
                              `faq.${selectedLanguage}.faqCards.${index}.question` as any,
                            )}
                          />
                        </InputGroup>
                      </Field>
                      <Field>
                        <FieldLabel>Answer</FieldLabel>
                        <Textarea
                          {...register(
                            `faq.${selectedLanguage}.faqCards.${index}.answer` as any,
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
                        {...register(`download.${selectedLanguage}.h2` as any)}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(`download.${selectedLanguage}.p` as any)}
                      />
                    </InputGroup>
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  <Card className="p-2">
                    <CardTitle className="text-xs mb-2">Qr Code</CardTitle>
                    <Controller
                      name={`download.${selectedLanguage}.qr.src` as any}
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrl
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
                            `download.${selectedLanguage}.appStore.alt` as any,
                          )}
                          placeholder="Alt text"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                  <Card className="p-2">
                    <CardTitle className="text-xs mb-2">App Store</CardTitle>
                    <Controller
                      name={`download.${selectedLanguage}.appStore.src` as any}
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrl
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
                            `download.${selectedLanguage}.appStore.alt` as any,
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
                            `download.${selectedLanguage}.appStore.link` as any,
                          )}
                          placeholder="Link"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                  <Card className="p-2">
                    <CardTitle className="text-xs mb-2">Play Store</CardTitle>
                    <Controller
                      name={`download.${selectedLanguage}.playStore.src` as any}
                      control={control}
                      render={({ field }) => (
                        <UploadWithUrl
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
                            `download.${selectedLanguage}.playStore.alt` as any,
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
                            `download.${selectedLanguage}.playStore.link` as any,
                          )}
                          placeholder="Link"
                        />
                      </InputGroup>
                    </Field>
                  </Card>
                  <Card className="p-2">
                    <CardTitle className="text-xs mb-2">Main Image</CardTitle>
                    <Controller
                      name={`download.${selectedLanguage}.image.src` as any}
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
                      <FieldLabel>Fig Caption</FieldLabel>
                      <InputGroup className="mt-2">
                        <InputGroupInput
                          {...register(
                            `download.${selectedLanguage}.image.fig` as any,
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
  // const formData = watch();
  const availableLanguages = watch("availableLanguages") || ["en"];

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);

    const currentData = getValues();
    const sections = [
      "services",
      "premiumFleet",
      "whyUs",
      "serviceInGlobalCities",
      "airportService",
      "shuttleBooking",
      "faq",
      "download",
    ];

    sections.forEach((section) => {
      const sectionData = currentData[section as keyof ServiceFormData];
      if (!sectionData || !(sectionData as any)[lang]) {
        const emptyContent = getEmptyLanguageContent();
        setValue(`${section}.${lang}` as any, (emptyContent as any)[section]);
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

  const onHandleSubmit: SubmitHandler<ServiceFormData> = (data) => {
    onSubmit(data);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

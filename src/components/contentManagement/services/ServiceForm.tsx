import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Link2, Plus, RefreshCw, Trash2, X } from "lucide-react";
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
import { Field, FieldLabel } from "@/components/ui/field";
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

// Shared schemas are imported from ../shared/sharedSchemas.ts

const multiLangServiceSchema = z.object({
  isActive: z.boolean().default(true),
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  services: z.record(z.string(), serviceItemSchema),
  premiumFleet: z.record(z.string(), premiumFleetSchema),
  whyUs: z.record(z.string(), whyUsSchema),
  serviceInGlobalCities: z.record(
    z.string(),
    z.object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema,
    }),
  ),
  airportService: z.record(
    z.string(),
    z.object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema,
    }),
  ),
  shuttleBooking: z.record(
    z.string(),
    z.object({
      imageCardWithTextOnSide: imageCardWithTextSideSchema,
    }),
  ),
  faq: z.record(
    z.string(),
    z.object({
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
  airportService: {
    imageCardWithTextOnSide: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  shuttleBooking: {
    imageCardWithTextOnSide: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  faq: { faqCards: [] },
  download: {
    h2: "",
    p: "",
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
      premiumFleet: { en: getEmptyLanguageContent().premiumFleet },
      whyUs: { en: getEmptyLanguageContent().whyUs },
      serviceInGlobalCities: {
        en: getEmptyLanguageContent().serviceInGlobalCities,
      },
      airportService: { en: getEmptyLanguageContent().airportService },
      shuttleBooking: { en: getEmptyLanguageContent().shuttleBooking },
      faq: { en: getEmptyLanguageContent().faq },
      download: { en: getEmptyLanguageContent().download },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  // If already in multi-language format, ensure ALL available languages are present in all records
  const languages = data.availableLanguages || ["en"];
  const sections = [
    "services",
    "premiumFleet",
    "whyUs",
    "serviceInGlobalCities",
    "airportService",
    "shuttleBooking",
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
    premiumFleet: {},
    whyUs: {},
    serviceInGlobalCities: {},
    airportService: {},
    shuttleBooking: {},
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
                      <Textarea
                        value={field.value?.join("\n") || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split("\n").filter(Boolean),
                          )
                        }
                        placeholder="Feature 1\nFeature 2..."
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
            { id: "airportService", label: "Airport Service" },
            { id: "shuttleBooking", label: "Shuttle Booking" },
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
                    <FieldLabel>Paragraph</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(`download.${selectedLanguage}.p` as any)}
                      />
                    </InputGroup>
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t pt-4">
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
                    <InputGroup className="mt-2">
                      <InputGroupInput
                        {...register(
                          `download.${selectedLanguage}.appStore.link` as any,
                        )}
                        placeholder="Link"
                      />
                    </InputGroup>
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
                    <InputGroup className="mt-2">
                      <InputGroupInput
                        {...register(
                          `download.${selectedLanguage}.playStore.link` as any,
                        )}
                        placeholder="Link"
                      />
                    </InputGroup>
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
                    <InputGroup className="mt-2">
                      <InputGroupInput
                        {...register(
                          `download.${selectedLanguage}.image.fig` as any,
                        )}
                        placeholder="Fig Caption"
                      />
                    </InputGroup>
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
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "seo"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  SEO (Shared)
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("jsonld")}
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "jsonld"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
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

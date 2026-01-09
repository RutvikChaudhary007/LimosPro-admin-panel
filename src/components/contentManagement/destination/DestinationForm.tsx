import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Link2, Plus, RefreshCw, Trash2, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea"; // Added import
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

// Language-specific content schemas
const featuresSchema = z.object({
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

const imageCardWithTextOnSideSchema = z.object({
  imageLeft: z.boolean(),
  src: imageSchema.optional(),
  alt: z.string().optional(),
  t1: z.string().optional(),
  t2: z.string().optional(),
  description: z.string().optional(),
});

// Shared schemas are imported from ../shared/sharedSchemas.ts

const multiLangDestinationSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  defaultLanguage: z.string(),
  availableLanguages: z.array(z.string()),
  features: z.record(z.string(), featuresSchema),
  serviceForEveryOccasion: z.record(
    z.string(),
    z.object({
      h2: z.string().optional(),
      imageCardWithTextOnSide: imageCardWithTextOnSideSchema,
    }),
  ),
  whyChoose: z.record(
    z.string(),
    z.object({
      h2: z.string().optional(),
      imageCardWithTextOnSide: imageCardWithTextOnSideSchema,
    }),
  ),
  howToBook: z.record(
    z.string(),
    z.object({
      h2: z.string().optional(),
      imageCardWithTextOnSide: imageCardWithTextOnSideSchema,
    }),
  ),
  premiumFleet: z.record(
    z.string(),
    z.object({
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
    }),
  ),
  bookARide: z.record(
    z.string(),
    z.object({
      h2: z.string().optional(),
      p: z.string().optional(),
      btn: z.object({
        text: z.string().optional(),
        link: z.string().optional(),
      }),
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
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type DestinationFormData = z.infer<typeof multiLangDestinationSchema>;

interface DestinationFormProps {
  initialData?: any;
  onSubmit: (data: DestinationFormData) => void;
  type: string;
}

const getEmptyLanguageContent = () => ({
  features: {
    service: "",
    subservice: "",
    infoCards: [],
  },
  serviceForEveryOccasion: {
    h2: "",
    imageCardWithTextOnSide: {
      imageLeft: false,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  whyChoose: {
    h2: "",
    imageCardWithTextOnSide: {
      imageLeft: false,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  howToBook: {
    h2: "",
    imageCardWithTextOnSide: {
      imageLeft: false,
      src: "",
      alt: "",
      t1: "",
      t2: "",
      description: "",
    },
  },
  premiumFleet: {
    p1: "",
    p2: "",
    h2: "",
    priceCards: [],
  },
  bookARide: {
    h2: "",
    p: "",
    btn: { text: "", link: "" },
  },
  faq: { faqCards: [] },
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

const normalizeDestinationData = (data: any): DestinationFormData => {
  if (!data)
    return {
      pageName: "",
      slug: "",
      isActive: true,
      defaultLanguage: "en",
      availableLanguages: ["en"],
      features: { en: getEmptyLanguageContent().features },
      serviceForEveryOccasion: {
        en: getEmptyLanguageContent().serviceForEveryOccasion,
      },
      whyChoose: { en: getEmptyLanguageContent().whyChoose },
      howToBook: { en: getEmptyLanguageContent().howToBook },
      premiumFleet: { en: getEmptyLanguageContent().premiumFleet },
      bookARide: { en: getEmptyLanguageContent().bookARide },
      faq: { en: getEmptyLanguageContent().faq },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  // If already in multi-language format, ensure ALL available languages are present in all records
  const languages = data.availableLanguages || ["en"];
  const sections = [
    "features",
    "serviceForEveryOccasion",
    "whyChoose",
    "howToBook",
    "premiumFleet",
    "bookARide",
    "faq",
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

  const normalized: DestinationFormData = {
    pageName: data.pageName || "",
    slug: data.slug || "",
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    defaultLanguage: data.defaultLanguage || "en",
    availableLanguages: languages,
    features: {},
    serviceForEveryOccasion: {},
    whyChoose: {},
    howToBook: {},
    premiumFleet: {},
    bookARide: {},
    faq: {},
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
      <InputGroup className="flex items-center gap-2">
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
    name: `features.${selectedLanguage}.infoCards` as any,
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
          {/* Features Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor={`features.${selectedLanguage}.service`}
                    >
                      Service
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`features.${selectedLanguage}.service`}
                        {...register(
                          `features.${selectedLanguage}.service` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor={`features.${selectedLanguage}.subservice`}
                    >
                      Subservice
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`features.${selectedLanguage}.subservice`}
                        {...register(
                          `features.${selectedLanguage}.subservice` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                </div>

                <div className="space-y-4 pt-4 border-t">
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
                      <Plus className="w-4 h-4 mr-1" /> Add Card
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                              `features.${selectedLanguage}.infoCards.${index}.src` as any
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
                                  `features.${selectedLanguage}.infoCards.${index}.alt` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `features.${selectedLanguage}.infoCards.${index}.title` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Description</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `features.${selectedLanguage}.infoCards.${index}.description` as any,
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

          {/* Image Components (Every Occasion, Why Choose, How to Book) */}
          {[
            {
              id: "serviceForEveryOccasion",
              label: "Service For Every Occasion",
            },
            { id: "whyChoose", label: "Why Choose" },
            { id: "howToBook", label: "How To Book" },
          ].map((section) => (
            <Card key={section.id}>
              <CardBody>
                <CardHeader>
                  <CardTitle>{section.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel
                      htmlFor={`${section.id}.${selectedLanguage}.h2`}
                    >
                      Heading (H2)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`${section.id}.${selectedLanguage}.h2`}
                        {...register(
                          `${section.id}.${selectedLanguage}.h2` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <div className="space-y-4 pt-4 border-t">
                    <Controller
                      name={
                        `${section.id}.${selectedLanguage}.imageCardWithTextOnSide.src` as any
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                </CardContent>
              </CardBody>
            </Card>
          ))}

          {/* Premium Fleet Section */}
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
                    <FieldLabel>Paragraph 2</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `premiumFleet.${selectedLanguage}.p2` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                </div>
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

                <div className="space-y-4 pt-4 border-t">
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
                      <Plus className="w-4 h-4 mr-1" /> Add Price Card
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
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Book A Ride Section */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Book A Ride</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel>Heading (H2)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(`bookARide.${selectedLanguage}.h2` as any)}
                    />
                  </InputGroup>
                </Field>
                <Controller
                  name={`bookARide.${selectedLanguage}.p` as any}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Paragraph</FieldLabel>
                      <TinyEditorRHF
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </Field>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <Field>
                    <FieldLabel>Button Text</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `bookARide.${selectedLanguage}.btn.text` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Button Link</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `bookARide.${selectedLanguage}.btn.link` as any,
                        )}
                      />
                    </InputGroup>
                  </Field>
                </div>
              </CardContent>
            </CardBody>
          </Card>

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
        </div>
      )}

      {activeTab === "seo" && (
        <SEOSection form={form} metaKeywordsData={metaKeywordsData} />
      )}

      {activeTab === "jsonld" && <JSONLDSection form={form} />}
    </div>
  );
}

export default function DestinationForm({
  initialData,
  onSubmit,
  type,
}: DestinationFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );
  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  const normalizedData = useMemo(
    () => normalizeDestinationData(initialData),
    [initialData],
  );

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(multiLangDestinationSchema) as any,
    defaultValues: normalizedData,
  });

  const { handleSubmit, watch, setValue, getValues } = form;

  const availableLanguages = watch("availableLanguages") || ["en"];

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);

    const currentData = getValues();
    const sections = [
      "features",
      "serviceForEveryOccasion",
      "whyChoose",
      "howToBook",
      "premiumFleet",
      "bookARide",
      "faq",
    ];

    sections.forEach((section) => {
      const sectionData = currentData[section as keyof DestinationFormData];
      // Note: seo and jsonLd are shared now, so not in this list
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

  const onHandleSubmit = (data: DestinationFormData) => {
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
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        className="space-y-6"
      >
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Destination Page</CardTitle>
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
                            placeholder="e.g. London Airport Transfer"
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
                            placeholder="e.g. london-airport-transfer"
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

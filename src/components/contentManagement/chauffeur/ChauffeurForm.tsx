import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { uid } from "@/utils/pagebuilder.utils";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

// Language-specific content schema for Chauffeur is defined dynamically via z.any() in the record
// to allow for flexible multi-language blocks while maintaining top-level structure.

const multiLangChauffeurSchema = z.object({
  isActive: z.boolean().default(true),
  defaultLanguage: z.string().default("en"),
  availableLanguages: z.array(z.string()).default(["en"]),
  hero: z.record(z.string(), z.any()), // maps to heroSection
  content: z.record(z.string(), z.any()), // everything else
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type ChauffeurFormData = z.infer<typeof multiLangChauffeurSchema>;

interface ChauffeurFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  type: string;
}

const getEmptyLanguageContent = () => ({
  content: {
    // heading: { BL1: "", BL2: "", h1: "" },
    testimony: { p: "", cite: "" },
    chaufferBenefits: {
      infoCard1Set: [{ src: "", alt: "", title: "", description: "" }],
      infoCard2Set: [{ src: "", alt: "", title: "", description: "" }],
    },
    requirements: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      description: "",
      info: "",
      buttonName: "",
      buttonLink: "",
    },
    onBoarding: {
      imageLeft: false,
      src: "",
      alt: "",
      t1: "",
      description: "",
      info: "",
      buttonName: "APPLY NOW",
      buttonLink: "",
    },
    environmentFriendly: {
      imageLeft: true,
      src: "",
      alt: "",
      t1: "",
      description: "",
      info: "",
      buttonName: "",
      buttonLink: "",
    },
    faq: { heading: "", faqData: [] },
    contact: { h2: "", p: "", btn: "", btnLink: "" },
  },
  hero: {
    chauffeurHeading: { service: "", subService: "", heading: "" },
    chauffeurHeadingImage: {
      image: {},
      alt: "",
      h2: "",
      p: "",
      btn: "",
      btnLink: "",
    },
  },
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

const normalizeChauffeurData = (data: any): ChauffeurFormData => {
  if (!data)
    return {
      isActive: true,
      defaultLanguage: "en",
      availableLanguages: ["en"],
      hero: { en: getEmptyLanguageContent().hero },
      content: { en: getEmptyLanguageContent().content },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };

  // Check if already in multi-language format with separate hero/content/seo
  // if (data.content && data.content.en && data.hero && data.hero.en) return data;

  // Conversion logic for old data or mismatched multi-lang structure
  const languages = data.availableLanguages || ["en"];

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

  const normalized: ChauffeurFormData = {
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    defaultLanguage: data.defaultLanguage || "en",
    availableLanguages: languages,
    hero: {},
    content: {},
    seo: sharedSeo,
    jsonLd: sharedJsonLd,
  };

  languages.forEach((lang: string) => {
    // If we have multi-lang data but in the old flattened 'content' format
    const langData = data.content?.[lang] || (lang === "en" ? data : null);

    if (langData) {
      const { heroSection, seo, jsonLd, ...rest } = langData;
      normalized.hero[lang] =
        heroSection || data.hero?.[lang] || getEmptyLanguageContent().hero;

      // Ensure chaufferBenefits has proper array structure
      const emptyContent = getEmptyLanguageContent().content;
      normalized.content[lang] = {
        ...emptyContent,
        ...rest,
        chaufferBenefits: {
          infoCard1Set:
            rest?.chaufferBenefits?.infoCard1Set ||
            rest?.chaufferBenefits?.infoCards1 ||
            emptyContent.chaufferBenefits.infoCard1Set,
          infoCard2Set:
            rest?.chaufferBenefits?.infoCard2Set ||
            rest?.chaufferBenefits?.infoCards2 ||
            emptyContent.chaufferBenefits.infoCard2Set,
        },
      };
    } else {
      normalized.hero[lang] =
        data.hero?.[lang] || getEmptyLanguageContent().hero;
      normalized.content[lang] =
        data.content?.[lang] || getEmptyLanguageContent().content;
    }
  });

  return normalized;
};

export default function ChauffeurForm({
  initialData,
  onSubmit,
  type,
}: ChauffeurFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );
  const normalizedData = useMemo(
    () => normalizeChauffeurData(initialData),
    [initialData],
  );

  const form = useForm<ChauffeurFormData>({
    resolver: zodResolver(multiLangChauffeurSchema) as any,
    defaultValues: normalizedData,
  });

  const { control, register, handleSubmit, watch, setValue, getValues } = form;

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});
  // const formData = watch();
  const availableLanguages = watch("availableLanguages") || ["en"];

  // FAQ Array for selected language
  const faqItems = useFieldArray({
    control,
    name: `content.${selectedLanguage}.faq.faqData` as any,
  });

  const chauffeurBenefitsCard1 = useFieldArray({
    control,
    name: `content.${selectedLanguage}.chaufferBenefits.infoCard1Set` as any,
  });

  const chauffeurBenefitsCard2 = useFieldArray({
    control,
    name: `content.${selectedLanguage}.chaufferBenefits.infoCard2Set` as any,
  });

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);

    const currentData = getValues();
    if (!currentData.content?.[lang]) {
      const empty = getEmptyLanguageContent();
      setValue(`content.${lang}` as any, empty.content);
      setValue(`hero.${lang}` as any, empty.hero);
    }

    if (!availableLanguages.includes(lang)) {
      setValue("availableLanguages", [...availableLanguages, lang]);
    }

    // Switch to general if switching to non-en and currently on restricted tabs
    if (lang !== "en" && (activeTab === "seo" || activeTab === "jsonld")) {
      setActiveTab("general");
    }
  };

  const onHandleSubmit = (data: ChauffeurFormData) => {
    const submissionData = structuredClone(data);
    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });
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
    onSubmit(formData);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onHandleSubmit as any)}
        className="flex flex-col gap-6"
      >
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Chauffeur Page</CardTitle>
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
              {/* Force clean re-mount of all fields on language change */}
              <div className="space-y-6" key={selectedLanguage}>
                {activeTab === "general" && (
                  <>
                    {/* Headings */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Page Headings</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>service</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `hero.${selectedLanguage}.chauffeurHeading.service` as any,
                                )}
                                placeholder="service"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Sub Service</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `hero.${selectedLanguage}.chauffeurHeading.subService` as any,
                                )}
                                placeholder="subService"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Heading</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `hero.${selectedLanguage}.chauffeurHeading.heading` as any,
                                )}
                                placeholder="Heading"
                              />
                            </InputGroup>
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>
                    {/* Hero Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Chauffeur Hero Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Controller
                            name={
                              `hero.${selectedLanguage}.chauffeurHeadingImage.image.src` as any
                            }
                            control={control}
                            render={({ field }) => (
                              <UploadWithUrlV2
                                value={field.value}
                                onChange={field.onChange}
                                title="Hero Image"
                              />
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Alt Text</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `hero.${selectedLanguage}.chauffeurHeadingImage.alt` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Heading</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `hero.${selectedLanguage}.chauffeurHeadingImage.h2` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Button Label</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `hero.${selectedLanguage}.chauffeurHeadingImage.btn` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Button Link</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `hero.${selectedLanguage}.chauffeurHeadingImage.btnLink` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                              {...register(
                                `hero.${selectedLanguage}.chauffeurHeadingImage.p` as any,
                              )}
                            />
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Testimony */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Testimony</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field className="md:col-span-2">
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                              {...register(
                                `content.${selectedLanguage}.testimony.p` as any,
                              )}
                            />
                          </Field>
                          <Field className="md:col-span-2">
                            <FieldLabel>Cite</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.testimony.cite` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Chauffeur benefits  */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Chauffeur Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Info Cards #1</h3>
                            <Button
                              type="button"
                              onClick={() =>
                                chauffeurBenefitsCard1.append({
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
                          <Separator className="my-4" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {chauffeurBenefitsCard1.fields.map(
                              (field, index) => (
                                <Card key={field.id}>
                                  <CardBody>
                                    <CardHeader>
                                      <CardTitle>
                                        {" "}
                                        <div className="flex justify-between">
                                          <span className="text-xs font-bold uppercase text-gray-400">
                                            Card #{index + 1}
                                          </span>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              chauffeurBenefitsCard1.remove(
                                                index,
                                              )
                                            }
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.chaufferBenefits.infoCard1Set.${index}.src` as any
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
                                        <FieldLabel>Alt Text</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.chaufferBenefits.infoCard1Set.${index}.alt` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Title</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.chaufferBenefits.infoCard1Set.${index}.title` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                          {...register(
                                            `content.${selectedLanguage}.chaufferBenefits.infoCard1Set.${index}.description` as any,
                                          )}
                                        />
                                      </Field>
                                    </CardContent>
                                  </CardBody>
                                </Card>
                              ),
                            )}
                          </div>
                          <Separator className="my-4" />
                          {/* Chauffeur benefits 2 */}
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Info Cards #2</h3>
                            <Button
                              type="button"
                              onClick={() =>
                                chauffeurBenefitsCard2.append({
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
                          <Separator className="my-4" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {chauffeurBenefitsCard2.fields.map(
                              (field, index) => (
                                <Card key={field.id}>
                                  <CardBody>
                                    <CardHeader>
                                      <CardTitle>
                                        {" "}
                                        <div className="flex justify-between">
                                          <span className="text-xs font-bold uppercase text-gray-400">
                                            Card #{index + 1}
                                          </span>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              chauffeurBenefitsCard2.remove(
                                                index,
                                              )
                                            }
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <Controller
                                        name={
                                          `content.${selectedLanguage}.chaufferBenefits.infoCard2Set.${index}.src` as any
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
                                        <FieldLabel>Alt Text</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.chaufferBenefits.infoCard2Set.${index}.alt` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Title</FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            {...register(
                                              `content.${selectedLanguage}.chaufferBenefits.infoCard2Set.${index}.title` as any,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                          {...register(
                                            `content.${selectedLanguage}.chaufferBenefits.infoCard2Set.${index}.description` as any,
                                          )}
                                        />
                                      </Field>
                                    </CardContent>
                                  </CardBody>
                                </Card>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>
                    {/* Side Cards */}
                    {[
                      { id: "requirements", label: "Requirements" },
                      { id: "onBoarding", label: "OnBoarding" },
                      {
                        id: "environmentFriendly",
                        label: "Environment Friendly",
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
                                <UploadWithUrlV2
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="Image"
                                />
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Alt Text</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.alt` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Title</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.t1` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Button Name</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.buttonName` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Button Link</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...register(
                                      `content.${selectedLanguage}.${section.id}.buttonLink` as any,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <Controller
                              name={
                                `content.${selectedLanguage}.${section.id}.description` as any
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
                            <Field>
                              <FieldLabel>Info</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...register(
                                    `content.${selectedLanguage}.${section.id}.info` as any,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                              <Checkbox
                                id={`${section.id}-left-${selectedLanguage}`}
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
                                htmlFor={`${section.id}-left-${selectedLanguage}`}
                                className="text-sm font-medium"
                              >
                                Image Left?
                              </label>
                            </div>
                          </CardContent>
                        </CardBody>
                      </Card>
                    ))}

                    {/* Contact */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Contact Section</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field className="col-span-2">
                            <FieldLabel>Heading</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.contact.h2` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field className="col-span-2">
                            <FieldLabel>Button Label</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.contact.btn` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field className="col-span-2">
                            <FieldLabel>Button Link</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.contact.btnLink` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Field className="md:col-span-2">
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                              {...register(
                                `content.${selectedLanguage}.contact.p` as any,
                              )}
                            />
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* FAQ */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>FAQ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Faq Heading</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...register(
                                  `content.${selectedLanguage}.faq.heading` as any,
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <Separator />
                          {faqItems.fields.map((field, index) => (
                            <Card key={field.id} className="border-dashed">
                              <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between">
                                  <span className="text-xs font-bold text-gray-400">
                                    FAQ #{index + 1}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => faqItems.remove(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <Field>
                                  <FieldLabel>Question</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...register(
                                        `content.${selectedLanguage}.faq.faqData.${index}.question` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Answer</FieldLabel>
                                  <Textarea
                                    {...register(
                                      `content.${selectedLanguage}.faq.faqData.${index}.answer` as any,
                                    )}
                                  />
                                </Field>
                              </CardContent>
                            </Card>
                          ))}
                          <CardFooter className="flex justify-end">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                faqItems.append({
                                  id: uid(),
                                  question: "",
                                  answer: "",
                                })
                              }
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add FAQ
                            </Button>
                          </CardFooter>
                        </CardContent>
                      </CardBody>
                    </Card>
                  </>
                )}

                {/* SEO & JSON-LD */}
                <div className="space-y-8">
                  {activeTab === "seo" && (
                    <SEOSection
                      form={form}
                      metaKeywordsData={metaKeywordsData}
                    />
                  )}
                  {activeTab === "jsonld" && <JSONLDSection form={form} />}
                </div>
              </div>
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
              <Button type="submit">{type}</Button>
            </CardContent>
          </CardBody>
        </Card>
      </form>
    </FormProvider>
  );
}

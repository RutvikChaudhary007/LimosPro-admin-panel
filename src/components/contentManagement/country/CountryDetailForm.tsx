import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useForm,
  useWatch,
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
import { FormMessage } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

const CTA_DEFAULT_BUTTON_LABEL = "Download";
const CTA_DEFAULT_DESCRIPTION = "Book, change, or cancel rides easily.";

const sectionEntrySchema = z.object({
  type: z.enum(["text", "cta"]),
  title: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  buttonLabel: z.string().optional(),
});

const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  subtitle: z.string().optional(),
});

const languageContentSchema = z.object({
  intro: introSchema.optional(),
  sections: z.array(sectionEntrySchema).optional(),
});

const countryDetailFormSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  defaultLanguage: z.string().default(DEFAULT_LANGUAGE),
  availableLanguages: z.array(z.string()).default([DEFAULT_LANGUAGE]),
  content: z.record(z.string(), languageContentSchema),
  seo: seoSchema.optional(),
  jsonLd: jsonLdSchema.optional(),
});

export type CountryDetailFormData = z.infer<typeof countryDetailFormSchema>;

const getEmptyIntro = () => ({
  title: "",
  description: "",
  subtitle: "",
});

const getEmptyLanguageContent = () => ({
  intro: getEmptyIntro(),
  sections: [] as Array<z.infer<typeof sectionEntrySchema>>,
});

const getEmptySeo = (): z.infer<typeof seoSchema> => ({
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [] as string[],
  canonicalUrl: "",
  openGraph: {},
  twitter: {},
});

function normalizeInitialData(data: any): CountryDetailFormData {
  const defaultLanguage = data?.defaultLanguage ?? DEFAULT_LANGUAGE;
  const languages = Array.isArray(data?.availableLanguages)
    ? data.availableLanguages
    : [defaultLanguage];

  if (!data) {
    return {
      pageName: "",
      slug: "",
      isActive: true,
      defaultLanguage,
      availableLanguages: [DEFAULT_LANGUAGE],
      content: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent() },
      seo: getEmptySeo(),
      jsonLd: [],
    };
  }

  const contentRecord: CountryDetailFormData["content"] = {};
  let seoRecord: NonNullable<CountryDetailFormData["seo"]> = getEmptySeo();
  let jsonLdRecord: NonNullable<CountryDetailFormData["jsonLd"]> = [];
  const defaultLanguageContent =
    data.content?.[defaultLanguage] ?? getEmptyLanguageContent();

  languages.forEach((lang: string) => {
    const contentForLang =
      data.content?.[lang] ||
      (lang === defaultLanguage
        ? {
            intro:
              data.intro ?? defaultLanguageContent.intro ?? getEmptyIntro(),
            sections: Array.isArray(data.sections)
              ? data.sections
              : (defaultLanguageContent.sections ?? []),
          }
        : getEmptyLanguageContent());

    contentRecord[lang] = {
      intro: {
        title: contentForLang?.intro?.title ?? "",
        description: contentForLang?.intro?.description ?? "",
        subtitle: contentForLang?.intro?.subtitle ?? "",
      },
      sections: Array.isArray(contentForLang?.sections)
        ? contentForLang.sections.map((section: any) => ({ ...section }))
        : [],
    };
  });

  if (data.seo && typeof data.seo === "object" && !Array.isArray(data.seo)) {
    const maybeRecord = data.seo[defaultLanguage] || data.seo.en;
    seoRecord =
      maybeRecord &&
      typeof maybeRecord === "object" &&
      !Array.isArray(maybeRecord)
        ? (maybeRecord as z.infer<typeof seoSchema>)
        : (data.seo as z.infer<typeof seoSchema>);
  } else {
    seoRecord = getEmptySeo();
  }

  if (Array.isArray(data.jsonLd)) {
    jsonLdRecord = data.jsonLd as z.infer<typeof jsonLdSchema>;
  } else if (
    data.jsonLd &&
    typeof data.jsonLd === "object" &&
    !Array.isArray(data.jsonLd)
  ) {
    const maybeRecord = data.jsonLd[defaultLanguage] || data.jsonLd.en;
    jsonLdRecord = Array.isArray(maybeRecord)
      ? (maybeRecord as z.infer<typeof jsonLdSchema>)
      : [];
  } else {
    jsonLdRecord = [];
  }

  if (!contentRecord[defaultLanguage]) {
    contentRecord[defaultLanguage] = getEmptyLanguageContent();
  }

  return {
    pageName: data.pageName ?? "",
    slug: data.slug ?? "",
    isActive: data.isActive ?? true,
    defaultLanguage,
    availableLanguages: languages,
    content: contentRecord,
    seo: seoRecord,
    jsonLd: jsonLdRecord,
  };
}

interface CountryDetailFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  type: string;
}

export default function CountryDetailForm({
  initialData,
  onSubmit,
  type,
}: CountryDetailFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});
  const defaultValues = useMemo(
    () => normalizeInitialData(initialData),
    [initialData],
  );

  const form = useForm<CountryDetailFormData>({
    resolver: zodResolver(countryDetailFormSchema) as any,
    defaultValues,
  });

  const { watch, getValues, setValue } = form;
  const availableLanguages = watch("availableLanguages") || [DEFAULT_LANGUAGE];

  const contentByLanguage =
    useWatch({
      control: form.control,
      name: "content",
    }) || {};
  const sectionsPath = `content.${selectedLanguage}.sections` as any;
  const sections: Array<z.infer<typeof sectionEntrySchema>> = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.sections,
  )
    ? contentByLanguage[selectedLanguage].sections
    : [];

  const addTextSection = () => {
    const currentSections = getValues(sectionsPath) || [];
    setValue(
      sectionsPath,
      [...currentSections, { type: "text", title: "", content: "" }],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addCtaSection = () => {
    const currentSections = getValues(sectionsPath) || [];
    setValue(
      sectionsPath,
      [
        ...currentSections,
        {
          type: "cta",
          title: "",
          description: CTA_DEFAULT_DESCRIPTION,
          buttonLabel: CTA_DEFAULT_BUTTON_LABEL,
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeSectionAt = (index: number) => {
    const currentSections = getValues(sectionsPath) || [];
    setValue(
      sectionsPath,
      currentSections.filter(
        (_: z.infer<typeof sectionEntrySchema>, idx: number) => idx !== index,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    const currentData = getValues();
    if (!currentData.content?.[lang]) {
      setValue(`content.${lang}` as any, getEmptyLanguageContent(), {
        shouldDirty: true,
      });
    }
    if (!availableLanguages.includes(lang)) {
      setValue("availableLanguages", [...availableLanguages, lang], {
        shouldDirty: true,
      });
    }
  };

  const handleSyncSlug = () => {
    const title = form.getValues("pageName");
    if (title) {
      form.setValue("slug", generateSlug(title), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const onFormSubmit: SubmitHandler<CountryDetailFormData> = (data) => {
    const submissionData = structuredClone(data) as CountryDetailFormData;
    submissionData.content = submissionData.content || {};

    (submissionData.availableLanguages || []).forEach((lang) => {
      if (!submissionData.content[lang]) {
        submissionData.content[lang] = getEmptyLanguageContent();
      }

      const languageContent = submissionData.content[lang];
      languageContent.intro = languageContent.intro || getEmptyIntro();
      languageContent.sections = (languageContent.sections || []).map(
        (section) => {
          if (section.type === "cta") {
            return {
              ...section,
              content: "",
              description: section.description ?? "",
              buttonLabel: section.buttonLabel ?? "",
            };
          }
          return {
            ...section,
            description: "",
            buttonLabel: "",
            content: section.content ?? "",
          };
        },
      );
    });

    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });
    onSubmit(formData);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit as any)}
        className="space-y-6"
      >
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Country Detail Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                availableLanguages={LANGUAGE_CODES}
              />

              <Card>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Page Details</CardTitle>
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
                          Page Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="pageName"
                            placeholder="e.g. United States"
                            {...form.register("pageName")}
                          />
                        </InputGroup>
                        {form.formState.errors.pageName && (
                          <FormMessage>
                            {form.formState.errors.pageName.message}
                          </FormMessage>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="slug">
                          Slug <span className="text-red-500">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="slug"
                            placeholder="e.g. united-states"
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

              <div className="flex gap-8">
                <Button
                  type="button"
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "general"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  spacing="sm"
                  disabled={selectedLanguage !== "en"}
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "seo"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }  ${selectedLanguage !== "en" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setActiveTab("seo")}
                >
                  SEO ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  spacing="sm"
                  disabled={selectedLanguage !== "en"}
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "jsonld"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }  ${selectedLanguage !== "en" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setActiveTab("jsonld")}
                >
                  JSON-LD ({selectedLanguage.toUpperCase()})
                </Button>
              </div>

              <div key={selectedLanguage}>
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Intro Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>
                              Intro Title (use {"{country}"} for country name)
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.intro.title` as any,
                                )}
                                placeholder="Your Private Driver in {country}"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Intro Description</FieldLabel>
                            <Textarea
                              {...form.register(
                                `content.${selectedLanguage}.intro.description` as any,
                              )}
                              placeholder="Description text"
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Intro Subtitle</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.intro.subtitle` as any,
                                )}
                                placeholder="Check out our range ... {country} ..."
                              />
                            </InputGroup>
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Content Sections</CardTitle>
                          <CardAction>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addTextSection}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add Text
                              </Button>
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addCtaSection}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add CTA
                              </Button>
                            </div>
                          </CardAction>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {sections.map(
                            (
                              _: z.infer<typeof sectionEntrySchema>,
                              index: number,
                            ) => {
                              const sectionType = form.watch(
                                `content.${selectedLanguage}.sections.${index}.type` as any,
                              );
                              return (
                                <Card
                                  key={`${selectedLanguage}-section-${index}`}
                                  className="border-dashed"
                                >
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-xs font-bold uppercase text-gray-400">
                                        Section #{index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSectionAt(index)}
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel>Type</FieldLabel>
                                      <select
                                        className="w-full border rounded px-3 py-2"
                                        {...form.register(
                                          `content.${selectedLanguage}.sections.${index}.type` as any,
                                        )}
                                      >
                                        <option value="text">Text</option>
                                        <option value="cta">CTA</option>
                                      </select>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Title</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.sections.${index}.title` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>

                                    {sectionType === "cta" ? (
                                      <>
                                        <Field>
                                          <FieldLabel>Description</FieldLabel>
                                          <Textarea
                                            {...form.register(
                                              `content.${selectedLanguage}.sections.${index}.description` as any,
                                            )}
                                          />
                                        </Field>
                                        <Field>
                                          <FieldLabel>Button Label</FieldLabel>
                                          <InputGroup>
                                            <InputGroupInput
                                              {...form.register(
                                                `content.${selectedLanguage}.sections.${index}.buttonLabel` as any,
                                              )}
                                            />
                                          </InputGroup>
                                        </Field>
                                      </>
                                    ) : (
                                      <Field>
                                        <FieldLabel>Content</FieldLabel>
                                        <Textarea
                                          {...form.register(
                                            `content.${selectedLanguage}.sections.${index}.content` as any,
                                          )}
                                        />
                                      </Field>
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            },
                          )}
                        </CardContent>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </div>

              {selectedLanguage === "en" && activeTab === "seo" && (
                <SEOSection
                  form={form}
                  metaKeywordsData={metaKeywordsData}
                  basePath="seo"
                />
              )}

              {selectedLanguage === "en" && activeTab === "jsonld" && (
                <JSONLDSection form={form} basePath="jsonLd" />
              )}
            </CardContent>
          </CardBody>
        </Card>

        <Card className="sticky bottom-6 z-10 bg-base-white/80 backdrop-blur">
          <CardBody className="p-4">
            <CardContent className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outlinePrimary"
                onClick={() => form.reset(defaultValues)}
              >
                Reset Form
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : `Submit ${type}`}
              </Button>
            </CardContent>
          </CardBody>
        </Card>
      </form>
    </FormProvider>
  );
}

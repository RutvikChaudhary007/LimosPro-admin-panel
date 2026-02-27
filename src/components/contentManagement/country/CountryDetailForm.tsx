import { zodResolver } from "@hookform/resolvers/zod";
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

const sectionEntrySchema = z.object({
  type: z.enum(["text", "cta"]),
  title: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  buttonLabel: z.string().optional(),
});

const countryDetailFormSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  defaultLanguage: z.string().default("en"),
  availableLanguages: z.array(z.string()).default(["en"]),
  intro: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      subtitle: z.string().optional(),
    })
    .optional(),
  sections: z.array(sectionEntrySchema).optional(),
  seo: z.record(z.string(), seoSchema).optional(),
  jsonLd: z.record(z.string(), jsonLdSchema).optional(),
});

export type CountryDetailFormData = z.infer<typeof countryDetailFormSchema>;

const getEmptyIntro = () => ({
  title: "",
  description: "",
  subtitle: "",
});
const getEmptySeo = () => ({
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [] as string[],
  canonicalUrl: "",
  openGraph: {} as Record<string, unknown>,
  twitter: {} as Record<string, unknown>,
});

function normalizeInitialData(data: any): CountryDetailFormData {
  if (!data)
    return {
      pageName: "",
      slug: "",
      isActive: true,
      defaultLanguage: DEFAULT_LANGUAGE,
      availableLanguages: LANGUAGE_CODES,
      intro: getEmptyIntro(),
      sections: [],
      seo: { [DEFAULT_LANGUAGE]: getEmptySeo() },
      jsonLd: { [DEFAULT_LANGUAGE]: [] },
    };

  const languages = data.availableLanguages || [DEFAULT_LANGUAGE];
  const seoRecord: Record<string, unknown> = {};
  const jsonLdRecord: Record<string, unknown[]> = {};
  languages.forEach((lang: string) => {
    seoRecord[lang] =
      data.seo?.[lang] || data.seo?.[DEFAULT_LANGUAGE] || getEmptySeo();
    jsonLdRecord[lang] = Array.isArray(data.jsonLd?.[lang])
      ? data.jsonLd[lang]
      : Array.isArray(data.jsonLd?.[DEFAULT_LANGUAGE])
        ? data.jsonLd[DEFAULT_LANGUAGE]
        : [];
  });

  return {
    pageName: data.pageName ?? "",
    slug: data.slug ?? "",
    isActive: data.isActive ?? true,
    defaultLanguage: data.defaultLanguage ?? DEFAULT_LANGUAGE,
    availableLanguages: languages,
    intro: data.intro ?? getEmptyIntro(),
    sections: Array.isArray(data.sections) ? data.sections : [],
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

  const sectionsArray = useFieldArray({
    control: form.control,
    name: "sections",
  });

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
    const formData = jsonToFormData(data, { fileKeyMode: "path" });
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
                onLanguageChange={setSelectedLanguage}
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
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "seo"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setActiveTab("seo")}
                >
                  SEO ({selectedLanguage.toUpperCase()})
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  spacing="sm"
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "jsonld"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setActiveTab("jsonld")}
                >
                  JSON-LD ({selectedLanguage.toUpperCase()})
                </Button>
              </div>

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
                              {...form.register("intro.title")}
                              placeholder="Your Private Driver in {country}"
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Intro Description</FieldLabel>
                          <Textarea
                            {...form.register("intro.description")}
                            placeholder="Description text"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Intro Subtitle</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...form.register("intro.subtitle")}
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
                          <Button
                            type="button"
                            variant="outlinePrimary"
                            size="sm"
                            onClick={() =>
                              sectionsArray.append({
                                type: "text",
                                title: "",
                                content: "",
                              })
                            }
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Section
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sectionsArray.fields.map((field, index) => (
                          <Card key={field.id} className="border-dashed">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-xs font-bold uppercase text-gray-400">
                                  Section #{index + 1}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sectionsArray.remove(index)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                              <Field>
                                <FieldLabel>Type</FieldLabel>
                                <select
                                  className="w-full border rounded px-3 py-2"
                                  {...form.register(`sections.${index}.type`)}
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
                                      `sections.${index}.title`,
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel>Content / Description</FieldLabel>
                                <Textarea
                                  {...form.register(
                                    `sections.${index}.content`,
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
                <SEOSection
                  form={form}
                  selectedLanguage={selectedLanguage}
                  metaKeywordsData={metaKeywordsData}
                  basePath="seo"
                />
              )}

              {activeTab === "jsonld" && (
                <JSONLDSection
                  form={form}
                  selectedLanguage={selectedLanguage}
                  basePath="jsonLd"
                />
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

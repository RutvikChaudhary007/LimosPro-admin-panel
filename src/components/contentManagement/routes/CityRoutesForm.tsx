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
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { uid } from "@/utils/pagebuilder.utils";
import { safeZodResolver } from "@/utils/safeZodResolver";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { imageSchema, jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

const routeEntrySchema = z.object({
  id: z.string().optional(),
  fromCity: z.string().optional(),
  toCity: z.string().optional(),
  fromSlug: z.string().optional(),
  toSlug: z.string().optional(),
  country: z.string().optional(),
  countrySlug: z.string().optional(),
  time: z.string().optional(),
  distance: z.string().optional(),
});

const sectionEntrySchema = z.object({
  type: z.enum(["text", "cta", "benefits"]),
  title: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  buttonLabel: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: imageSchema.optional(),
  imageAlt: z.string().optional(),
});

const languageContentSchema = z.object({
  intro: introSchema.optional(),
  sections: z.array(sectionEntrySchema).optional(),
  routes: z.array(routeEntrySchema).optional(),
});

const cityRoutesFormSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  defaultLanguage: z.string().default(DEFAULT_LANGUAGE),
  availableLanguages: z.array(z.string()).default([DEFAULT_LANGUAGE]),
  seo: seoSchema.optional(),
  content: z.record(z.string(), languageContentSchema),
  jsonLd: jsonLdSchema.optional(),
});

export type CityRoutesFormData = z.infer<typeof cityRoutesFormSchema>;

const getEmptySeo = () => ({
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [] as string[],
  canonicalUrl: "",
  openGraph: {},
  twitter: {},
});
const getEmptyIntro = () => ({
  title: "",
  description: "",
  image: "",
  imageAlt: "",
});
const getEmptyLanguageContent = () => ({
  intro: getEmptyIntro(),
  sections: [] as Array<z.infer<typeof sectionEntrySchema>>,
  routes: [] as Array<z.infer<typeof routeEntrySchema>>,
});
const normalizeSeo = (seo: any) => {
  if (!seo || typeof seo !== "object") return getEmptySeo();
  if ("metaTitle" in seo || "metaDescription" in seo || "metaKeywords" in seo) {
    return {
      ...getEmptySeo(),
      ...seo,
      openGraph: seo.openGraph || {},
      twitter: seo.twitter || {},
    };
  }
  return {
    ...getEmptySeo(),
    metaTitle: seo.title ?? "",
    metaDescription: seo.description ?? "",
    metaKeywords: Array.isArray(seo.keywords) ? seo.keywords : [],
  };
};

function normalizeInitialData(data: any): CityRoutesFormData {
  if (!data) {
    return {
      pageName: "City-to-City Routes",
      slug: "city-routes",
      isActive: true,
      defaultLanguage: DEFAULT_LANGUAGE,
      availableLanguages: [DEFAULT_LANGUAGE],
      seo: getEmptySeo(),
      content: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent() },
      jsonLd: [],
    };
  }

  const defaultLanguage = data.defaultLanguage ?? DEFAULT_LANGUAGE;
  const availableLanguages = Array.isArray(data.availableLanguages)
    ? data.availableLanguages
    : [defaultLanguage];
  const content =
    data.content &&
    typeof data.content === "object" &&
    !Array.isArray(data.content)
      ? { ...data.content }
      : {};

  if (!content[defaultLanguage]) {
    content[defaultLanguage] = getEmptyLanguageContent();
  }

  return {
    pageName: data.pageName ?? "City-to-City Routes",
    slug: data.slug ?? "city-routes",
    isActive: data.isActive ?? true,
    defaultLanguage,
    availableLanguages,
    seo: normalizeSeo(data.seo),
    content,
    jsonLd: Array.isArray(data.jsonLd) ? data.jsonLd : [],
  };
}

interface CityRoutesFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  type: string;
}

export default function CityRoutesForm({
  initialData,
  onSubmit,
  type,
}: CityRoutesFormProps) {
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

  const form = useForm<CityRoutesFormData>({
    resolver: safeZodResolver(cityRoutesFormSchema) as any,
    defaultValues,
  });

  const { watch, getValues, setValue } = form;
  const availableLanguages = watch("availableLanguages") || [DEFAULT_LANGUAGE];

  const contentByLanguage =
    useWatch({
      control: form.control,
      name: "content",
    }) || {};
  const sections = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.sections,
  )
    ? contentByLanguage[selectedLanguage].sections
    : [];
  const routes = Array.isArray(contentByLanguage?.[selectedLanguage]?.routes)
    ? contentByLanguage[selectedLanguage].routes
    : [];

  const addSection = () => {
    const path = `content.${selectedLanguage}.sections` as any;
    const currentSections = getValues(path) || [];
    setValue(
      path,
      [...currentSections, { type: "text", title: "", content: "" }],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeSection = (index: number) => {
    const path = `content.${selectedLanguage}.sections` as any;
    const currentSections = getValues(path) || [];
    setValue(
      path,
      currentSections.filter((_: any, idx: number) => idx !== index),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addRoute = () => {
    const path = `content.${selectedLanguage}.routes` as any;
    const currentRoutes = getValues(path) || [];
    setValue(
      path,
      [
        ...currentRoutes,
        {
          id: uid(),
          fromCity: "",
          toCity: "",
          fromSlug: "",
          toSlug: "",
          country: "",
          countrySlug: "",
          time: "",
          distance: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeRoute = (index: number) => {
    const path = `content.${selectedLanguage}.routes` as any;
    const currentRoutes = getValues(path) || [];
    setValue(
      path,
      currentRoutes.filter((_: any, idx: number) => idx !== index),
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
    if (
      lang !== DEFAULT_LANGUAGE &&
      (activeTab === "seo" || activeTab === "jsonld")
    ) {
      setActiveTab("general");
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

  const onFormSubmit: SubmitHandler<CityRoutesFormData> = (data) => {
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
              <CardTitle>City-to-City Routes Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                availableLanguages={LANGUAGE_CODES}
              />

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
                  disabled={selectedLanguage !== DEFAULT_LANGUAGE}
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "seo"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  } ${selectedLanguage !== DEFAULT_LANGUAGE ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setActiveTab("seo")}
                >
                  SEO (Shared)
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  spacing="sm"
                  disabled={selectedLanguage !== DEFAULT_LANGUAGE}
                  className={`capitalize border-b-2 rounded-none transition ${
                    activeTab === "jsonld"
                      ? "border-base-black font-semibold text-primary"
                      : "border-transparent text-gray-500"
                  } ${selectedLanguage !== DEFAULT_LANGUAGE ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setActiveTab("jsonld")}
                >
                  JSON-LD (Shared)
                </Button>
              </div>

              {activeTab === "general" && (
                <div className="space-y-6" key={selectedLanguage}>
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
                                placeholder="e.g. City-to-City Routes"
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
                                placeholder="e.g. city-routes"
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

                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>
                          Intro Section ({selectedLanguage.toUpperCase()})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Intro Title</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...form.register(
                                `content.${selectedLanguage}.intro.title` as any,
                              )}
                              placeholder="Intro heading"
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel>Intro Description</FieldLabel>
                          <Textarea
                            {...form.register(
                              `content.${selectedLanguage}.intro.description` as any,
                            )}
                            placeholder="Intro text"
                          />
                        </Field>
                        <Controller
                          name={
                            `content.${selectedLanguage}.intro.image` as any
                          }
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <div className="space-y-1">
                              <UploadWithUrlV2
                                value={field.value}
                                onChange={field.onChange}
                                title="Intro Image"
                                disabled={form.formState.isSubmitting}
                              />
                              {fieldState.error && (
                                <FormMessage>
                                  {fieldState.error.message}
                                </FormMessage>
                              )}
                            </div>
                          )}
                        />
                        <Field>
                          <FieldLabel>Intro Image Alt</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...form.register(
                                `content.${selectedLanguage}.intro.imageAlt` as any,
                              )}
                              placeholder="Alt text for image"
                            />
                          </InputGroup>
                        </Field>
                      </CardContent>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>
                          Content Sections ({selectedLanguage.toUpperCase()})
                        </CardTitle>
                        <CardAction>
                          <Button
                            type="button"
                            variant="outlinePrimary"
                            size="sm"
                            onClick={addSection}
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Section
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sections.map((_: any, index: number) => (
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
                                  onClick={() => removeSection(index)}
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
                                  <option value="benefits">Benefits</option>
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
                              <Field>
                                <FieldLabel>Content</FieldLabel>
                                <Textarea
                                  {...form.register(
                                    `content.${selectedLanguage}.sections.${index}.content` as any,
                                  )}
                                />
                              </Field>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <CardHeader>
                        <CardTitle>
                          Routes List ({selectedLanguage.toUpperCase()})
                        </CardTitle>
                        <CardAction>
                          <Button
                            type="button"
                            variant="outlinePrimary"
                            size="sm"
                            onClick={addRoute}
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Route
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {routes.map((_: any, index: number) => (
                          <Card
                            key={`${selectedLanguage}-route-${index}`}
                            className="border-dashed"
                          >
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between">
                                <span className="text-xs font-bold uppercase text-gray-400">
                                  Route #{index + 1}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRoute(index)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Field>
                                  <FieldLabel>From City</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.fromCity` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>To City</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.toCity` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>From Slug</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.fromSlug` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>To Slug</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.toSlug` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Country</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.country` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Country Slug</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.countrySlug` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Time</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.time` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                                <Field>
                                  <FieldLabel>Distance</FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      {...form.register(
                                        `content.${selectedLanguage}.routes.${index}.distance` as any,
                                      )}
                                    />
                                  </InputGroup>
                                </Field>
                              </div>
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

import {
  Banknote,
  Clock,
  Globe,
  Link2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useFieldArray,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrlV2 from "@/components/ui/upload-with-url-v2";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { safeZodResolver } from "@/utils/safeZodResolver";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema, seoSchema } from "../shared/sharedSchemas";

// const CTA_DEFAULT_BUTTON_LABEL = "Download";
// const CTA_DEFAULT_DESCRIPTION = "Book, change, or cancel rides easily.";

const sectionEntrySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const citiesSectionSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});
const airportTransferSectionsSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});
const airportTransferByAirportSectionsSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});

const introSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  // subtitle: z.string().optional(),
});

const cardSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  // subtitle: z.string().optional(),
});

const breadcrumbItemSchema = z.object({
  label: z.string().optional(),
  url: z.string().optional(),
});

const downloadOptionsAppSchema = z.object({
  image: z.any().optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
});

const downloadOptionsListItemSchema = z.object({
  value: z.string().optional(),
});

const downloadOptionsImageSchema = z.object({
  src: z.any().optional(),
  alt: z.string().optional(),
});

const downloadOptionsSchema = z.object({
  Heading: z.string().optional(),
  Description: z.string().optional(),
  image: downloadOptionsImageSchema.optional(),
  qrImage: downloadOptionsImageSchema.optional(),
  apps: z.array(downloadOptionsAppSchema).optional(),
  // QRAlt: z.string().optional(),
  // AppStoreAlt: z.string().optional(),
  // PlayStoreAlt: z.string().optional(),
  list: z.array(downloadOptionsListItemSchema).optional(),
});

const languageContentSchema = z.object({
  intro: introSchema.optional(),
  breadcrumb: z.array(breadcrumbItemSchema).optional(),
  cardSections: z.array(cardSchema).optional(),
  citiesSections: citiesSectionSchema.optional(),
  airportTransferSections: airportTransferSectionsSchema.optional(),
  airportTransferByAirportSections:
    airportTransferByAirportSectionsSchema.optional(),
  sections: sectionEntrySchema.optional(),
  DownloadOptions: downloadOptionsSchema.optional(),
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
  // subtitle: "",
});

const getEmptyBreadCrumb = () => [];

const getEmptyLanguageContent = () => ({
  intro: getEmptyIntro(),
  breadcrumb: getEmptyBreadCrumb(),
  sections: {} as z.infer<typeof sectionEntrySchema>,
  DownloadOptions: {
    Heading: "",
    Description: "",
    image: { src: "", alt: "" },
    qrImage: { src: "", alt: "" },
    apps: [{ image: "", url: "", alt: "" }],
    // QRAlt: "",
    // AppStoreAlt: "",
    // PlayStoreAlt: "",
    list: [],
  },
});

const getEmptySeo = () => ({
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
  let seoRecord: CountryDetailFormData["seo"] = getEmptySeo();
  let jsonLdRecord: CountryDetailFormData["jsonLd"] = [];
  const defaultLanguageContent =
    data.content?.[defaultLanguage] ?? getEmptyLanguageContent();

  languages.forEach((lang: string) => {
    const contentForLang =
      data.content?.[lang] ||
      (lang === defaultLanguage
        ? {
            intro: defaultLanguageContent.intro ?? getEmptyIntro(),
            breadcrumb: Array.isArray(defaultLanguageContent.breadcrumb)
              ? defaultLanguageContent.breadcrumb
              : [],
            sections: defaultLanguageContent.sections
              ? defaultLanguageContent.sections
              : {},
            cardSections: defaultLanguageContent?.cardSections
              ? defaultLanguageContent.cardSections
              : {},
            citiesSections: defaultLanguageContent?.citiesSections
              ? defaultLanguageContent?.citiesSections
              : {},
            airportTransferSections:
              defaultLanguageContent?.airportTransferSections
                ? defaultLanguageContent.airportTransferSections
                : {},
            airportTransferByAirportSections:
              defaultLanguageContent?.airportTransferByAirportSections
                ? defaultLanguageContent.airportTransferByAirportSections
                : {},
            DownloadOptions: defaultLanguageContent?.DownloadOptions ?? {
              Heading: "",
              Description: "",
              image: { src: "", alt: "" },
              qrImage: { src: "", alt: "" },
              apps: [{ image: "", url: "", alt: "" }],
              list: [],
            },
          }
        : getEmptyLanguageContent());

    contentRecord[lang] = {
      intro: {
        title: contentForLang?.intro?.title ?? "",
        description: contentForLang?.intro?.description ?? "",
        // subtitle: contentForLang?.intro?.subtitle ?? "",
      },
      breadcrumb: Array.isArray(contentForLang?.breadcrumb)
        ? contentForLang.breadcrumb.map((item: any) => ({ ...item }))
        : [],
      sections: contentForLang?.sections ? contentForLang.sections : {},
      cardSections: contentForLang?.cardSections
        ? contentForLang.cardSections
        : {},
      citiesSections: contentForLang?.citiesSections
        ? contentForLang?.citiesSections
        : {},
      airportTransferSections: contentForLang?.airportTransferSections
        ? contentForLang.airportTransferSections
        : {},
      airportTransferByAirportSections:
        contentForLang?.airportTransferByAirportSections
          ? contentForLang.airportTransferByAirportSections
          : {},
      DownloadOptions: contentForLang?.DownloadOptions ?? {
        Heading: "",
        Description: "",
        image: { src: "", alt: "" },
        qrImage: { src: "", alt: "" },
        apps: [{ image: "", url: "", alt: "" }],
        list: [],
      },
    };
  });

  if (data.seo && typeof data.seo === "object" && !Array.isArray(data.seo)) {
    const maybeRecord = data.seo[defaultLanguage] || data.seo.en;
    seoRecord =
      maybeRecord &&
      typeof maybeRecord === "object" &&
      !Array.isArray(maybeRecord)
        ? maybeRecord
        : data.seo;
  } else {
    seoRecord = getEmptySeo();
  }

  if (Array.isArray(data.jsonLd)) {
    jsonLdRecord = data.jsonLd;
  } else if (
    data.jsonLd &&
    typeof data.jsonLd === "object" &&
    !Array.isArray(data.jsonLd)
  ) {
    const maybeRecord = data.jsonLd[defaultLanguage] || data.jsonLd.en;
    jsonLdRecord = Array.isArray(maybeRecord) ? maybeRecord : [];
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
    resolver: safeZodResolver(countryDetailFormSchema) as any,
    defaultValues,
  });

  const {
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (errors) console.error("errors:=", errors, "\nvalues:", getValues());
  }, [errors]);
  const availableLanguages = watch("availableLanguages") || [DEFAULT_LANGUAGE];

  const contentByLanguage =
    useWatch({
      control,
      name: "content",
    }) || {};

  const appList = useFieldArray({
    control,
    name: `content.${selectedLanguage}.DownloadOptions.apps` as any,
  });
  const downloadList = useFieldArray({
    control,
    name: `content.${selectedLanguage}.DownloadOptions.list` as any,
  });
  const getCardSectionsPath = (lang: LanguageCode = selectedLanguage) =>
    `content.${lang}.cardSections` as any;

  const cardSections = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.cardSections,
  )
    ? contentByLanguage[selectedLanguage].cardSections
    : [];

  const addCardSections = () => {
    const sectionsPath = getCardSectionsPath();
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      [...sectionsArray, { icon: "", title: "", description: "" }],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeCardSectionsAt = (index: number) => {
    const sectionsPath = getCardSectionsPath();
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      sectionsArray.filter(
        (_: z.infer<typeof cardSchema>, idx: number) => idx !== index,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };
  const citiesSections = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.citiesSections?.items,
  )
    ? contentByLanguage[selectedLanguage]?.citiesSections?.items
    : [];

  const airportTransferSections = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.airportTransferSections?.items,
  )
    ? contentByLanguage[selectedLanguage]?.airportTransferSections?.items
    : [];

  const airportTransferByAirportSections = Array.isArray(
    contentByLanguage?.[selectedLanguage]?.airportTransferByAirportSections
      ?.items,
  )
    ? contentByLanguage[selectedLanguage]?.airportTransferByAirportSections
        ?.items
    : [];

  const addCitiesSection = () => {
    const sectionsPath: any = `content.${selectedLanguage}.citiesSections.items`;
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      [...sectionsArray, { type: "text", title: "", content: "" }],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeCitiesSectionAt = (index: number) => {
    const sectionsPath: any = `content.${selectedLanguage}.citiesSections.items`;
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      sectionsArray.filter(
        (_: z.infer<typeof sectionEntrySchema>, idx: number) => idx !== index,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addAirportTransferSections = () => {
    const sectionsPath: any = `content.${selectedLanguage}.airportTransferSections.items`;
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      [...sectionsArray, { type: "text", title: "", content: "" }],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeAirportTransferSectionsAt = (index: number) => {
    const sectionsPath: any = `content.${selectedLanguage}.airportTransferSections.items`;
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      sectionsArray.filter(
        (_: z.infer<typeof sectionEntrySchema>, idx: number) => idx !== index,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const addAirportTransferByAirportSections = () => {
    const sectionsPath: any = `content.${selectedLanguage}.airportTransferByAirportSections.items`;
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      [...sectionsArray, { type: "text", title: "", content: "" }],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeAirportTransferByAirportSectionsAt = (index: number) => {
    const sectionsPath: any = `content.${selectedLanguage}.airportTransferByAirportSections.items`;
    const currentSections = getValues(sectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    setValue(
      sectionsPath,
      sectionsArray.filter(
        (_: z.infer<typeof sectionEntrySchema>, idx: number) => idx !== index,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const getBreadcrumbSectionsPath = (lang: LanguageCode = selectedLanguage) =>
    `content.${lang}.breadcrumb` as any;

  const breadcrumbSections: Array<z.infer<typeof breadcrumbItemSchema>> =
    Array.isArray(contentByLanguage?.[selectedLanguage]?.breadcrumb)
      ? contentByLanguage[selectedLanguage].breadcrumb
      : [];

  const addBreadcrumbSection = () => {
    const breadcrumbSectionsPath = getBreadcrumbSectionsPath();
    const currentSections = getValues(breadcrumbSectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];
    console.log(
      "breadcrumbSectionsPath:",
      breadcrumbSectionsPath,
      "\ncurrentSections:",
      { ...sectionsArray },
    );
    setValue(
      breadcrumbSectionsPath,
      [
        ...sectionsArray,
        {
          label: "",
          url: "",
        },
      ],
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const removeBreadcrumSectionAt = (index: number) => {
    const breadcrumbSectionsPath = getBreadcrumbSectionsPath();
    const currentSections = getValues(breadcrumbSectionsPath);
    const sectionsArray = Array.isArray(currentSections) ? currentSections : [];

    setValue(
      breadcrumbSectionsPath,
      sectionsArray.filter(
        (_: z.infer<typeof breadcrumbItemSchema>, idx: number) => idx !== index,
      ),
      { shouldDirty: true, shouldTouch: true },
    );
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    const currentData = getValues();
    const languageContent = currentData.content?.[lang];
    if (!languageContent) {
      setValue(`content.${lang}` as any, getEmptyLanguageContent(), {
        shouldDirty: true,
      });
    } else if (
      !Array.isArray(languageContent.sections) ||
      !languageContent.intro
    ) {
      setValue(
        `content.${lang}` as any,
        {
          intro: {
            ...getEmptyIntro(),
            ...(languageContent.intro || {}),
          },
          breadcrumb: Array.isArray(languageContent.breadcrumb)
            ? languageContent.breadcrumb.map((bcb: any) => ({ ...bcb }))
            : [],
          sections: Array.isArray(languageContent.sections)
            ? languageContent.sections.map((section: any) => ({ ...section }))
            : [],
          DownloadOptions: languageContent.DownloadOptions ?? {
            Heading: "",
            Description: "",
            image: { src: "", alt: "" },
            qrImage: { src: "", alt: "" },
            apps: [{ image: "", url: "", alt: "" }],
            // QRAlt: "",
            // AppStoreAlt: "",
            // PlayStoreAlt: "",
            list: [],
          },
        },
        { shouldDirty: true },
      );
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
    console.log("data:", data);
    const submissionData = structuredClone(data) as CountryDetailFormData;
    submissionData.content = submissionData.content || {};

    (submissionData.availableLanguages || []).forEach((lang) => {
      if (!submissionData.content[lang]) {
        submissionData.content[lang] = getEmptyLanguageContent();
      }

      const languageContent = submissionData.content[lang];
      languageContent.intro = languageContent.intro || getEmptyIntro();
      // languageContent.sections = (languageContent.sections || []).map(
      //   (section) => {
      //     if (section.type === "cta") {
      //       return {
      //         ...section,
      //         content: "",
      //         description: section.description ?? "",
      //         buttonLabel: section.buttonLabel ?? "",
      //       };
      //     }
      //     return {
      //       ...section,
      //       description: "",
      //       buttonLabel: "",
      //       content: section.content ?? "",
      //     };
      //   },
      // );
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
                    {/* Hero Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Intro Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Intro Title</FieldLabel>
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
                            <FieldLabel>Intro Subtitle</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.intro.subtitle` as any,
                                )}
                                placeholder="Check out our services in {country}"
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={form.control}
                            name={
                              `content.${selectedLanguage}.intro.description` as any
                            }
                            render={({ field }) => (
                              <Field>
                                <FieldLabel>Intro Description</FieldLabel>
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

                    {/* BreadCrumb Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>BreadCumb Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardAction>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addBreadcrumbSection}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add BreadCrumb
                              </Button>
                            </div>
                          </CardAction>
                          {breadcrumbSections.map(
                            (
                              _: z.infer<typeof breadcrumbItemSchema>,
                              index: number,
                            ) => {
                              return (
                                <Card
                                  key={`${selectedLanguage}breadcrumb-${index}`}
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
                                        onClick={() =>
                                          removeBreadcrumSectionAt(index)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel>Label</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.breadcrumb.${index}.label` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>URL</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.breadcrumb.${index}.url` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                  </CardContent>
                                </Card>
                              );
                            },
                          )}
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Card Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Card Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardAction>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addCardSections}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add Card
                              </Button>
                            </div>
                          </CardAction>
                          {cardSections.map((_, index: number) => {
                            return (
                              <Card
                                key={`${selectedLanguage}breadcrumb-${index}`}
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
                                      onClick={() =>
                                        removeCardSectionsAt(index)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <Field>
                                    <FieldLabel>Icon</FieldLabel>
                                    <Controller
                                      control={control}
                                      name={
                                        `content.${selectedLanguage}.cardSections.${index}.icon` as any
                                      }
                                      render={({ field }) => (
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          value={field.value}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Icon" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Globe">
                                              <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" />{" "}
                                                <span>Globe</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="Clock">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Clock</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="Banknote">
                                              <div className="flex items-center gap-2">
                                                <Banknote className="w-4 h-4" />
                                                <span>BankNote</span>
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      )}
                                    />
                                  </Field>
                                  <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.cardSections.${index}.title` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>

                                  <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.cardSections.${index}.description` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.sections.title` as any,
                                )}
                                placeholder="Your Private Driver in United States"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <Controller
                              control={form.control}
                              name={
                                `content.${selectedLanguage}.sections.description` as any
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
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Cities Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Cities Sections</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.citiesSections.title` as any,
                                )}
                                placeholder="Your Private Driver in United States"
                              />
                            </InputGroup>
                          </Field>
                          <CardAction>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addCitiesSection}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add
                              </Button>
                            </div>
                          </CardAction>
                          {citiesSections.map((_, index: number) => {
                            return (
                              <Card
                                key={`${selectedLanguage}-citiesSections-${index}`}
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
                                      onClick={() =>
                                        removeCitiesSectionAt(index)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <Field>
                                    <FieldLabel>Label</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.citiesSections.items.${index}.label` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>URL</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.citiesSections.items.${index}.url` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Airport Transfer Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Airport Transfer Sections</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.airportTransferSections.title` as any,
                                )}
                                placeholder="Your Private Driver in United States"
                              />
                            </InputGroup>
                          </Field>
                          <CardAction>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addAirportTransferSections}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add
                              </Button>
                            </div>
                          </CardAction>
                          {airportTransferSections.map((_, index: number) => {
                            return (
                              <Card
                                key={`${selectedLanguage}-airportTransferSections-${index}`}
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
                                      onClick={() =>
                                        removeAirportTransferSectionsAt(index)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <Field>
                                    <FieldLabel>Label</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.airportTransferSections.items.${index}.label` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel>URL</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.airportTransferSections.items.${index}.url` as any,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Airport transfer by airport Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>
                            Airport transfer by airport Sections
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.airportTransferByAirportSections.title` as any,
                                )}
                                placeholder="Your Private Driver in United States"
                              />
                            </InputGroup>
                          </Field>
                          <CardAction>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outlinePrimary"
                                size="sm"
                                onClick={addAirportTransferByAirportSections}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Add
                              </Button>
                            </div>
                          </CardAction>
                          {airportTransferByAirportSections.map(
                            (_, index: number) => {
                              return (
                                <Card
                                  key={`${selectedLanguage}-airportTransferByAirportSections-${index}`}
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
                                        onClick={() =>
                                          removeAirportTransferByAirportSectionsAt(
                                            index,
                                          )
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel>Label</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.airportTransferByAirportSections.items.${index}.label` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>URL</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.airportTransferByAirportSections.items.${index}.url` as any,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                  </CardContent>
                                </Card>
                              );
                            },
                          )}
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* DownloadOptions Section */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Download Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel>Heading</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(
                                  `content.${selectedLanguage}.DownloadOptions.Heading` as any,
                                )}
                                placeholder="Heading"
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Controller
                              name={
                                `content.${selectedLanguage}.DownloadOptions.Description` as any
                              }
                              control={control}
                              render={({ field }) => (
                                <TinyEditorRHF
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Controller
                                name={
                                  `content.${selectedLanguage}.DownloadOptions.image.src` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <UploadWithUrlV2
                                    value={field.value}
                                    onChange={field.onChange}
                                    title="Main Image"
                                  />
                                )}
                              />
                              <Field>
                                <FieldLabel>Image Alt Text</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...form.register(
                                      `content.${selectedLanguage}.DownloadOptions.image.alt` as any,
                                    )}
                                    placeholder="Main Image Alt"
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                            <div>
                              <Controller
                                name={
                                  `content.${selectedLanguage}.DownloadOptions.qrImage.src` as any
                                }
                                control={control}
                                render={({ field }) => (
                                  <UploadWithUrlV2
                                    value={field.value}
                                    onChange={field.onChange}
                                    title="QR Image"
                                  />
                                )}
                              />
                              <Field>
                                <FieldLabel>QR Image Alt Text</FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    {...form.register(
                                      `content.${selectedLanguage}.DownloadOptions.qrImage.alt` as any,
                                    )}
                                    placeholder="QR Image Alt"
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <h4 className="font-bold">App Buttons</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                appList.append({
                                  image: "",
                                  url: "",
                                  alt: "",
                                })
                              }
                            >
                              Add App
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {appList.fields.map((field, idx) => (
                              <Card key={field.id}>
                                <CardBody className="p-4 space-y-3">
                                  <div className="flex-1 space-y-2">
                                    <Controller
                                      name={
                                        `content.${selectedLanguage}.DownloadOptions.apps.${idx}.image` as any
                                      }
                                      control={control}
                                      render={({ field }) => (
                                        <UploadWithUrlV2
                                          value={field.value}
                                          onChange={field.onChange}
                                          title="Store Icon"
                                        />
                                      )}
                                    />
                                    <Field>
                                      <FieldLabel>URL</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.DownloadOptions.apps.${idx}.url` as any,
                                          )}
                                          placeholder="URL"
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel>Alt</FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          {...form.register(
                                            `content.${selectedLanguage}.DownloadOptions.apps.${idx}.alt` as any,
                                          )}
                                          placeholder="Alt"
                                        />
                                      </InputGroup>
                                    </Field>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => appList.remove(idx)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <h4 className="font-bold">List Items</h4>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => downloadList.append({ value: "" })}
                            >
                              Add Item
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {downloadList.fields.map((field, idx) => (
                              <Card key={field.id}>
                                <CardBody className="p-4 space-y-3">
                                  <Field>
                                    <FieldLabel>Feature Item</FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        {...form.register(
                                          `content.${selectedLanguage}.DownloadOptions.list.${idx}.value` as any,
                                        )}
                                        placeholder="Feature Item"
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => downloadList.remove(idx)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </CardBody>
                              </Card>
                            ))}
                          </div>
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

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useMemo } from "react";
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
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
import { jsonToFormData } from "@/utils/formData.utils";
import { uid } from "@/utils/pagebuilder.utils";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";

const countryEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  code: z.string().optional(),
  cityCount: z.string().optional(),
  seo: z
    .object({
      title: z.record(z.string(), z.string()).optional(),
      description: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
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

const countriesPageFormSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  defaultLanguage: z.string().default("en"),
  availableLanguages: z.array(z.string()).default(["en"]),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  intro: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  sections: z.array(sectionEntrySchema).optional(),
  countries: z.array(countryEntrySchema).optional(),
  jsonLd: z.array(z.object({ type: z.string(), data: z.any() })).optional(),
});

export type CountriesPageFormData = z.infer<typeof countriesPageFormSchema>;

const getEmptySeo = () => ({
  title: "",
  description: "",
  keywords: [] as string[],
});
const getEmptyIntro = () => ({ title: "", description: "" });

function normalizeInitialData(data: any): CountriesPageFormData {
  if (!data)
    return {
      pageName: "Global Availability",
      slug: "global-availability",
      isActive: true,
      defaultLanguage: "en",
      availableLanguages: ["en"],
      seo: getEmptySeo(),
      intro: getEmptyIntro(),
      sections: [],
      countries: [],
      jsonLd: [],
    };
  return {
    pageName: data.pageName ?? "Global Availability",
    slug: data.slug ?? "global-availability",
    isActive: data.isActive ?? true,
    defaultLanguage: data.defaultLanguage ?? "en",
    availableLanguages: data.availableLanguages ?? ["en"],
    seo: data.seo ?? getEmptySeo(),
    intro: data.intro ?? getEmptyIntro(),
    sections: Array.isArray(data.sections) ? data.sections : [],
    countries: Array.isArray(data.countries) ? data.countries : [],
    jsonLd: Array.isArray(data.jsonLd) ? data.jsonLd : [],
  };
}

interface CountriesPageFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  type: string;
}

export default function CountriesPageForm({
  initialData,
  onSubmit,
  type,
}: CountriesPageFormProps) {
  const defaultValues = useMemo(
    () => normalizeInitialData(initialData),
    [initialData],
  );

  const form = useForm<CountriesPageFormData>({
    resolver: zodResolver(countriesPageFormSchema),
    defaultValues,
  });

  const countriesArray = useFieldArray({
    control: form.control,
    name: "countries",
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

  const onFormSubmit: SubmitHandler<CountriesPageFormData> = (data) => {
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
              <CardTitle>Countries Page (Global Availability)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                            placeholder="e.g. Global Availability"
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
                            placeholder="e.g. global-availability"
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
                    <CardTitle>SEO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Field>
                      <FieldLabel>Meta Title</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...form.register("seo.title")}
                          placeholder="Page title for search engines"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Meta Description</FieldLabel>
                      <Textarea
                        {...form.register("seo.description")}
                        placeholder="Brief summary for search results"
                      />
                    </Field>
                  </CardContent>
                </CardBody>
              </Card>

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
                          {...form.register("intro.title")}
                          placeholder="Intro heading"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Intro Description</FieldLabel>
                      <Textarea
                        {...form.register("intro.description")}
                        placeholder="Intro text"
                      />
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
                              <option value="benefits">Benefits</option>
                            </select>
                          </Field>
                          <Field>
                            <FieldLabel>Title</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...form.register(`sections.${index}.title`)}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel>Content</FieldLabel>
                            <Textarea
                              {...form.register(`sections.${index}.content`)}
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
                    <CardTitle>Countries List</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        variant="outlinePrimary"
                        size="sm"
                        onClick={() =>
                          countriesArray.append({
                            id: uid(),
                            name: "",
                            slug: "",
                            code: "",
                            cityCount: "",
                            seo: { title: { en: "" }, description: { en: "" } },
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Country
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {countriesArray.fields.map((field, index) => (
                      <Card key={field.id} className="border-dashed">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs font-bold uppercase text-gray-400">
                              Country #{index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => countriesArray.remove(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field>
                              <FieldLabel>Country Name</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...form.register(`countries.${index}.name`)}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Slug</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...form.register(`countries.${index}.slug`)}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>Code</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...form.register(`countries.${index}.code`)}
                                  placeholder="e.g. us, uk"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel>City Count</FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...form.register(
                                    `countries.${index}.cityCount`,
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <FieldLabel className="mb-2 block">
                              SEO (en)
                            </FieldLabel>
                            <Field>
                              <FieldLabel className="text-xs">
                                SEO Title (en)
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  {...form.register(
                                    `countries.${index}.seo.title.en`,
                                  )}
                                  placeholder="Country page meta title"
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel className="text-xs">
                                SEO Description (en)
                              </FieldLabel>
                              <Textarea
                                {...form.register(
                                  `countries.${index}.seo.description.en`,
                                )}
                                placeholder="Country page meta description"
                              />
                            </Field>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </CardBody>
              </Card>

              <JSONLDSection form={form} />
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

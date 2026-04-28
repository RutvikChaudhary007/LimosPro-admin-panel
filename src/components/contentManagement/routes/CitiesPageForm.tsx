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
import { safeZodResolver } from "@/utils/safeZodResolver";
import { generateSlug } from "@/utils/slug";
import { JSONLDSection } from "../shared/JSONLDSection";

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

const citiesPageFormSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().optional().default(true),
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
  routes: z.array(z.any()).optional(),
  countries: z.array(z.any()).optional(),
  jsonLd: z.array(z.object({ type: z.string(), data: z.any() })).optional(),
});

export type CitiesPageFormData = z.infer<typeof citiesPageFormSchema>;

const getEmptySeo = () => ({
  title: "",
  description: "",
  keywords: [] as string[],
});
const getEmptyIntro = () => ({ title: "", description: "" });

function normalizeInitialData(data: any): CitiesPageFormData {
  if (!data)
    return {
      pageName: "Our Cities",
      slug: "cities",
      isActive: true,
      defaultLanguage: "en",
      availableLanguages: ["en"],
      seo: getEmptySeo(),
      intro: getEmptyIntro(),
      sections: [],
      routes: [],
      countries: [],
      jsonLd: [],
    };
  return {
    pageName: data.pageName ?? "Our Cities",
    slug: data.slug ?? "cities",
    isActive: data.isActive ?? true,
    defaultLanguage: data.defaultLanguage ?? "en",
    availableLanguages: data.availableLanguages ?? ["en"],
    seo: data.seo ?? getEmptySeo(),
    intro: data.intro ?? getEmptyIntro(),
    sections: Array.isArray(data.sections) ? data.sections : [],
    routes: Array.isArray(data.routes) ? data.routes : [],
    countries: Array.isArray(data.countries) ? data.countries : [],
    jsonLd: Array.isArray(data.jsonLd) ? data.jsonLd : [],
  };
}

interface CitiesPageFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  type: string;
}

export default function CitiesPageForm({
  initialData,
  onSubmit,
  type,
}: CitiesPageFormProps) {
  const defaultValues = useMemo(
    () => normalizeInitialData(initialData),
    [initialData],
  );

  const form = useForm<CitiesPageFormData>({
    resolver: safeZodResolver(citiesPageFormSchema) as any,
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

  const onFormSubmit: SubmitHandler<CitiesPageFormData> = (data) => {
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
              <CardTitle>Cities Page</CardTitle>
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
                            placeholder="e.g. Our Cities"
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
                            placeholder="e.g. cities"
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

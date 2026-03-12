import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
import LanguageSelector from "@/components/language/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  type LanguageCode,
} from "@/lib/language";
import { jsonToFormData } from "@/utils/formData.utils";
import { JSONLDSection } from "../shared/JSONLDSection";
import { SEOSection } from "../shared/SEOSection";
import { jsonLdSchema } from "../shared/sharedSchemas";

// Route type options
const ROUTE_TYPES = [
  { value: "CITY_TO_CITY", label: "City to City" },
  { value: "AIRPORT_TRANSFER", label: "Airport Transfer" },
] as const;

// Location type options
const LOCATION_TYPES = [
  { value: "CITY", label: "City" },
  { value: "AIRPORT", label: "Airport" },
] as const;

// Feature icon options
const FEATURE_ICONS = [
  { value: "route", label: "Route" },
  { value: "clock", label: "Clock" },
  { value: "wifi", label: "WiFi" },
  { value: "shield", label: "Shield" },
  { value: "star", label: "Star" },
  { value: "users", label: "Users" },
] as const;

// Schema for hero section
const heroSchema = z.object({
  title: z.string().optional(),
  backgroundImage: z.string().optional(),
  alt: z.string().optional(),
  // showBookingWidget: z.boolean().optional(),
});

// Schema for breadcrumb item
const breadcrumbItemSchema = z.object({
  label: z.string().optional(),
  url: z.string().optional(),
});

// Schema for route location
const routeLocationSchema = z.object({
  type: z.string().optional(),
  name: z.string().optional(),
});

// Schema for route
const routeSchema = z.object({
  from: routeLocationSchema.optional(),
  to: routeLocationSchema.optional(),
});

// Schema for features
const featureSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

// Schema for sections
const sectionSchema = z.object({
  // type: z.string().optional(),
  isImageLeft: z.boolean().optional(),
  image: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

// Schema for fleet capacity
const fleetCapacitySchema = z.object({
  passengers: z.number().optional(),
  luggage: z.string().optional(),
});

// Schema for fleet item
const fleetItemSchema = z.object({
  name: z.string().optional(),
  images: z.array(z.string()).optional(),
  alt: z.string().optional(),
  description: z.string().optional(),
  capacity: fleetCapacitySchema.optional(),
  features: z.array(z.string()).optional(),
});

// Schema for premium fleets
const premiumFleetsSchema = z.object({
  title: z.string().optional(),
  fleets: z.array(fleetItemSchema).optional(),
});

// Schema for FAQ
const faqItemSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
});

// Schema for SEO (simplified)
const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

// Language-specific content schema
const languageContentSchema = z.object({
  hero: heroSchema.optional(),
  breadcrumb: z.array(breadcrumbItemSchema).optional(),
  route: routeSchema.optional(),
  features: z.array(featureSchema).optional(),
  sections: z.array(sectionSchema).optional(),
  premiumFleets: premiumFleetsSchema.optional(),
  faq: z.array(faqItemSchema).optional(),
});

// Main schema for route details
const routeDetailsSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  slug: z.string().min(1, "Slug is required"),
  routeType: z
    .enum(["CITY_TO_CITY", "AIRPORT_TRANSFER"])
    .default("CITY_TO_CITY"),
  defaultLanguage: z.string().default(DEFAULT_LANGUAGE),
  availableLanguages: z.array(z.string()).default([DEFAULT_LANGUAGE]),
  isActive: z.boolean().default(true),
  content: z.record(z.string(), languageContentSchema).optional(),
  seo: seoSchema,
  jsonLd: jsonLdSchema,
});

type RouteDetailsFormData = z.infer<typeof routeDetailsSchema>;

interface RouteDetailsFormProps {
  initialData?: any;
  onSubmit: (data: RouteDetailsFormData) => void;
  type: string;
}

// Default empty content for a language
const getEmptyLanguageContent = () => ({
  hero: {
    title: "",
    backgroundImage: "",
    alt: "",
    // showBookingWidget: true,
  },
  breadcrumb: [{ label: "", url: "" }],
  route: {
    from: { type: "CITY", name: "" },
    to: { type: "CITY", name: "" },
  },
  features: [{ icon: "", title: "", description: "" }],
  sections: [
    {
      // type: "imageText",
      isImageLeft: true,
      image: "",
      alt: "",
      title: "",
      description: "",
    },
  ],
  premiumFleets: {
    title: "",
    fleets: [
      {
        name: "",
        images: [],
        alt: "",
        description: "",
        capacity: { passengers: 3, luggage: "" },
        features: [],
      },
    ],
  },
  faq: [{ question: "", answer: "" }],
});

// Default empty SEO
const getEmptySeo = () => ({
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
});

// Default empty JSON-LD
const getEmptyJsonLd = () => [];

// Normalize initial data to match form schema
const normalizeRouteData = (data: any): RouteDetailsFormData => {
  if (!data) {
    return {
      pageName: "",
      slug: "",
      routeType: "CITY_TO_CITY",
      defaultLanguage: DEFAULT_LANGUAGE,
      availableLanguages: [DEFAULT_LANGUAGE],
      isActive: true,
      content: { [DEFAULT_LANGUAGE]: getEmptyLanguageContent() },
      seo: getEmptySeo(),
      jsonLd: getEmptyJsonLd(),
    };
  }

  const languages = data.availableLanguages || [DEFAULT_LANGUAGE];
  const normalized: RouteDetailsFormData = {
    pageName: data.pageName || "",
    slug: data.slug || "",
    routeType: data.routeType || "CITY_TO_CITY",
    defaultLanguage: data.defaultLanguage || DEFAULT_LANGUAGE,
    availableLanguages: languages,
    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    content: {},
    seo: data.seo || getEmptySeo(),
    jsonLd: data.jsonLd || getEmptyJsonLd(),
  };

  // Normalize content for each language
  languages.forEach((lang: string) => {
    const langContent = data.content?.[lang] || getEmptyLanguageContent();
    normalized.content![lang] = {
      hero: langContent.hero || getEmptyLanguageContent().hero,
      breadcrumb:
        langContent.breadcrumb?.length > 0
          ? langContent.breadcrumb
          : getEmptyLanguageContent().breadcrumb,
      route: langContent.route || getEmptyLanguageContent().route,
      features:
        langContent.features?.length > 0
          ? langContent.features
          : getEmptyLanguageContent().features,
      sections:
        langContent.sections?.length > 0
          ? langContent.sections
          : getEmptyLanguageContent().sections,
      premiumFleets:
        langContent.premiumFleets || getEmptyLanguageContent().premiumFleets,
      faq:
        langContent.faq?.length > 0
          ? langContent.faq
          : getEmptyLanguageContent().faq,
    };
  });

  return normalized;
};

// Separate component for language-specific content to ensure proper isolation
interface LanguageContentFieldsProps {
  language: LanguageCode;
}

function LanguageContentFields({ language }: LanguageContentFieldsProps) {
  const { control, register } = useFormContext<RouteDetailsFormData>();

  // Field Arrays for this specific language
  const breadcrumbFields = useFieldArray({
    control,
    name: `content.${language}.breadcrumb` as any,
  });

  const featuresFields = useFieldArray({
    control,
    name: `content.${language}.features` as any,
  });

  const sectionsFields = useFieldArray({
    control,
    name: `content.${language}.sections` as any,
  });

  const fleetsFields = useFieldArray({
    control,
    name: `content.${language}.premiumFleets.fleets` as any,
  });

  const faqFields = useFieldArray({
    control,
    name: `content.${language}.faq` as any,
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card>
        <CardBody>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(`content.${language}.hero.title` as any)}
                  placeholder="e.g., Manchester <> Liverpool Car Service"
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Background Image URL</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(
                    `content.${language}.hero.backgroundImage` as any,
                  )}
                  placeholder="e.g., https://cdn.limospro.com/routes/manchester-liverpool-hero.jpg"
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Alt Text</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(`content.${language}.hero.alt` as any)}
                  placeholder="e.g., hero"
                />
              </InputGroup>
            </Field>
            {/*<Field>
              <FieldLabel>Show Booking Widget</FieldLabel>
              <div className="flex items-center space-x-2 pt-2">
                <Controller
                  control={control}
                  name={`content.${language}.hero.showBookingWidget` as any}
                  render={({ field }) => (
                    <Checkbox
                      id={`showBookingWidget-${language}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor={`showBookingWidget-${language}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Display booking widget on hero
                </label>
              </div>
            </Field>*/}
          </CardContent>
        </CardBody>
      </Card>

      {/* Breadcrumb Section */}
      <Card>
        <CardBody>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Breadcrumb</CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={() => breadcrumbFields.append({ label: "", url: "" })}
              >
                Add Breadcrumb Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {breadcrumbFields.fields.map((field, index) => (
              <Card key={field.id} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                    <span className="text-xs font-bold text-gray-400 px-2">
                      BREADCRUMB #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => breadcrumbFields.remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Label</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.breadcrumb.${index}.label` as any,
                          )}
                          placeholder="e.g., Home"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>URL</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.breadcrumb.${index}.url` as any,
                          )}
                          placeholder="e.g., /"
                        />
                      </InputGroup>
                    </Field>
                  </div>
                </CardContent>
              </Card>
            ))}
            {breadcrumbFields.fields.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No breadcrumb items added yet.
              </p>
            )}
          </CardContent>
        </CardBody>
      </Card>

      {/* Route Section */}
      <Card>
        <CardBody>
          <CardHeader>
            <CardTitle>Route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Location */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-sm text-gray-600">
                  From Location
                </h4>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Controller
                    control={control}
                    name={`content.${language}.route.from.type` as any}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(
                        `content.${language}.route.from.name` as any,
                      )}
                      placeholder="e.g., Manchester"
                    />
                  </InputGroup>
                </Field>
              </div>
              {/* To Location */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-sm text-gray-600">
                  To Location
                </h4>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Controller
                    control={control}
                    name={`content.${language}.route.to.type` as any}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register(`content.${language}.route.to.name` as any)}
                      placeholder="e.g., Liverpool"
                    />
                  </InputGroup>
                </Field>
              </div>
            </div>
          </CardContent>
        </CardBody>
      </Card>

      {/* Features Section */}
      <Card>
        <CardBody>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Features</CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  featuresFields.append({
                    icon: "",
                    title: "",
                    description: "",
                  })
                }
              >
                Add Feature
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuresFields.fields.map((field, index) => (
              <Card key={field.id} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                    <span className="text-xs font-bold text-gray-400 px-2">
                      FEATURE #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => featuresFields.remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Icon</FieldLabel>
                      <Controller
                        control={control}
                        name={
                          `content.${language}.features.${index}.icon` as any
                        }
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select icon" />
                            </SelectTrigger>
                            <SelectContent>
                              {FEATURE_ICONS.map((icon) => (
                                <SelectItem key={icon.value} value={icon.value}>
                                  {icon.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.features.${index}.title` as any,
                          )}
                          placeholder="e.g., Door-to-door convenience"
                        />
                      </InputGroup>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      {...register(
                        `content.${language}.features.${index}.description` as any,
                      )}
                      placeholder="e.g., Enjoy a smooth journey with direct pickup and drop-off."
                      rows={2}
                    />
                  </Field>
                </CardContent>
              </Card>
            ))}
            {featuresFields.fields.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No features added yet. Click "Add Feature" to add one.
              </p>
            )}
          </CardContent>
        </CardBody>
      </Card>

      {/* Sections (Image-Text Blocks) */}
      <Card>
        <CardBody>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Image-Text Sections</CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  sectionsFields.append({
                    type: "imageText",
                    isImageLeft: true,
                    image: "",
                    alt: "",
                    title: "",
                    description: "",
                  })
                }
              >
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sectionsFields.fields.map((field, index) => (
              <Card key={field.id} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                    <span className="text-xs font-bold text-gray-400 px-2">
                      SECTION #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => sectionsFields.remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.sections.${index}.type` as any,
                          )}
                          placeholder="e.g., imageText"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Image Position</FieldLabel>
                      <div className="flex items-center space-x-2 pt-2">
                        <Controller
                          control={control}
                          name={
                            `content.${language}.sections.${index}.isImageLeft` as any
                          }
                          render={({ field }) => (
                            <Checkbox
                              id={`isImageLeft-${language}-${index}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <label
                          htmlFor={`isImageLeft-${language}-${index}`}
                          className="text-sm font-medium leading-none"
                        >
                          Image on left side
                        </label>
                      </div>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Image URL</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.sections.${index}.image` as any,
                          )}
                          placeholder="e.g., https://cdn.limospro.com/routes/driver.jpg"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Alt Text</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.sections.${index}.alt` as any,
                          )}
                          placeholder="e.g., image"
                        />
                      </InputGroup>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${language}.sections.${index}.title` as any,
                        )}
                        placeholder="e.g., The safe and private option for your city-to-city ride"
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      {...register(
                        `content.${language}.sections.${index}.description` as any,
                      )}
                      placeholder="e.g., Travel between cities in a private chauffeur-driven car."
                      rows={3}
                    />
                  </Field>
                </CardContent>
              </Card>
            ))}
            {sectionsFields.fields.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No sections added yet. Click "Add Section" to add one.
              </p>
            )}
          </CardContent>
        </CardBody>
      </Card>

      {/* Premium Fleets Section */}
      <Card>
        <CardBody>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Premium Fleets</CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  fleetsFields.append({
                    name: "",
                    images: [],
                    description: "",
                    capacity: { passengers: 3, luggage: "" },
                    features: [],
                  })
                }
              >
                Add Fleet
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Section Title</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register(
                    `content.${language}.premiumFleets.title` as any,
                  )}
                  placeholder="e.g., Discover our service classes"
                />
              </InputGroup>
            </Field>
            {fleetsFields.fields.map((field, index) => (
              <Card key={field.id} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                    <span className="text-xs font-bold text-gray-400 px-2">
                      FLEET #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fleetsFields.remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.premiumFleets.fleets.${index}.name` as any,
                          )}
                          placeholder="e.g., Business Class"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Images (comma-separated URLs)</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.premiumFleets.fleets.${index}.images` as any,
                          )}
                          placeholder="e.g., https://cdn.limospro.com/vehicles/business-1.jpg, https://cdn.limospro.com/vehicles/business-2.jpg"
                        />
                      </InputGroup>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      {...register(
                        `content.${language}.premiumFleets.fleets.${index}.description` as any,
                      )}
                      placeholder="e.g., Mercedes E-Class, BMW 5 Series, Audi A6, Cadillac XTS, or similar."
                      rows={2}
                    />
                  </Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Passengers</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          {...register(
                            `content.${language}.premiumFleets.fleets.${index}.capacity.passengers` as any,
                            { valueAsNumber: true },
                          )}
                          placeholder="e.g., 3"
                        />
                      </InputGroup>
                    </Field>
                    <Field>
                      <FieldLabel>Luggage</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...register(
                            `content.${language}.premiumFleets.fleets.${index}.capacity.luggage` as any,
                          )}
                          placeholder="e.g., 2 carry-on bags or 2 standard check-in bags"
                        />
                      </InputGroup>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Features (comma-separated)</FieldLabel>
                    <Textarea
                      {...register(
                        `content.${language}.premiumFleets.fleets.${index}.features` as any,
                      )}
                      placeholder="e.g., Professional chauffeur, Air conditioning, Comfortable seating"
                      rows={2}
                    />
                  </Field>
                </CardContent>
              </Card>
            ))}
            {fleetsFields.fields.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No fleets added yet. Click "Add Fleet" to add one.
              </p>
            )}
          </CardContent>
        </CardBody>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardBody>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>FAQ</CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={() => faqFields.append({ question: "", answer: "" })}
              >
                Add FAQ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqFields.fields.map((field, index) => (
              <Card key={field.id} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 -mx-4 -mt-4 p-2 rounded-t">
                    <span className="text-xs font-bold text-gray-400 px-2">
                      FAQ #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => faqFields.remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <Field>
                    <FieldLabel>Question</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register(
                          `content.${language}.faq.${index}.question` as any,
                        )}
                        placeholder="e.g., How long is the journey from Manchester to Liverpool?"
                      />
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>Answer</FieldLabel>
                    <Textarea
                      {...register(
                        `content.${language}.faq.${index}.answer` as any,
                      )}
                      placeholder="e.g., The trip usually takes about 1 hour depending on traffic."
                      rows={2}
                    />
                  </Field>
                </CardContent>
              </Card>
            ))}
            {faqFields.fields.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No FAQ items added yet. Click "Add FAQ" to add one.
              </p>
            )}
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}

export default function RouteDetailsForm({
  initialData,
  onSubmit,
  type,
}: RouteDetailsFormProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );

  const normalizedData = useMemo(
    () => normalizeRouteData(initialData),
    [initialData],
  );

  const form = useForm<RouteDetailsFormData>({
    resolver: zodResolver(routeDetailsSchema) as any,
    defaultValues: normalizedData,
    mode: "onSubmit",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});
  // Debug: Log validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("RouteDetails validation errors:", errors);
    }
  }, [errors]);

  const availableLanguages = watch("availableLanguages") || ["en"];

  const onHandleSubmit = (data: RouteDetailsFormData) => {
    console.log("onHandleSubmit called with data:", data);

    // Build a mutable copy
    const submissionData: RouteDetailsFormData = {
      ...data,
      content: { ...(data.content || {}) },
    };

    // Convert to FormData for file handling
    const formData = jsonToFormData(submissionData, { fileKeyMode: "path" });

    // Log FormData contents
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

    onSubmit(formData as any);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    const currentData = getValues();
    if (!currentData.content?.[lang]) {
      const empty = getEmptyLanguageContent();
      setValue(`content.${lang}` as any, empty);
    }
    if (!availableLanguages.includes(lang)) {
      setValue("availableLanguages", [...availableLanguages, lang]);
    }

    // Switch to general if switching to non-en and currently on restricted tabs
    if (lang !== "en" && (activeTab === "seo" || activeTab === "jsonld")) {
      setActiveTab("general");
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
              <CardTitle>Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Page Name *</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register("pageName")}
                        placeholder="e.g., Heathrow Airport to London Chauffeur Service"
                      />
                    </InputGroup>
                    {errors.pageName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pageName.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Slug *</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...register("slug")}
                        placeholder="e.g., heathrow-to-london"
                      />
                    </InputGroup>
                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Route Type *</FieldLabel>
                    <Controller
                      control={control}
                      name="routeType"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select route type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROUTE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.routeType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.routeType.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex items-center space-x-2 pt-2">
                      <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                          <Checkbox
                            id="isActive"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Active
                      </label>
                    </div>
                  </Field>
                </div>
              </div>

              <Separator />

              {/* Language Selector */}
              <div className="space-y-4">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  availableLanguages={LANGUAGE_CODES}
                />
              </div>

              {/* Tabs */}
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

              {/* Tab Content */}
              <div className="pt-4">
                {activeTab === "general" && (
                  <LanguageContentFields
                    key={selectedLanguage}
                    language={selectedLanguage}
                  />
                )}

                {activeTab === "seo" && selectedLanguage === "en" && (
                  <SEOSection
                    form={form}
                    // selectedLanguage is removed/undefined for shared SEO
                    metaKeywordsData={metaKeywordsData}
                  />
                )}

                {activeTab === "jsonld" && selectedLanguage === "en" && (
                  <JSONLDSection form={form} />
                )}
              </div>
            </CardContent>
          </CardBody>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            {type === "edit" ? "Update Route" : "Create Route"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

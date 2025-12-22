import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useFetchAllMetaKeywords } from "@/api";
import { AutoCompleteInput } from "@/components/AutoCompleteInput";
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import UploadWithUrl from "@/components/ui/upload-with-url";
import { getDefaultJsonLdItem, uid } from "@/utils/pagebuilder.utils";

const imageSchema = z.union([z.string(), z.instanceof(File)]);

// Schema for Home Page
const homeSchema = z.object({
  isActive: z.boolean().default(true),
  servicesOverview: z
    .object({
      paragraph: z.string().optional(),
      h2: z.string().optional(),
      description: z.string().optional(),
      serviceCards: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            button: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  whyChoose: z
    .object({
      paragraph: z.string().optional(),
      h2: z.string().optional(),
      description: z.string().optional(),
      infoCards: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  cityRoutes: z
    .object({
      paragraph: z.string().optional(),
      h2: z.string().optional(),
      description: z.string().optional(),
      cities: z
        .object({
          h3: z.string().optional(),
          link: z.string().optional(),
          cityCards: z
            .array(
              z.object({
                id: z.string().optional(),
                src: z.string().optional(),
                alt: z.string().optional(),
                title: z.string().optional(),
                description: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
      routes: z
        .object({
          h3: z.string().optional(),
          link: z.string().optional(),
          routeCards: z
            .array(
              z.object({
                id: z.string().optional(),
                from: z.string().optional(),
                to: z.string().optional(),
                time: z.string().optional(),
                distance: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
    })
    .optional(),
  findYours: z
    .object({
      heroSectionText: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
          height: z.string().optional(),
          gradient: z.string().optional(),
        })
        .optional(),
      p1: z.string().optional(),
      p2: z.string().optional(),
      description: z.string().optional(),
      btn1: z.string().optional(),
      btn2: z.string().optional(),
    })
    .optional(),
  safetyAndPrivacy: z
    .object({
      infoCards: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  corporateGroundTransportation: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      t2: z.string().optional(),
      description: z.string().optional(),
      imageLeft: z.boolean().optional(),
    })
    .optional(),
  meetingsAndSpecialEvents: z
    .object({
      imageLeft: z.boolean().optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      t2: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  bookARide: z
    .object({
      h2: z.string().optional(),
      p: z.string().optional(),
      btn: z.string().optional(),
    })
    .optional(),
  downloadOptions: z
    .object({
      h2: z.string().optional(),
      p: z.string().optional(),
      appStoreLink: z.string().optional(),
      playStoreLink: z.string().optional(),
      image: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  testimonial: z
    .object({
      testimonialCard: z
        .object({
          h2: z.string().optional(),
          Quote: z.string().optional(),
          Name: z.string().optional(),
          Position: z.string().optional(),
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
      image: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  ourPartners: z
    .object({
      p1: z.string().optional(),
      p2: z.string().optional(),
      images: z
        .array(
          z.object({
            id: z.string().optional(),
            src: z.string().optional(),
            alt: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.array(z.string()).optional(),
      canonicalUrl: z.string().optional(),
      ogImage: imageSchema.optional().or(z.literal("")),
    })
    .optional(),
  jsonLd: z.array(z.any()).optional(),
});

type HomeFormData = z.infer<typeof homeSchema>;

interface HomeFormProps {
  initialData?: any;
  onSubmit: (data: HomeFormData) => void;
  type: string;
}

export default function HomeForm({
  initialData,
  onSubmit,
  type,
}: HomeFormProps) {
  const form = useForm<HomeFormData>({
    resolver: zodResolver(homeSchema),
    defaultValues: initialData || {
      isActive: true,
      findYours: {
        heroSectionText: {
          src: "/HeroSections/hs-features.jpg",
          alt: "A Picture of a Luxury vehicle",
          height: "h-[60vh]",
          gradient: "bg-black/80",
        },
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        canonicalUrl: "",
        ogImage: "",
      },
      jsonLd: [],
    },
  });

  const [activeTab, setActiveTab] = useState<"general" | "seo" | "jsonld">(
    "general",
  );
  const [keywordInput, setKeywordInput] = useState("");

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  const { control, register, handleSubmit } = form;

  // Field Arrays
  const serviceCards = useFieldArray({
    control,
    name: "servicesOverview.serviceCards",
  });
  const wyChooseCards = useFieldArray({ control, name: "whyChoose.infoCards" });
  const cityCards = useFieldArray({
    control,
    name: "cityRoutes.cities.cityCards",
  });
  const routeCards = useFieldArray({
    control,
    name: "cityRoutes.routes.routeCards",
  });
  const safetyCards = useFieldArray({
    control,
    name: "safetyAndPrivacy.infoCards",
  });
  const partnerImages = useFieldArray({ control, name: "ourPartners.images" });

  const {
    fields: jsonLdFields,
    append: appendJsonLd,
    remove: removeJsonLd,
  } = useFieldArray({
    control,
    name: "jsonLd",
  });

  const onHandleSubmit = (data: HomeFormData) => {
    console.log("Home Data:", data);
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-6">
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Home Page</CardTitle>
              <CardAction className="flex items-center gap-3"></CardAction>
            </CardHeader>
            <CardContent>
              {/* Tabs */}
              <div className="flex gap-8">
                {["general", "seo", "jsonld"].map((tab) => (
                  <Button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    variant="ghost"
                    spacing="sm"
                    className={`capitalize border-b-2 rounded-none transition ${
                      activeTab === tab
                        ? "border-base-black"
                        : "border-transparent"
                    }`}
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              <Separator orientation="horizontal" className="mb-6" />

              {/* Main Content */}
              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-6">
                    {/* Services Overview */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Services Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="servicesOverview.paragraph"
                            >
                              Paragraph
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="servicesOverview.paragraph"
                                type="text"
                                placeholder="Enter paragraph text"
                                {...register("servicesOverview.paragraph")}
                              />
                            </InputGroup>
                          </Field>

                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="servicesOverview.h2"
                            >
                              Heading (H2)
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="servicesOverview.h2"
                                type="text"
                                placeholder="Enter heading"
                                {...register("servicesOverview.h2")}
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={control}
                            name="servicesOverview.description"
                            render={({ field }) => (
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="servicesOverview.description"
                                >
                                  Paragraph
                                </FieldLabel>
                                <TinyEditorRHF
                                  id="servicesOverview.description"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </Field>
                            )}
                          />
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Service Cards
                              </h3>
                              <Button
                                type="button"
                                onClick={() =>
                                  serviceCards.append({
                                    id: uid(),
                                    src: "",
                                    alt: "",
                                    title: "",
                                    description: "",
                                    button: "",
                                  })
                                }
                                variant="outlinePrimary"
                              >
                                Add Service Card
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {serviceCards.fields.map((field, index) => (
                                <Card key={field.id}>
                                  <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-semibold text-sm text-gray-500 uppercase">
                                        Card #{index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          serviceCards.remove(index)
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`servicesOverview.serviceCards.${index}.src`}
                                      >
                                        Image URL
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`servicesOverview.serviceCards.${index}.src`}
                                          type="text"
                                          placeholder="Enter image URL"
                                          {...register(
                                            `servicesOverview.serviceCards.${index}.src`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`servicesOverview.serviceCards.${index}.alt`}
                                      >
                                        Alt
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`servicesOverview.serviceCards.${index}.alt`}
                                          type="text"
                                          placeholder="Enter image alt"
                                          {...register(
                                            `servicesOverview.serviceCards.${index}.alt`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`servicesOverview.serviceCards.${index}.title`}
                                      >
                                        Title
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`servicesOverview.serviceCards.${index}.title`}
                                          type="text"
                                          placeholder="Enter card title"
                                          {...register(
                                            `servicesOverview.serviceCards.${index}.title`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`servicesOverview.serviceCards.${index}.description`}
                                      >
                                        Description
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`servicesOverview.serviceCards.${index}.description`}
                                          type="text"
                                          placeholder="Enter description"
                                          {...register(
                                            `servicesOverview.serviceCards.${index}.description`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`servicesOverview.serviceCards.${index}.button`}
                                      >
                                        Button Label
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`servicesOverview.serviceCards.${index}.button`}
                                          type="text"
                                          placeholder="Enter button label"
                                          {...register(
                                            `servicesOverview.serviceCards.${index}.button`,
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

                    {/* Why Choose */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Why Choose</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="whyChoose.paragraph"
                            >
                              Paragraph
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="whyChoose.paragraph"
                                type="text"
                                placeholder="Enter paragraph text"
                                {...register("whyChoose.paragraph")}
                              />
                            </InputGroup>
                          </Field>

                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="whyChoose.h2"
                            >
                              Heading (H2)
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="whyChoose.h2"
                                type="text"
                                placeholder="Enter heading"
                                {...register("whyChoose.h2")}
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={control}
                            name="whyChoose.description"
                            render={({ field }) => (
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="whyChoose.description"
                                >
                                  Paragraph
                                </FieldLabel>
                                <TinyEditorRHF
                                  id="whyChoose.description"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </Field>
                            )}
                          />
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Info Cards
                              </h3>
                              <Button
                                type="button"
                                onClick={() =>
                                  wyChooseCards.append({
                                    id: uid(),
                                    src: "",
                                    alt: "",
                                    title: "",
                                    description: "",
                                  })
                                }
                                variant="outlinePrimary"
                              >
                                Add Info Card
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {wyChooseCards.fields.map((field, index) => (
                                <Card key={field.id}>
                                  <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-semibold text-sm text-gray-500 uppercase">
                                        Card #{index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          wyChooseCards.remove(index)
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`whyChoose.infoCards.${index}.src`}
                                      >
                                        Image URL
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`whyChoose.infoCards.${index}.src`}
                                          type="text"
                                          placeholder="Enter image URL"
                                          {...register(
                                            `whyChoose.infoCards.${index}.src`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`whyChoose.infoCards.${index}.alt`}
                                      >
                                        Alt
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`whyChoose.infoCards.${index}.alt`}
                                          type="text"
                                          placeholder="Enter image alt"
                                          {...register(
                                            `whyChoose.infoCards.${index}.alt`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`whyChoose.infoCards.${index}.title`}
                                      >
                                        Title
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`whyChoose.infoCards.${index}.title`}
                                          type="text"
                                          placeholder="Enter card title"
                                          {...register(
                                            `whyChoose.infoCards.${index}.title`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`whyChoose.infoCards.${index}.description`}
                                      >
                                        Description
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`whyChoose.infoCards.${index}.description`}
                                          type="text"
                                          placeholder="Enter description"
                                          {...register(
                                            `whyChoose.infoCards.${index}.description`,
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

                    {/* City Routes */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>City Routes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="cityRoutes.paragraph"
                            >
                              Paragraph
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="cityRoutes.paragraph"
                                type="text"
                                placeholder="Enter paragraph text"
                                {...register("cityRoutes.paragraph")}
                              />
                            </InputGroup>
                          </Field>

                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="cityRoutes.h2"
                            >
                              Heading (H2)
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="cityRoutes.h2"
                                type="text"
                                placeholder="Enter heading"
                                {...register("cityRoutes.h2")}
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={control}
                            name="cityRoutes.description"
                            render={({ field }) => (
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="cityRoutes.description"
                                >
                                  Paragraph
                                </FieldLabel>
                                <TinyEditorRHF
                                  id="cityRoutes.description"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </Field>
                            )}
                          />
                          <Separator />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Cities */}
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold border-b pb-2">
                                Cities
                              </h3>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="cityRoutes.cities.h3"
                                >
                                  Heading (H3)
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="cityRoutes.cities.h3"
                                    type="text"
                                    placeholder="Enter heading"
                                    {...register("cityRoutes.cities.h3")}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="cityRoutes.cities.link"
                                >
                                  Link
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="cityRoutes.cities.link"
                                    type="text"
                                    placeholder="Enter link"
                                    {...register("cityRoutes.cities.link")}
                                  />
                                </InputGroup>
                              </Field>
                              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <h4 className="text-sm font-semibold">
                                  City Cards
                                </h4>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    cityCards.append({
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
                                  Add City Card
                                </Button>
                              </div>
                              <div className="space-y-4 mt-4">
                                {cityCards.fields.map((field, index) => (
                                  <Card key={field.id}>
                                    <CardContent className="p-4 space-y-2">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-sm text-gray-500 uppercase">
                                          City #{index + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            cityCards.remove(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.cities.cityCards.${index}.src`}
                                        >
                                          Image URL
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.cities.cityCards.${index}.src`}
                                            type="text"
                                            placeholder="Enter image URL"
                                            {...register(
                                              `cityRoutes.cities.cityCards.${index}.src`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.cities.cityCards.${index}.alt`}
                                        >
                                          Alt
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.cities.cityCards.${index}.alt`}
                                            type="text"
                                            placeholder="Enter image alt"
                                            {...register(
                                              `cityRoutes.cities.cityCards.${index}.alt`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.cities.cityCards.${index}.title`}
                                        >
                                          Title
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.cities.cityCards.${index}.title`}
                                            type="text"
                                            placeholder="Enter card title"
                                            {...register(
                                              `cityRoutes.cities.cityCards.${index}.title`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.cities.cityCards.${index}.description`}
                                        >
                                          Description
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.cities.cityCards.${index}.description`}
                                            type="text"
                                            placeholder="Enter description"
                                            {...register(
                                              `cityRoutes.cities.cityCards.${index}.description`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            {/* Routes */}
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold border-b pb-2">
                                Routes
                              </h3>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="cityRoutes.routes.h3"
                                >
                                  Heading (H3)
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="cityRoutes.routes.h3"
                                    type="text"
                                    placeholder="Enter heading"
                                    {...register("cityRoutes.routes.h3")}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="cityRoutes.routes.link"
                                >
                                  Link
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="cityRoutes.routes.link"
                                    type="text"
                                    placeholder="Enter link"
                                    {...register("cityRoutes.routes.link")}
                                  />
                                </InputGroup>
                              </Field>
                              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <h4 className="text-sm font-semibold">
                                  Route Cards
                                </h4>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    routeCards.append({
                                      id: uid(),
                                      from: "",
                                      to: "",
                                      time: "",
                                      distance: "",
                                    })
                                  }
                                  variant="outlinePrimary"
                                  size="sm"
                                >
                                  Add Route Card
                                </Button>
                              </div>
                              <div className="space-y-4 mt-4">
                                {routeCards.fields.map((field, index) => (
                                  <Card key={field.id}>
                                    <CardContent className="p-4 space-y-2">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-sm text-gray-500 uppercase">
                                          Route #{index + 1}
                                        </span>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            routeCards.remove(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.routes.routeCards.${index}.from`}
                                        >
                                          From
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.routes.routeCards.${index}.from`}
                                            type="text"
                                            placeholder="Enter starting point"
                                            {...register(
                                              `cityRoutes.routes.routeCards.${index}.from`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.routes.routeCards.${index}.to`}
                                        >
                                          To
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.routes.routeCards.${index}.to`}
                                            type="text"
                                            placeholder="Enter destination"
                                            {...register(
                                              `cityRoutes.routes.routeCards.${index}.to`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.routes.routeCards.${index}.time`}
                                        >
                                          Time
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.routes.routeCards.${index}.time`}
                                            type="text"
                                            placeholder="Enter travel time"
                                            {...register(
                                              `cityRoutes.routes.routeCards.${index}.time`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                      <Field>
                                        <FieldLabel
                                          className="text-base-black gap-0"
                                          htmlFor={`cityRoutes.routes.routeCards.${index}.distance`}
                                        >
                                          Distance
                                        </FieldLabel>
                                        <InputGroup>
                                          <InputGroupInput
                                            id={`cityRoutes.routes.routeCards.${index}.distance`}
                                            type="text"
                                            placeholder="Enter distance"
                                            {...register(
                                              `cityRoutes.routes.routeCards.${index}.distance`,
                                            )}
                                          />
                                        </InputGroup>
                                      </Field>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Find Yours */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Find Yours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.heroSectionText.src"
                              >
                                Hero Image URL
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.heroSectionText.src"
                                  type="text"
                                  placeholder="Enter image URL"
                                  {...register("findYours.heroSectionText.src")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.heroSectionText.alt"
                              >
                                Alt Text
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.heroSectionText.alt"
                                  type="text"
                                  placeholder="Enter image alt"
                                  {...register("findYours.heroSectionText.alt")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.heroSectionText.height"
                              >
                                Height
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.heroSectionText.height"
                                  type="text"
                                  placeholder="Enter height"
                                  {...register(
                                    "findYours.heroSectionText.height",
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.heroSectionText.gradient"
                              >
                                Gradient
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.heroSectionText.gradient"
                                  type="text"
                                  placeholder="Enter gradient"
                                  {...register(
                                    "findYours.heroSectionText.gradient",
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.p1"
                              >
                                Paragraph 1
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.p1"
                                  type="text"
                                  placeholder="Enter paragraph 1 text"
                                  {...register("findYours.p1")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.p2"
                              >
                                Paragraph 2
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.p2"
                                  type="text"
                                  placeholder="Enter paragraph 2 text"
                                  {...register("findYours.p2")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.btn1"
                              >
                                Button 1
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.btn1"
                                  type="text"
                                  placeholder="Enter button 1 text"
                                  {...register("findYours.btn1")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="findYours.btn2"
                              >
                                Button 2
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="findYours.btn2"
                                  type="text"
                                  placeholder="Enter button 2 text"
                                  {...register("findYours.btn2")}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Controller
                            control={control}
                            name="findYours.description"
                            render={({ field }) => (
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="findYours.description"
                                >
                                  Description
                                </FieldLabel>
                                <TinyEditorRHF
                                  id="findYours.description"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </Field>
                            )}
                          />
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Safety and Privacy */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Safety and Privacy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                              Info Cards Secondary
                            </h3>
                            <Button
                              type="button"
                              onClick={() =>
                                safetyCards.append({
                                  id: uid(),
                                  src: "",
                                  alt: "",
                                  title: "",
                                  description: "",
                                })
                              }
                              variant="outlinePrimary"
                            >
                              Add Safety Card
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {safetyCards.fields.map((field, index) => (
                              <Card key={field.id}>
                                <CardContent className="p-4 space-y-2">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-sm text-gray-500 uppercase">
                                      Card #{index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => safetyCards.remove(index)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`safetyAndPrivacy.infoCards.${index}.src`}
                                    >
                                      Image URL
                                    </FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        id={`safetyAndPrivacy.infoCards.${index}.src`}
                                        type="text"
                                        placeholder="Enter image URL"
                                        {...register(
                                          `safetyAndPrivacy.infoCards.${index}.src`,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`safetyAndPrivacy.infoCards.${index}.alt`}
                                    >
                                      Alt
                                    </FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        id={`safetyAndPrivacy.infoCards.${index}.alt`}
                                        type="text"
                                        placeholder="Enter image alt"
                                        {...register(
                                          `safetyAndPrivacy.infoCards.${index}.alt`,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`safetyAndPrivacy.infoCards.${index}.title`}
                                    >
                                      Title
                                    </FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        id={`safetyAndPrivacy.infoCards.${index}.title`}
                                        type="text"
                                        placeholder="Enter card title"
                                        {...register(
                                          `safetyAndPrivacy.infoCards.${index}.title`,
                                        )}
                                      />
                                    </InputGroup>
                                  </Field>
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`safetyAndPrivacy.infoCards.${index}.description`}
                                    >
                                      Description
                                    </FieldLabel>
                                    <InputGroup>
                                      <InputGroupInput
                                        id={`safetyAndPrivacy.infoCards.${index}.description`}
                                        type="text"
                                        placeholder="Enter description"
                                        {...register(
                                          `safetyAndPrivacy.infoCards.${index}.description`,
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

                    {/* Corporate Ground Transportation */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Corporate Ground Transportation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="corporateGroundTransportation.src"
                              >
                                Image URL
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="corporateGroundTransportation.src"
                                  type="text"
                                  placeholder="Enter image URL"
                                  {...register(
                                    "corporateGroundTransportation.src",
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="corporateGroundTransportation.alt"
                              >
                                Alt Text
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="corporateGroundTransportation.alt"
                                  type="text"
                                  placeholder="Enter image alt"
                                  {...register(
                                    "corporateGroundTransportation.alt",
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="corporateGroundTransportation.t1"
                              >
                                Title Layer 1 (T1)
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="corporateGroundTransportation.t1"
                                  type="text"
                                  placeholder="Enter title layer 1"
                                  {...register(
                                    "corporateGroundTransportation.t1",
                                  )}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="corporateGroundTransportation.t2"
                              >
                                Title Layer 2 (T2)
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="corporateGroundTransportation.t2"
                                  type="text"
                                  placeholder="Enter title layer 2"
                                  {...register(
                                    "corporateGroundTransportation.t2",
                                  )}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="corporateGroundTransportation.description"
                            >
                              Description
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="corporateGroundTransportation.description"
                                type="text"
                                placeholder="Enter description"
                                {...register(
                                  "corporateGroundTransportation.description",
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                            <Controller
                              control={control}
                              name="corporateGroundTransportation.imageLeft"
                              render={({ field }) => (
                                <>
                                  <Checkbox
                                    id="imageLeft_corporate"
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked === true)
                                    }
                                  />
                                  <label
                                    htmlFor="imageLeft_corporate"
                                    className="text-sm font-medium leading-none cursor-pointer"
                                  >
                                    Show Image on Left?
                                  </label>
                                </>
                              )}
                            />
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Meetings and Special Events */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Meetings and Special Events</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="meetingsAndSpecialEvents.src"
                              >
                                Image URL
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="meetingsAndSpecialEvents.src"
                                  type="text"
                                  placeholder="Enter image URL"
                                  {...register("meetingsAndSpecialEvents.src")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="meetingsAndSpecialEvents.alt"
                              >
                                Alt Text
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="meetingsAndSpecialEvents.alt"
                                  type="text"
                                  placeholder="Enter image alt"
                                  {...register("meetingsAndSpecialEvents.alt")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="meetingsAndSpecialEvents.t1"
                              >
                                Title Layer 1 (T1)
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="meetingsAndSpecialEvents.t1"
                                  type="text"
                                  placeholder="Enter title layer 1"
                                  {...register("meetingsAndSpecialEvents.t1")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="meetingsAndSpecialEvents.t2"
                              >
                                Title Layer 2 (T2)
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="meetingsAndSpecialEvents.t2"
                                  type="text"
                                  placeholder="Enter title layer 2"
                                  {...register("meetingsAndSpecialEvents.t2")}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="meetingsAndSpecialEvents.description"
                            >
                              Description
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="meetingsAndSpecialEvents.description"
                                type="text"
                                placeholder="Enter description"
                                {...register(
                                  "meetingsAndSpecialEvents.description",
                                )}
                              />
                            </InputGroup>
                          </Field>
                          <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                            <Controller
                              control={control}
                              name="meetingsAndSpecialEvents.imageLeft"
                              render={({ field }) => (
                                <>
                                  <Checkbox
                                    id="imageLeft_meetings"
                                    checked={!!field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked === true)
                                    }
                                  />
                                  <label
                                    htmlFor="imageLeft_meetings"
                                    className="text-sm font-medium leading-none cursor-pointer"
                                  >
                                    Show Image on Left?
                                  </label>
                                </>
                              )}
                            />
                          </div>
                          {/* </div> */}
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Book A Ride */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Book A Ride</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="bookARide.h2"
                            >
                              Heading (H2)
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="bookARide.h2"
                                type="text"
                                placeholder="Enter heading"
                                {...register("bookARide.h2")}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="bookARide.p"
                            >
                              Paragraph
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="bookARide.p"
                                type="text"
                                placeholder="Enter paragraph text"
                                {...register("bookARide.p")}
                              />
                            </InputGroup>
                          </Field>
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="bookARide.btn"
                            >
                              Button Label
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="bookARide.btn"
                                type="text"
                                placeholder="Enter button label"
                                {...register("bookARide.btn")}
                              />
                            </InputGroup>
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Download Options */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Download Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="downloadOptions.h2"
                            >
                              Heading (H2)
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="downloadOptions.h2"
                                type="text"
                                placeholder="Enter heading"
                                {...register("downloadOptions.h2")}
                              />
                            </InputGroup>
                          </Field>
                          <Controller
                            control={control}
                            name="downloadOptions.p"
                            render={({ field }) => (
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="downloadOptions.p"
                                >
                                  Paragraph
                                </FieldLabel>
                                <TinyEditorRHF
                                  id="downloadOptions.p"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                />
                              </Field>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-sm">
                                App Store (iOS)
                              </h4>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="downloadOptions.appStoreLink"
                                >
                                  App Store Link
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="downloadOptions.appStoreLink"
                                    type="text"
                                    placeholder="Enter App Store link"
                                    {...register(
                                      "downloadOptions.appStoreLink",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <img
                                src="/DownloadOptions/appstore.png"
                                alt="App Store preview"
                                className="h-10 object-contain brightness-75 opacity-50"
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-semibold text-sm">
                                Play Store (Android)
                              </h4>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="downloadOptions.playStoreLink"
                                >
                                  Play Store Link
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="downloadOptions.playStoreLink"
                                    type="text"
                                    placeholder="Enter Play Store link"
                                    {...register(
                                      "downloadOptions.playStoreLink",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <img
                                src="/DownloadOptions/playstore.png"
                                alt="Play Store preview"
                                className="h-10 object-contain brightness-75 opacity-50"
                              />
                            </div>
                          </div>
                          <div className="space-y-4 border-t pt-4">
                            <h4 className="font-semibold text-sm">
                              Central/Large Image
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="downloadOptions.image.src"
                                >
                                  Image URL
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="downloadOptions.image.src"
                                    type="text"
                                    placeholder="Enter image URL"
                                    {...register("downloadOptions.image.src")}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="downloadOptions.image.alt"
                                >
                                  Alt Text
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="downloadOptions.image.alt"
                                    type="text"
                                    placeholder="Enter image alt"
                                    {...register("downloadOptions.image.alt")}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Testimonial */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Testimonial Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div className="space-y-4">
                            <h4 className="text-lg font-bold border-b pb-1">
                              Testimonial Card
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.testimonialCard.h2"
                                >
                                  Heading (H2)
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.testimonialCard.h2"
                                    type="text"
                                    placeholder="Enter heading"
                                    {...register(
                                      "testimonial.testimonialCard.h2",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.testimonialCard.Quote"
                                >
                                  Quote
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.testimonialCard.Quote"
                                    type="text"
                                    placeholder="Enter quote"
                                    {...register(
                                      "testimonial.testimonialCard.Quote",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.testimonialCard.Name"
                                >
                                  Author Name
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.testimonialCard.Name"
                                    type="text"
                                    placeholder="Enter author name"
                                    {...register(
                                      "testimonial.testimonialCard.Name",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.testimonialCard.Position"
                                >
                                  Author Position
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.testimonialCard.Position"
                                    type="text"
                                    placeholder="Enter author position"
                                    {...register(
                                      "testimonial.testimonialCard.Position",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.testimonialCard.src"
                                >
                                  Author Image URL
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.testimonialCard.src"
                                    type="text"
                                    placeholder="Enter author image URL"
                                    {...register(
                                      "testimonial.testimonialCard.src",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.testimonialCard.alt"
                                >
                                  Author Image Alt
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.testimonialCard.alt"
                                    type="text"
                                    placeholder="Enter author image alt"
                                    {...register(
                                      "testimonial.testimonialCard.alt",
                                    )}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-lg font-bold border-b pb-1">
                              Main Section Image
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.image.src"
                                >
                                  Image URL
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.image.src"
                                    type="text"
                                    placeholder="Enter image URL"
                                    {...register("testimonial.image.src")}
                                  />
                                </InputGroup>
                              </Field>
                              <Field>
                                <FieldLabel
                                  className="text-base-black gap-0"
                                  htmlFor="testimonial.image.alt"
                                >
                                  Alt Text
                                </FieldLabel>
                                <InputGroup>
                                  <InputGroupInput
                                    id="testimonial.image.alt"
                                    type="text"
                                    placeholder="Enter image alt"
                                    {...register("testimonial.image.alt")}
                                  />
                                </InputGroup>
                              </Field>
                            </div>
                          </div>
                        </CardContent>
                      </CardBody>
                    </Card>

                    {/* Our Partners */}
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Our Partners</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="ourPartners.p1"
                              >
                                Paragraph 1
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="ourPartners.p1"
                                  type="text"
                                  placeholder="Enter paragraph 1 text"
                                  {...register("ourPartners.p1")}
                                />
                              </InputGroup>
                            </Field>
                            <Field>
                              <FieldLabel
                                className="text-base-black gap-0"
                                htmlFor="ourPartners.p2"
                              >
                                Paragraph 2
                              </FieldLabel>
                              <InputGroup>
                                <InputGroupInput
                                  id="ourPartners.p2"
                                  type="text"
                                  placeholder="Enter paragraph 2 text"
                                  {...register("ourPartners.p2")}
                                />
                              </InputGroup>
                            </Field>
                          </div>
                          <Separator />
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">
                                Partner Logos/Images
                              </h3>
                              <Button
                                type="button"
                                onClick={() =>
                                  partnerImages.append({
                                    id: uid(),
                                    src: "",
                                    alt: "",
                                  })
                                }
                                variant="outlinePrimary"
                              >
                                Add Partner Logo
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {partnerImages.fields.map((field, index) => (
                                <Card key={field.id}>
                                  <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-semibold text-sm text-gray-500 uppercase">
                                        Logo #{index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          partnerImages.remove(index)
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`ourPartners.images.${index}.src`}
                                      >
                                        Logo URL
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`ourPartners.images.${index}.src`}
                                          type="text"
                                          placeholder="Enter logo URL"
                                          {...register(
                                            `ourPartners.images.${index}.src`,
                                          )}
                                        />
                                      </InputGroup>
                                    </Field>
                                    <Field>
                                      <FieldLabel
                                        className="text-base-black gap-0"
                                        htmlFor={`ourPartners.images.${index}.alt`}
                                      >
                                        Alt Text
                                      </FieldLabel>
                                      <InputGroup>
                                        <InputGroupInput
                                          id={`ourPartners.images.${index}.alt`}
                                          type="text"
                                          placeholder="Enter logo alt"
                                          {...register(
                                            `ourPartners.images.${index}.alt`,
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
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-6">
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>Basic SEO</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="seo.metaTitle"
                            >
                              Meta Title
                            </FieldLabel>
                            <Controller
                              control={control}
                              name="seo.metaTitle"
                              render={({ field }) => (
                                <InputGroup>
                                  <InputGroupInput
                                    id="seo.metaTitle"
                                    type="text"
                                    placeholder="Enter meta title"
                                    {...field}
                                  />
                                </InputGroup>
                              )}
                            />
                          </Field>

                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="seo.metaDescription"
                            >
                              Meta Description
                            </FieldLabel>
                            <Controller
                              control={control}
                              name="seo.metaDescription"
                              render={({ field }) => (
                                <InputGroup>
                                  <InputGroupInput
                                    id="seo.metaDescription"
                                    type="text"
                                    placeholder="Enter meta description"
                                    {...field}
                                  />
                                </InputGroup>
                              )}
                            />
                          </Field>

                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="seo.metaKeywords"
                            >
                              Meta Keywords
                            </FieldLabel>
                            <Controller
                              name="seo.metaKeywords"
                              control={control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <AutoCompleteInput
                                    inputId="seo.metaKeywords"
                                    list={metaKeywordsData?.keywords || []}
                                    value={keywordInput}
                                    setValue={setKeywordInput}
                                    onAdd={(val: string) => {
                                      if (!field.value?.includes(val)) {
                                        field.onChange([
                                          ...(field.value || []),
                                          val,
                                        ]);
                                      }
                                      setKeywordInput("");
                                    }}
                                    placeholder="Type and select keywords..."
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    {field.value?.map((kw: string) => (
                                      <Badge
                                        key={kw}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                      >
                                        {kw}
                                        <X
                                          className="w-3 h-3 cursor-pointer"
                                          onClick={() =>
                                            field.onChange(
                                              (field.value || []).filter(
                                                (k: string) => k !== kw,
                                              ),
                                            )
                                          }
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            />
                          </Field>

                          <Field>
                            <FieldLabel
                              className="text-base-black gap-0"
                              htmlFor="seo.canonicalUrl"
                            >
                              Canonical URL
                            </FieldLabel>
                            <Controller
                              control={control}
                              name="seo.canonicalUrl"
                              render={({ field }) => (
                                <InputGroup>
                                  <InputGroupInput
                                    id="seo.canonicalUrl"
                                    type="text"
                                    placeholder="https://..."
                                    {...field}
                                  />
                                </InputGroup>
                              )}
                            />
                          </Field>

                          <Field>
                            {/* <FieldLabel className="text-base-black gap-0">
                              OG Image
                            </FieldLabel> */}
                            <Controller
                              name="seo.ogImage"
                              control={control}
                              render={({ field }) => (
                                <UploadWithUrl
                                  value={field.value}
                                  onChange={field.onChange}
                                  title="OG Image"
                                />
                              )}
                            />
                          </Field>
                        </CardContent>
                      </CardBody>
                    </Card>
                  </div>
                )}

                {activeTab === "jsonld" && (
                  <div className="space-y-6">
                    <Card>
                      <CardBody>
                        <CardHeader>
                          <CardTitle>JSON-LD Schema</CardTitle>
                          <CardAction>
                            <Button
                              type="button"
                              onClick={() =>
                                appendJsonLd(getDefaultJsonLdItem("FAQPage"))
                              }
                            >
                              <Plus />
                              Add Item
                            </Button>
                          </CardAction>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {jsonLdFields.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No JSON-LD items added yet.
                            </p>
                          )}
                          {jsonLdFields.map((field, index) => (
                            <Card key={field.id}>
                              <CardBody>
                                <CardHeader>
                                  <CardTitle>Item {index + 1}</CardTitle>
                                  <CardAction>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeJsonLd(index)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </CardAction>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor={`jsonLd.${index}`}
                                    >
                                      Schema JSON
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name={`jsonLd.${index}`}
                                      render={({ field }) => (
                                        <Textarea
                                          id={`jsonLd.${index}`}
                                          className="w-full h-40 p-2 border rounded font-mono text-sm"
                                          value={
                                            typeof field.value === "string"
                                              ? field.value
                                              : JSON.stringify(
                                                  field.value,
                                                  null,
                                                  2,
                                                )
                                          }
                                          onChange={(e) => {
                                            try {
                                              const parsed = JSON.parse(
                                                e.target.value,
                                              );
                                              field.onChange(parsed);
                                            } catch (err) {
                                              field.onChange(e.target.value);
                                            }
                                          }}
                                        />
                                      )}
                                    />
                                    <FieldDescription>
                                      Paste your JSON-LD object here.
                                    </FieldDescription>
                                  </Field>
                                </CardContent>
                              </CardBody>
                            </Card>
                          ))}
                        </CardContent>
                      </CardBody>
                    </Card>
                  </div>
                )}
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
              <Button type="submit">Submit</Button>
            </CardContent>
          </CardBody>
        </Card>
      </form>
    </FormProvider>
  );
}

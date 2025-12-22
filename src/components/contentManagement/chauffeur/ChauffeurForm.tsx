import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  Controller,
  FormProvider,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import { uid } from "@/utils/pagebuilder.utils";

// Schema for Chauffeur Page
const chauffeurSchema = z.object({
  heading: z
    .object({
      BL1: z.string().optional(),
      BL2: z.string().optional(),
      h1: z.string().optional(),
    })
    .optional(),
  heroSection: z
    .object({
      image: z
        .object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
        .optional(),
      h2: z.string().optional(),
      p: z.string().optional(),
      btn: z.string().optional(),
    })
    .optional(),
  testimony: z
    .object({
      quoteMark: z.string().optional(), // decorative quote mark
      p: z.string().optional(),
      cite: z.string().optional(),
    })
    .optional(),
  infoCard1: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  infoCard2: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  requirements: z
    .object({
      imageLeft: z.boolean().optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      description: z.string().optional(), // richtext
      info: z.string().optional(),
      buttonName: z.string().optional(),
    })
    .optional(),
  onBoarding: z
    .object({
      imageLeft: z.boolean().optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      description: z.string().optional(),
      info: z.string().optional(),
      buttonName: z.string().optional(),
    })
    .optional(),
  environmentFriendly: z
    .object({
      imageLeft: z.boolean().optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
      t1: z.string().optional(),
      description: z.string().optional(),
      info: z.string().optional(),
      buttonName: z.string().optional(),
    })
    .optional(),
  faq: z
    .object({
      faqData: z
        .array(
          z.object({
            id: z.string().optional(),
            question: z.string().optional(),
            answer: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  contact: z
    .object({
      h2: z.string().optional(),
      p: z.string().optional(),
      btn: z.string().optional(),
    })
    .optional(),
});

type ChauffeurFormData = z.infer<typeof chauffeurSchema>;

interface ChauffeurFormProps {
  initialData?: any;
  onSubmit: (data: ChauffeurFormData) => void;
  type: string;
}

export default function ChauffeurForm({
  initialData,
  onSubmit,
  type,
}: ChauffeurFormProps) {
  const form = useForm<ChauffeurFormData>({
    resolver: zodResolver(chauffeurSchema),
    defaultValues: initialData || {
      heroSection: {
        image: {
          src: "/HeroSections/hs-chauffer-and-business-corp.png",
          alt: "Cars",
        },
      },
      onBoarding: {
        buttonName: "APPLY NOW",
        imageLeft: false,
      },
      requirements: {
        imageLeft: true,
      },
      environmentFriendly: {
        imageLeft: true,
      },
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const faqItems = useFieldArray({ control, name: "faq.faqData" });

  const onHandleSubmit = (data: ChauffeurFormData) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className="flex flex-col gap-6"
      >
        {/* Headings */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Page Headings</CardTitle>
              <CardDescription>
                Manage the main headings for the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="heading.BL1"
                  className="text-base-black gap-0"
                >
                  BL1
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="heading.BL1"
                    type="text"
                    placeholder="BL1"
                    aria-invalid={!!errors.heading?.BL1}
                    {...register("heading.BL1")}
                  />
                </InputGroup>
                <FieldDescription>Enter the BL1.</FieldDescription>
                {errors.heading?.BL1 && (
                  <FormMessage>{errors.heading?.BL1?.message}</FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="heading.BL2"
                  className="text-base-black gap-0"
                >
                  BL2
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="heading.BL2"
                    type="text"
                    placeholder="BL2"
                    aria-invalid={!!errors.heading?.BL2}
                    {...register("heading.BL2")}
                  />
                </InputGroup>
                <FieldDescription>Enter the BL2.</FieldDescription>
                {errors.heading?.BL2 && (
                  <FormMessage>{errors.heading?.BL2?.message}</FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="heading.h1"
                  className="text-base-black gap-0"
                >
                  H1
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="heading.h1"
                    type="text"
                    placeholder="H1"
                    aria-invalid={!!errors.heading?.h1}
                    {...register("heading.h1")}
                  />
                </InputGroup>
                <FieldDescription>Enter the H1.</FieldDescription>
                {errors.heading?.h1 && (
                  <FormMessage>{errors.heading?.h1?.message}</FormMessage>
                )}
              </Field>
            </CardContent>
          </CardBody>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the hero banner content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="heroSection.image.src"
                    className="text-base-black gap-0"
                  >
                    Image Source
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="heroSection.image.src"
                      type="text"
                      placeholder="https://..."
                      aria-invalid={!!errors.heroSection?.image?.src}
                      {...register("heroSection.image.src")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the hero image URL.</FieldDescription>
                  {errors.heroSection?.image?.src && (
                    <FormMessage>
                      {errors.heroSection?.image?.src?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="heroSection.image.alt"
                    className="text-base-black gap-0"
                  >
                    Image Alt
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="heroSection.image.alt"
                      type="text"
                      placeholder="Alt text"
                      aria-invalid={!!errors.heroSection?.image?.alt}
                      {...register("heroSection.image.alt")}
                    />
                  </InputGroup>
                  <FieldDescription>
                    Enter the hero image alt text.
                  </FieldDescription>
                  {errors.heroSection?.image?.alt && (
                    <FormMessage>
                      {errors.heroSection?.image?.alt?.message}
                    </FormMessage>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="heroSection.h2"
                    className="text-base-black gap-0"
                  >
                    H2
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="heroSection.h2"
                      type="text"
                      placeholder="Heading"
                      aria-invalid={!!errors.heroSection?.h2}
                      {...register("heroSection.h2")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the hero heading.</FieldDescription>
                  {errors.heroSection?.h2 && (
                    <FormMessage>{errors.heroSection?.h2?.message}</FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="heroSection.btn"
                    className="text-base-black gap-0"
                  >
                    Button Label
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="heroSection.btn"
                      type="text"
                      placeholder="Button label"
                      aria-invalid={!!errors.heroSection?.btn}
                      {...register("heroSection.btn")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the button label.</FieldDescription>
                  {errors.heroSection?.btn && (
                    <FormMessage>
                      {errors.heroSection?.btn?.message}
                    </FormMessage>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="heroSection.p"
                  className="text-base-black gap-0"
                >
                  Paragraph
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="heroSection.p"
                    type="text"
                    placeholder="Paragraph"
                    aria-invalid={!!errors.heroSection?.p}
                    {...register("heroSection.p")}
                  />
                </InputGroup>
                <FieldDescription>
                  Enter the hero paragraph text.
                </FieldDescription>
                {errors.heroSection?.p && (
                  <FormMessage>{errors.heroSection?.p?.message}</FormMessage>
                )}
              </Field>
            </CardContent>
          </CardBody>
        </Card>

        {/* Testimony */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Testimony</CardTitle>
              <CardDescription>
                Configure the testimonial content.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="testimony.quoteMark"
                  className="text-base-black gap-0"
                >
                  Decorative Quote Mark
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="testimony.quoteMark"
                    type="text"
                    placeholder="Quote mark"
                    aria-invalid={!!errors.testimony?.quoteMark}
                    {...register("testimony.quoteMark")}
                  />
                </InputGroup>
                <FieldDescription>Enter the quote mark text.</FieldDescription>
                {errors.testimony?.quoteMark && (
                  <FormMessage>
                    {errors.testimony?.quoteMark?.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="testimony.cite"
                  className="text-base-black gap-0"
                >
                  Cite
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="testimony.cite"
                    type="text"
                    placeholder="Cite"
                    aria-invalid={!!errors.testimony?.cite}
                    {...register("testimony.cite")}
                  />
                </InputGroup>
                <FieldDescription>Enter the cite.</FieldDescription>
                {errors.testimony?.cite && (
                  <FormMessage>{errors.testimony?.cite?.message}</FormMessage>
                )}
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel
                  htmlFor="testimony.p"
                  className="text-base-black gap-0"
                >
                  Paragraph
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="testimony.p"
                    type="text"
                    placeholder="Testimonial paragraph"
                    aria-invalid={!!errors.testimony?.p}
                    {...register("testimony.p")}
                  />
                </InputGroup>
                <FieldDescription>
                  Enter the testimonial paragraph.
                </FieldDescription>
                {errors.testimony?.p && (
                  <FormMessage>{errors.testimony?.p?.message}</FormMessage>
                )}
              </Field>
            </CardContent>
          </CardBody>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>Info Card 1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="infoCard1.src"
                      className="text-base-black gap-0"
                    >
                      Image Source
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard1.src"
                        type="text"
                        placeholder="https://..."
                        aria-invalid={!!errors.infoCard1?.src}
                        {...register("infoCard1.src")}
                      />
                    </InputGroup>
                    <FieldDescription>Enter the image URL.</FieldDescription>
                    {errors.infoCard1?.src && (
                      <FormMessage>
                        {errors.infoCard1?.src?.message}
                      </FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="infoCard1.alt"
                      className="text-base-black gap-0"
                    >
                      Image Alt
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard1.alt"
                        type="text"
                        placeholder="Alt text"
                        aria-invalid={!!errors.infoCard1?.alt}
                        {...register("infoCard1.alt")}
                      />
                    </InputGroup>
                    <FieldDescription>
                      Enter the image alt text.
                    </FieldDescription>
                    {errors.infoCard1?.alt && (
                      <FormMessage>
                        {errors.infoCard1?.alt?.message}
                      </FormMessage>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="infoCard1.title"
                      className="text-base-black gap-0"
                    >
                      Title
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard1.title"
                        type="text"
                        placeholder="Title"
                        aria-invalid={!!errors.infoCard1?.title}
                        {...register("infoCard1.title")}
                      />
                    </InputGroup>
                    <FieldDescription>Enter the title.</FieldDescription>
                    {errors.infoCard1?.title && (
                      <FormMessage>
                        {errors.infoCard1?.title?.message}
                      </FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="infoCard1.description"
                      className="text-base-black gap-0"
                    >
                      Description
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard1.description"
                        type="text"
                        placeholder="Description"
                        aria-invalid={!!errors.infoCard1?.description}
                        {...register("infoCard1.description")}
                      />
                    </InputGroup>
                    <FieldDescription>Enter the description.</FieldDescription>
                    {errors.infoCard1?.description && (
                      <FormMessage>
                        {errors.infoCard1?.description?.message}
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
                <CardTitle>Info Card 2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="infoCard2.src"
                      className="text-base-black gap-0"
                    >
                      Image Source
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard2.src"
                        type="text"
                        placeholder="https://..."
                        aria-invalid={!!errors.infoCard2?.src}
                        {...register("infoCard2.src")}
                      />
                    </InputGroup>
                    <FieldDescription>Enter the image URL.</FieldDescription>
                    {errors.infoCard2?.src && (
                      <FormMessage>
                        {errors.infoCard2?.src?.message}
                      </FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="infoCard2.alt"
                      className="text-base-black gap-0"
                    >
                      Image Alt
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard2.alt"
                        type="text"
                        placeholder="Alt text"
                        aria-invalid={!!errors.infoCard2?.alt}
                        {...register("infoCard2.alt")}
                      />
                    </InputGroup>
                    <FieldDescription>
                      Enter the image alt text.
                    </FieldDescription>
                    {errors.infoCard2?.alt && (
                      <FormMessage>
                        {errors.infoCard2?.alt?.message}
                      </FormMessage>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="infoCard2.title"
                      className="text-base-black gap-0"
                    >
                      Title
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard2.title"
                        type="text"
                        placeholder="Title"
                        aria-invalid={!!errors.infoCard2?.title}
                        {...register("infoCard2.title")}
                      />
                    </InputGroup>
                    <FieldDescription>Enter the title.</FieldDescription>
                    {errors.infoCard2?.title && (
                      <FormMessage>
                        {errors.infoCard2?.title?.message}
                      </FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="infoCard2.description"
                      className="text-base-black gap-0"
                    >
                      Description
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="infoCard2.description"
                        type="text"
                        placeholder="Description"
                        aria-invalid={!!errors.infoCard2?.description}
                        {...register("infoCard2.description")}
                      />
                    </InputGroup>
                    <FieldDescription>Enter the description.</FieldDescription>
                    {errors.infoCard2?.description && (
                      <FormMessage>
                        {errors.infoCard2?.description?.message}
                      </FormMessage>
                    )}
                  </Field>
                </div>
              </CardContent>
            </CardBody>
          </Card>
        </div>

        {/* Requirements */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Requirements (Image Side Card)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="requirements.src"
                    className="text-base-black gap-0"
                  >
                    Image Source
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="requirements.src"
                      type="text"
                      placeholder="https://..."
                      aria-invalid={!!errors.requirements?.src}
                      {...register("requirements.src")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the image URL.</FieldDescription>
                  {errors.requirements?.src && (
                    <FormMessage>
                      {errors.requirements?.src?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="requirements.alt"
                    className="text-base-black gap-0"
                  >
                    Image Alt
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="requirements.alt"
                      type="text"
                      placeholder="Alt text"
                      aria-invalid={!!errors.requirements?.alt}
                      {...register("requirements.alt")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the image alt text.</FieldDescription>
                  {errors.requirements?.alt && (
                    <FormMessage>
                      {errors.requirements?.alt?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="requirements.t1"
                    className="text-base-black gap-0"
                  >
                    T1
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="requirements.t1"
                      type="text"
                      placeholder="T1"
                      aria-invalid={!!errors.requirements?.t1}
                      {...register("requirements.t1")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the title text.</FieldDescription>
                  {errors.requirements?.t1 && (
                    <FormMessage>
                      {errors.requirements?.t1?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="requirements.buttonName"
                    className="text-base-black gap-0"
                  >
                    Button Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="requirements.buttonName"
                      type="text"
                      placeholder="Button Name"
                      aria-invalid={!!errors.requirements?.buttonName}
                      {...register("requirements.buttonName")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the button text.</FieldDescription>
                  {errors.requirements?.buttonName && (
                    <FormMessage>
                      {errors.requirements?.buttonName?.message}
                    </FormMessage>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="requirements.description"
                  className="text-base-black gap-0"
                >
                  Description (Rich Text)
                </FieldLabel>
                <Controller
                  control={control}
                  name="requirements.description"
                  render={({ field }) => (
                    <TinyEditorRHF
                      id="requirements.description"
                      value={(field.value as string) || ""}
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  )}
                />
                <FieldDescription>
                  Enter the rich text description.
                </FieldDescription>
                {errors.requirements?.description && (
                  <FormMessage>
                    {errors.requirements?.description?.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="requirements.info"
                  className="text-base-black gap-0"
                >
                  Info
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="requirements.info"
                    type="text"
                    placeholder="Info"
                    aria-invalid={!!errors.requirements?.info}
                    {...register("requirements.info")}
                  />
                </InputGroup>
                <FieldDescription>Enter the supporting info.</FieldDescription>
                {errors.requirements?.info && (
                  <FormMessage>
                    {errors.requirements?.info?.message}
                  </FormMessage>
                )}
              </Field>

              <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                <Controller
                  control={control}
                  name="requirements.imageLeft"
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="requirements.imageLeft"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="requirements.imageLeft"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Image Left?
                      </label>
                    </>
                  )}
                />
              </div>
            </CardContent>
          </CardBody>
        </Card>

        {/* OnBoarding */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>OnBoarding (Image Side Card)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="onBoarding.src"
                    className="text-base-black gap-0"
                  >
                    Image Source
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="onBoarding.src"
                      type="text"
                      placeholder="https://..."
                      aria-invalid={!!errors.onBoarding?.src}
                      {...register("onBoarding.src")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the image URL.</FieldDescription>
                  {errors.onBoarding?.src && (
                    <FormMessage>{errors.onBoarding?.src?.message}</FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="onBoarding.alt"
                    className="text-base-black gap-0"
                  >
                    Image Alt
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="onBoarding.alt"
                      type="text"
                      placeholder="Alt text"
                      aria-invalid={!!errors.onBoarding?.alt}
                      {...register("onBoarding.alt")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the image alt text.</FieldDescription>
                  {errors.onBoarding?.alt && (
                    <FormMessage>{errors.onBoarding?.alt?.message}</FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="onBoarding.t1"
                    className="text-base-black gap-0"
                  >
                    T1
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="onBoarding.t1"
                      type="text"
                      placeholder="T1"
                      aria-invalid={!!errors.onBoarding?.t1}
                      {...register("onBoarding.t1")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the title text.</FieldDescription>
                  {errors.onBoarding?.t1 && (
                    <FormMessage>{errors.onBoarding?.t1?.message}</FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="onBoarding.buttonName"
                    className="text-base-black gap-0"
                  >
                    Button Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="onBoarding.buttonName"
                      type="text"
                      placeholder="Button Name"
                      aria-invalid={!!errors.onBoarding?.buttonName}
                      {...register("onBoarding.buttonName")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the button text.</FieldDescription>
                  {errors.onBoarding?.buttonName && (
                    <FormMessage>
                      {errors.onBoarding?.buttonName?.message}
                    </FormMessage>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="onBoarding.description"
                  className="text-base-black gap-0"
                >
                  Description
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="onBoarding.description"
                    type="text"
                    placeholder="Description"
                    aria-invalid={!!errors.onBoarding?.description}
                    {...register("onBoarding.description")}
                  />
                </InputGroup>
                <FieldDescription>Enter the description.</FieldDescription>
                {errors.onBoarding?.description && (
                  <FormMessage>
                    {errors.onBoarding?.description?.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="onBoarding.info"
                  className="text-base-black gap-0"
                >
                  Info
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="onBoarding.info"
                    type="text"
                    placeholder="Info"
                    aria-invalid={!!errors.onBoarding?.info}
                    {...register("onBoarding.info")}
                  />
                </InputGroup>
                <FieldDescription>Enter the supporting info.</FieldDescription>
                {errors.onBoarding?.info && (
                  <FormMessage>{errors.onBoarding?.info?.message}</FormMessage>
                )}
              </Field>

              <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                <Controller
                  control={control}
                  name="onBoarding.imageLeft"
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="onBoarding.imageLeft"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="onBoarding.imageLeft"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Image Left?
                      </label>
                    </>
                  )}
                />
              </div>
            </CardContent>
          </CardBody>
        </Card>

        {/* Environment Friendly */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Environment Friendly (Image Side Card)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="environmentFriendly.src"
                    className="text-base-black gap-0"
                  >
                    Image Source
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="environmentFriendly.src"
                      type="text"
                      placeholder="https://..."
                      aria-invalid={!!errors.environmentFriendly?.src}
                      {...register("environmentFriendly.src")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the image URL.</FieldDescription>
                  {errors.environmentFriendly?.src && (
                    <FormMessage>
                      {errors.environmentFriendly?.src?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="environmentFriendly.alt"
                    className="text-base-black gap-0"
                  >
                    Image Alt
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="environmentFriendly.alt"
                      type="text"
                      placeholder="Alt text"
                      aria-invalid={!!errors.environmentFriendly?.alt}
                      {...register("environmentFriendly.alt")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the image alt text.</FieldDescription>
                  {errors.environmentFriendly?.alt && (
                    <FormMessage>
                      {errors.environmentFriendly?.alt?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="environmentFriendly.t1"
                    className="text-base-black gap-0"
                  >
                    T1
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="environmentFriendly.t1"
                      type="text"
                      placeholder="T1"
                      aria-invalid={!!errors.environmentFriendly?.t1}
                      {...register("environmentFriendly.t1")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the title text.</FieldDescription>
                  {errors.environmentFriendly?.t1 && (
                    <FormMessage>
                      {errors.environmentFriendly?.t1?.message}
                    </FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="environmentFriendly.buttonName"
                    className="text-base-black gap-0"
                  >
                    Button Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="environmentFriendly.buttonName"
                      type="text"
                      placeholder="Button Name"
                      aria-invalid={!!errors.environmentFriendly?.buttonName}
                      {...register("environmentFriendly.buttonName")}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the button text.</FieldDescription>
                  {errors.environmentFriendly?.buttonName && (
                    <FormMessage>
                      {errors.environmentFriendly?.buttonName?.message}
                    </FormMessage>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="environmentFriendly.description"
                  className="text-base-black gap-0"
                >
                  Description
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="environmentFriendly.description"
                    type="text"
                    placeholder="Description"
                    aria-invalid={!!errors.environmentFriendly?.description}
                    {...register("environmentFriendly.description")}
                  />
                </InputGroup>
                <FieldDescription>Enter the description.</FieldDescription>
                {errors.environmentFriendly?.description && (
                  <FormMessage>
                    {errors.environmentFriendly?.description?.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="environmentFriendly.info"
                  className="text-base-black gap-0"
                >
                  Info
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="environmentFriendly.info"
                    type="text"
                    placeholder="Info"
                    aria-invalid={!!errors.environmentFriendly?.info}
                    {...register("environmentFriendly.info")}
                  />
                </InputGroup>
                <FieldDescription>Enter the supporting info.</FieldDescription>
                {errors.environmentFriendly?.info && (
                  <FormMessage>
                    {errors.environmentFriendly?.info?.message}
                  </FormMessage>
                )}
              </Field>

              <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                <Controller
                  control={control}
                  name="environmentFriendly.imageLeft"
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="environmentFriendly.imageLeft"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="environmentFriendly.imageLeft"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Image Left?
                      </label>
                    </>
                  )}
                />
              </div>
            </CardContent>
          </CardBody>
        </Card>

        {/* FAQ */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Manage the FAQ section content.</CardDescription>
              <CardAction>
                <Button
                  type="button"
                  size="lg"
                  spacing="sm"
                  className="w-8"
                  tooltip="Add FAQ"
                  onClick={() =>
                    faqItems.append({ id: uid(), question: "", answer: "" })
                  }
                >
                  <Plus />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardBody>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>
                        <span className="font-semibold text-sm text-gray-500 uppercase">
                          Question #{index + 1}
                        </span>
                      </CardTitle>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => faqItems.remove(index)}
                      >
                        Remove
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Field>
                        <FieldLabel
                          htmlFor={`faq.faqData.${index}.question`}
                          className="text-base-black gap-0"
                        >
                          Question
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`faq.faqData.${index}.question`}
                            type="text"
                            placeholder="Question"
                            aria-invalid={
                              !!errors.faq?.faqData?.[index]?.question
                            }
                            {...register(`faq.faqData.${index}.question`)}
                          />
                        </InputGroup>
                        <FieldDescription>Enter the question.</FieldDescription>
                        {errors.faq?.faqData?.[index]?.question && (
                          <FormMessage>
                            {errors.faq?.faqData?.[index]?.question?.message}
                          </FormMessage>
                        )}
                      </Field>

                      <Field>
                        <FieldLabel
                          htmlFor={`faq.faqData.${index}.answer`}
                          className="text-base-black gap-0"
                        >
                          Answer
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`faq.faqData.${index}.answer`}
                            type="text"
                            placeholder="Answer"
                            aria-invalid={
                              !!errors.faq?.faqData?.[index]?.answer
                            }
                            {...register(`faq.faqData.${index}.answer`)}
                          />
                        </InputGroup>
                        <FieldDescription>Enter the answer.</FieldDescription>
                        {errors.faq?.faqData?.[index]?.answer && (
                          <FormMessage>
                            {errors.faq?.faqData?.[index]?.answer?.message}
                          </FormMessage>
                        )}
                      </Field>
                    </CardContent>
                  </CardBody>
                </Card>
              ))}
            </CardContent>
          </CardBody>
        </Card>

        {/* Contact */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
              <CardDescription>
                Configure the contact call-to-action.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="contact.h2"
                  className="text-base-black gap-0"
                >
                  H2
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="contact.h2"
                    type="text"
                    placeholder="Heading"
                    aria-invalid={!!errors.contact?.h2}
                    {...register("contact.h2")}
                  />
                </InputGroup>
                <FieldDescription>Enter the contact heading.</FieldDescription>
                {errors.contact?.h2 && (
                  <FormMessage>{errors.contact?.h2?.message}</FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="contact.btn"
                  className="text-base-black gap-0"
                >
                  Button Label
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="contact.btn"
                    type="text"
                    placeholder="Button label"
                    aria-invalid={!!errors.contact?.btn}
                    {...register("contact.btn")}
                  />
                </InputGroup>
                <FieldDescription>Enter the button label.</FieldDescription>
                {errors.contact?.btn && (
                  <FormMessage>{errors.contact?.btn?.message}</FormMessage>
                )}
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel
                  htmlFor="contact.p"
                  className="text-base-black gap-0"
                >
                  Paragraph
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="contact.p"
                    type="text"
                    placeholder="Paragraph"
                    aria-invalid={!!errors.contact?.p}
                    {...register("contact.p")}
                  />
                </InputGroup>
                <FieldDescription>
                  Enter the contact paragraph.
                </FieldDescription>
                {errors.contact?.p && (
                  <FormMessage>{errors.contact?.p?.message}</FormMessage>
                )}
              </Field>
            </CardContent>
          </CardBody>
        </Card>

        {/* Form Actions */}
        <Card className="sticky bottom-6 z-10 bg-base-white/80 backdrop-blur">
          <CardBody className="p-4">
            <CardContent className="flex justify-end gap-3">
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

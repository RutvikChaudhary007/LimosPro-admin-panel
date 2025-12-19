import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import {
  LabeledEditor,
  LabeledInput,
} from "@/components/pagebuilder/partials/HelperComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const { control, register, handleSubmit } = form;

  const faqItems = useFieldArray({ control, name: "faq.faqData" });

  const onHandleSubmit = (data: ChauffeurFormData) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-8">
        {/* Headings */}
        <Card>
          <CardHeader>
            <CardTitle>Page Headings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput label="BL1" {...register("heading.BL1")} />
            <LabeledInput label="BL2" {...register("heading.BL2")} />
            <LabeledInput label="H1" {...register("heading.h1")} />
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Image Source"
                {...register("heroSection.image.src")}
              />
              <LabeledInput
                label="Image Alt"
                {...register("heroSection.image.alt")}
              />
            </div>
            <LabeledInput label="H2" {...register("heroSection.h2")} />
            <LabeledInput label="Paragraph" {...register("heroSection.p")} />
            <LabeledInput
              label="Button Label"
              {...register("heroSection.btn")}
            />
          </CardContent>
        </Card>

        {/* Testimony */}
        <Card>
          <CardHeader>
            <CardTitle>Testimony</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput
              label="Decorative Quote Mark"
              {...register("testimony.quoteMark")}
            />
            <LabeledInput label="Paragraph" {...register("testimony.p")} />
            <LabeledInput label="Cite" {...register("testimony.cite")} />
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Info Card 1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LabeledInput
                label="Image Source"
                {...register("infoCard1.src")}
              />
              <LabeledInput label="Image Alt" {...register("infoCard1.alt")} />
              <LabeledInput label="Title" {...register("infoCard1.title")} />
              <LabeledInput
                label="Description"
                {...register("infoCard1.description")}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Info Card 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LabeledInput
                label="Image Source"
                {...register("infoCard2.src")}
              />
              <LabeledInput label="Image Alt" {...register("infoCard2.alt")} />
              <LabeledInput label="Title" {...register("infoCard2.title")} />
              <LabeledInput
                label="Description"
                {...register("infoCard2.description")}
              />
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements (Image Side Card)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Image Source"
                {...register("requirements.src")}
              />
              <LabeledInput
                label="Image Alt"
                {...register("requirements.alt")}
              />
              <LabeledInput label="T1" {...register("requirements.t1")} />
              <LabeledInput
                label="Button Name"
                {...register("requirements.buttonName")}
              />
            </div>
            <Controller
              control={control}
              name="requirements.description"
              render={({ field }) => (
                <LabeledEditor
                  label="Description (Rich Text)"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <LabeledInput label="Info" {...register("requirements.info")} />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reqImageLeft"
                {...register("requirements.imageLeft")}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="reqImageLeft"
                className="text-sm font-medium text-gray-700"
              >
                Image Left?
              </label>
            </div>
          </CardContent>
        </Card>

        {/* OnBoarding */}
        <Card>
          <CardHeader>
            <CardTitle>OnBoarding (Image Side Card)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Image Source"
                {...register("onBoarding.src")}
              />
              <LabeledInput label="Image Alt" {...register("onBoarding.alt")} />
              <LabeledInput label="T1" {...register("onBoarding.t1")} />
              <LabeledInput
                label="Button Name"
                {...register("onBoarding.buttonName")}
              />
            </div>
            <LabeledInput
              label="Description"
              {...register("onBoarding.description")}
            />
            <LabeledInput label="Info" {...register("onBoarding.info")} />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="onbImageLeft"
                {...register("onBoarding.imageLeft")}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="onbImageLeft"
                className="text-sm font-medium text-gray-700"
              >
                Image Left?
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Environment Friendly */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Friendly (Image Side Card)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Image Source"
                {...register("environmentFriendly.src")}
              />
              <LabeledInput
                label="Image Alt"
                {...register("environmentFriendly.alt")}
              />
              <LabeledInput
                label="T1"
                {...register("environmentFriendly.t1")}
              />
              <LabeledInput
                label="Button Name"
                {...register("environmentFriendly.buttonName")}
              />
            </div>
            <LabeledInput
              label="Description"
              {...register("environmentFriendly.description")}
            />
            <LabeledInput
              label="Info"
              {...register("environmentFriendly.info")}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="envImageLeft"
                {...register("environmentFriendly.imageLeft")}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="envImageLeft"
                className="text-sm font-medium text-gray-700"
              >
                Image Left?
              </label>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">FAQ Items</h3>
              <Button
                type="button"
                onClick={() =>
                  faqItems.append({ id: uid(), question: "", answer: "" })
                }
                variant="outlinePrimary"
              >
                Add FAQ
              </Button>
            </div>
            <div className="space-y-4">
              {faqItems.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-gray-500 uppercase">
                        Question #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => faqItems.remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <LabeledInput
                      label="Question"
                      {...register(`faq.faqData.${index}.question`)}
                    />
                    <LabeledInput
                      label="Answer"
                      {...register(`faq.faqData.${index}.answer`)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabeledInput label="H2" {...register("contact.h2")} />
            <LabeledInput label="Paragraph" {...register("contact.p")} />
            <LabeledInput label="Button Label" {...register("contact.btn")} />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="sticky bottom-6 z-10 bg-white/80 backdrop-blur p-4 border rounded-xl shadow-lg flex justify-end gap-3">
          <Button
            type="button"
            variant="outlinePrimary"
            onClick={() => form.reset()}
          >
            Reset Form
          </Button>
          <Button type="submit">{type}</Button>
        </div>
      </form>
    </FormProvider>
  );
}

// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { IconMessageCircle, IconStar, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type {
  ITestimonialFormProps,
  TTestimonialFormData,
} from "@/types/testimonial.type";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Form, FormControl, FormItem, FormMessage } from "../ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import ImagesUpload from "../ui/upload-images";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Name must be at least 3 characters" }),
  message: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Message  cannot be empty or just whitespace.",
    })
    .min(3, { message: "Message  must be at least 3 characters" }),
  photo: z
    .union([
      // For create: accept File
      z.instanceof(File),
      // For edit: accept URL string
      z
        .string()
        .url(),
    ])
    .refine(
      (file) => {
        // If it's a string URL, it's valid (edit mode)
        if (typeof file === "string") return true;
        // If it's a File, check size (create mode)
        return file.size <= MAX_SIZE;
      },
      { message: "Max size is 5MB" },
    )
    .refine(
      (file) => {
        // If it's a string URL, it's valid (edit mode)
        if (typeof file === "string") return true;
        // If it's a File, check mime type (create mode)
        return ALLOWED_MIME_TYPES.includes(file.type);
      },
      { message: "Invalid file type. Only accept jpeg and png file" },
    ),
  rating: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1).max(5),
  ),
  isFeatured: z.boolean(),
  // photo: z
  // .instanceof(File)
  // .nullable()
  // .refine(val => val !== null, "Image required"),
  // .custom<FileList>().check((ctx) => {
  //     const list = ctx.value;
  //     if (list.length < 1) {
  //         ctx.issues.push({ code: "custom", message: "Select at least 1 file", input: list });
  //     }
  //     //   console.log("list:")
  //     if (list.length > 1) {
  //         ctx.issues.push({ code: "custom", message: "You can upload up to 1 file", input: list });
  //     }
  // }).transform(list => Array.from(list)).refine(files => files.every(f => f.size <= maxSize), {
  //     message: `Max size ${maxSize / (1024 * 1024)}MB`,
  // })
  //     .refine(files => files.every(f => ALLOWED_MIME_TYPES.includes(f.type)), {
  //         message: "Invalid file types detected",
  //     }),
});

export type TTestimonialForm = z.infer<typeof formSchema>;

const TestimonialForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: ITestimonialFormProps) => {
  const [previews, setPreviews] = useState<string | null>(null);
  const transformInitialData = (
    data?: TTestimonialFormData,
  ): TTestimonialFormData | undefined => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)

    return {
      name: data?.customerName || "",
      message: data?.content || "",
      photo: data?.customerImage || null,
      rating: data?.rating,
      isFeatured: data?.isFeatured || false,
    };
  };

  const form = useForm<TTestimonialForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      name: "",
      message: "",
      photo: null,
      rating: 1,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (initialData?.customerImage) {
      setPreviews(initialData?.customerImage);
      form.setValue("photo", initialData?.customerImage);
    }
  }, [initialData, form.setValue]);
  const handleFormSubmit: SubmitHandler<TTestimonialFormData> = async (
    data: TTestimonialFormData,
  ) => {
    console.log("data:", data);
    try {
      await onSubmit(data);
      form.reset();
      setPreviews(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(handleFormSubmit)(e)}>
        {/* fleet Details */}
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="name" className="text-base-black gap-0">
                  Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="name"
                        type="text"
                        placeholder="Customer Name"
                        disabled={isFieldDisabled(disabledFields, "name")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconUser />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter the customer’s full name.
                </FieldDescription>

                {form.formState.errors.name && (
                  <FormMessage>
                    {form.formState.errors.name.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="message" className="text-base-black gap-0">
                  Message
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="message"
                        type="text"
                        placeholder="Write Message"
                        disabled={isFieldDisabled(disabledFields, "message")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMessageCircle />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your message here.</FieldDescription>

                {form.formState.errors.message && (
                  <FormMessage>
                    {form.formState.errors.message.message}
                  </FormMessage>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="rating" className="text-base-black gap-0">
                  Rating
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="rating"
                        type="number"
                        placeholder="Rating"
                        disabled={isFieldDisabled(disabledFields, "rating")}
                        {...field}
                        min={1}
                        max={5}
                      />
                      <InputGroupAddon>
                        <IconStar />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the rating value.</FieldDescription>

                {form.formState.errors.rating && (
                  <FormMessage>
                    {form.formState.errors.rating.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="justify-between">
                <FieldLabel
                  htmlFor="isFeatured"
                  className="text-base-black gap-0"
                >
                  Is Featured
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Checkbox
                      className="w-4 max-w-4 !mt-auto"
                      id="isFeatured"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />

                <FieldDescription className="!mt-auto">
                  Toggle to mark this item as featured.
                </FieldDescription>

                {form.formState.errors.isFeatured && (
                  <FormMessage>
                    {form.formState.errors.isFeatured.message}
                  </FormMessage>
                )}
              </Field>

              <Controller
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormControl>
                      <ImagesUpload
                        accept="image/*"
                        title="Upload Image"
                        maxSize={10}
                        multiple={true}
                        onFilesSelected={(files) => {
                          if (files && files.length > 0) {
                            const file = files[0];
                            field.onChange(file);
                            form.trigger("photo");
                            setPreviews(file.preview || null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.photo?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex items-center justify-start space-x-2.5">
              <Button
                variant="outlinePrimary"
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
                Clear Alls
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default TestimonialForm;

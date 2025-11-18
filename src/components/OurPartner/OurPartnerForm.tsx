// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { IconBuilding } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { IOurPartnerFormProps } from "@/types/ourPartner.type";
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
  companyName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Company Name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Company Name must be at least 3 characters" }),
  url: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "URL  cannot be empty or just whitespace.",
    })
    .min(3, { message: "URL  must be at least 3 characters" }),
  photo: z
    .any()
    .refine((file) => file instanceof File, { message: "Select an image" })
    .refine((file) => !file || file.size <= MAX_SIZE, {
      message: "Max size is 5MB",
    })
    .refine((file) => !file || ALLOWED_MIME_TYPES.includes(file.type), {
      message: "Invalid file type. Only accept jpeg and png file",
    }),
});

export type TOurPartnerForm = z.infer<typeof formSchema>;
const OurPartnerForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: IOurPartnerFormProps) => {
  const [previews, setPreviews] = useState<string | null>(null);
  const transformInitialData = (
    data?: TOurPartnerForm,
  ): TOurPartnerForm | undefined => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)
    return {
      companyName: data?.companyName,
      url: data?.url,
      photo: data?.logoUrl || null,
    };
  };
  const fileRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<TOurPartnerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      companyName: "",
      url: "",
      photo: null,
    },
  });

  const handleFormSubmit: SubmitHandler<TOurPartnerForm> = async (
    data: TOurPartnerForm,
  ) => {
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
                <FieldLabel
                  htmlFor="companyName"
                  className="text-base-black gap-0"
                >
                  Company Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="companyName"
                        type="text"
                        placeholder="Enter a Company Name"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "companyName",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBuilding />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your CompanyName here.
                </FieldDescription>

                {form.formState.errors.CompanyName && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.CompanyName.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="url" className="text-base-black gap-0">
                  URL
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="url"
                        type="text"
                        placeholder="Enter a URL"
                        disabled={isFieldDisabled(disabledFields, "url")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBuilding />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your Url here.</FieldDescription>

                {form.formState.errors.url && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.url.message}
                  </p>
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
                    <FormMessage className="mt-1 text-base-danger">
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

export default OurPartnerForm;

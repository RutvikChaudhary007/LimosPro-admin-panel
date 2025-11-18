// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandSkype,
  IconBrandWhatsapp,
  IconKey,
  IconLocation,
  IconMail,
  IconPaywall,
  IconPhone,
} from "@tabler/icons-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { ISettingFormProps } from "@/types/settings.type";
import isFieldDisabled from "@/utils/disableFormField";
import type { TSetting } from "../table/column";
import { Button } from "../ui/button";
import { Card, CardBody, CardContent, CardFooter } from "../ui/card";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Form } from "../ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

const formSchema = z.object({
  paymentId: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Payment ID cannot be empty or just whitespace.",
    })
    .min(3, { message: "Payment ID must be at least 3 characters" }),
  location: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Location cannot be empty or just whitespace.",
    })
    .min(3, { message: "Location must be at least 3 characters" }),
  email: z.email(),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^\d+$/, { message: "Must be number" })
    .transform((v) => Number(v))
    .refine((n) => n >= 0, { message: "Must be non‑negative" })
    .nullable(),
  whatsapp: z
    .string()
    .min(1, { message: "Whatsapp number is required" })
    .regex(/^\d+$/, { message: "Must be number" })
    .transform((v) => Number(v))
    .refine((n) => n >= 0, { message: "Must be non‑negative" })
    .nullable(),
  skype: z
    .string()
    .min(1, { message: "skype number or Id is required" })
    .optional(),
  // .regex(/^\d+$/, { message: "Must be number" })
  // .transform((v) => Number(v))
  // .refine((n) => n >= 0, { message: "Must be non‑negative" }),
  paymentSecretKey: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Payment secret key cannot be empty or just whitespace.",
    })
    .min(3, { message: "Payment secret key must be at least 3 characters" }),
});

export type TSettingForm = z.infer<typeof formSchema>;

const SettingForm = ({
  type,
  initialData,
  onSubmit,
  disabledFields,
}: ISettingFormProps) => {
  const transformInitialData = (data?: TSetting): TSettingForm | undefined => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)
    return {
      email: data?.email,
      location: data?.location,
      paymentId: data?.paymentId,
      paymentSecretKey: data?.paymentSecretKey,
      phone: data?.phone,
      skype: data?.skype,
      whatsapp: data?.whatsapp,
    };
  };
  const form = useForm<TSettingForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      paymentId: "",
      location: "",
      email: "",
      phone: null,
      whatsapp: null,
      skype: "",
      paymentSecretKey: "",
    },
  });

  const handleFormSubmit: SubmitHandler<TSettingForm> = async (
    data: TSettingForm,
  ) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {/* Setting Details */}
        <Card>
          <CardBody>
            <CardContent className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="email" className="text-base-black gap-0">
                  Email
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="text"
                        placeholder="info@aadmirals.com"
                        disabled={isFieldDisabled(disabledFields, "email")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconMail />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your email address here.
                </FieldDescription>

                {form.formState.errors.email && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="location"
                  className="text-base-black gap-0"
                >
                  Location
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="location"
                        type="text"
                        placeholder="Kingsbrook Rd, Houston, TX 77024"
                        disabled={isFieldDisabled(disabledFields, "location")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconLocation />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your location here.</FieldDescription>

                {form.formState.errors.location && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="phone" className="text-base-black gap-0">
                  Phone
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="phone"
                        type="text"
                        placeholder="3468574294"
                        disabled={isFieldDisabled(disabledFields, "phone")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconPhone />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your phone number here.
                </FieldDescription>

                {form.formState.errors.phone && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="whatsapp"
                  className="text-base-black gap-0"
                >
                  Whatsapp
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="whatsapp"
                        type="text"
                        placeholder="3468574294"
                        disabled={isFieldDisabled(disabledFields, "whatsapp")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBrandWhatsapp />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your Whatsapp number here.
                </FieldDescription>

                {form.formState.errors.whatsapp && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.whatsapp.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="skype" className="text-base-black gap-0">
                  Skype
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="skype"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="skype"
                        type="text"
                        placeholder="3468574294"
                        disabled={isFieldDisabled(disabledFields, "skype")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconBrandSkype />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your Skype ID here.</FieldDescription>

                {form.formState.errors.skype && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.skype.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="paymentId"
                  className="text-base-black gap-0"
                >
                  Payment ID
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="paymentId"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="paymentId"
                        type="text"
                        placeholder="Payment ID"
                        disabled={isFieldDisabled(disabledFields, "paymentId")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconPaywall />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter your payment ID here.</FieldDescription>

                {form.formState.errors.paymentId && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.paymentId.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="paymentSecretKey"
                  className="text-base-black gap-0"
                >
                  Payment Secret Key
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="paymentSecretKey"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="paymentSecretKey"
                        type="text"
                        placeholder="Payment Secret Key"
                        disabled={isFieldDisabled(
                          disabledFields,
                          "paymentSecretKey",
                        )}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconKey />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter your payment secret key here.
                </FieldDescription>

                {form.formState.errors.paymentSecretKey && (
                  <p className="text-base-danger mt-1">
                    {form.formState.errors.paymentSecretKey.message}
                  </p>
                )}
              </Field>
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

export default SettingForm;

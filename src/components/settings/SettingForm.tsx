// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { ISettingFormProps } from "@/types/settings.type";
import isFieldDisabled from "@/utils/disableFormField";
import type { TSetting } from "../table/column";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

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
  skype: z.string().min(1, { message: "skype number or Id is required" }).optional(),
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

const SettingForm = ({ initialData, onSubmit, disabledFields }: ISettingFormProps) => {
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

  const handleFormSubmit: SubmitHandler<TSettingForm> = async (data: TSettingForm) => {
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
        <Card className="overflow-y-auto rounded">
          {/* <CardHeader>
                         <CardTitle></CardTitle>
                     </CardHeader> */}
          <CardContent className="grid grid-cols-6 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="info@aadmirals.com"
                      disabled={isFieldDisabled(disabledFields, "email")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.email ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Location</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="Kingsbrook Rd, Houston, TX 77024"
                      disabled={isFieldDisabled(disabledFields, "location")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.location ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.location?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2 col-start-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input placeholder="3468574294" disabled={isFieldDisabled(disabledFields, "phone")} {...field} />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.phone ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.phone?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Whatsapp</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input placeholder="3468574294" disabled={isFieldDisabled(disabledFields, "whatsapp")} {...field} />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.whatsapp ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.whatsapp?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skype"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Skype</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input placeholder="3468574294" disabled={isFieldDisabled(disabledFields, "skype")} {...field} />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.whatsapp ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.skype?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentId"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Payment ID</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="Payment ID"
                      disabled={isFieldDisabled(disabledFields, "paymentId")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.paymentId ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.paymentId?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentSecretKey"
              render={({ field }) => (
                <FormItem className="col-span-2 ">
                  <FormLabel>Payment Secret Key</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="Payment Secret Key"
                      disabled={isFieldDisabled(disabledFields, "paymentSecretKey")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${
                      form.formState.errors.paymentSecretKey ? "visible text-red-600" : "invisible"
                    }`}
                  >
                    {form.formState.errors.paymentSecretKey?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </CardContent>
          <div className="flex items-center justify-start rounded px-6 space-x-2.5">
            <Button
              className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50"
              variant={"secondary"}
              type="button"
              onClick={() => {
                form.reset();
              }}
            >
              Clear Alls
            </Button>
            <Button
              className="cursor-pointer rounded w-[124px] h-[39px] px-6 py-2.5 bg-[#E4E4E4] active:scale-50"
              variant={"secondary"}
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default SettingForm;

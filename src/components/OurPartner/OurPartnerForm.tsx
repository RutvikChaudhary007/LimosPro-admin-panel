// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import type { IOurPartnerFormProps } from "@/types/ourPartner.type";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

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
        <Card className="overflow-y-auto rounded">
          <CardHeader>
            <CardTitle>{type}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 gap-5">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="Company Name"
                      disabled={isFieldDisabled(disabledFields, "companyName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.companyName ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.companyName?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1">
                  <FormLabel>URL</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="https://biz.yelp.com/biz_info/7uwU7YiWZo6xjrSCrLV9pg"
                      disabled={isFieldDisabled(disabledFields, "url")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors?.url ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.url?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              defaultValue={null}
              render={({ field }) => (
                <FormItem className="col-span-6 rounded">
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    {/* Hidden File Input */}
                    <Input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file); // Sync with react-hook-form
                          form.trigger("photo");
                          const url = URL.createObjectURL(file);
                          setPreviews(url);
                        }
                      }}
                    />
                  </FormControl>
                  {/* Image Previews */}
                  <div className="mt-2 flex gap-3">
                    {previews && (
                      <div className="relative w-28 h-28 bg-[#D9D9D9] flex items-center justify-center rounded-md overflow-hidden">
                        <img
                          src={previews}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviews(null);
                            field.onChange(null); // Clear file in form
                            if (previews) URL.revokeObjectURL(previews); // Free memory
                          }}
                          className="cursor-pointer absolute top-1 right-1 bg-white rounded p-1"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    )}
                    {!previews && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-28 h-28 cursor-pointer border border-dashed border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="h-6 w-6 text-gray-500" />
                      </button>
                    )}
                  </div>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.photo ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.photo &&
                    typeof form.formState.errors.photo.message === "string"
                      ? form.formState.errors.photo.message
                      : null}
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

export default OurPartnerForm;

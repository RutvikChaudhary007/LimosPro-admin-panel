// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";
import type { ITestimonialFormProps, TTestimonialFormData } from "@/types/testimonial.type";
import isFieldDisabled from "@/utils/disableFormField";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

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
  rating: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(1).max(5)),
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

const TestimonialForm = ({ initialData, onSubmit, disabledFields, type }: ITestimonialFormProps) => {
  const [previews, setPreviews] = useState<string | null>(null);
  const transformInitialData = (data?: TTestimonialFormData): TTestimonialFormData | undefined => {
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
  useEffect(() => {
    if (initialData?.customerImage) {
      setPreviews(initialData?.customerImage);
      form.setValue("photo", initialData?.customerImage);
    }
  }, [initialData]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<TTestimonialForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      name: "",
      message: "",
      photo: null,
      rating: 0,
      isFeatured: false,
    },
  });

  const handleFormSubmit: SubmitHandler<TTestimonialFormData> = async (data: TTestimonialFormData) => {
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
        <Card className="overflow-y-auto rounded">
          <CardHeader>
            <CardTitle>{type}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-6 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input placeholder="Customer Name" disabled={isFieldDisabled(disabledFields, "name")} {...field} />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors.name ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1">
                  <FormLabel>Message</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      placeholder="Write Message"
                      disabled={isFieldDisabled(disabledFields, "message")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors?.message ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.message?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1">
                  <FormLabel>Rating</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium">
                    <Input
                      type="number"
                      placeholder="Rating"
                      disabled={isFieldDisabled(disabledFields, "rating")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors?.rating ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.rating?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="col-span-3 col-start-1 flex items-center">
                  <FormLabel>Is Featured</FormLabel>
                  <FormControl className="px-3 py-4 rounded placeholder:text-[#E6E6E6] font-medium ">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        return field.onChange(checked);
                      }}
                      className={cn(
                        "p-1 rounded border border-gray-400",
                        "data-[state=checked]:bg-[#939393] ",
                        "data-[state=checked]:text-white",
                        "flex items-center justify-center",
                      )}
                    />
                  </FormControl>
                  <FormMessage
                    className={`mt-1 h-5 ${form.formState.errors?.isFeatured ? "visible text-red-600" : "invisible"}`}
                  >
                    {form.formState.errors.isFeatured?.message}
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
                        <img src={previews} alt="preview" className="object-cover w-full h-full" />
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
                    {form.formState.errors.photo?.message}
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

export default TestimonialForm;

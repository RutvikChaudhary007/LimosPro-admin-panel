//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import isFieldDisabled from "@/utils/disableFormField";
import "react-quill/dist/quill.snow.css"; // or 'quill.bubble.css'
// import { Plus } from "lucide-react";
// import { Label } from "../ui/label";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const formSchema = z.object({
  pageTitle: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Page title cannot be empty or just whitespace.",
    })
    .min(3, { message: "Page title must be at least 3 characters" }),
  metaTitle: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Meta title cannot be empty or just whitespace.",
    })
    .min(3, { message: "Meta title must be at least 3 characters" }),
  metaDescription: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Meta description cannot be empty or just whitespace.",
    })
    .min(3, { message: "Meta description must be at least 3 characters" }),
  blockType: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Block type cannot be empty or just whitespace.",
    })
    .min(3, { message: "Block type must be at least 3 characters" }),
  pageName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Page name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Page name must be at least 3 characters" }),
  sectionName: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Section name cannot be empty or just whitespace.",
    })
    .min(3, { message: "Section name must be at least 3 characters" }),
  sortOrder: z
    .string()
    .regex(/^\d+$/, "Only digits are allowed")
    .transform(Number),
  //   .transform((val:string):number => Number(val)),
  content: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Content be empty or just whitespace.",
    })
    .min(3),
});

export type TContentForm = z.infer<typeof formSchema>;

const ContentManagementForm = ({
  initialData,
  onSubmit,
  disabledFields,
  type,
}: {
  initialData?: object;
  onSubmit: (data: TContentForm) => Promise<void>;
  disabledFields?: [];
  type: string;
}) => {
  const transformInitialData = (data?: TContentForm) => {
    if (!data) return undefined;
    // console.log("edit chauffeur formdata:>",data)
    return {
      blockType: data?.blockType,
      pageName: data?.pageName,
      sectionName: data?.sectionName,
      sortOrder: data?.sortOrder,
      content: data?.content,
    };
  };
  const form = useForm<TContentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: transformInitialData(initialData) || {
      metaDescription: "",
      metaTitle: "",
      pageTitle: "",
      blockType: "",
      pageName: "",
      sectionName: "",
      sortOrder: 0,
      content: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      toast.error(error);
    }
  };
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card className="rounded  bg-[#FDFDFD] hover:outline-none shadow-[#F1F1F1] shadow-base-md">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{type}</CardTitle>
            <div className="w-[258px] flex items-center justify-between">
              <Button
                type="button"
                onClick={() => form.clearErrors()}
                className="bg-[#E4E4E4] text-[#515151] hover:text-white w-[124px] h-[39px] px-2.5 py-6 font-medium"
              >
                Clear All
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                variant="secondary"
                className="text-[#515151] rounded text-center px-2.5 py-6 bg-[#E4E4E4] text-sm font-medium  border-none cursor-pointer select-none mx-6 w-[124px] h-[39px]"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="pageTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[31px] ">
                  <FormLabel>Page Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="Page Title"
                      disabled={isFieldDisabled(disabledFields, "pageTitle")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[31px]  ">
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="Meta Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col  gap-3 mb-[31px] col-span-2">
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="Meta Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="broder bg-black col-span-2" />
            <FormField
              control={form.control}
              name="blockType"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[31px] col-span-2">
                  <FormLabel>Block Type</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="Block Type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pageName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[31px] col-span-2">
                  <FormLabel>Page Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="Home"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sectionName"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[31px] col-span-2">
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="sectionName"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[31px] col-span-2">
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-[#FFFFFF] placeholder:text-[#E6E6E6] rounded shadow shadow-[#D9D9D9]"
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-[60px] col-span-2">
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <ReactQuill
                      className="col-span-2"
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      formats={formats}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Label className="font-medium h-[22px]"><Plus className="w-5 h-5" /> <span className="">Add Field</span></Label> */}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default ContentManagementForm;

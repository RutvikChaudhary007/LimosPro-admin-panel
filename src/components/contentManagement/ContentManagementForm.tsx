//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText, IconGridPattern, IconSort09 } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { Form, FormMessage } from "@/components/ui/form";
import isFieldDisabled from "@/utils/disableFormField";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

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
    "indent",
    "link",
    "image",
    "video",
  ];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{type}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-6 gap-4">
              <Field className="col-span-3">
                <FieldLabel
                  htmlFor="pageTitle"
                  className="text-base-black gap-0"
                >
                  Page Title
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="pageTitle"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pageTitle"
                        type="text"
                        placeholder="Page Title"
                        disabled={isFieldDisabled(disabledFields, "pageTitle")}
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconFileText />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the page title.</FieldDescription>

                {form.formState.errors.pageTitle && (
                  <FormMessage>
                    {form.formState.errors.pageTitle.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-3">
                <FieldLabel
                  htmlFor="metaTitle"
                  className="text-base-black gap-0"
                >
                  Meta Title
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="metaTitle"
                        type="text"
                        placeholder="Meta Title"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconFileText /> {/* Example icon for meta title */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter the meta title for SEO.
                </FieldDescription>

                {form.formState.errors.metaTitle && (
                  <FormMessage>
                    {form.formState.errors.metaTitle.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-full">
                <FieldLabel
                  htmlFor="metaDescription"
                  className="text-base-black gap-0"
                >
                  Meta Description
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="metaDescription"
                        type="text"
                        placeholder="Meta Description"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconFileText />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter the meta description for SEO.
                </FieldDescription>

                {form.formState.errors.metaDescription && (
                  <FormMessage>
                    {form.formState.errors.metaDescription.message}
                  </FormMessage>
                )}
              </Field>

              <FieldSeparator className="col-span-full" />

              <Field className="col-span-3">
                <FieldLabel
                  htmlFor="blockType"
                  className="text-base-black gap-0"
                >
                  Block Type
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="blockType"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="blockType"
                        type="text"
                        placeholder="Block Type"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconGridPattern />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the block type.</FieldDescription>

                {form.formState.errors.blockType && (
                  <FormMessage>
                    {form.formState.errors.blockType.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-3">
                <FieldLabel
                  htmlFor="pageName"
                  className="text-base-black gap-0"
                >
                  Page Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="pageName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="pageName"
                        type="text"
                        placeholder="Home"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconFileText />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the page name.</FieldDescription>

                {form.formState.errors.pageName && (
                  <FormMessage>
                    {form.formState.errors.pageName.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-3">
                <FieldLabel
                  htmlFor="sectionName"
                  className="text-base-black gap-0"
                >
                  Section Name
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="sectionName"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="sectionName"
                        type="text"
                        placeholder="sectionName"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconFileText /> {/* Example icon for section name */}
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>Enter the section name.</FieldDescription>

                {form.formState.errors.sectionName && (
                  <FormMessage>
                    {form.formState.errors.sectionName.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-3">
                <FieldLabel
                  htmlFor="sortOrder"
                  className="text-base-black gap-0"
                >
                  Sort Order
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupInput
                        id="sortOrder"
                        type="number"
                        placeholder="1"
                        {...field}
                      />
                      <InputGroupAddon>
                        <IconSort09 />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                />

                <FieldDescription>
                  Enter the sort order number.
                </FieldDescription>

                {form.formState.errors.sortOrder && (
                  <FormMessage>
                    {form.formState.errors.sortOrder.message}
                  </FormMessage>
                )}
              </Field>

              <Field className="col-span-full">
                <FieldLabel htmlFor="content" className="text-base-black gap-0">
                  Content
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <ReactQuill
                      id="content"
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      formats={formats}
                      className="react-quill-full"
                    />
                  )}
                />

                <FieldDescription>
                  Enter the full content here.
                </FieldDescription>

                {form.formState.errors.content && (
                  <FormMessage>
                    {form.formState.errors.content.message}
                  </FormMessage>
                )}
              </Field>
            </CardContent>
            <CardFooter className="flex items-center justify-start space-x-2.5">
              <Button
                type="button"
                variant="outlinePrimary"
                onClick={() => form.clearErrors()}
              >
                Clear All
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Saving..." : "Save Details"}
              </Button>
            </CardFooter>
          </CardBody>
        </Card>
      </form>
    </Form>
  );
};

export default ContentManagementForm;

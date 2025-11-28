import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Save, X } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import UsefetchAllUsers from "@/api/getAllUser.api";
import useFetchAllMetaKeywords from "@/api/metaKeyWord.api";
import useFetchAllTags from "@/api/tag.api";
import { AutoCompleteInput } from "@/components/AutoCompleteInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import type { BlogPost } from "@/types/content";
import UploadWithUrl from "../ui/upload-with-url";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import * as z from "zod";
import { styledLog } from "@/utils/styledLog";
import { Form, FormMessage } from "../ui/form";

const imageSchema = z.union([z.string(), z.instanceof(File)]);

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: imageSchema.optional().or(z.literal("")),
  images: z.array(imageSchema).optional(),
  status: z.enum(["draft", "published", "archived"]),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metaKeywords: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: imageSchema.optional().or(z.literal("")),
});

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

export type BlogPostForm = z.infer<typeof blogPostSchema>;

interface IBlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: FormData) => Promise<void>;
  mode?: "create" | "edit";
  loading?: boolean;
}

const transformInitialData = (data?: BlogPost): BlogPostForm | undefined => {
  if (!data) return undefined;

  // Helper to extract URL from image field which might be string or object
  const getImageUrl = (img: any): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.url || "";
  };

  return {
    title: data?.title || "",
    content: data?.content || "",
    excerpt: data?.excerpt || "",
    featuredImage: getImageUrl(data?.featuredImage),
    images: Array.isArray(data?.images)
      ? data.images.map(getImageUrl).filter(Boolean)
      : [],
    slug: data?.slug || "",
    status: (data?.status as "draft" | "published" | "archived") || "draft",
    authorId: data?.blogAuthor?.userId ?? data?.authorId ?? data?.author ?? "",
    tags: data?.tags || [],
    metaKeywords: data?.seo?.metaKeywords || [],
    metaTitle: data?.seo?.metaTitle || "",
    metaDescription: data?.seo?.metaDescription || "",
    canonicalUrl: data?.seo?.canonicalUrl || "",
    ogImage: getImageUrl(data?.seo?.ogImage),
  };
};

const BlogForm: FC<IBlogFormProps> = ({
  initialData,
  onSubmit,
  mode = "create",
  loading = false,
}) => {
  // Local state for AutoCompleteInput components
  const [keywordInput, setKeywordInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const keywordSuggestions = [
    "SEO",
    "Search Engine Optimization",
    "Social Media",
    "Social Marketing",
    "Marketing",
    "Market Research",
    "Google",
    "Google Ads",
    "Google Analytics",
    "Content",
    "Content Writing",
    "Content Strategy",
    "Copywriting",
    "Conversion Rate",
    "Campaign Management",
    "Customer Engagement",
    "Email Marketing",
    "Ecommerce",
    "Brand Strategy",
    "Business Growth",
  ];

  const tagSuggestions = [
    "Tech",
    "Technology",
    "Tech News",
    "Trending",
    "Trends",
    "Travel",
    "News",
    "Networking",
    "Nature",
    "Sports",
    "Soccer",
    "Science",
    "Startup",
    "AI",
    "Artificial Intelligence",
    "Automation",
    "Analytics",
    "Lifestyle",
    "Learning",
    "Leadership",
    "Local",
    "Health",
    "History",
    "Finance",
    "Food",
  ];

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});
  const { data: tagsData } = useFetchAllTags({});
  const { data: usersData, isFetching: userIsFetching } = UsefetchAllUsers({
    DateRange: { startDate: undefined, endDate: undefined },
    limit: 100,
    queryOptions: {
      staleTime: 0,
      gcTime: 0,
    },
  });

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    roleName: string;
  }

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: transformInitialData(initialData) || {
      status: "draft",
      tags: [],
      metaKeywords: [],
      images: [],
    },
  });
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (newTitle && mode === "create") {
      setValue("slug", generateSlug(newTitle));
    }
  };

  const handleFormSubmit = async (data: BlogPostForm) => {
    try {
      const formdata = new FormData();

      // Basic fields
      formdata.append("title", data.title);
      formdata.append("content", data.content);
      formdata.append("excerpt", data.excerpt || "");
      formdata.append("slug", data.slug);
      formdata.append("status", data.status);
      formdata.append("authorId", data.authorId || "");

      // Featured Image - handle File or URL string
      if (data.featuredImage) {
        if (data.featuredImage instanceof File) {
          formdata.append("featuredImage", data.featuredImage);
        } else if (typeof data.featuredImage === "string") {
          formdata.append("featuredImage", data.featuredImage);
        }
      }

      // Blog Images - handle File array or URL string array
      if (data?.images && Array.isArray(data.images)) {
        const imageFiles: File[] = [];
        const imageUrls: string[] = [];

        data.images.forEach((item) => {
          if (item instanceof File) {
            imageFiles.push(item);
          } else if (typeof item === "string") {
            imageUrls.push(item);
          }
        });

        // Append files individually
        imageFiles.forEach((file) => {
          formdata.append("images", file);
        });

        // Append URLs as a single JSON string to satisfy backend validation
        if (imageUrls.length > 0) {
          const urlObjects = imageUrls.map((url) => ({ url }));
          formdata.append("images", JSON.stringify(urlObjects));
        }
      }

      // Tags - append as JSON string or individually
      if (data.tags && data.tags.length > 0) {
        formdata.append("tags", JSON.stringify(data.tags));
      }

      // SEO fields
      const seoData = {
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords: data.metaKeywords || [],
        canonicalUrl: data.canonicalUrl || "",
      };

      formdata.append("seo", JSON.stringify(seoData));

      await onSubmit(formdata);
    } catch (error) {
      styledLog(error, "Error submitting blog post:", "danger");
      toast.error("Error submitting blog post");
    }
  };

  const isEditMode = mode === "edit";
  const buttonLabel =
    watch("status") === "published"
      ? loading
        ? isEditMode
          ? "Updating..."
          : "Publishing..."
        : isEditMode
          ? "Update & Publish"
          : "Publish Post"
      : loading
        ? isEditMode
          ? "Updating..."
          : "Drafting..."
        : isEditMode
          ? "Update Draft"
          : "Draft Post";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Please check the form for errors");
        })}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel
                      htmlFor="title"
                      className="text-base-black gap-0"
                    >
                      Title <span className="text-base-danger">*</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroupInput
                            id="title"
                            type="text"
                            placeholder="Enter blog post title"
                            {...field}
                            onChange={handleTitleChange}
                            className={errors.title ? "border-base-danger" : ""}
                          />
                          <InputGroupAddon>
                            <IconFileText />
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    />
                    <FieldDescription>Enter the Title here.</FieldDescription>

                    {errors.title && (
                      <FormMessage>{errors.title.message}</FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="slug"
                      className="text-base-black gap-0"
                    >
                      Slug <span className="text-base-danger">*</span>
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <InputGroup>
                          <InputGroupInput
                            id="slug"
                            type="text"
                            placeholder="Enter blog post slug"
                            {...field}
                            className={errors.slug ? "border-base-danger" : ""}
                          />
                          <InputGroupAddon>
                            <IconFileText />
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    />
                    <FieldDescription>Enter the Slug here.</FieldDescription>

                    {errors.slug && (
                      <FormMessage>{errors.slug.message}</FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="excerpt"
                      className="text-base-black gap-0"
                    >
                      Excerpt <span className="text-base-danger">*</span>
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <ReactQuill
                          id="excerpt"
                          theme="snow"
                          value={(field.value as string) || ""}
                          onChange={(val) => {
                            field.onChange(val);
                          }}
                          modules={modules}
                          formats={formats}
                          className={`react-quill-full ${errors.excerpt ? "border-base-danger" : ""}`}
                        />
                      )}
                    />

                    <FieldDescription>
                      Enter a short description of the blog post.
                    </FieldDescription>

                    {errors.excerpt && (
                      <FormMessage>{errors.excerpt.message}</FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="content"
                      className="text-base-black gap-0"
                    >
                      Content <span className="text-base-danger">*</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <ReactQuill
                          id="content"
                          theme="snow"
                          value={(field.value as string) || ""}
                          onChange={(val) => {
                            field.onChange(val);
                          }}
                          modules={modules}
                          formats={formats}
                          className={`react-quill-full ${errors.content ? "border-base-danger" : ""}`}
                        />
                      )}
                    />

                    <FieldDescription>
                      Enter the full blog content here.
                    </FieldDescription>

                    {errors.content && (
                      <FormMessage>{errors.content.message}</FormMessage>
                    )}
                  </Field>
                </CardContent>
              </CardBody>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
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
                            placeholder="SEO title for search engines"
                            {...field}
                            className={
                              errors.metaTitle ? "border-base-danger" : ""
                            }
                          />
                          <InputGroupAddon>
                            <IconFileText />
                          </InputGroupAddon>
                        </InputGroup>
                      )}
                    />

                    <FieldDescription>
                      Enter the SEO title for this blog post.
                    </FieldDescription>

                    {errors.metaTitle && (
                      <FormMessage>{errors.metaTitle.message}</FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-base-black gap-0">
                      Meta Keywords
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name="metaKeywords"
                      render={({ field }) => {
                        const keywords = field.value || [];

                        const addKeyword = (kw: string) => {
                          if (!kw.trim() || keywords.includes(kw)) return;
                          field.onChange([...keywords, kw]);
                        };

                        const removeKeyword = (index: number) => {
                          field.onChange(
                            keywords.filter((_, i) => i !== index),
                          );
                        };

                        return (
                          <>
                            <AutoCompleteInput
                              value={keywordInput}
                              setValue={setKeywordInput}
                              list={
                                metaKeywordsData?.metaKeywords?.map(
                                  (k: { keyword: string }) => k.keyword,
                                ) || keywordSuggestions
                              }
                              onAdd={(kw) => {
                                addKeyword(kw);
                                setKeywordInput("");
                              }}
                              open={false}
                              setOpen={() => {}}
                              typingTimer={null}
                              setTypingTimer={() => {}}
                              placeholder="Add keyword"
                              inputId="keyword-input"
                            />
                            <FieldDescription>
                              Add SEO keywords here (type to search, press
                              Enter, or click +).
                            </FieldDescription>

                            {/* Keywords List */}
                            {keywords.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {keywords.map(
                                  (keyword: string, index: number) => (
                                    <Badge key={index} className="capitalize">
                                      <span>{keyword}</span>
                                      <span
                                        className="cursor-pointer"
                                        onClick={() => removeKeyword(index)}
                                      >
                                        <X className="size-4" />
                                      </span>
                                    </Badge>
                                  ),
                                )}
                              </div>
                            )}
                          </>
                        );
                      }}
                    />
                  </Field>

                  <Controller
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <UploadWithUrl
                        multiple={false}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </CardContent>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>
                    {isEditMode ? "Publish Settings" : "Settings"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <SelectDropDown
                      placeholder="Select Status"
                      items={[
                        { label: "Draft", value: "draft" },
                        { label: "Publish", value: "published" },
                        ...(isEditMode
                          ? [{ label: "Archived", value: "archived" }]
                          : []),
                      ]}
                      value={watch("status")}
                      setSelectedItem={(v) =>
                        setValue(
                          "status",
                          v as "draft" | "published" | "archived",
                          { shouldValidate: true },
                        )
                      }
                    />

                    {errors.status && (
                      <FormMessage>{errors.status.message}</FormMessage>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="author"
                      className="text-base-black gap-0"
                    >
                      Author
                    </FieldLabel>

                    {userIsFetching ? (
                      <div className="w-full h-14 skeleton rounded"></div>
                    ) : usersData?.users?.some(
                        (user: User) => user.roleName === "SEO Agent",
                      ) || initialData?.blogAuthor ? (
                      <Controller
                        name="authorId"
                        control={form.control}
                        render={({ field }) => (
                          <SelectDropDown
                            placeholder="Author Name"
                            items={(() => {
                              const options =
                                usersData?.users
                                  ?.filter(
                                    (user: User) =>
                                      user.roleName === "SEO Agent",
                                  )
                                  .map((user: User) => ({
                                    label: `${user.firstName} ${user.lastName}`,
                                    value: user.id,
                                  })) || [];

                              if (
                                initialData?.blogAuthor?.userId &&
                                !options.find(
                                  (o) =>
                                    o.value === initialData.blogAuthor?.userId,
                                )
                              ) {
                                options.push({
                                  label:
                                    initialData.blogAuthor.name ||
                                    "Current Author",
                                  value: initialData.blogAuthor.userId,
                                });
                              }
                              return options;
                            })()}
                            value={field.value}
                            setSelectedItem={(v) => field.onChange(v as string)}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        name="authorId"
                        control={form.control}
                        render={({ field }) => (
                          <InputGroup>
                            <InputGroupInput
                              id="authorId"
                              type="text"
                              placeholder="Author name"
                              {...field}
                              className={
                                errors.authorId ? "border-base-danger" : ""
                              }
                            />
                            <InputGroupAddon>
                              <IconFileText />
                            </InputGroupAddon>
                          </InputGroup>
                        )}
                      />
                    )}

                    <FieldDescription>
                      Enter the author's name.
                    </FieldDescription>

                    {errors.authorId && (
                      <FormMessage>{errors.authorId.message}</FormMessage>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant={
                      watch("status") === "published" ? "default" : "black"
                    }
                  >
                    <Save />
                    {buttonLabel}
                  </Button>
                </CardContent>
              </CardBody>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <UploadWithUrl
                        multiple={false}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </CardContent>
              </CardBody>
            </Card>

            {/* Blog Images */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Blog Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <UploadWithUrl
                        multiple={true}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </CardContent>
              </CardBody>
            </Card>

            {/* Tags */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <Field>
                    <FieldLabel className="text-base-black gap-0">
                      Tags
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name="tags"
                      render={({ field }) => {
                        const tags = field.value || [];

                        const addTag = (t: string) => {
                          if (!t || tags.includes(t)) return;
                          field.onChange([...tags, t]);
                        };

                        const removeTag = (index: number) => {
                          field.onChange(tags.filter((_, i) => i !== index));
                        };

                        return (
                          <>
                            <AutoCompleteInput
                              value={tagInput}
                              setValue={setTagInput}
                              list={
                                tagsData?.tags?.map(
                                  (k: { name: string }) => k.name,
                                ) || tagSuggestions
                              }
                              onAdd={(t) => {
                                addTag(t);
                                setTagInput("");
                              }}
                              open={false}
                              setOpen={() => {}}
                              typingTimer={null}
                              setTypingTimer={() => {}}
                              placeholder="Add tag"
                              inputId="tag-input"
                            />

                            <FieldDescription>
                              Add tags for this blog post (type to search, press
                              Enter, or click +)
                            </FieldDescription>

                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag: string, index: number) => (
                                  <Badge key={index} className="capitalize">
                                    <span>{tag}</span>
                                    <span
                                      className="cursor-pointer"
                                      onClick={() => removeTag(index)}
                                    >
                                      <X className="size-4" />
                                    </span>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      }}
                    />
                  </Field>
                </CardContent>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;

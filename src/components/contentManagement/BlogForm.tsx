//@ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Save, X } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import ImageUpload from "@/components/ui/image-upload";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import MultipleImageUpload from "@/components/ui/multiple-image-upload";
import { SelectDropDown } from "@/components/ui/select";
import type { BlogPost, BlogPostFormData } from "@/types/content";
import "react-quill/dist/quill.snow.css";
import * as z from "zod";
import { FormMessage } from "../ui/form";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().url().optional().or(z.literal("")),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long"),
  status: z.enum(["draft", "published", "archived"]),
  author: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
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

type BlogPostForm = z.infer<typeof blogPostSchema>;

interface IBlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  mode?: "create" | "edit";
  loading?: boolean;
}

const transformInitialData = (data?: BlogPost): BlogPostForm | undefined => {
  if (!data) return undefined;
  return {
    title: data?.title || "",
    content: data?.content || "",
    excerpt: data?.excerpt || "",
    featuredImage: data?.featuredImage || "",
    slug: data?.slug || "",
    status: (data?.status as "draft" | "published" | "archived") || "draft",
    author: data?.author || "",
    metaTitle: data?.seo?.metaTitle || "",
    metaDescription: data?.seo?.metaDescription || "",
    ogImage: data?.seo?.ogImage || "",
  };
};

const BlogForm: FC<IBlogFormProps> = ({
  initialData,
  onSubmit,
  mode = "create",
  loading = false,
}) => {
  const [blogImages, setBlogImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [metaKeywords, setMetaKeywords] = useState<string[]>(
    initialData?.seo?.metaKeywords || [],
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [keywordTypingTimer, setKeywordTypingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [tagTypingTimer, setTagTypingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

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
  });

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    roleName: string;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: transformInitialData(initialData) || {
      status: "draft",
    },
  });

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

  const addTag = (t: string) => {
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addKeyword = (kw: string = keywordInput) => {
    if (!kw.trim()) return;
    if (metaKeywords.includes(kw)) return;

    setMetaKeywords([...metaKeywords, kw]);
    setKeywordInput("");
    setKeywordOpen(false);
  };

  const removeKeyword = (index: number) => {
    setMetaKeywords(metaKeywords.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: BlogPostForm) => {
    const blogPostData: BlogPostFormData = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
      featuredImage: data.featuredImage || "",
      slug: data.slug,
      status: data.status,
      author: data.author || "",
      tags,
      images: blogImages,
      seo: {
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords,
        ogImage: data.ogImage || "",
      },
    };

    await onSubmit(blogPostData);
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  <FieldLabel htmlFor="title" className="text-base-black gap-0">
                    Title <span className="text-base-danger">*</span>
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      id="title"
                      type="text"
                      placeholder="Enter blog post title"
                      {...register("title")}
                      onChange={handleTitleChange}
                      className={errors.title ? "border-base-danger" : ""}
                    />
                    <InputGroupAddon>
                      <IconFileText />
                    </InputGroupAddon>
                  </InputGroup>

                  <FieldDescription>Enter the Title here.</FieldDescription>

                  {errors.title && (
                    <FormMessage>{errors.title.message}</FormMessage>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="slug" className="text-base-black gap-0">
                    Slug <span className="text-base-danger">*</span>
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      id="slug"
                      type="text"
                      placeholder="Enter blog post slug"
                      {...register("slug")}
                      className={errors.slug ? "border-base-danger" : ""}
                    />
                    <InputGroupAddon>
                      <IconFileText />
                    </InputGroupAddon>
                  </InputGroup>

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

                  <ReactQuill
                    id="excerpt"
                    theme="snow"
                    value={(watch("excerpt") as string) || ""}
                    onChange={(val) => {
                      setValue("excerpt", val, { shouldValidate: true });
                    }}
                    modules={modules}
                    formats={formats}
                    className={`react-quill-full ${errors.excerpt ? "border-base-danger" : ""}`}
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

                  <ReactQuill
                    id="content"
                    theme="snow"
                    value={(watch("content") as string) || ""}
                    onChange={(val) => {
                      setValue("content", val, { shouldValidate: true });
                    }}
                    modules={modules}
                    formats={formats}
                    className={`react-quill-full ${errors.content ? "border-base-danger" : ""}`}
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

                  <InputGroup>
                    <InputGroupInput
                      id="metaTitle"
                      type="text"
                      placeholder="SEO title for search engines"
                      {...register("metaTitle")}
                      className={errors.metaTitle ? "border-base-danger" : ""}
                    />
                    <InputGroupAddon>
                      <IconFileText />
                    </InputGroupAddon>
                  </InputGroup>

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

                  <AutoCompleteInput
                    value={keywordInput}
                    setValue={setKeywordInput}
                    list={
                      metaKeywordsData?.metaKeywords?.map(
                        (k: { keyword: string }) => k.keyword,
                      ) || keywordSuggestions
                    }
                    onAdd={(kw) => addKeyword(kw)}
                    open={keywordOpen}
                    setOpen={setKeywordOpen}
                    typingTimer={keywordTypingTimer}
                    setTypingTimer={setKeywordTypingTimer}
                    placeholder="Add keyword"
                    inputId="keyword-input"
                  />

                  <FieldDescription>
                    Add SEO keywords here (type to search, press Enter, or click
                    +).
                  </FieldDescription>

                  {/* Keywords List */}
                  {metaKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {metaKeywords.map((keyword, index) => (
                        <Badge key={index} className="capitalize">
                          <span>{keyword}</span>
                          <span
                            className="cursor-pointer"
                            onClick={() => removeKeyword(index)}
                          >
                            <X className="size-4" />
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </Field>

                <ImageUpload
                  label="Open Graph Image"
                  placeholder="Enter OG image URL or upload file"
                  value={watch("ogImage") || ""}
                  onChange={(url) => setValue("ogImage", url)}
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
                    ) ? (
                    <SelectDropDown
                      placeholder="Author Name"
                      items={
                        usersData.users
                          .filter((user: User) => user.roleName === "SEO Agent")
                          .map((user: User) => ({
                            label: `${user.firstName} ${user.lastName}`,
                            value: user.id,
                          })) || []
                      }
                      value={watch("author")}
                      setSelectedItem={(v) =>
                        setValue("author", v as string, {
                          shouldValidate: true,
                        })
                      }
                    />
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        id="author"
                        type="text"
                        placeholder="Author name"
                        {...register("author")}
                        className={errors.author ? "border-base-danger" : ""}
                      />
                      <InputGroupAddon>
                        <IconFileText />
                      </InputGroupAddon>
                    </InputGroup>
                  )}

                  <FieldDescription>Enter the author's name.</FieldDescription>

                  {errors.author && (
                    <FormMessage>{errors.author.message}</FormMessage>
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
                <ImageUpload
                  label="Featured Image"
                  placeholder="Enter featured image URL or upload file"
                  value={watch("featuredImage") || ""}
                  onChange={(url) => setValue("featuredImage", url)}
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
                <MultipleImageUpload
                  label="Additional Images"
                  value={blogImages}
                  onChange={setBlogImages}
                  maxImages={10}
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

                  <AutoCompleteInput
                    value={tagInput}
                    setValue={setTagInput}
                    list={
                      tagsData?.tags?.map((k: { name: string }) => k.name) ||
                      tagSuggestions
                    }
                    onAdd={(t) => addTag(t)}
                    open={tagOpen}
                    setOpen={setTagOpen}
                    typingTimer={tagTypingTimer}
                    setTypingTimer={setTagTypingTimer}
                    placeholder="Add tag"
                    inputId="tag-input"
                  />

                  <FieldDescription>
                    Add tags for this blog post (type to search, press Enter, or
                    click +)
                  </FieldDescription>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
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
                </Field>
              </CardContent>
            </CardBody>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;

import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { ArrowLeft, Save, X } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import useFetchAllMetaKeywords from "@/api/metaKeyWord.api";
import { AutoCompleteInput } from "@/components/AutoCompleteInput";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { styledLog } from "@/utils/styledLog";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { blogService } from "../../api/contentServices.api";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ImageUpload from "../../components/ui/image-upload";
import MultipleImageUpload from "../../components/ui/multiple-image-upload";
import { SelectDropDown } from "../../components/ui/select";
import { constant } from "../../lib/constant";
import type { BlogPostFormData } from "../../types/content";

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

const CreateBlogPostPage: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogImages, setBlogImages] = useState<string[]>([]);

  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [keywordTypingTimer, setKeywordTypingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const { data } = useFetchAllMetaKeywords({});

  styledLog(data, "Get Meta Key Words");

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

  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [tagTypingTimer, setTagTypingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
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
    if (newTitle) {
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

  const onSubmit = async (data: BlogPostForm) => {
    try {
      setLoading(true);

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

      await blogService.create(blogPostData);
      toast.success("Blog post created successfully");
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Blog Post"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Content Management" },
          {
            label: "Blog Posts",
            path: constant.ROUTING_URLS.BLOG_POSTS,
          },
          { label: "Create Blog Post" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.BLOG_POSTS,
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      <p className="text-base-danger mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="slug"
                      className="text-base-black gap-0"
                    >
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
                      <p className="text-base-danger mt-1">
                        {errors.slug.message}
                      </p>
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
                      <p className="text-base-danger mt-1">
                        {errors.excerpt.message}
                      </p>
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
                      <p className="text-base-danger mt-1">
                        {errors.content.message}
                      </p>
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
                      <p className="text-base-danger mt-1">
                        {errors.metaTitle.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-base-black gap-0">
                      Meta Keywords
                    </FieldLabel>

                    <AutoCompleteInput
                      value={keywordInput}
                      setValue={setKeywordInput}
                      list={keywordSuggestions}
                      onAdd={(kw) => addKeyword(kw)}
                      open={keywordOpen}
                      setOpen={setKeywordOpen}
                      typingTimer={keywordTypingTimer}
                      setTypingTimer={setKeywordTypingTimer}
                      placeholder="Add keyword"
                      inputId="keyword-input"
                    />

                    <FieldDescription>
                      Add SEO keywords here (type to search, press Enter, or
                      click +).
                    </FieldDescription>

                    {/* Keywords List */}
                    {metaKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {metaKeywords.map((keyword, index) => (
                          <Badge key={index}>
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
            {/* Publish Settings */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel
                      htmlFor="status"
                      className="text-base-black gap-0"
                    >
                      Status
                    </FieldLabel>

                    <SelectDropDown
                      placeholder="Select Status"
                      items={[
                        { label: "Draft", value: "draft" },
                        { label: "Published", value: "published" },
                        { label: "Archived", value: "archived" },
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
                      <p className="text-base-danger mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="author"
                      className="text-base-black gap-0"
                    >
                      Author
                    </FieldLabel>

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

                    <FieldDescription>
                      Enter the author's name.
                    </FieldDescription>

                    {errors.author && (
                      <p className="text-base-danger mt-1">
                        {errors.author.message}
                      </p>
                    )}
                  </Field>

                  <Button type="submit" disabled={loading}>
                    <Save />
                    {loading ? "Creating..." : "Create Post"}
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
                      list={tagSuggestions}
                      onAdd={(t) => addTag(t)}
                      open={tagOpen}
                      setOpen={setTagOpen}
                      typingTimer={tagTypingTimer}
                      setTypingTimer={setTagTypingTimer}
                      placeholder="Add tag"
                      inputId="tag-input"
                    />

                    <FieldDescription>
                      Add tags for this blog post (type to search, press Enter,
                      or click +)
                    </FieldDescription>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index}>
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
    </div>
  );
};

export default CreateBlogPostPage;

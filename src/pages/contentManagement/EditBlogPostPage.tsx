// @ts-nocheck

import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { blogService } from "@/api/contentServices.api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
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
import { Textarea } from "@/components/ui/textarea";
import { constant } from "@/lib/constant";
import type { BlogPost, BlogPostFormData } from "@/types/content";
import { SelectDropDown } from "../../components/ui/select";

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

type BlogPostForm = z.infer<typeof blogPostSchema>;

// `fetchBlogPost` moved inside the component so it can access state and setters
const EditBlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [blogImages, setBlogImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
  });

  // const title = watch('title');

  const fetchBlogPost = async () => {
    try {
      setFetchLoading(true);
      const response = await blogService.getById(id!);
      const post = response?.data;
      setBlogPost(post ?? null);

      // Set form values
      reset({
        title: post?.title ?? "",
        content: post?.content ?? "",
        excerpt: post?.excerpt ?? "",
        featuredImage: post?.featuredImage ?? "",
        slug: post?.slug ?? "",
        status: (post?.status ?? "draft") as any,
        author: post?.author ?? "",
        metaTitle: post?.seo?.metaTitle ?? "",
        metaDescription: post?.seo?.metaDescription ?? "",
        ogImage: post?.seo?.ogImage ?? "",
      });

      setTags(post?.tags ?? []);
      setMetaKeywords(post?.seo?.metaKeywords ?? []);
      setBlogImages(post?.images ?? []);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to fetch blog post");
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !metaKeywords.includes(keywordInput.trim())) {
      setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setMetaKeywords(metaKeywords.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BlogPostForm) => {
    try {
      setLoading(true);

      const blogPostData: Partial<BlogPostFormData> = {
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

      await blogService.update(id!, blogPostData);
      toast.success("Blog post updated successfully");
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast.error("Failed to update blog post");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Spinner />;
  }

  if (!blogPost) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Blog post not found
          </h3>
          <Button onClick={() => navigate(constant.ROUTING_URLS.BLOG_POSTS)}>
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      {/* Header */}
      <PageHeader
        title="Edit Blog Post"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Content Management" },
          {
            label: "Blog Posts",
            path: constant.ROUTING_URLS.BLOG_POSTS,
          },
          { label: "Edit Blog Post" },
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
                      Excerpt<span className="text-base-danger">*</span>
                    </FieldLabel>

                    <Textarea
                      id="excerpt"
                      {...register("excerpt")}
                      placeholder="Brief description of the blog post"
                      rows={3}
                      className={errors.excerpt ? "border-base-danger" : ""}
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

                    <Textarea
                      id="content"
                      {...register("content")}
                      placeholder="Write your blog post content here..."
                      rows={15}
                      className={errors.content ? "border-base-danger" : ""}
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
                    <FieldLabel
                      htmlFor="metaDescription"
                      className="text-base-black gap-0"
                    >
                      Meta Description
                    </FieldLabel>

                    <Textarea
                      id="metaDescription"
                      {...register("metaDescription")}
                      placeholder="Brief description for search engines"
                      rows={3}
                      className={
                        errors.metaDescription ? "border-base-danger" : ""
                      }
                    />

                    <FieldDescription>
                      Enter the SEO meta description for this blog post.
                    </FieldDescription>

                    {errors.metaDescription && (
                      <p className="text-base-danger mt-1">
                        {errors.metaDescription.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-base-black gap-0">
                      Meta Keywords
                    </FieldLabel>

                    {/* Input + Add Button */}
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Add keyword"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addKeyword())
                        }
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <Button
                          type="button"
                          onClick={addKeyword}
                          size="xl"
                          spacing="lg"
                        >
                          <Plus />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldDescription>
                      Add SEO keywords here (press Enter or click +).
                    </FieldDescription>

                    {/* Keywords List */}
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
                    {loading ? "Updating..." : "Update Post"}
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

                    {/* Input + Add Button */}
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <Button
                          type="button"
                          onClick={addTag}
                          size="xl"
                          spacing="lg"
                        >
                          <Plus />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldDescription>
                      Add tags for this blog post (press Enter or click +).
                    </FieldDescription>

                    {/* Tags List */}
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

export default EditBlogPostPage;

import { Archive, ArrowLeft } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { blogService } from "@/api";
import BlogForm from "@/components/contentManagement/BlogForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
import type { BlogPost } from "@/types/content";

const EditBlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const blogFormRef = useRef<{ archivePost: () => void }>(null);

  const fetchBlogPost = async () => {
    try {
      setFetchLoading(true);
      const response = await blogService.getById(id!);
      const post = response?.data;
      setBlogPost(post ?? null);
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

  const handleUpdateBlogPost = async (data: FormData) => {
    try {
      setLoading(true);
      await blogService.update(id!, data);
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
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.BLOG_POSTS,
        }}
        action={{
          variant: "outlineNavBtnSecondary",
          label: "Archive Post",
          icon: <Archive />,
          className: "border border-base-secondary",
          onClick: () => {
            blogFormRef.current?.archivePost();
          },
        }}
      />

      <BlogForm
        ref={blogFormRef}
        initialData={blogPost}
        onSubmit={handleUpdateBlogPost}
        mode="edit"
        loading={loading}
      />
    </div>
  );
};

export default EditBlogPostPage;

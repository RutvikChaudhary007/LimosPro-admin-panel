import axios from "axios";
import { ArrowLeft } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { blogService } from "@/api/contentServices.api";
import BlogForm from "@/components/contentManagement/BlogForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { constant } from "@/lib/constant";

const CreateBlogPostPage: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateBlogPost = async (data: FormData) => {
    try {
      setLoading(true);
      await blogService.create(data);
      toast.success("Blog post created successfully");
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      }

      console.error("Error creating blog post:", error);
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
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.BLOG_POSTS,
        }}
      />

      <BlogForm
        onSubmit={handleCreateBlogPost}
        mode="create"
        loading={loading}
      />
    </div>
  );
};

export default CreateBlogPostPage;

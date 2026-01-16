import axios from "axios";
import { Archive, ArrowLeft } from "lucide-react";
import type { FC } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import BlogForm from "@/components/contentManagement/BlogForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateBlogPostPage: FC = () => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const blogFormRef = useRef<{ archivePost: () => void }>(null);

  const createBlogPostMutation = queries.useCreateBlogPostMutation();
  const handleCreateBlogPost = async (data: FormData) => {
    try {
      await createBlogPostMutation.mutateAsync(data);
      toast.success("Blog post created successfully");
      // navigate(constant.ROUTING_URLS.BLOG_POSTS); // Handled by mutation hook
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
        onSubmit={handleCreateBlogPost}
        mode="create"
        loading={loading}
      />
    </div>
  );
};

export default CreateBlogPostPage;

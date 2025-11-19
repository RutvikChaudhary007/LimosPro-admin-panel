// @ts-nocheck

import { Plus, Search } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { blogService } from "@/api/contentServices.api";
import PageTitle from "@/components/common/PageTitle";
import BlogPostCard from "@/components/contentManagement/BlogPostCard";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { constant } from "@/lib/constant";
import type { BlogPost, BlogQueryParams } from "@/types/content";
import { generatePageTitle } from "@/utils/seo";

const fetchBlogPosts = async ({ ...rest }) => {
  console.log(rest);
  const {
    setLoading,
    searchTerm,
    statusFilter,
    setBlogPosts,
    pagination,
    setPagination,
  } = rest;
  try {
    setLoading(true);
    const params: BlogQueryParams = {
      page: pagination.page,
      limit: pagination.limit,
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
      sortBy: "createdAt",
      sortOrder: "DESC",
    };

    const response = await blogService.getAll(params);
    setBlogPosts(response.data);
    setPagination(response.pagination);
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);

    let errorTitle = "Error Loading Blog Posts";
    let errorDescription =
      "Failed to fetch blog posts. Please try again later.";

    if (error instanceof Error) {
      if (error.message.includes("404")) {
        errorTitle = "Blog Feature Not Available";
        errorDescription =
          "The blog management feature is not yet implemented in the backend. Please contact your administrator.";
      } else if (error.message.includes("401")) {
        errorTitle = "Authentication Required";
        errorDescription = "Please log in again to access blog posts.";
      } else if (error.message.includes("403")) {
        errorTitle = "Access Denied";
        errorDescription = "You do not have permission to access blog posts.";
      } else if (error.message.includes("500")) {
        errorTitle = "Server Error";
        errorDescription =
          "The server encountered an error. Please try again later.";
      } else if (error.message.includes("Failed to fetch")) {
        errorTitle = "Connection Error";
        errorDescription =
          "Cannot connect to the server. Please check if the admin service is running on port 3001.";
      } else {
        errorDescription = error.message;
      }
    }

    toast.error(errorTitle, {
      description: errorDescription,
      duration: 6000,
    });

    setBlogPosts([]); // Set empty array to show the "no posts" state
  } finally {
    setLoading(false);
  }
};

const BlogPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchBlogPosts({
      setLoading,
      searchTerm,
      statusFilter,
      setBlogPosts,
      pagination,
      setPagination,
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchBlogPosts();
  };

  const handleEdit = (id: string) => {
    navigate(constant.ROUTING_URLS.EDIT_BLOG_POST.replace(":id", id));
  };

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_BLOG_POST.replace(":id", id));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await blogService.delete(id);
        toast.success("Blog post deleted successfully");
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchBlogPosts();
      } catch (error) {
        console.error("Error deleting blog post:", error);
        toast.error("Failed to delete blog post");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <>
      <PageTitle title={generatePageTitle("BlogPosts")} />
      <div className="p-6 space-y-6">
        <PageHeader
          title="Blog Posts"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Content Management" },
            { label: "Blog Posts" },
          ]}
          action={{
            label: "Create Post",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_BLOG_POST,
          }}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pagination.total}</div>
              </CardContent>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    blogPosts.filter((post) => post.status === "published")
                      .length
                  }
                </div>
              </CardContent>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {blogPosts.filter((post) => post.status === "draft").length}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {blogPosts.reduce((sum, post) => sum + post.viewCount, 0)}
                </div>
              </CardContent>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <CardContent>
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-6 items-end justify-between w-full"
              >
                {/* ---- Search Input ---- */}
                <Field className="flex-1">
                  <FieldLabel htmlFor="search">Search</FieldLabel>

                  <InputGroup>
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>

                    <InputGroupInput
                      id="search"
                      type="text"
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Field>

                {/* ---- Status SelectDropDown ---- */}
                <Field className="flex-0">
                  <FieldLabel htmlFor="status">Status</FieldLabel>

                  <SelectDropDown
                    placeholder="All statuses"
                    items={[
                      { label: "All statuses", value: "all" },
                      { label: "Published", value: "published" },
                      { label: "Draft", value: "draft" },
                      { label: "Archived", value: "archived" },
                    ]}
                    value={statusFilter}
                    setSelectedItem={setStatusFilter}
                  />
                </Field>
              </form>
            </CardContent>
          </CardBody>
        </Card>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardBody>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <Card>
            <CardBody>
              <CardContent>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No blog posts found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get started by creating your first blog post.
                  </p>
                  <Button
                    onClick={() =>
                      navigate(constant.ROUTING_URLS.CREATE_BLOG_POST)
                    }
                  >
                    <Plus />
                    Create Post
                  </Button>
                </div>
              </CardContent>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                blogPost={post}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - pagination.page) <= 2
              ) {
                return (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              }
              if (
                page === pagination.page - 3 ||
                page === pagination.page + 3
              ) {
                return <span key={page}>...</span>;
              }
              return null;
            })}
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPostsPage;

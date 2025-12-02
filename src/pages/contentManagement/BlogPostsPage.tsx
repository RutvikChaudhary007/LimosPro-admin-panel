// @ts-nocheck

import { Grid, List, Plus, Search } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { blogService } from "@/api/contentServices.api";
import PageTitle from "@/components/common/PageTitle";
import BlogPostCard from "@/components/contentManagement/BlogPostCard";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { getBlogColumns } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    setBlogPosts(response.data || []);
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
  const [searchValue, setSearchValue] = useState("");
  const [tableRef, setTableRef] = useState<Table<BlogPost> | null>(null);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isGrid, setIsGrid] = useState(true);
  const [perPage, setperPage] = useState<number>(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: perPage,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchBlogPosts({
      setLoading,
      searchTerm,
      statusFilter,
      setBlogPosts,
      pagination: { ...pagination, page: 1 },
      setPagination,
    });
  }, [searchTerm, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchBlogPosts({
      setLoading,
      searchTerm,
      statusFilter,
      setBlogPosts,
      pagination: { ...pagination, page: 1 },
      setPagination,
    });
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
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

        const newPagination = { ...pagination, page: 1 };
        fetchBlogPosts({
          setLoading,
          searchTerm,
          statusFilter,
          setBlogPosts,
          pagination: newPagination,
          setPagination,
        });
      } catch (error) {
        console.error("Error deleting blog post:", error);
        toast.error("Failed to delete blog post");
      }
    }
  };

  // simple pagination values driven by server pagination state
  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;
  const currentItems = blogPosts;
  const calculatedTotalPages = Math.max(1, totalPages);

  // Unified handler for page and page size changes
  const handlePageChange = (value: number) => {
    if (value === 10 || value === 20 || value === 30) {
      setperPage(value);
      const newPagination = { ...pagination, page: 1, limit: value };
      setPagination(newPagination);
      fetchBlogPosts({
        setLoading,
        searchTerm,
        statusFilter,
        setBlogPosts,
        pagination: newPagination,
        setPagination,
      });
    } else {
      // Otherwise it's a page change
      if (value < 1 || value > Math.max(1, pagination.totalPages)) return;
      const newPagination = { ...pagination, page: value };
      setPagination(newPagination);
      fetchBlogPosts({
        setLoading,
        searchTerm,
        statusFilter,
        setBlogPosts,
        pagination: newPagination,
        setPagination,
      });
      window.scrollTo(0, 0);
    }
  };

  const columns = getBlogColumns(handleEdit, handleView, handleDelete);

  return (
    <>
      <PageTitle title={generatePageTitle("BlogPosts")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
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
                <CardTitle className="text-sm font-medium">Archive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {blogPosts.filter((post) => post.status === "archive").length}
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
                    setSelectedItem={handleStatusFilterChange}
                  />
                </Field>
              </form>
            </CardContent>
          </CardBody>
        </Card>

        {/* Blog Posts Section */}
        <div>
          {/* 1. Loading Skeleton */}
          {loading && (
            <>
              {/* Toggle Button Skeleton */}
              <div className="flex justify-end mb-6 gap-2">
                <div className="h-9 w-10 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-9 w-10 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardImage
                      src="https://via.placeholder.com/400x160?text=Loading..."
                      alt="loading"
                      className="w-full h-40 object-cover rounded-t"
                    />
                    <CardBody>
                      <CardHeader>
                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <div className="h-4 w-12 bg-gray-200 rounded" />
                          <div className="h-4 w-12 bg-gray-200 rounded" />
                          <div className="h-4 w-6 bg-gray-200 rounded" />
                        </div>
                        <CardAction>
                          <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="h-3 w-full bg-gray-200 rounded" />
                          <div className="h-3 w-5/6 bg-gray-200 rounded" />
                          <div className="h-3 w-3/4 bg-gray-200 rounded" />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex flex-col gap-1">
                            <div className="h-3 w-16 bg-gray-200 rounded" />
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-3 w-20 bg-gray-200 rounded" />
                          </div>
                          <div className="h-3 w-10 bg-gray-200 rounded" />
                        </div>
                      </CardContent>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* 2. Posts exist */}
          {!loading && blogPosts.length > 0 && (
            <>
              {/* Toggle Button */}
              <div className="flex justify-end mb-6 ">
                <TooltipProvider>
                  <ToggleGroup
                    type="single"
                    value={isGrid ? "grid" : "list"}
                    onValueChange={(value) => {
                      if (value && (value === "grid") !== isGrid) {
                        setIsGrid(value === "grid");
                      }
                    }}
                    variant="outline"
                    className="rounded"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="grid" aria-label="Grid View">
                          <Grid />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>Grid View</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem value="list" aria-label="List View">
                          <List />
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>List View</TooltipContent>
                    </Tooltip>
                  </ToggleGroup>
                </TooltipProvider>
              </div>

              {/* Grid View */}
              {isGrid ? (
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
              ) : (
                <DataTable
                  columns={columns}
                  data={blogPosts}
                  rowSelection={rowSelection}
                  onRowSelectionChange={setRowSelection}
                  // onTableReady={setTableRef}
                  // globalFilter={searchValue}
                  // onGlobalFilterChange={setSearchValue}
                />
              )}
            </>
          )}

          {/* 3. No posts */}
          {!loading && blogPosts.length === 0 && (
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
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages >= 1 && (
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            totalItems={pagination.total}
            perPage={perPage}
            disabled={loading}
          />
        )}
      </div>
    </>
  );
};

export default BlogPostsPage;

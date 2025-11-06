// @ts-nocheck

import { Filter, Plus, Search } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { blogService } from "@/api/contentServices.api";
import PageTitle from "@/components/common/PageTitle";
import BlogPostCard from "@/components/contentManagement/BlogPostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { constant } from "@/lib/constant";
import type { BlogPost, BlogQueryParams } from "@/types/content";
import { generatePageTitle } from "@/utils/seo";

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

	const fetchBlogPosts = async () => {
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

	useEffect(() => {
		fetchBlogPosts();
	}, [pagination.page, searchTerm, statusFilter]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPagination({ ...pagination, page: 1 });
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
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Blog Posts</h1>
						<p className="text-gray-600">Manage your blog content</p>
					</div>
					<Button
						onClick={() => navigate(constant.ROUTING_URLS.CREATE_BLOG_POST)}
					>
						<Plus className="mr-2 h-4 w-4" />
						Create Post
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Total Posts</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{pagination.total}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Published</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{blogPosts.filter((post) => post.status === "published").length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Drafts</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">
								{blogPosts.filter((post) => post.status === "draft").length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{blogPosts.reduce((sum, post) => sum + post.viewCount, 0)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<form
							onSubmit={handleSearch}
							className="flex gap-4 items-end justify-between"
						>
							<div className="flex-1">
								<label className="text-sm font-medium mb-2 block">Search</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search blog posts..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>
							<div className="w-48">
								<label className="text-sm font-medium mb-2 block">Status</label>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger>
										<SelectValue placeholder="All statuses" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All statuses</SelectItem>
										<SelectItem value="published">Published</SelectItem>
										<SelectItem value="draft">Draft</SelectItem>
										<SelectItem value="archived">Archived</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{/* <Button type="button">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button> */}
						</form>
					</CardContent>
				</Card>

				{/* Blog Posts Grid */}
				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, index) => (
							<Card key={index} className="animate-pulse">
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
							</Card>
						))}
					</div>
				) : blogPosts.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center py-12">
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
									<Plus className="mr-2 h-4 w-4" />
									Create Post
								</Button>
							</div>
						</CardContent>
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

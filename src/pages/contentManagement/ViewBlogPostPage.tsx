// @ts-nocheck

import { ArrowLeft, Calendar, Edit, Eye, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { blogService } from "@/api/contentServices.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { constant } from "@/lib/constant";
import type { BlogPost } from "@/types/content";

const fetchBlogPost = async (postId: string) => {
  try {
    setLoading(true);
    const response = await blogService.getById(postId);
    setBlogPost(response.data);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    toast.error("Error Loading Blog Post", {
      description: "Failed to fetch blog post details.",
      duration: 4000,
    });
  } finally {
    setLoading(false);
  }
};
const ViewBlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);
  const handleEdit = () => {
    navigate(constant.ROUTING_URLS.EDIT_BLOG_POST.replace(":id", id!));
  };

  const handleBack = () => {
    navigate(constant.ROUTING_URLS.BLOG_POSTS);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Blog post not found
          </h3>
          <p className="text-gray-600 mb-4">
            The blog post you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{blogPost.title}</h1>
            <p className="text-gray-600">View blog post details</p>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Post
        </Button>
      </div>

      {/* Blog Post Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {blogPost.featuredImage && (
            <Card>
              <CardContent className="pt-6">
                <img
                  src={blogPost.featuredImage}
                  alt={blogPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </CardContent>
          </Card>

          {/* Additional Images */}
          {blogPost.images && blogPost.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {blogPost.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Blog-image-${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    blogPost.status === "published" ? "default" : "secondary"
                  }
                >
                  {blogPost.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{blogPost.author || "Unknown Author"}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {blogPost.publishedAt
                      ? new Date(blogPost.publishedAt).toLocaleDateString()
                      : "Not published"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{blogPost.viewCount || 0} views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Info */}
          {blogPost.seo && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {blogPost.seo.metaTitle && (
                  <div>
                    <label
                      htmlFor="metaTitle"
                      className="text-sm font-medium text-gray-700"
                    >
                      Meta Title
                    </label>
                    <p className="text-sm text-gray-600">
                      {blogPost.seo.metaTitle}
                    </p>
                  </div>
                )}

                {blogPost.seo.metaDescription && (
                  <div>
                    <label
                      htmlFor="metaDesc"
                      className="text-sm font-medium text-gray-700"
                    >
                      Meta Description
                    </label>
                    <p className="text-sm text-gray-600">
                      {blogPost.seo.metaDescription}
                    </p>
                  </div>
                )}

                {blogPost.seo.metaKeywords &&
                  blogPost.seo.metaKeywords.length > 0 && (
                    <div>
                      <label
                        htmlFor="meta"
                        className="text-sm font-medium text-gray-700"
                      >
                        Meta Keywords
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {blogPost.seo.metaKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBlogPostPage;

import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type React from "react";
import type { BlogPost } from "@/types/content";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface BlogPostCardProps {
  blogPost: BlogPost;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  blogPost,
  onEdit,
  onView,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {blogPost.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(blogPost.status)}>
                {blogPost.status}
              </Badge>
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="flex gap-1">
                  {blogPost.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={`${index}-${tag}`}
                      variant="outline"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {blogPost.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{blogPost.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(blogPost.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(blogPost.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(blogPost.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {blogPost.featuredImage && (
          <img
            src={blogPost.featuredImage}
            alt={blogPost.title}
            className="w-full h-32 object-cover rounded-md mb-3"
          />
        )}
        {blogPost.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {blogPost.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-col gap-1">
            {blogPost.author && <span>By {blogPost.author}</span>}
            <span>Created: {formatDate(blogPost.createdAt)}</span>
            {blogPost.publishedAt && (
              <span>Published: {formatDate(blogPost.publishedAt)}</span>
            )}
          </div>
          <div className="text-right">
            <span>{blogPost.viewCount} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;

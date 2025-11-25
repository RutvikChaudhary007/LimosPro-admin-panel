import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/content";
import { TitleWithTooltip } from "../TitleWithTooltip";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardImage,
} from "../ui/card";
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
        return "bg-base-success/15 text-base-success brightness-75";
      case "draft":
        return "bg-base-warning/15 text-base-warning brightness-75";
      case "archived":
        return "bg-base-gray/15 text-base-gray brightness-75";
      default:
        return "bg-base-gray/15 text-base-gray brightness-75";
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
    <Card>
      <CardImage
        src={
          blogPost.featuredImage ||
          "https://placehold.co/160?font=montserrat&text=No+Image"
        }
        alt={blogPost.title}
        className="w-full h-40"
      />

      <CardBody className="flex-1">
        <CardHeader className="!grid-rows-1 !auto-rows-auto !gap-1">
          <TitleWithTooltip title={blogPost.title} />
          <div className="flex items-center gap-1.5 flex-wrap col-span-2">
            <Badge
              className={cn("capitalize", getStatusColor(blogPost.status))}
            >
              {blogPost.status}
            </Badge>

            {blogPost.tags?.slice(0, 2).map((tag, index) => (
              <Badge
                key={`${index}-${tag}`}
                variant="outline"
                className="capitalize"
              >
                {tag}
              </Badge>
            ))}

            {blogPost.tags && blogPost.tags.length > 2 && (
              <Badge variant="outline">+{blogPost.tags.length - 2}</Badge>
            )}
          </div>

          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(blogPost.id)}>
                  <Eye className="size-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(blogPost.id)}>
                  <Edit className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(blogPost.id)}
                  className="text-base-danger"
                >
                  <Trash2 className="size-4 text-base-danger" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          {blogPost.excerpt && (
            <p className="text-sm line-clamp-3 mb-4">
              {blogPost.excerpt.replace(/<[^>]+>/g, "")}
            </p>
          )}
          <div className="flex items-center justify-between text-xs">
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
      </CardBody>
    </Card>
  );
};

export default BlogPostCard;

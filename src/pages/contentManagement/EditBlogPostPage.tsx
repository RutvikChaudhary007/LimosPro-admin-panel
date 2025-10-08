import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, ArrowLeft, Plus, X, Loader } from 'lucide-react';
import AdminRootLayout from '@/components/layouts/AdminRootLayout';
import ImageUpload from '@/components/ui/image-upload';
import MultipleImageUpload from '@/components/ui/multiple-image-upload';
import { blogService } from '@/api/contentServices.api';
import type { BlogPost, BlogPostFormData } from '@/types/content';
import { constant } from '@/lib/constant';
import { toast } from 'sonner';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long'),
  status: z.enum(['draft', 'published', 'archived']),
  author: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

const EditBlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
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

  const title = watch('title');

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setFetchLoading(true);
      const response = await blogService.getById(id!);
      const post = response?.data ;
      setBlogPost(post);
      
      // Set form values
      reset({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        featuredImage: post.featuredImage || '',
        slug: post.slug,
        status: post.status as any,
        author: post.author || '',
        metaTitle: post.seo?.metaTitle || '',
        metaDescription: post.seo?.metaDescription || '',
        ogImage: post.seo?.ogImage || '',
      });

      setTags(post.tags || []);
      setMetaKeywords(post.seo?.metaKeywords || []);
      setBlogImages(post.images || []);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to fetch blog post');
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    } finally {
      setFetchLoading(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !metaKeywords.includes(keywordInput.trim())) {
      setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      setKeywordInput('');
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
        excerpt: data.excerpt || '',
        featuredImage: data.featuredImage || '',
        slug: data.slug,
        status: data.status,
        author: data.author || '',
        tags,
        images: blogImages,
        seo: {
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          metaKeywords,
          ogImage: data.ogImage || '',
        },
      };

      await blogService.update(id!, blogPostData);
      toast.success('Blog post updated successfully');
      navigate(constant.ROUTING_URLS.BLOG_POSTS);
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminRootLayout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading blog post...</p>
          </div>
        </div>
      </AdminRootLayout>
    );
  }

  if (!blogPost) {
    return (
      <AdminRootLayout>
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
      </AdminRootLayout>
    );
  }

  return (
    <AdminRootLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(constant.ROUTING_URLS.BLOG_POSTS)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Blog Post</h1>
              <p className="text-gray-600">Update blog post details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      onChange={handleTitleChange}
                      placeholder="Enter blog post title"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="blog-post-slug"
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      {...register('excerpt')}
                      placeholder="Brief description of the blog post"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      {...register('content')}
                      placeholder="Write your blog post content here..."
                      rows={15}
                      className={errors.content ? 'border-red-500' : ''}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.content.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      {...register('metaTitle')}
                      placeholder="SEO title for search engines"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      {...register('metaDescription')}
                      placeholder="Brief description for search engines"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Meta Keywords</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add keyword"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <Button type="button" onClick={addKeyword}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metaKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <ImageUpload
                    label="Open Graph Image"
                    placeholder="Enter OG image URL or upload file"
                    value={watch('ogImage') || ''}
                    onChange={(url) => setValue('ogImage', url)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => setValue('status', value as any)}
                      value={watch('status')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      {...register('author')}
                      placeholder="Author name"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Updating...' : 'Update Post'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    label="Featured Image"
                    placeholder="Enter featured image URL or upload file"
                    value={watch('featuredImage') || ''}
                    onChange={(url) => setValue('featuredImage', url)}
                  />
                </CardContent>
              </Card>

              {/* Blog Images */}
              <Card>
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
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminRootLayout>
  );
};

export default EditBlogPostPage;

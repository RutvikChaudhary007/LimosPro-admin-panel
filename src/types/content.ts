// Content Management Types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images?: string[];
  tags?: string[];
  slug: string;
  status: "draft" | "published" | "archived";
  viewCount: number;
  publishedAt?: Date;
  author?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentBlock {
  id: string;
  blockType: string;
  sectionName: string;
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
    images?: string[];
    features?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
      rating: number;
    }>;
    pricing?: Array<{
      name: string;
      price: number;
      features: string[];
      popular: boolean;
    }>;
    gallery?: Array<{
      image: string;
      caption?: string;
      alt?: string;
    }>;
    contact?: {
      address?: string;
      phone?: string;
      email?: string;
      hours?: string;
    };
  };
  sortOrder: number;
  isActive: boolean;
  pageName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageTemplate {
  id: string;
  pageName: string;
  slug: string;
  layout: {
    header: {
      logo: string;
      navigation: Array<{
        label: string;
        url: string;
        children?: Array<{
          label: string;
          url: string;
        }>;
      }>;
    };
    footer: {
      companyInfo: {
        name: string;
        description: string;
        address: string;
        phone: string;
        email: string;
      };
      socialLinks: Array<{
        platform: string;
        url: string;
        icon: string;
      }>;
      quickLinks: Array<{
        label: string;
        url: string;
      }>;
    };
    contentBlocks: string[];
  };
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaLibrary {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    alt?: string;
    caption?: string;
  };
  category?: string;
  folder?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Form Types
export interface BlogPostFormData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images?: string[];
  tags?: string[];
  slug: string;
  status: "draft" | "published" | "archived";
  author?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
}

export interface ContentBlockFormData {
  blockType: string;
  sectionName: string;
  content: unknown;
  sortOrder: number;
  pageName?: string;
  isActive: boolean;
}

export interface PageTemplateFormData {
  pageName: string;
  slug: string;
  layout: unknown;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  isActive: boolean;
}

export interface MediaUploadFormData {
  file: File;
  category?: string;
  folder?: string;
  alt?: string;
  caption?: string;
}

// Query Params
export interface BlogQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  author?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ContentBlockQueryParams {
  page?: number;
  limit?: number;
  blockType?: string;
  pageName?: string;
  sectionName?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  fileType?: string;
  category?: string;
  folder?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PageTemplateQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

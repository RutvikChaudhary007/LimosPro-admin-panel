import { FileText, Image, List, MousePointerClick } from "lucide-react";

export const BLOCK_TYPES = {
  HERO: "hero",
  FEATURES: "features",
  CONTENT: "content",
  CTA: "cta",
} as const;

export const BLOCK_DEFINITIONS = [
  {
    type: BLOCK_TYPES.HERO,
    label: "Hero Section",
    icon: Image,
    defaultValue: {
      blockType: BLOCK_TYPES.HERO,
      content: {
        title: "Welcome to our website",
        subtitle: "We provide the best services for you",
        buttonText: "Get Started",
        buttonUrl: "/contact",
        backgroundImage: "",
      },
    },
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "buttonText", label: "Button Text", type: "text" },
      { name: "buttonUrl", label: "Button URL", type: "text" },
      { name: "backgroundImage", label: "Background Image URL", type: "image" },
    ],
  },
  {
    type: BLOCK_TYPES.FEATURES,
    label: "Features Grid",
    icon: List,
    defaultValue: {
      blockType: BLOCK_TYPES.FEATURES,
      content: {
        title: "Our Features",
        features: [
          { title: "Feature 1", description: "Description 1", icon: "star" },
          { title: "Feature 2", description: "Description 2", icon: "shield" },
          { title: "Feature 3", description: "Description 3", icon: "zap" },
        ],
      },
    },
    fields: [
      { name: "title", label: "Section Title", type: "text" },
      {
        name: "features",
        label: "Features",
        type: "array",
        itemFields: [
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "icon", label: "Icon", type: "text" },
        ],
      },
    ],
  },
  {
    type: BLOCK_TYPES.CONTENT,
    label: "Rich Content",
    icon: FileText,
    defaultValue: {
      blockType: BLOCK_TYPES.CONTENT,
      content: {
        html: "<p>Enter your content here...</p>",
      },
    },
    fields: [{ name: "html", label: "Content", type: "richtext" }],
  },
  {
    type: BLOCK_TYPES.CTA,
    label: "Call to Action",
    icon: MousePointerClick,
    defaultValue: {
      blockType: BLOCK_TYPES.CTA,
      content: {
        title: "Ready to get started?",
        description: "Join us today and experience the difference.",
        buttonText: "Sign Up Now",
        buttonUrl: "/signup",
      },
    },
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "buttonText", label: "Button Text", type: "text" },
      { name: "buttonUrl", label: "Button URL", type: "text" },
    ],
  },
];

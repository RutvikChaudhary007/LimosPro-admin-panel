import type { PageTemplate, PageTemplateFormData } from "@/types/content";

let MOCK_PAGES_DATA: PageTemplate[] = [
  {
    id: "1",
    pageName: "Home Page",
    slug: "home",
    hero: {
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "LimosPro Hero",
      h1: "Welcome to LimosPro",
      p: "Premium Limousine Service",
      btn: "Book Now",
    },
    content: [
      {
        type: "features",
        content: {
          title: "Why Choose Us",
          features: [
            {
              title: "Luxury Fleet",
              description: "Best in class vehicles",
              icon: "car",
            },
            {
              title: "Professional Chauffeurs",
              description: "Experienced and polite",
              icon: "user",
            },
            {
              title: "24/7 Support",
              description: "Always here for you",
              icon: "phone",
            },
          ],
        },
      },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    pageName: "About Us",
    slug: "about-us",
    hero: {},
    content: [
      {
        type: "content",
        content: {
          html: "<h1>About LimosPro</h1><p>We are the leading provider of luxury transportation...</p>",
        },
      },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getPages = () => [...MOCK_PAGES_DATA];

export const getPageById = (id: string) =>
  MOCK_PAGES_DATA.find((p) => p.id === id);

export const createPage = (data: PageTemplateFormData) => {
  const newPage: PageTemplate = {
    ...data,
    hero: data.hero || {},
    content: data.content || [],
    id: Math.random().toString(36).substr(2, 9),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  MOCK_PAGES_DATA.push(newPage);
  return newPage;
};

export const updatePage = (id: string, data: PageTemplateFormData) => {
  const index = MOCK_PAGES_DATA.findIndex((p) => p.id === id);
  if (index !== -1) {
    MOCK_PAGES_DATA[index] = {
      ...MOCK_PAGES_DATA[index],
      ...data,
      updatedAt: new Date(),
    };
    return MOCK_PAGES_DATA[index];
  }
  return null;
};

export const deletePage = (id: string) => {
  MOCK_PAGES_DATA = MOCK_PAGES_DATA.filter((p) => p.id !== id);
};

// Keep for backward compatibility if needed, but prefer functions
export const MOCK_PAGES = MOCK_PAGES_DATA;

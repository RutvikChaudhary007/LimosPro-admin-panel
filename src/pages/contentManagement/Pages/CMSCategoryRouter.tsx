import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/Spinner";

// Lazy load all category pages
const categories = {
  business: {
    create: lazy(() => import("./businessPages/CreatePage")),
    edit: lazy(() => import("./businessPages/EditPage")),
  },
  home: {
    create: lazy(() => import("./homePage/CreatePage")),
    edit: lazy(() => import("./homePage/EditPage")),
  },
  services: {
    create: lazy(() => import("./servicespage/CreatePage")),
    edit: lazy(() => import("./servicespage/EditPage")),
  },
  destinations: {
    create: lazy(() => import("./destinationPage/CreatePage")),
    edit: lazy(() => import("./destinationPage/EditPage")),
  },
  about: {
    create: lazy(() => import("./aboutPage/CreatePage")),
    edit: lazy(() => import("./aboutPage/EditPage")),
  },
  chauffeur: {
    create: lazy(() => import("./chauffeurPage/CreatePage")),
    edit: lazy(() => import("./chauffeurPage/EditPage")),
  },
  help: {
    create: lazy(() => import("./helpPage/CreatePage")),
    edit: lazy(() => import("./helpPage/EditPage")),
  },
};

export default function CMSCategoryRouter({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const { category } = useParams<{ category: string }>();

  const selectedCategory =
    (category?.toLowerCase() as keyof typeof categories) || "business";
  const categoryConfig = categories[selectedCategory] || categories.business;
  const Component = categoryConfig[mode];

  return (
    <Suspense
      fallback={
        <div className="p-8 flex justify-center">
          <Spinner />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

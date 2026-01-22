"use client";

import { Edit2, FileText, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllServicePageContent } from "@/api/pages/servicePages.api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSticky } from "@/hooks/useSticky";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import cmsPageListFallback from "./cmsPageListData.json";

const categoryConfig = [
  { name: "All", label: "All", key: "total" },
  { name: "Services", label: "Services", key: "service" },
  {
    name: "Destinations",
    label: "Global Cities & Airports",
    key: "destination",
  },
  { name: "Business", label: "Business & Diplomats", key: "business" },
  { name: "Home", label: "Home", key: "home" },
  { name: "Chauffeur", label: "Chauffeur", key: "chauffeur" },
];

export default function CMSPageList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const {
    data: servicePageContent,
    isLoading,
    isError,
  } = useFetchAllServicePageContent();

  const resolvedPageContent = useMemo(
    () =>
      isError || !servicePageContent
        ? cmsPageListFallback.data
        : servicePageContent,
    [isError, servicePageContent],
  );

  const categoriesData = useMemo(() => {
    const counts = resolvedPageContent?.counts ?? {};
    return categoryConfig.map((category) => ({
      ...category,
      count: counts[category.key as keyof typeof counts] ?? 0,
    }));
  }, [resolvedPageContent]);

  const pagesData = useMemo(() => {
    const data = resolvedPageContent?.data ?? {};
    const buildDescription = (page: any) => {
      const lang = page?.defaultLanguage ?? "en";
      const service = page?.services?.[lang]?.service;
      const subservice = page?.services?.[lang]?.subservice;
      const fallback = page?.slug ? `/${page.slug}` : "";
      return [service, subservice, fallback].filter(Boolean).join(" • ");
    };
    const formatUpdatedAt = (updatedAt?: string) =>
      updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A";

    return [
      { key: "services", category: "Services" },
      { key: "destination", category: "Destinations" },
      { key: "business", category: "Business" },
      { key: "home", category: "Home" },
      { key: "chauffeur", category: "Chauffeur" },
    ].flatMap(
      ({ key, category }) =>
        (data as Record<string, any[]>)[key]?.map((page) => ({
          id: page.id,
          title: page.pageName,
          description: buildDescription(page),
          lastUpdated: formatUpdatedAt(page.updatedAt),
          category,
        })) ?? [],
    );
  }, [resolvedPageContent]);

  const showLoadingState = isLoading && pagesData.length === 0;
  const showErrorState = isError && pagesData.length === 0;
  // Filter Pages based on selected category and search query
  const filteredPages = pagesData.filter((page) => {
    const matchesCategory =
      selectedCategory === "All" || page.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sticky hook
  const { stickyRef, sentinelRef } = useSticky(
    100,
    1024,
    selectedCategory,
    searchQuery,
  );

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Content Management"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Pages" }]}
        action={
          selectedCategory === "All"
            ? undefined
            : {
                label: "Create Page",
                icon: <Plus />,
                link: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT.replace(
                  ":category",
                  selectedCategory.toLowerCase(),
                ),
              }
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-2 xl:col-span-1">
          <div ref={sentinelRef} className="h-px"></div>
          <Card ref={stickyRef} className="h-fit">
            <CardBody>
              <CardHeader className="space-y-2">
                <CardTitle>Page Categories</CardTitle>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search Pages..."
                    className="cursor-pointer"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </CardHeader>
              <CardContent className="space-y-2">
                {categoriesData.map((category) => (
                  <div
                    key={category.label}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded hover:bg-base-light-gray cursor-pointer transition-colors group",
                      selectedCategory === category.name &&
                        "bg-base-light-gray",
                    )}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className="font-medium">{category.label}</span>
                    <Badge
                      className="transition-colors"
                      variant={
                        selectedCategory === category.name
                          ? "default"
                          : "outline"
                      }
                    >
                      {category.name === "All"
                        ? pagesData.length
                        : category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </CardBody>
          </Card>
        </div>

        {/* Pages Grid */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-base-black">
              {selectedCategory === "All"
                ? "All Pages"
                : `${selectedCategory} Pages`}
              <span className="text-sm font-normal text-base-gray ml-2">
                ({filteredPages.length}{" "}
                {filteredPages.length === 1 ? "page" : "pages"})
              </span>
            </h2>

            {showLoadingState ? (
              <Card>
                <CardBody className="flex flex-col items-center justify-center py-12 text-center text-base-black">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p>Loading pages...</p>
                </CardBody>
              </Card>
            ) : showErrorState ? (
              <Card>
                <CardBody className="flex flex-col items-center justify-center py-12 text-center text-base-black">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p>Unable to load pages right now.</p>
                </CardBody>
              </Card>
            ) : filteredPages.length === 0 ? (
              <Card>
                <CardBody className="flex flex-col items-center justify-center py-12 text-center text-base-black">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <p>No pages found matching your search criteria.</p>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPages.map((page) => (
                  <Card
                    key={page.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardBody>
                      <CardHeader>
                        <CardTitle className="line-clamp-1" title={page.title}>
                          {page.title}
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline" className="shrink-0">
                            {page.category}
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-base-gray line-clamp-2 min-h-[40px]">
                          {page.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center border-t">
                        <span className="text-xs text-base-gray">
                          Updated {page.lastUpdated}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-primary hover:text-primary/90 hover:bg-primary/5"
                          onClick={() =>
                            navigate(
                              constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(
                                ":category",
                                page.category.toLowerCase(),
                              ).replace(":id", page.id.toString()),
                            )
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      </CardFooter>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

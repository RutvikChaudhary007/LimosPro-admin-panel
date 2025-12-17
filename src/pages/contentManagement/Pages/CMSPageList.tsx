"use client";

import { Edit2, FileText, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Dummy Data
const categoriesData = [
  { name: "All", count: 0 },
  { name: "Services", count: 3 },
  { name: "Destinations", count: 2 },
  { name: "Business", count: 1 },
  { name: "Legal", count: 2 },
];

const pagesData = [
  {
    id: 1,
    title: "Chauffeur Service",
    description: "Premium chauffeur services for your comfort.",
    lastUpdated: "2 days ago",
    category: "Services",
  },
  {
    id: 2,
    title: "Airport Transfer",
    description: "Reliable airport transfers to and from all major airports.",
    lastUpdated: "1 week ago",
    category: "Services",
  },
  {
    id: 3,
    title: "Event Transportation",
    description: "Luxury transport for corporate events and weddings.",
    lastUpdated: "3 days ago",
    category: "Services",
  },
  {
    id: 4,
    title: "London",
    description: "Explore our premium services available in London.",
    lastUpdated: "1 month ago",
    category: "Destinations",
  },
  {
    id: 5,
    title: "Paris",
    description: "Explore our premium services available in Paris.",
    lastUpdated: "2 weeks ago",
    category: "Destinations",
  },
  {
    id: 6,
    title: "Corporate Accounts",
    description: "Open a business account for streamlined billing.",
    lastUpdated: "5 days ago",
    category: "Business",
  },
  {
    id: 7,
    title: "Terms of Service",
    description: "Our terms and conditions for using the platform.",
    lastUpdated: "3 months ago",
    category: "Legal",
  },
  {
    id: 8,
    title: "Privacy Policy",
    description: "How we collect, use, and handle your data.",
    lastUpdated: "3 months ago",
    category: "Legal",
  },
];

export default function CMSPageList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  // Update "All" count dynamically
  /* eslint-disable-next-line */
  categoriesData.find((c) => c.name === "All")!.count = pagesData.length;

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Content Management"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Pages" }]}
        action={{
          label: "Create Page",
          icon: <Plus />,
          link: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT,
        }}
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
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                </InputGroup>
              </CardHeader>
              <CardContent className="space-y-2">
                {categoriesData.map((category) => (
                  <div
                    key={category.name}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded hover:bg-base-light-gray cursor-pointer transition-colors group",
                      selectedCategory === category.name &&
                        "bg-base-light-gray",
                    )}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className="font-medium">{category.name}</span>
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

            {filteredPages.length === 0 ? (
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
                                ":id",
                                page.id.toString(),
                              ),
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

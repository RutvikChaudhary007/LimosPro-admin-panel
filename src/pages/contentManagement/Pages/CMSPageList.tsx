"use client";

import { Edit2, FileText, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllCitiesHubPages } from "@/api/pages/citiesHubPage.api";
import { useFetchAllCityDiplomatsHubPages } from "@/api/pages/cityDiplomatsHubPage.api";
import { useFetchAllCountryDetailPages } from "@/api/pages/countryDetailPage.api";
import { useFetchAllCountryPages } from "@/api/pages/countryPage.api";
import { useFetchAllRoutePages } from "@/api/pages/routesPage.api";
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
  {
    name: "City-to-City Routes",
    label: "City-to-City Routes",
    key: "cityroutes",
  },
  { name: "Countries", label: "Countries", key: "countries" },
  { name: "Cities", label: "Cities", key: "cities" },
  {
    name: "Business & Diplomats Hub",
    label: "Business & Diplomats Hub Page",
    key: "diplomats",
  },
  { name: "Country Detail", label: "Country Detail", key: "country" },
];

function getRouteCategoryKey(slug: string): string {
  if (slug === "city-routes") return "cityroutes";
  if (slug === "global-availability") return "countries";
  if (slug === "cities") return "cities";
  return "cityroutes";
}

export default function CMSPageList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const {
    data: servicePageContent,
    isLoading,
    isError,
  } = useFetchAllServicePageContent();

  const { data: routesResponse, isLoading: isLoadingRoutes } =
    useFetchAllRoutePages({ limit: 100 });
  const { data: countryResponse, isLoading: isLoadingCountry } =
    useFetchAllCountryPages({ limit: 100 });
  const { data: citiesHubResponse, isLoading: isLoadingCitiesHub } =
    useFetchAllCitiesHubPages({ limit: 100 });
  const {
    data: cityDiplomatsHubResponse,
    isLoading: isLoadingCityDiplomatsHub,
  } = useFetchAllCityDiplomatsHubPages({ limit: 100 });
  const { data: countryDetailsResponse, isLoading: isLoadingCountryDetails } =
    useFetchAllCountryDetailPages({ limit: 100 });

  // const resolvedPageContent = useMemo(
  //   () => (isErrorService || !servicePageContent ? null : servicePageContent),
  //   [isErrorService, servicePageContent],
  // );

  const routePages = useMemo(
    () =>
      Array.isArray(routesResponse?.routePages)
        ? routesResponse.routePages
        : [],
    [routesResponse],
  );
  const countryPages = useMemo(
    () => (Array.isArray(countryResponse?.items) ? countryResponse.items : []),
    [countryResponse],
  );
  const citiesHubPages = useMemo(
    () =>
      Array.isArray(citiesHubResponse?.pages) ? citiesHubResponse.pages : [],
    [citiesHubResponse],
  );
  const cityDiplomatsHubPages = useMemo(
    () =>
      Array.isArray(cityDiplomatsHubResponse?.items)
        ? cityDiplomatsHubResponse.items
        : [],
    [cityDiplomatsHubResponse],
  );
  console.log("cityDiplomatsHubPages=>", cityDiplomatsHubPages);
  const countryDetailsPages = useMemo(
    () =>
      Array.isArray(countryDetailsResponse?.items)
        ? countryDetailsResponse.items
        : [],
    [countryDetailsResponse],
  );

  const resolvedPageContent = useMemo(
    () => (isError || !servicePageContent ? null : servicePageContent),
    [isError, servicePageContent],
  );

  const categoriesData = useMemo(() => {
    const getTotalFromPagination = (response: any, fallback: number) => {
      if (typeof response?.pagination?.totalItems === "number") {
        return response.pagination.totalItems;
      }
      if (typeof response?.totalItems === "number") return response.totalItems;
      return fallback;
    };

    const serviceData = resolvedPageContent?.data ?? {};
    const serviceCount = Array.isArray(serviceData.services)
      ? serviceData.services.length
      : 0;
    const destinationCount = Array.isArray(serviceData.destination)
      ? serviceData.destination.length
      : 0;
    const businessCount = Array.isArray(serviceData.business)
      ? serviceData.business.length
      : 0;
    const homeCount = Array.isArray(serviceData.home)
      ? serviceData.home.length
      : 0;
    const chauffeurCount = Array.isArray(serviceData.chauffeur)
      ? serviceData.chauffeur.length
      : 0;

    const cityRoutesCount = routePages.filter(
      (p: any) => getRouteCategoryKey(p.slug) === "cityroutes",
    ).length;
    const citiesCount = routePages.filter(
      (p: any) => getRouteCategoryKey(p.slug) === "cities",
    ).length;
    const countriesCountFromCountryApi = getTotalFromPagination(
      countryResponse,
      countryPages.length,
    );
    const citiesCountFromCitiesHubApi = getTotalFromPagination(
      citiesHubResponse,
      citiesHubPages.length,
    );
    const countryDetailCount = getTotalFromPagination(
      countryDetailsResponse,
      countryDetailsPages.length,
    );
    const diplomatsCount = getTotalFromPagination(
      cityDiplomatsHubResponse,
      cityDiplomatsHubPages.length,
    );
    const totalCount =
      serviceCount +
      destinationCount +
      businessCount +
      homeCount +
      chauffeurCount +
      cityRoutesCount +
      countriesCountFromCountryApi +
      (citiesCount + citiesCountFromCitiesHubApi) +
      countryDetailCount +
      diplomatsCount;

    const computedCounts: Record<string, number> = {
      total: totalCount,
      service: serviceCount,
      destination: destinationCount,
      business: businessCount,
      home: homeCount,
      chauffeur: chauffeurCount,
      cityroutes: cityRoutesCount,
      countries: countriesCountFromCountryApi,
      cities: citiesCount + citiesCountFromCitiesHubApi,
      diplomats: diplomatsCount,
      country: countryDetailCount,
    };

    return categoryConfig.map((category) => ({
      ...category,
      count: computedCounts[category.key] ?? 0,
    }));
  }, [
    resolvedPageContent,
    routePages,
    countryResponse,
    countryPages.length,
    citiesHubResponse,
    citiesHubPages.length,
    cityDiplomatsHubResponse,
    cityDiplomatsHubPages.length,
    countryDetailsResponse,
    countryDetailsPages.length,
  ]);

  //   const cityRoutesCount = routePages.filter(
  //     (p: any) => getRouteCategoryKey(p.slug) === "cityroutes",
  //   ).length;
  //   const countriesCount = routePages.filter(
  //     (p: any) => getRouteCategoryKey(p.slug) === "countries",
  //   ).length;
  //   const citiesCount = routePages.filter(
  //     (p: any) => getRouteCategoryKey(p.slug) === "cities",
  //   ).length;
  //   const countOverrides: Record<string, number> = {
  //     cityroutes: cityRoutesCount,
  //     countries: countriesCount,
  //     cities: citiesCount,
  //     country: countryPages.length,
  //   };
  //   const fromService = [
  //     "services",
  //     "destination",
  //     "business",
  //     "home",
  //     "chauffeur",
  //   ].reduce(
  //     (sum, key) =>
  //       sum + ((resolvedPageContent?.data as any)?.[key]?.length ?? 0),
  //     0,
  //   );
  //   const totalCount = fromService + routePages.length + countryPages.length;
  //   return categoryConfig.map((category) => ({
  //     ...category,
  //     count:
  //       category.key === "total"
  //         ? totalCount
  //         : (countOverrides[category.key] ??
  //           counts[category.key as keyof typeof counts] ??
  //           0),
  //   }));
  // }, [resolvedPageContent, routePages, countryPages]);
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

    const servicePages = [
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

    // Add cityDiplomatsHubPages
    const diplomatsPages = cityDiplomatsHubPages.map((page: any) => ({
      id: page.id,
      title: page.pageName || "City Diplomats Hub",
      description: page.slug ? `/${page.slug}` : "",
      lastUpdated: formatUpdatedAt(page.updatedAt),
      category: "Business & Diplomats Hub",
    }));

    // Add citiesHubPages
    const citiesPages = citiesHubPages.map((page: any) => ({
      id: page.id,
      title: page.pageName || "Cities Hub",
      description: page.slug ? `/${page.slug}` : "",
      lastUpdated: formatUpdatedAt(page.updatedAt),
      category: "Cities",
    }));

    // Add routePages
    const cityRoutesPages = routePages
      .filter((p: any) => getRouteCategoryKey(p.slug) === "cityroutes")
      .map((page: any) => ({
        id: page.id,
        title: page.pageName || page.slug || "Route",
        description: page.slug ? `/${page.slug}` : "",
        lastUpdated: formatUpdatedAt(page.updatedAt),
        category: "City-to-City Routes",
      }));

    // Add countryPages
    const countriesPages = countryPages.map((page: any) => ({
      id: page.id,
      title: page.pageName || page.name || "Country",
      description: page.slug ? `/${page.slug}` : "",
      lastUpdated: formatUpdatedAt(page.updatedAt),
      category: "Countries",
    }));

    // Add countryDetailsPages
    const countryDetailPagesList = countryDetailsPages.map((page: any) => ({
      id: page.id,
      title: page.pageName || page.name || "Country Detail",
      description: page.slug ? `/${page.slug}` : "",
      lastUpdated: formatUpdatedAt(page.updatedAt),
      category: "Country Detail",
    }));

    return [
      ...servicePages,
      ...diplomatsPages,
      ...citiesPages,
      ...cityRoutesPages,
      ...countriesPages,
      ...countryDetailPagesList,
    ];
  }, [
    resolvedPageContent,
    cityDiplomatsHubPages,
    citiesHubPages,
    routePages,
    countryPages,
    countryDetailsPages,
  ]);

  const showLoadingState =
    (isLoading ||
      isLoadingRoutes ||
      isLoadingCountry ||
      isLoadingCitiesHub ||
      isLoadingCityDiplomatsHub ||
      isLoadingCountryDetails) &&
    pagesData.length === 0;
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
                  // selectedCategory.toLowerCase(),
                  (() => {
                    const m: Record<string, string> = {
                      "City-to-City Routes": "cityroutes",

                      Countries: "countries",

                      Cities: "cities",

                      Diplomats: "diplomats",

                      "Country Detail": "country",
                    };

                    return (
                      m[selectedCategory] ?? selectedCategory.toLowerCase()
                    );
                  })(),
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
                      {category.count}
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

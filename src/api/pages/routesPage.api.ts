import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export interface RoutesPageData {
  id?: string;
  pageName: string;
  slug: string;
  isActive?: boolean;
  defaultLanguage?: string;
  availableLanguages?: string[];
  seo?: { title?: string; description?: string; keywords?: string[] };
  intro?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  sections?: Array<{
    type: "text" | "cta" | "benefits";
    title?: string;
    content?: string;
    description?: string;
    buttonLabel?: string;
    items?: Array<{ title?: string; description?: string }>;
  }>;
  routes?: Array<{
    id?: string;
    fromCity?: string;
    toCity?: string;
    fromSlug?: string;
    toSlug?: string;
    country?: string;
    countrySlug?: string;
    time?: string;
    distance?: string;
  }>;
  countries?: Array<{
    id?: string;
    name?: string;
    slug?: string;
    code?: string;
    cityCount?: string;
    seo?: {
      title?: Record<string, string>;
      description?: Record<string, string>;
    };
  }>;
  jsonLd?: Array<{ type: string; data: unknown }>;
}

export const fetchAllRoutePages = async (params?: Record<string, unknown>) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ROUTES_PAGE.GET_ALL, {
    params,
  });
  return data?.data ?? data;
};

export const fetchRoutePageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.ROUTES_PAGE.GET_BY_ID(id),
  );
  return data?.data ?? data;
};

export const fetchRoutePageBySlug = async (slug: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.ROUTES_PAGE.GET_BY_SLUG(slug),
  );
  return data?.data ?? data;
};

export const createRoutePage = async (payload: FormData | RoutesPageData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.ROUTES_PAGE.CREATE,
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const updateRoutePage = async ({
  id,
  data: payload,
}: {
  id: string;
  data: FormData | Partial<RoutesPageData>;
}) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.ROUTES_PAGE.UPDATE(id),
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const useFetchAllRoutePages = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: queryKeys.routesPage.lists(params),
    queryFn: () => fetchAllRoutePages(params),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchRoutePageById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.routesPage.detail(id),
    queryFn: () => fetchRoutePageById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchRoutePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...queryKeys.routesPage.all, "slug", slug] as const,
    queryFn: () => fetchRoutePageBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useCreateRoutePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoutePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routesPage.all });
    },
  });
};

export const useUpdateRoutePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoutePage,
    onSuccess: (data: RoutesPageData) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routesPage.all });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.routesPage.detail(data.id),
        });
      }
    },
  });
};

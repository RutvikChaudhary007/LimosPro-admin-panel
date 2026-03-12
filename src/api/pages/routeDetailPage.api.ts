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
  content?: any;
  jsonLd?: Array<{ type: string; data: unknown }>;
}

const fetchAllRoutePages = async (params?: Record<string, unknown>) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ROUTEDETAILS.GET_ALL, {
    params,
  });
  return data?.data ?? data;
};

const fetchRoutePageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.ROUTEDETAILS.GET_BY_ID(id),
  );
  return data?.data ?? data;
};

const fetchRoutePageBySlug = async (slug: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.ROUTEDETAILS.GET_BY_SLUG(slug),
  );
  return data?.data ?? data;
};

export const createRoutePage = async (payload: FormData | RoutesPageData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.ROUTEDETAILS.CREATE,
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
    API_ENDPOINTS.ROUTEDETAILS.UPDATE(id),
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const useFetchAllRouteDetailsPages = (
  params?: Record<string, unknown>,
) => {
  return useQuery({
    queryKey: queryKeys.routeDetailsPage.lists(params),
    queryFn: () => fetchAllRoutePages(params),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchRouteDetailsPageById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.routeDetailsPage.detail(id),
    queryFn: () => fetchRoutePageById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchRoutePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...queryKeys.routeDetailsPage.all, "slug", slug] as const,
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

export const useUpdateRouteDetailsPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoutePage,
    onSuccess: (data: RoutesPageData) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routeDetailsPage.all,
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.routeDetailsPage.detail(data.id),
        });
      }
    },
  });
};

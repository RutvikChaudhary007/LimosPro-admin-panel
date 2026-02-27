import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export interface CountryPageData {
  id?: string;
  pageName: string;
  slug: string;
  isActive?: boolean;
  defaultLanguage?: string;
  availableLanguages?: string[];
  hero?: Record<string, unknown>;
  content?: Record<string, unknown>;
  intro?: { title?: string; description?: string; subtitle?: string };
  sections?: Array<{
    type: "text" | "cta";
    title?: string;
    content?: string;
    description?: string;
    buttonLabel?: string;
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
  seo?: Record<string, unknown>;
  jsonLd?: Record<string, unknown[]>;
}

export const fetchAllCountryPages = async (
  params?: Record<string, unknown>,
) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.COUNTRY_PAGE.GET_ALL, {
    params,
  });
  return data?.data ?? data;
};

export const fetchCountryPageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.COUNTRY_PAGE.GET_BY_ID(id),
  );
  return data?.data ?? data;
};

export const fetchCountryPageBySlug = async (slug: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.COUNTRY_PAGE.GET_BY_SLUG(slug),
  );
  return data?.data ?? data;
};

export const createCountryPage = async (
  payload: FormData | CountryPageData,
) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.COUNTRY_PAGE.CREATE,
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const updateCountryPage = async ({
  id,
  data: payload,
}: {
  id: string;
  data: FormData | Partial<CountryPageData>;
}) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.COUNTRY_PAGE.UPDATE(id),
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const useFetchAllCountryPages = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: queryKeys.countryPage.lists(params),
    queryFn: () => fetchAllCountryPages(params),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchCountryPageById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.countryPage.detail(id),
    queryFn: () => fetchCountryPageById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchCountryPageBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...queryKeys.countryPage.all, "slug", slug] as const,
    queryFn: () => fetchCountryPageBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useCreateCountryPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCountryPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countryPage.all });
    },
  });
};

export const useUpdateCountryPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCountryPage,
    onSuccess: (data: CountryPageData) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countryPage.all });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.countryPage.detail(data.id),
        });
      }
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export interface CountryDetailSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
}

export interface CountryDetailIntro {
  title?: string;
  description?: string;
  subtitle?: string;
}

export interface CountryDetailSection {
  id?: string;
  type?: "text" | "cta";
  title?: string;
  content?: string;
  description?: string;
  buttonLabel?: string;
}

export interface CountryDetailLanguageContent {
  intro?: CountryDetailIntro;
  sections?: CountryDetailSection[];
}

export interface CountryDetailPage {
  id?: string;
  pageName: string;
  slug: string;
  isActive?: boolean;
  defaultLanguage?: string;
  availableLanguages?: string[];
  content?: Record<string, CountryDetailLanguageContent>;
  seo?: Record<string, CountryDetailSeo>;
  jsonLd?: Record<string, Array<{ type: string; data: unknown }>>;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchAllCountryDetailPages = async (params?: any) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.COUNTRY_DETAIL_PAGE.GET_ALL,
    { params },
  );
  return data?.data ?? data;
};

export const fetchCountryDetailPageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.COUNTRY_DETAIL_PAGE.GET_BY_ID(id),
  );
  return data?.data ?? data;
};

export const fetchCountryDetailPageBySlug = async (slug: string) => {
  try {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.COUNTRY_DETAIL_PAGE.GET_BY_SLUG(slug),
    );
    return data?.data ?? data ?? null;
  } catch {
    return null;
  }
};

export const createCountryDetailPage = async (
  payload: FormData | CountryDetailPage,
) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.COUNTRY_DETAIL_PAGE.CREATE,
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const updateCountryDetailPage = async ({
  id,
  data: payload,
}: {
  id: string;
  data: FormData | Partial<CountryDetailPage>;
}) => {
  const { data } = await axiosInstance.put(
    API_ENDPOINTS.COUNTRY_DETAIL_PAGE.UPDATE(id),
    payload,
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return data?.data ?? data;
};

export const deleteCountryDetailPage = async (id: string) => {
  const { data } = await axiosInstance.delete(
    API_ENDPOINTS.COUNTRY_DETAIL_PAGE.DELETE(id),
  );
  return data?.success || true;
};

export const useFetchAllCountryDetailPages = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.countryDetailPage.lists(params),
    queryFn: () => fetchAllCountryDetailPages(params),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchCountryDetailPageById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.countryDetailPage.detail(id),
    queryFn: () => fetchCountryDetailPageById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useFetchCountryDetailPageBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.countryDetailPage.bySlug(slug),
    queryFn: () => fetchCountryDetailPageBySlug(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useCreateCountryDetailPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCountryDetailPage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.countryDetailPage.all,
      });
    },
  });
};

export const useUpdateCountryDetailPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCountryDetailPage,
    onSuccess: (data: CountryDetailPage) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.countryDetailPage.all,
      });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.countryDetailPage.detail(data.id),
        });
      }
    },
  });
};

export const useDeleteCountryDetailPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCountryDetailPage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.countryDetailPage.all,
      });
    },
  });
};

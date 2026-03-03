import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export interface CitiesHubPageData {
  id?: string;
  pageName: string;
  slug: string;
  isActive: boolean;
  defaultLanguage: string;
  availableLanguages: string[];
  content: any;
  seo: any;
  jsonLd: any;
}

export const fetchAllCitiesHubPages = async (params: any) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.CITIES_HUB_PAGE.GET_ALL,
    { params },
  );
  return data.data;
};

export const fetchCitiesHubPageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.CITIES_HUB_PAGE.GET_BY_ID(id),
  );
  return data.data;
};

export const createCitiesHubPage = async (formData: CitiesHubPageData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CITIES_HUB_PAGE.CREATE,
    formData,
  );
  return data.data;
};

export const updateCitiesHubPage = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<CitiesHubPageData>;
}) => {
  const { data: response } = await axiosInstance.put(
    API_ENDPOINTS.CITIES_HUB_PAGE.UPDATE(id),
    data,
  );
  return response.data;
};

export const useFetchAllCitiesHubPages = (params: any = {}) => {
  return useQuery({
    queryKey: queryKeys.citiesHubPage.lists(params),
    queryFn: () => fetchAllCitiesHubPages(params),
  });
};

export const useFetchCitiesHubPageById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.citiesHubPage.detail(id),
    queryFn: () => fetchCitiesHubPageById(id),
    enabled: !!id,
  });
};

export const useCreateCitiesHubPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCitiesHubPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.citiesHubPage.all });
    },
  });
};

export const useUpdateCitiesHubPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCitiesHubPage,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.citiesHubPage.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.citiesHubPage.detail(data.id),
      });
    },
  });
};

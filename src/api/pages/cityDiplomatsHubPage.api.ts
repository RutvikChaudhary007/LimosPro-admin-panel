import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export interface CityDiplomatsHubPageData {
  id?: string;
  pageName: string;
  slug: string;
  isActive: boolean;
  defaultLanguage: string;
  availableLanguages: string[];
  content: {
    [languageCode: string]: {
      breadCrumb: {
        title: string;
        description: string;
        link: string;
      };
      intro?: {
        title: string;
        description: string;
        btnTitle: string;
        btnLink: string;
      };
      cards?: Array<{
        title: string;
        subTitle: string;
        image: string;
        alt: string;
        btnTitle: string;
        btnLink: string;
      }>;
      trustBlock?: Array<{
        image: string;
        alt: string;
        title: string;
        description: string;
      }>;
      faqs?: Array<{
        ques: string;
        answer: string;
      }>;
    };
  };
  seo: any;
  jsonLd: any;
}

export const fetchAllCityDiplomatsHubPages = async (params: any) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.CITY_DIPLOMATS_HUB_PAGE.GET_ALL,
    { params },
  );
  return data.data;
};

export const fetchCityDiplomatsHubPageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.CITY_DIPLOMATS_HUB_PAGE.GET_BY_ID(id),
  );
  return data.data;
};

export const createCityDiplomatsHubPage = async (
  formData: CityDiplomatsHubPageData,
) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CITY_DIPLOMATS_HUB_PAGE.CREATE,
    formData,
  );
  return data.data;
};

export const updateCityDiplomatsHubPage = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<CityDiplomatsHubPageData>;
}) => {
  const { data: response } = await axiosInstance.put(
    API_ENDPOINTS.CITY_DIPLOMATS_HUB_PAGE.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteCityDiplomatsHubPage = async (id: string) => {
  const { data } = await axiosInstance.delete(
    API_ENDPOINTS.CITY_DIPLOMATS_HUB_PAGE.DELETE(id),
  );
  return data;
};

export const useFetchAllCityDiplomatsHubPages = (params: any = {}) => {
  return useQuery({
    queryKey: queryKeys.cityDiplomatsHubPage.lists(params),
    queryFn: () => fetchAllCityDiplomatsHubPages(params),
  });
};

export const useFetchCityDiplomatsHubPageById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.cityDiplomatsHubPage.detail(id),
    queryFn: () => fetchCityDiplomatsHubPageById(id),
    enabled: !!id,
  });
};

export const useCreateCityDiplomatsHubPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCityDiplomatsHubPage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cityDiplomatsHubPage.all,
      });
    },
  });
};

export const useUpdateCityDiplomatsHubPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCityDiplomatsHubPage,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cityDiplomatsHubPage.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cityDiplomatsHubPage.detail(data.id),
      });
    },
  });
};

export const useDeleteCityDiplomatsHubPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCityDiplomatsHubPage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cityDiplomatsHubPage.all,
      });
    },
  });
};

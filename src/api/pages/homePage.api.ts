import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

export interface HomePageData {
  id?: string;
  pageName: string;
  slug: string;
  isActive: boolean;
  defaultLanguage: string;
  availableLanguages: string[];
  content: any; // Using any for flexible content structure
  seo: any;
  jsonLd: any;
}

export const fetchAllHomePages = async (params: any) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.HOME_PAGE_CONTENT.GET_ALL,
    { params },
  );
  return data.data;
};

export const fetchHomePageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.HOME_PAGE_CONTENT.GET_BY_ID(id),
  );
  return data.data;
};

export const createHomePage = async (formData: HomePageData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.HOME_PAGE_CONTENT.CREATE,
    formData,
  );
  return data.data;
};

export const updateHomePage = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<HomePageData>;
}) => {
  const { data: response } = await axiosInstance.put(
    API_ENDPOINTS.HOME_PAGE_CONTENT.UPDATE(id),
    data,
  );
  return response.data;
};

export const useFetchAllHomePages = (params: any = {}) => {
  return useQuery({
    queryKey: ["homePages", params],
    queryFn: () => fetchAllHomePages(params),
  });
};

export const useFetchHomePageById = (id: string) => {
  return useQuery({
    queryKey: ["homePage", id],
    queryFn: () => fetchHomePageById(id),
    enabled: !!id,
  });
};

export const useCreateHomePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHomePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homePages"] });
    },
  });
};

export const useUpdateHomePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHomePage,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["homePages"] });
      queryClient.invalidateQueries({ queryKey: ["homePage", data.id] });
    },
  });
};

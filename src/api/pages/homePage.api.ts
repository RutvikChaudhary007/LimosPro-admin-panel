import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

const api = axiosInstance;

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
  const { data } = await api.get(
    `${import.meta.env.VITE_API_BASE_URL}/pages/home`,
    { params },
  );
  return data.data; // Assuming standard response structure { data: { pages: [], pagination: {} } }
};

export const fetchHomePageById = async (id: string) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_API_BASE_URL}/pages/home/${id}`,
  );
  return data.data;
};

export const createHomePage = async (formData: HomePageData) => {
  const { data } = await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/pages/home`,
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
  const { data: response } = await api.put(
    `${import.meta.env.VITE_API_BASE_URL}/pages/home/${id}`,
    data,
  );
  return response.data;
};

// Hooks

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

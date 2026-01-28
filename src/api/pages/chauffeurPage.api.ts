import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

const api = axiosInstance;

export interface ChauffeurPageData {
  id?: string;
  pageName: string;
  slug: string;
  isActive: boolean;
  defaultLanguage: string;
  availableLanguages: string[];
  hero: any;
  content: any;
  seo: any;
  jsonLd: any;
}

export const fetchAllChauffeurPages = async (params: any) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_API_BASE_URL}/pages/chauffeur`,
    { params },
  );
  return data.data;
};

export const fetchChauffeurPageById = async (id: string) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_API_BASE_URL}/pages/chauffeur/${id}`,
  );
  return data.data;
};

export const createChauffeurPage = async (formData: ChauffeurPageData) => {
  const { data } = await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/pages/chauffeur`,
    formData,
  );
  return data.data;
};

export const updateChauffeurPage = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ChauffeurPageData>;
}) => {
  const { data: response } = await api.put(
    `${import.meta.env.VITE_API_BASE_URL}/pages/chauffeur/${id}`,
    data,
  );
  return response.data;
};

// Hooks

export const useFetchAllChauffeurPages = (params: any = {}) => {
  return useQuery({
    queryKey: ["chauffeurPages", params],
    queryFn: () => fetchAllChauffeurPages(params),
  });
};

export const useFetchChauffeurPageById = (id: string) => {
  return useQuery({
    queryKey: ["chauffeurPage", id],
    queryFn: () => fetchChauffeurPageById(id),
    enabled: !!id,
  });
};

export const useCreateChauffeurPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChauffeurPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chauffeurPages"] });
    },
  });
};

export const useUpdateChauffeurPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateChauffeurPage,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["chauffeurPages"] });
      queryClient.invalidateQueries({ queryKey: ["chauffeurPage", data.id] });
    },
  });
};

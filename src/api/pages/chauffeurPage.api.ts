import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

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
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.CHAUFFEUR_PAGE_CONTENT.GET_ALL,
    { params },
  );
  return data.data;
};

export const fetchChauffeurPageById = async (id: string) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.CHAUFFEUR_PAGE_CONTENT.GET_BY_ID(id),
  );
  return data.data;
};

export const createChauffeurPage = async (formData: ChauffeurPageData) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CHAUFFEUR_PAGE_CONTENT.CREATE,
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
  const { data: response } = await axiosInstance.put(
    API_ENDPOINTS.CHAUFFEUR_PAGE_CONTENT.UPDATE(id),
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

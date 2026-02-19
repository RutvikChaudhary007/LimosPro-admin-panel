import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MultiLangPageTemplateFormData } from "@/components/pagebuilder/PageBuilderBusinessForm";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { PageTemplateQueryParams } from "@/types/content";
import axiosInstance from "@/utils/axiosInstance";

export const getAllBusinessPageLayouts = async (
  params?: PageTemplateQueryParams,
) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.BUSINESS_PAGE_LAYOUT.GET_ALL,
    {
      params,
    },
  );
  return response.data.data;
};

export const useFetchAllBusinessPageLayouts = (
  params?: PageTemplateQueryParams,
) =>
  useQuery({
    queryKey: queryKeys.businessPageLayout.lists(params),
    queryFn: () => getAllBusinessPageLayouts(params),
    refetchOnWindowFocus: false,
    retry: false,
  });

export const getBusinessPageLayoutById = async (id: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.BUSINESS_PAGE_LAYOUT.GET_BY_ID(id),
  );
  return response.data.data;
};

export const useFetchBusinessPageLayoutById = (id: string) =>
  useQuery({
    queryKey: queryKeys.businessPageLayout.detail(id),
    queryFn: () => getBusinessPageLayoutById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const createBusinessPageLayout = async (
  data: MultiLangPageTemplateFormData,
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.BUSINESS_PAGE_LAYOUT.CREATE,
    data,
  );
  return response.data;
};

export const useCreateBusinessPageLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusinessPageLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessPageLayout.all,
      });
    },
  });
};

export const updateBusinessPageLayout = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<MultiLangPageTemplateFormData>;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.BUSINESS_PAGE_LAYOUT.UPDATE(id),
    data,
  );
  return response.data;
};

export const useUpdateBusinessPageLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBusinessPageLayout,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessPageLayout.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessPageLayout.detail(variables.id),
      });
    },
  });
};

export const deleteBusinessPageLayout = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.BUSINESS_PAGE_LAYOUT.DELETE(id),
  );
  return response.data;
};

export const useDeleteBusinessPageLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusinessPageLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessPageLayout.all,
      });
    },
  });
};

import adminAxiosInstance from "@/utils/axiosInstance";
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { TChauffeurForm } from "@/components/chauffeur/ChauffeurForm";

/**
 * #############################################
 *  Fetch Chauffeur
 * ##############################################
 * @param data 
 * @returns response data
 */

export const getAllChauffeur = async () => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_CHAUFFEUR}`);
    // console.log("response:",response)
  
    return response.data.data;
  };

const useFetchAllChauffeur = () =>
  useQuery({
    queryKey: ['chauffeurs'],
    queryFn: () => getAllChauffeur(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllChauffeur;

/**
 * #############################################
 *  Fetch Chauffeur By ID
 * ##############################################
 * @param data 
 * @returns response data
 */
export const getChauffeurById = async (id: string) => {

  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_CHAUFFEUR_BY_ID.replace(":id",id)}`);
  console.log("response:",response.data)
  return response?.data?.data;
};

export const useFetchChauffeurById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ['affiliateById', id],
    queryFn: () => getChauffeurById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
;

/**
 * #############################################
 *  Create Chauffeur
 * ##############################################
 * @param data 
 * @returns response data
 */
export const createChauffeur = async (data:object) => {
  const response = await adminAxiosInstance.post(API_ENDPOINTS.CREATE_CHAFFEUR,data, {
    headers: {
    'Content-Type': 'multipart/form-data',
    },
    });
    
  return response.data;
};

/**
 * #############################################
 *  Edit Chauffeur
 * ##############################################
 * @param data 
 * @returns response data
 */
export const editChauffeur = async ({data,id}:{data:TChauffeurForm,id:string| undefined}) => {
  // console.log("edit chauffeur..:",data)
  const response = await adminAxiosInstance.patch(API_ENDPOINTS.EDIT_CHAFFEUR.replace(':id', id!),data, {
    headers: {
    'Content-Type': 'multipart/form-data',
    },
    });
    
  return response.data;
};

/**
 * #############################################
 *  Delete Chauffeur
 * ##############################################
 * @param data 
 * @returns response data
 */
export const deleteChauffeur = async (id:string) => {
  const response = await adminAxiosInstance.delete(API_ENDPOINTS.DELETE_CHAFFEUR.replace(':id', id));
    
  return response.data;
};
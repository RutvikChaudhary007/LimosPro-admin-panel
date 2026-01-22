import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const formData = new FormData();

  if (data.firstName) formData.append("firstName", data.firstName);
  if (data.lastName) formData.append("lastName", data.lastName);
  if (data.email) formData.append("email", data.email);

  const response = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_PROFILE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const changePassword = async (data: ChangePasswordPayload) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.CHANGE_PASSWORD,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const deleteProfile = async (userId: string, permanent?: boolean) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_USERS.replace(":id", userId),
    {
      params: permanent ? { permanent: true } : undefined,
    },
  );

  return response.data;
};

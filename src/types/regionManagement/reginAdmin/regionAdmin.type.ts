export type TRegionAdminRes = {
  id: string;
  userId: string;
  adminName: string;
  createdAt: string;
  deletedAt: string;
  region: {
    id: string;
    regionName: string;
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
  };
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    dateOfBirth: string;
    deletedAt: string;
    email: string;
    gender: string;
    password: string;
    paymentMethod: string;
    phoneNumber: string;
    profilePicture: string;
    roleName: string;
    social: string;
    status: string;
    updatedAt: string;
  };
};

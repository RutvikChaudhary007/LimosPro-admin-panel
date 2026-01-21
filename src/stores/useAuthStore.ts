import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  accessToken: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  partnerId?: string;
  chauffeurId?: string;
  profilePicture?: string;
  permissions: string[];
  refreshToken: string;
};

type UserStore = {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user) => {
        set({
          user: user,
          isLoggedIn: !!user,
        });
      },
    }),
    {
      name: "user-store",
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  accessToken: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  permissions: string;
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
        console.log("zustand:", user);
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

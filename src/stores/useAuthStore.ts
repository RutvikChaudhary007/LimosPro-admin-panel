import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  first_name: string;
  profile: string;
  last_name: string;
  email: string;
  company_name: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist((set) => {
  return {
    user:null,
    isLoggedIn:false,
    token:null,
    setUser: (user, token) => {
      // console.log('user',user)
      if (user) {
        // Cookies.set('token', token, { path: '/', expires: 7 });
        // localStorage.setItem('user', JSON.stringify(user));
        set({ user, isLoggedIn: true, token });
      }
    },
    logout: () => {
      set({ user: null, isLoggedIn: false, token: null });
      localStorage.clear();
      window.location.href = "/login";
    },
  };
},
  {
      name: 'auth-store', // key used in localStorage
    }
));

export default useAuthStore;

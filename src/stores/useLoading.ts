import { create } from 'zustand';


interface ILoadingState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useLoading = create<ILoadingState>()(
  (set) => {
  return {
    isLoading: false,
    setLoading: (isLoading) => {
      console.log('Global loading>',isLoading)
        set({ isLoading});
    },
  };
});

export default useLoading;

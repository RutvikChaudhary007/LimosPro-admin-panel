import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./App.css";
import { renderRoutes } from "./routes/renderRoutes";
import { envValidationError } from "./utils/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  if (envValidationError) {
    // Show nice error UI instead of breaking the whole app
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8">
        <h1 className="text-3xl font-bold mb-4">
          Environment Configuration Error
        </h1>
        <p className="whitespace-pre-line text-left">{envValidationError}</p>
        <p className="mt-4 text-gray-600 font-semibold">
          Please check your <code>.env</code> file or Vite environment settings.
        </p>
      </div>
    );
  }

  // useEffect(() => {
  //   if ("scrollRestoration" in window.history) {
  //     console.log("scrollRestoration:", window.history.scrollRestoration);
  //     window.history.scrollRestoration = "auto";
  //   }
  // }, []);
  return (
    <TooltipProvider>
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {renderRoutes()}
        </QueryClientProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;

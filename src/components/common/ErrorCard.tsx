import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

export const ErrorCard = ({ refetch }: { refetch: () => void }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">
            Oops! Something went wrong.
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
            We're sorry for the inconvenience. Please try refreshing the page or navigating back.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-gray-700 dark:text-gray-200">An unexpected error has occurred.</p>
          <Button type="button" onClick={() => refetch()}>
            <AlertCircle />
            <span className="text-[#fffafa] font-medium text-sm">Retry</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

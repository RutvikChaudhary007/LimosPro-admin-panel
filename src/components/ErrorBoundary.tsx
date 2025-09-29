// ... existing code ...
import  { Component, type ErrorInfo,type ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; // Import Card components
import { Button } from "@/components/ui/button"; // Import Button component
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You can also log error messages to an error reporting service here
    // logErrorToMyService(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI matching project theme
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <Card className="w-full max-w-md p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">Oops! Something went wrong.</CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                We're sorry for the inconvenience. Please try refreshing the page or navigating back.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-gray-700 dark:text-gray-200">
                An unexpected error has occurred. Our team has been notified.
              </p>
              <Button asChild>
                <Link to="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
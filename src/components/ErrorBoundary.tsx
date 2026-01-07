// ... existing code ...
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom"; // Assuming react-router-dom for navigation
import { Button } from "@/components/ui/button"; // Import Button component
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Card components

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
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

  public handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // Custom fallback UI matching project theme
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <Card className="w-full max-w-md">
            <CardBody className="p-6">
              <CardHeader className="text-center p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Oops! Something went wrong.
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
                  We're sorry for the inconvenience. An unexpected error has
                  occurred.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="mb-6 text-gray-700 dark:text-gray-200 text-sm">
                  An unexpected error has occurred. You can try refreshing the
                  page or click the button below to try again.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={this.handleReset}
                    className="w-full"
                    variant="default"
                  >
                    Try Again
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/">Go to Homepage</Link>
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="ghost"
                    className="w-full text-xs text-gray-500"
                  >
                    Reload Page
                  </Button>
                </div>
              </CardContent>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
        Page Not Found
      </p>
      <p className="text-gray-500 mt-2 mb-6">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  );
}

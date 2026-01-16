import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-center text-2xl">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              You do not have permission to access this page or perform this
              action.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              If you believe this is an error, please contact your
              administrator.
            </p>
            <div className="flex gap-2 justify-center pt-4">
              <Button variant="outline" onClick={handleGoBack}>
                Go Back
              </Button>
              <Button onClick={handleGoHome}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;

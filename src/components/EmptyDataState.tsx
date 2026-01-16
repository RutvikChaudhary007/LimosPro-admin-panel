import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmptyDataStateProps {
  entityName: string;
  listRoute: string;
  title?: string;
  description?: string;
}

export function EmptyDataState({
  entityName,
  listRoute,
  title,
  description,
}: EmptyDataStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-amber-500" />
            </div>
            <CardTitle className="text-center text-2xl">
              {title || "Data Not Available"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-center">
              {description ||
                `The ${entityName.toLowerCase()} information you're looking for could not be found or loaded. This may be because the ${entityName.toLowerCase()} doesn't exist or has been removed.`}
            </CardDescription>
            <div className="flex gap-2 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button onClick={() => navigate(listRoute)}>
                View All {entityName}s
              </Button>
            </div>
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}

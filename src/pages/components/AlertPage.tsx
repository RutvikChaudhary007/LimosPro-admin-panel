import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BadgeCheck,
  PopcornIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AlertPage() {
  return (
    <div className="grid w-full max-w-5xl gap-6">
      {/* PRIMARY */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Alert>
          <PopcornIcon />
          <AlertTitle>
            This is a Primary Alert This is a Primary Alert This is a Primary
            Alert
          </AlertTitle>
        </Alert>
        <Alert variant="solidPrimary">
          <PopcornIcon />
          <AlertTitle>This is a Solid Primary Alert</AlertTitle>
        </Alert>
      </div>

      {/* SECONDARY */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Alert variant="secondary">
          <BadgeCheck />
          <AlertTitle>Secondary Alert</AlertTitle>
          <AlertDescription>This is a normal secondary alert.</AlertDescription>
        </Alert>
        <Alert variant="solidSecondary">
          <BadgeCheck />
          <AlertTitle>Solid Secondary Alert</AlertTitle>
          <AlertDescription>This is a solid secondary alert.</AlertDescription>
        </Alert>
      </div>

      {/* SUCCESS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Alert variant="success">
          <BadgeCheck />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
        <Alert variant="solidSuccess">
          <BadgeCheck />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
      </div>

      {/* DANGER */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Alert variant="danger">
          <AlertCircleIcon />
          <AlertTitle>Payment Failed</AlertTitle>
          <AlertDescription>
            Please verify your billing information and try again.
          </AlertDescription>
        </Alert>
        <Alert variant="solidDanger">
          <AlertCircleIcon />
          <AlertTitle>Payment Failed</AlertTitle>
          <AlertDescription>
            Please verify your billing information and try again.
          </AlertDescription>
        </Alert>
      </div>

      {/* WARNING */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Alert variant="warning">
          <AlertTriangleIcon />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Be cautious while performing this action.
          </AlertDescription>
        </Alert>
        <Alert variant="solidWarning">
          <AlertTriangleIcon />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Be cautious while performing this action.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export default AlertPage;

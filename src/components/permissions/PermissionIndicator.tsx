import { FolderKey, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFetchUserPermissions } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PermissionManager from "./PermissionManager";

interface PermissionIndicatorProps {
  userId: string;
  userRole: string;
  userName?: string;
  regionName?: string;
}

const PermissionIndicator = ({
  userId,
  userRole,
  userName,
  regionName,
}: PermissionIndicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: permissions, isLoading } = useFetchUserPermissions(userId);
  const isRegionalAdmin = userRole === "Regional Admin";

  const count = permissions?.length ?? 0;
  const isError = !isLoading && !permissions;

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative inline-flex items-center">
            <Button
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              disabled={isLoading}
              tooltip={
                isError
                  ? "Failed to load permissions"
                  : isRegionalAdmin && count === 0
                    ? "Sync/View Region Permissions"
                    : "View/Manage Permissions"
              }
            >
              <FolderKey />
            </Button>

            {/* Status indicator */}
            <div className="absolute -right-2 -top-1 flex items-center justify-center size-5">
              {isLoading ? (
                <Loader2
                  className="animate-spin text-muted-foreground"
                  aria-label="Loading permissions"
                />
              ) : isError ? (
                <Badge
                  variant="destructive"
                  className="p-0 size-5 flex items-center justify-center"
                >
                  !
                </Badge>
              ) : (
                <Badge
                  variant={count > 0 ? "default" : "gray"}
                  className="p-0 size-5 flex items-center justify-center"
                >
                  {count}
                </Badge>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Permissions: {userName || "User"} ({userRole})
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <PermissionManager
              userId={userId}
              userRole={userRole}
              regionName={regionName}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionIndicator;

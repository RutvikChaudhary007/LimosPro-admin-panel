import { FolderKey, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFetchRegionPermissions } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegionPermissionManager from "./RegionPermissionManager";

interface RegionPermissionIndicatorProps {
  regionId: string;
  regionName: string;
}

const RegionPermissionIndicator = ({
  regionName,
}: RegionPermissionIndicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: regionPermissionsRaw, isLoading } =
    useFetchRegionPermissions(regionName);

  // Normalize data
  const regionPermissions = Array.isArray(regionPermissionsRaw)
    ? regionPermissionsRaw
    : (regionPermissionsRaw as any)?.permissions ||
      (regionPermissionsRaw as any)?.data ||
      [];

  const count = regionPermissions.length || 0;
  const isError = !isLoading && !regionPermissionsRaw;

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
              tooltip="View/Manage Region Permissions"
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
            <DialogTitle>Region Permissions: {regionName}</DialogTitle>
          </DialogHeader>
          <div>
            <RegionPermissionManager regionName={regionName} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegionPermissionIndicator;

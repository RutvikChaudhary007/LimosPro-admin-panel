import { AlertCircle, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAssignPermissionToRegion,
  useFetchRegionPermissions,
  useFetchUserAllPermissions,
  useRemovePermissionFromRegion,
  useSyncRegionPermissionsToUsers,
  useUpdateRegionPermissionActions,
} from "@/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PermissionActionsEditor from "./PermissionActionsEditor";

interface RegionPermissionManagerProps {
  regionId: string;
  regionName: string;
}

const RegionPermissionManager = ({
  regionId,
  regionName,
}: RegionPermissionManagerProps) => {
  const [expandedPermission, setExpandedPermission] = useState<string | null>(
    null,
  );

  const apiIdentifier = regionId;
  const { data: regionPermissionsRaw, isLoading: isLoadingRegion } =
    useFetchRegionPermissions(apiIdentifier);
  const { data: allPermissionsRaw, isLoading: isLoadingAll } =
    useFetchUserAllPermissions();

  const assignMutation = useAssignPermissionToRegion();
  const removeMutation = useRemovePermissionFromRegion();
  const updateActionsMutation = useUpdateRegionPermissionActions();
  const syncMutation = useSyncRegionPermissionsToUsers(apiIdentifier);

  // Normalize data
  const regionPermissions = Array.isArray(regionPermissionsRaw)
    ? regionPermissionsRaw
    : (regionPermissionsRaw as any)?.permissions ||
      (regionPermissionsRaw as any)?.data ||
      [];

  const allPermissions = Array.isArray(allPermissionsRaw)
    ? allPermissionsRaw
    : (allPermissionsRaw as any)?.permissions ||
      (allPermissionsRaw as any)?.data ||
      [];

  const handleTogglePermission = async (
    permissionId: string,
    isAssigned: boolean,
  ) => {
    try {
      if (isAssigned) {
        await removeMutation.mutateAsync({
          regionId: apiIdentifier,
          permissionId,
        });
        toast.success("Permission removed from region template");
      } else {
        await assignMutation.mutateAsync({
          regionId: apiIdentifier,
          permissionId,
        });
        toast.success("Permission assigned to region template");
      }
    } catch (error) {
      toast.error("Failed to update permission");
    }
  };

  const handleActionSave = async (
    permissionId: string,
    actions: Record<string, boolean>,
  ) => {
    try {
      await updateActionsMutation.mutateAsync({
        regionId: apiIdentifier,
        permissionId,
        actions,
      });
      toast.success("Permission actions updated");
    } catch (error) {
      toast.error("Failed to update actions");
    }
  };

  const handleSyncToUsers = async () => {
    try {
      await syncMutation.mutateAsync();
      toast.success(
        `Synced permissions to all Regional Admins in ${regionName}`,
      );
    } catch (error) {
      toast.error("Failed to sync permissions");
    }
  };

  const isLoading = isLoadingRegion || isLoadingAll;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full ">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded border bg-base-info/10 border-base-info/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-base-info mt-0.5" />
            <div>
              <p className="text-sm font-bold text-base-black">
                Region Template: {regionName}
              </p>
              <p className="text-xs text-base-black/70 mt-1 leading-relaxed font-medium">
                Changes affect new admins automatically. Push updates to current
                admins using Sync.
              </p>
            </div>
          </div>
          <Button
            onClick={handleSyncToUsers}
            disabled={syncMutation.isPending}
            variant="outlineInfo"
            size="sm"
            spacing="md"
          >
            {syncMutation.isPending ? (
              <Loader2 className=" animate-spin" />
            ) : (
              "Sync Users"
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-base-gray uppercase tracking-widest">
              Template Permissions
            </h3>
            <Badge variant="outline">{regionPermissions.length} Active</Badge>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full border border-base-gray"
            value={expandedPermission || ""}
            onValueChange={(val) => setExpandedPermission(val || null)}
          >
            {allPermissions.map((permission: any) => {
              const regionPerm = regionPermissions.find(
                (rp: any) => rp.permissionId === permission.id,
              );
              const isAssigned = !!regionPerm;

              // Defensively parse actions if they arrive as string
              const rawActions = regionPerm?.actions || {};
              const actions =
                typeof rawActions === "string"
                  ? JSON.parse(rawActions)
                  : rawActions;

              return (
                <AccordionItem key={permission.id} value={permission.id}>
                  <div className="flex items-center">
                    <div className="pl-4">
                      <Checkbox
                        id={`perm-${permission.id}`}
                        checked={isAssigned}
                        onCheckedChange={() =>
                          handleTogglePermission(permission.id, isAssigned)
                        }
                      />
                    </div>
                    <AccordionTrigger className="flex-1 py-5 px-4 hover:no-underline text-left">
                      <div className="flex items-center gap-3">
                        <Shield
                          className={`size-4 ${isAssigned ? "text-base-primary" : "text-base-gray"}`}
                        />
                        <span
                          className={`text-base font-bold tracking-tight ${isAssigned ? "text-base-black" : "text-base-black/40"}`}
                        >
                          {permission.name}
                        </span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="pb-8 pt-0 px-4">
                    <Separator className="mb-8 bg-base-gray" />
                    {isAssigned ? (
                      <PermissionActionsEditor
                        permissionId={permission.id}
                        actions={actions}
                        onSave={(newActions) =>
                          handleActionSave(permission.id, newActions)
                        }
                        isLoading={updateActionsMutation.isPending}
                      />
                    ) : (
                      <div className="p-6 rounded bg-base-light-gray/50 text-center border border-dashed border-base-gray">
                        <p className="text-sm text-base-black/50 font-medium italic">
                          Assign this permission to configure granular actions
                          for this template.
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
};

export default RegionPermissionManager;

import { AlertCircle, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAssignPermissionToUser,
  useFetchUserAllPermissions,
  useFetchUserPermissions,
  useRemovePermissionFromUser,
  useUpdatePermissionActions,
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

interface PermissionManagerProps {
  userId: string;
  userRole: string;
  regionName?: string;
}

const PermissionManager = ({
  userId,
  userRole,
  regionName,
}: PermissionManagerProps) => {
  const {
    data: userPermissionsRaw,
    isLoading: loadingUserPerms,
    refetch,
  } = useFetchUserPermissions(userId);
  const { data: allPermissionsRaw, isLoading: loadingAllPerms } =
    useFetchUserAllPermissions();
  const assignMutation = useAssignPermissionToUser();
  const removeMutation = useRemovePermissionFromUser();
  const updateMutation = useUpdatePermissionActions();
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedPermission, setExpandedPermission] = useState<string | null>(
    null,
  );

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await refetch();
      toast.success("Permissions synced with templates");
    } catch (error) {
      toast.error("Failed to sync permissions");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleActionSave = async (
    permissionId: string,
    actions: Record<string, boolean>,
  ) => {
    try {
      await updateMutation.mutateAsync({
        userId,
        permissionId,
        actions,
      });
      toast.success("Permission actions updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update permission actions");
    }
  };

  const allPermissions = Array.isArray(allPermissionsRaw)
    ? allPermissionsRaw
    : (allPermissionsRaw as any)?.permissions ||
      (allPermissionsRaw as any)?.data ||
      [];

  const userPermissions = Array.isArray(userPermissionsRaw)
    ? userPermissionsRaw
    : (userPermissionsRaw as any)?.permissions ||
      (userPermissionsRaw as any)?.data ||
      [];

  const isRegionalAdmin = userRole === "Regional Admin";

  const handlePermissionToggle = async (
    permissionId: string,
    isAssigned: boolean,
  ) => {
    try {
      if (isAssigned) {
        await removeMutation.mutateAsync({ userId, permissionId });
        toast.success("Permission removed successfully");
      } else {
        await assignMutation.mutateAsync({ userId, permissionId });
        toast.success("Permission assigned successfully");
      }
      refetch();
    } catch (error) {
      toast.error(`Failed to ${isAssigned ? "remove" : "assign"} permission`);
    }
  };

  const isLoading = loadingUserPerms || loadingAllPerms;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        {isRegionalAdmin && (
          <div className="flex font-quicksand items-center justify-between gap-4 p-4 rounded border bg-base-info/10 border-base-info/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-base-info mt-0.5" />
              <div>
                <p className="text-sm font-bold text-base-black">
                  Regional Admin - {regionName}
                </p>
                <p className="text-xs text-base-black/70 mt-1 leading-relaxed font-medium">
                  Permissions are merged from Role + Region templates. Use sync
                  to refresh from latest templates.
                </p>
              </div>
            </div>
            <Button
              variant="outlineBlack"
              size="sm"
              spacing="md"
              onClick={handleManualSync}
              disabled={isSyncing}
            >
              {isSyncing ? <Loader2 /> : null}
              Sync
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-base-gray uppercase tracking-widest font-quicksand">
              Available Permissions
            </h3>
            <Badge variant="outline">{userPermissions.length} Assigned</Badge>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full border border-base-gray"
            value={expandedPermission || ""}
            onValueChange={(val) => setExpandedPermission(val || null)}
          >
            {allPermissions.map((permission: any) => {
              const userPerm = userPermissions.find(
                (up: any) => up.permissionId === permission.id,
              );
              const isAssigned = !!userPerm;

              return (
                <AccordionItem key={permission.id} value={permission.id}>
                  <div className="flex items-center w-full">
                    <div className="pl-4">
                      <Checkbox
                        checked={isAssigned}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission.id, isAssigned)
                        }
                        disabled={
                          assignMutation.isPending || removeMutation.isPending
                        }
                      />
                    </div>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Shield
                          className={`size-4 ${isAssigned ? "text-base-primary" : "text-base-gray"}`}
                        />
                        <span
                          className={
                            isAssigned ? "text-base-black" : "text-base-gray"
                          }
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
                        actions={userPerm?.actions || {}}
                        onSave={(actions) =>
                          handleActionSave(permission.id, actions)
                        }
                        isLoading={updateMutation.isPending}
                      />
                    ) : (
                      <div className="p-6 rounded bg-base-light-gray/50 text-center border border-dashed border-base-gray">
                        <p className="text-sm text-base-black/50 font-medium italic">
                          Assign this permission to configure granular actions.
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

export default PermissionManager;

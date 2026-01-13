import { Info, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PermissionActionsEditorProps {
  permissionId: string;
  actions: Record<string, boolean>;
  onSave: (actions: Record<string, boolean>) => Promise<void>;
  isLoading?: boolean;
}

const PermissionActionsEditor = ({
  permissionId,
  actions: initialActions,
  onSave,
  isLoading = false,
}: PermissionActionsEditorProps) => {
  const [actions, setActions] = useState(initialActions);
  const [hasChanges, setHasChanges] = useState(false);

  const handleActionToggle = (actionKey: string) => {
    setActions((prev) => ({
      ...prev,
      [actionKey]: !prev[actionKey],
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(actions);
    setHasChanges(false);
  };

  const handleReset = () => {
    setActions(initialActions);
    setHasChanges(false);
  };

  // Group actions by category for better UX
  const actionGroups = {
    "Basic Access": ["view", "read"],
    "CRUD Operations": ["create", "update", "delete", "bulkDelete", "restore"],
    // "Data Operations": ["export", "import"],
    // "Workflow Status": [
    //   "approve",
    //   "reject",
    //   "assign",
    //   "reassign",
    //   "cancel",
    //   "reschedule",
    // ],
    // "Visibility Scope": ["viewAll", "viewOwn", "viewRegion", "viewTeam"],
    // Financial: [
    //   "viewPricing",
    //   "editPricing",
    //   "applyDiscount",
    //   "viewRevenue",
    //   "issueRefund",
    // ],
    // "System & Advanced": [
    //   "manageSettings",
    //   "managePermissions",
    //   "impersonate",
    //   "auditLogs",
    //   "forceAction",
    // ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-base-primary/10 p-2 rounded">
            <Info className="size-5 text-base-primary" />
          </div>
          <div>
            <h4 className="font-bold text-base text-base-black uppercase tracking-tight">
              Action Permissions
            </h4>
            <p className="text-xs text-base-black/50 font-medium">
              Fine-tune functional access for this feature
            </p>
          </div>
        </div>
        {hasChanges && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
            <Button
              onClick={handleReset}
              disabled={isLoading}
              variant="outlinePrimary"
            >
              <RotateCcw />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {Object.entries(actionGroups).map(([groupName, actionKeys]) => {
          const availableActions = actionKeys.filter(
            (key) =>
              key in actions ||
              ["view", "read", "create", "update", "delete"].includes(key),
          );

          if (availableActions.length === 0) return null;

          return (
            <div key={groupName} className="space-y-4">
              <div className="flex items-center gap-3">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-base-gray">
                  {groupName}
                </h5>
                <Separator className="flex-1 opacity-50" />
              </div>
              <div className="grid gap-2">
                {availableActions.map((actionKey) => (
                  <div
                    key={actionKey}
                    className="flex items-center justify-between group rounded p-2 hover:bg-base-light-gray/50 transition-colors border border-transparent hover:border-base-light-gray"
                  >
                    <Label
                      htmlFor={`${permissionId}-${actionKey}`}
                      className="text-sm font-medium text-base-black/70 capitalize cursor-pointer flex-1"
                    >
                      {actionKey.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Checkbox
                      id={`${permissionId}-${actionKey}`}
                      checked={!!actions[actionKey]}
                      onCheckedChange={() => handleActionToggle(actionKey)}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionActionsEditor;

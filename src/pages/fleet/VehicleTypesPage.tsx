import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  createVehicleType,
  deleteVehicleType,
  editVehicleType,
  type IVehicleType,
  useFetchVehicleTypes,
} from "@/api/vehicleType.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toastPromise } from "@/hooks/use-toast";
import { useInvalidateModule } from "@/hooks/useInvalidateModule";
import { generatePageTitle } from "@/utils/seo";

const initialForm = {
  name: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

function VehicleTypesPage() {
  const { invalidate } = useInvalidateModule();
  const { data, isPending, isError, refetch } = useFetchVehicleTypes(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createVehicleType,
    onSuccess: () => {
      invalidate.vehicleType();
      invalidate.vehicle();
      refetch();
      setForm(initialForm);
    },
  });

  const editMutation = useMutation({
    mutationFn: editVehicleType,
    onSuccess: () => {
      invalidate.vehicleType();
      invalidate.vehicle();
      refetch();
      setEditingId(null);
      setForm(initialForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicleType,
    onSuccess: () => {
      invalidate.vehicleType();
      invalidate.vehicle();
      refetch();
    },
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    if (editingId) {
      await toastPromise(
        editMutation.mutateAsync({
          id: editingId,
          data: form,
        }),
        {
          loading: "Updating vehicle type...",
          success: "Vehicle type updated.",
          error: "Failed to update vehicle type.",
        },
      );
      return;
    }
    await toastPromise(createMutation.mutateAsync(form), {
      loading: "Creating vehicle type...",
      success: "Vehicle type created.",
      error: "Failed to create vehicle type.",
    });
  };

  const startEdit = (item: IVehicleType) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive,
    });
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Vehicle Types")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Vehicle Types"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Vehicle Types" },
          ]}
        />

        <Card>
          <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Vehicle type name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
            <Input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="Sort order"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  sortOrder: Number(e.target.value || 0),
                }))
              }
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleSubmit} disabled={!form.name.trim()}>
                {editingId ? "Update" : "Create"}
              </Button>
              {editingId ? (
                <Button
                  variant="outlineSecondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            {isPending ? (
              <Spinner />
            ) : (
              <div className="space-y-4">
                {(data?.items || []).map((item: IVehicleType) => (
                  <div
                    key={item.id}
                    className="border rounded-md p-4 md:p-5 flex items-center justify-between gap-4"
                  >
                    <div className="pr-4">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.description || "-"} | Sort: {item.sortOrder} |{" "}
                        {item.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outlineSecondary"
                        onClick={() =>
                          toastPromise(
                            editMutation.mutateAsync({
                              id: item.id,
                              data: { isActive: !item.isActive },
                            }),
                            {
                              loading: "Updating status...",
                              success: "Status updated.",
                              error: "Failed to update status.",
                            },
                          )
                        }
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outlinePrimary"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          toastPromise(deleteMutation.mutateAsync(item.id), {
                            loading: "Deleting...",
                            success: "Vehicle type deleted.",
                            error: "Failed to delete vehicle type.",
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default VehicleTypesPage;

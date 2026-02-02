import {
  IconArrowNarrowUp,
  IconArrowsUpDown,
  IconBrandWhatsapp,
  IconFileCheck,
  IconMap,
} from "@tabler/icons-react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Edit,
  Eye,
  Mail,
  Phone,
  PhoneIcon,
  Reply,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { INotification } from "@/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TChauffeur } from "@/types/chauffeur/chauffeur.type";
import type { IEditPartnerRes, IPartner } from "@/types/partner/partner.type";
import { formatDate as notificationDateFormat } from "../layouts/header/notifications-context";
import ManageRefund from "../manageRefund/ManageRefund";
import {
  PermissionGate,
  PermissionIndicator,
  RegionPermissionIndicator,
} from "../permissions";
import { Badge } from "../ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

// Header checkbox component - NOT memoized to ensure it always re-renders with latest state
function SelectHeaderCheckbox({ table }: { table: Table<any> }) {
  const isAllSelected = table.getIsAllPageRowsSelected();
  const isSomeSelected = table.getIsSomePageRowsSelected();

  return (
    <Checkbox
      checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

export const getStatusColor = (status: string): string => {
  if (status?.toLowerCase() === "active") {
    return "bg-[#444444]";
  } else if (status?.toLowerCase() === "inactive") {
    return "bg-[#B8B8B8] text-black";
  } else if (status?.toLowerCase() === "suspended") {
    return "bg-[#ECECEC] text-black";
  } else if (status?.toLowerCase() === "completed") {
    return "bg-[#444444] text-white";
  } else if (status?.toLowerCase() === "ongoing") {
    return "bg-[#ECECEC] text-black";
  } else if (status?.toLowerCase() === "canceled") {
    return "bg-[#B8B8B8] text-black";
  }
  return "bg-[#ececeb] text-black";
};
export const getStatusVariant = (status: string) => {
  const map = {
    pending: "gray",
    ongoing: "info",
    suspended: "gray",

    canceled: "destructive",
    cancelled: "destructive",
    rejected: "destructive",

    inactive: "black",
  } as const;

  return map[status?.toLowerCase() as keyof typeof map] || "default";
};

export type TDashboardBooking = {
  id: string;
  userName: string;
  bookingId: string;
  price: number;
  commute: string;
  status: string;
};

export type TAuditLog = {
  id: string;
  statusCode?: number | string;
  module?: string;
  action?: string;
  method?: string;
};

export const getAuditLogColumns = (
  onView: (id: string) => void,
): ColumnDef<TAuditLog>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "module",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Module" />
      ),
      cell: ({ row }) => (
        <span className="uppercase">{row.original.module || "N/A"}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action Type" />
      ),
      cell: ({ row }) => (
        <span className="uppercase">{row.original.action || "N/A"}</span>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Actions" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onView(String(row.original.id))}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View Details"
          >
            <Eye />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
};

export const getDashboardColumns = (): ColumnDef<TDashboardBooking>[] => {
  return [
    {
      id: "userName",
      accessorKey: "userName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Users" />
      ),
      enableSorting: false,
    },
    {
      id: "bookingId",
      accessorKey: "bookingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking ID" />
      ),
      enableSorting: false,
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      enableSorting: false,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
  ];
};

export type TRegion = {
  id: string;
  regionName: string;
  admin: string;
};

export function getRegionColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  isPending: boolean,
): ColumnDef<TRegion>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "regionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region Name" />
      ),
      enableSorting: false,
    },
    // { accessorKey: "admin", header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <RegionPermissionIndicator
            regionId={row.original.id}
            regionName={row.original.regionName}
          />
          <PermissionGate permission="manageRegions" action="update">
            <Button
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              onClick={() => onEdit(row.original.id)}
              className="ml-4"
              tooltip="Edit"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageRegions" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete Region</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this region? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outlinePrimary" disabled={isPending}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete region"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export function getSupportTickets(
  onView: (id: string) => void,
): ColumnDef<TSupportTicket>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ticket ID" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
      enableSorting: false,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "region",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "OPEN"
              ? "destructive"
              : row.original.status === "RESOLVED"
                ? "success"
                : "default"
          }
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "raisedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Raised By" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), "dd MMM yyyy")
            : "N/A"}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View Details"
          >
            <Eye />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TRegionAdmin = {
  id: string;
  userId: string;
  adminName: string;
  createdAt: string;
  deletedAt: string;
  region: {
    id: string;
    regionName: string;
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
  };
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    dateOfBirth: string;
    deletedAt: string;
    email: string;
    gender: string;
    password: string;
    paymentMethod: string;
    phoneNumber: string;
    profilePicture: string;
    roles: string[];
    roleName: string;
    social: string;
    status: string;
    updatedAt: string;
  };
};

export function getRegionAdminColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  isPending: boolean,
  _onAccess: (id: string) => void,
): ColumnDef<TRegionAdmin>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "region.regionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region Name" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionIndicator
            userId={row.original.user.id}
            userRole="Regional Admin"
            userName={`${row.original.user.firstName} ${row.original.user.lastName}`}
            regionName={row.original.region.regionName}
          />
          <PermissionGate permission="manageRegionAdmins" action="update">
            <Button
              className="ml-4"
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageRegionAdmins" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete Regional Admin</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this regional admin? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outlinePrimary" disabled={isPending}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete admin"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export function getPartner(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<IPartner | IEditPartnerRes>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Partner Name" />
      ),
      cell: ({ row }) => {
        const user = (row.original as IEditPartnerRes).user;
        return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;
      },
      enableSorting: false,
    },
    {
      accessorKey: "businessEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email Address" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "businessContactNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact Number" />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const number = row.original.businessContactNumber;
        const normalizedNumber = number.replace(/\D/g, "");
        return (
          <HoverCard openDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="linkDark" spacing="none">
                {number}
              </Button>
            </HoverCardTrigger>

            <HoverCardContent className="w-36 p-4 rounded">
              <div className="flex items-center justify-between">
                <Button
                  asChild
                  variant="outlineNavBtnPrimary"
                  size="xl"
                  spacing="lg"
                  tooltip="Call"
                >
                  <a href={`tel:${normalizedNumber}`}>
                    <PhoneIcon />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outlineNavBtnPrimary"
                  size="xl"
                  spacing="lg"
                  tooltip="Whatsapp"
                >
                  <a
                    href={`https://wa.me/${normalizedNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconBrandWhatsapp />
                  </a>
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "commissionRate",
      header: ({ column }) => (
        <div className="w-30">
          <DataTableColumnHeader
            column={column}
            title="Commission Per Ride (%)"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-30 text-center">{row.original.commissionRate}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "isChauffer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chauffeur" />
      ),
      cell: ({ row }) => <span>{row.original.isChauffer ? "Yes" : "No"}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionIndicator
            userId={(row.original as any).user?.id}
            userRole="Partner"
            userName={`${(row.original as any).user?.firstName || ""} ${(row.original as any).user?.lastName || ""}`}
          />
          <PermissionGate permission="managePartners" action="view">
            <Button
              className="ml-4"
              onClick={() => onView(row?.original?.id ?? "")}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View"
            >
              <Eye />
            </Button>
          </PermissionGate>
          <PermissionGate permission="managePartners" action="update">
            <Button
              onClick={() => onEdit(row.original.id ?? "")}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="managePartners" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete Partner</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this partner? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outlinePrimary">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => onDelete(row.original.id ?? "")}
                    variant="destructive"
                  >
                    Delete partner
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export function getChauffeur(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TChauffeur>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "vehicle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle Name" />
      ),
      cell: ({ row }) => {
        const vehicle = row.original.vehicle;
        return vehicle ? `${vehicle.brand} ${vehicle.model}` : "N/A";
      },
      enableSorting: false,
    },
    {
      accessorKey: "licenseNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="License Number" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "taxIdNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tax Id Number" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => {
        return (
          <Badge>
            <Star />
            <span>{row.original.rating}</span>
          </Badge>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          <span>{row.original.status}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionIndicator
            userId={row.original.userId ?? ""}
            userRole="Chauffeur"
            userName={`${row.original.user?.firstName || ""} ${row.original.user?.lastName || ""}`}
          />
          <PermissionGate
            permission={["manageChauffeurs", "managePartnerChauffeurs"]}
            action="view"
          >
            <Button
              className="ml-4"
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View"
            >
              <Eye />
            </Button>
          </PermissionGate>
          <PermissionGate permission="managePartnerChauffeurs" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="managePartnerChauffeurs" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete Chauffeur</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this chauffeur? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outlinePrimary">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Delete chauffeur
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TUsers = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  paymentMethod: string;
  profilePicture: string;
  social: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
export function getUsers(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TUsers>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          <span>{row.original.status}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageUsers" action="view">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View User"
            >
              <Eye />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageUsers" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit User"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageUsers" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete User"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TBooking = {
  id: string;
  userId: string;
  partnerId: string;
  bookingType: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
  };
  isThirdPartyUser: boolean;
  thirdPartyUser: {
    name: string;
    email: string;
    phone: string;
  };
  scheduledTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "MMM d, yyyy h:mm a");
};

export function getBooking(
  onView: (id: string) => void,
): ColumnDef<TBooking>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "partnerId",
      accessorKey: "partnerId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Partner Id" />
      ),
      enableSorting: false,
    },
    {
      id: "bookingType",
      accessorKey: "bookingType",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Booking Type"
          className="text-center"
        />
      ),

      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <TooltipProvider delayDuration={0}>
            {row.original.bookingType === "oneWay" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <IconArrowNarrowUp />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>One Way</p>
                </TooltipContent>
              </Tooltip>
            )}
            {row.original.bookingType === "twoWay" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <IconArrowsUpDown />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Two Way</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "scheduledTime",
      accessorKey: "scheduledTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Scheduled Time" />
      ),
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
      enableSorting: false,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          <span>{row.original.status}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageBookings" action="view">
            <Button
              type="button"
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Email User"
            >
              <Mail />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageBookings" action="view">
            <Button
              type="button"
              onClick={() => {
                const phone = row?.original?.thirdPartyUser?.phone;
                if (phone) {
                  window.location.href = `tel:${phone}`;
                }
              }}
              variant="outlineNavBtnSuccess"
              size="xl"
              spacing="lg"
              tooltip="Call User"
            >
              <Phone />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageBookings" action="view">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View"
            >
              <Eye />
            </Button>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TFleet = {
  id: string;
  partnerId: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vehicleType: string;
  capacity: number;
  documents: [];
  vehicleImages: [];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    password: string;
    status: string;
    roles: string[];
    roleName: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null | undefined;
  };
};

export function getFleets(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TFleet>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "partner.user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Partner Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="">
            {row.original?.user?.firstName} {row.original?.user?.lastName}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "plateNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Plate Number" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "vehicleType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle Type" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Capacity" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View Fleet"
          >
            <Eye />
          </Button>
          <PermissionGate permission="manageFleets" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Fleet"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageFleets" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete Fleet"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Fleet</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this fleet? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TTrips = {
  id: string;
  bookingId: string;
  chaufferId: string;
  tripType: string;
  tripStatus: string;
  tripStartTime: string;
  tripEndTime: string;
  distanceInKm: number;
  gratuity: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

export function getTrips(
  onView: (id: string) => void,
  onMap: (id: string) => void,
): ColumnDef<TTrips>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "bookingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking Id" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "tripType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trip Type" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "tripStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trip Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.tripStatus ?? "")}
          className="capitalize"
        >
          <span>{row.original.tripStatus}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "distanceInKm",
      header: ({ column }) => (
        <div className="w-20">
          <DataTableColumnHeader column={column} title="Distance In Km" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-20 text-center">{row.original.distanceInKm}</div>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageTrips" action="view">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View Trip Details"
            >
              <Eye />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageTrips" action="view">
            <Button
              onClick={() => onMap(row.original.id)}
              variant="outlineNavBtnWarning"
              size="xl"
              spacing="lg"
              tooltip="View On Map"
            >
              <IconMap />
            </Button>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export function getNotification(
  onMarkAsRead?: (id: string) => void,
  onDelete?: (id: string) => void,
): ColumnDef<INotification>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "isRead",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant={row.original.isRead ? "success" : "warning"}>
          <span>{row.original.isRead ? "Read" : "Unread"}</span>
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created On" />
      ),
      enableSorting: false,
      cell: ({ row }) => notificationDateFormat(row.original.createdAt),
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          {!row.original.isRead && onMarkAsRead && (
            <PermissionGate permission="manageNotifications" action="update">
              <Button
                onClick={() => onMarkAsRead(row.original.id)}
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Mark as Read"
              >
                <IconFileCheck />
              </Button>
            </PermissionGate>
          )}
          {onDelete && (
            <PermissionGate permission="manageNotifications" action="delete">
              <Button
                onClick={() => onDelete(row.original.id)}
                variant="outlineNavBtnDestructive"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </PermissionGate>
          )}
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TPayments = {
  userDetails: any;
  id: string;
  partnerId?: string;
  partnerName?: string;
  transactionType?: string;
  amount?: number | string;
  status?: string;
  bookingId?: string;
  grossCallback?: number | string;
  platformMargin?: number | string;
};

export type TPayoutWallet = {
  id: string;
  partnerId: string;
  partnerName: string;
  balance: string | number;
  totalEarnings: string | number;
  totalWithdrawn: string | number;
  updatedAt: string;
};

export function getPayoutWalletColumns(
  onView: (id: string) => void,
  onManualPayout: (payload: {
    partnerId: string;
    amount: string | number;
  }) => void,
  options?: { showWithdraw?: boolean },
): ColumnDef<TPayoutWallet>[] {
  const showWithdraw = options?.showWithdraw ?? true;
  return [
    {
      accessorKey: "partnerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Partner Name" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "partnerId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Partner Id" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Balance" />
      ),
      cell: ({ row }) => <span>${row.original.balance}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "totalEarnings",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Earnings" />
      ),
      cell: ({ row }) => <span>${row.original.totalEarnings}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "totalWithdrawn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Withdrawn" />
      ),
      cell: ({ row }) => <span>${row.original.totalWithdrawn}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.updatedAt
            ? format(new Date(row.original.updatedAt), "dd MMM yyyy")
            : "N/A"}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => {
        const [withdrawType, setWithdrawType] = useState<"full" | "personal">(
          "full",
        );
        const [amount, setAmount] = useState("");

        return (
          <div className="text-right flex gap-2 items-center justify-end">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View Details"
            >
              <Eye />
            </Button>
            {showWithdraw && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outlineNavBtnPrimary" size="xl" spacing="lg">
                    Dispute
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-2xl rounded-2xl shadow-xl p-0">
                  <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-2xl font-bold text-center">
                      Withdraw
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-muted-foreground">
                      Select a withdrawal type and confirm the amount.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-6 pb-0 pt-2 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 w-full justify-center">
                      <Label
                        className={`flex-1 rounded-xl border bg-muted/30 p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-primary/60 ${withdrawType === "full" ? "border-primary ring-2 ring-primary/20" : ""}`}
                        htmlFor={`withdraw-${row.original.id}-full`}
                      >
                        <Input
                          type="radio"
                          id={`withdraw-${row.original.id}-full`}
                          name={`withdraw-${row.original.id}`}
                          value="full"
                          checked={withdrawType === "full"}
                          onChange={() => setWithdrawType("full")}
                          className="mb-2 size-5 accent-primary"
                        />
                        <span className="block text-base font-semibold text-center">
                          Full Withdraw
                        </span>
                        <span className="block text-xs text-muted-foreground text-center">
                          Withdraw the entire available balance.
                        </span>
                      </Label>
                      <Label
                        className={`flex-1 rounded-xl border bg-muted/30 p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-primary/60 ${withdrawType === "personal" ? "border-primary ring-2 ring-primary/20" : ""}`}
                        htmlFor={`withdraw-${row.original.id}-personal`}
                      >
                        <Input
                          type="radio"
                          id={`withdraw-${row.original.id}-personal`}
                          name={`withdraw-${row.original.id}`}
                          value="personal"
                          checked={withdrawType === "personal"}
                          onChange={() => setWithdrawType("personal")}
                          className="mb-2 size-5 accent-primary"
                        />
                        <span className="block text-base font-semibold text-center">
                          partial Payment
                        </span>
                        <span className="block text-xs text-muted-foreground text-center">
                          Enter a custom amount for this payment.
                        </span>
                      </Label>
                    </div>
                    {withdrawType === "personal" && (
                      <div className="space-y-2 rounded-xl border bg-muted/20 p-4 flex flex-col items-center">
                        <Label
                          className="text-sm font-medium w-full"
                          htmlFor={`amount-${row.original.id}`}
                        >
                          Amount
                        </Label>
                        <Input
                          className="w-full rounded-lg border bg-background px-4 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          id={`amount-${row.original.id}`}
                          type="number"
                          min="0"
                          max={row.original.balance}
                          placeholder={`Max: ${row.original.balance}`}
                          value={amount}
                          onChange={(event) => {
                            const val = event.target.value;
                            if (Number(val) > Number(row.original.balance)) {
                              setAmount(String(row.original.balance));
                            } else {
                              setAmount(val);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter className="px-6 py-4 flex flex-row gap-3 justify-end">
                    <DialogClose asChild>
                      <Button variant="outlinePrimary" className="w-28">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className="w-28 font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm rounded-lg"
                      variant="default"
                      onClick={() => {
                        const rawAmount =
                          withdrawType === "full"
                            ? row.original.balance
                            : amount;
                        const payloadAmount = Number(rawAmount);
                        onManualPayout({
                          partnerId: row.original.partnerId,
                          amount: Number.isNaN(payloadAmount)
                            ? 0
                            : payloadAmount,
                        });
                      }}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}
export function getPayments(
  onView: (id: string) => void,
  // onMap: (id: string) => void,
  // onAccess: (id: string) => void,
  options?: { showWithdraw?: boolean },
): ColumnDef<TPayments>[] {
  const showWithdraw = options?.showWithdraw ?? true;
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "passengerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Passenger Name" />
      ),
      cell: ({ row }) => {
        const user = row.original.userDetails;
        return (
          <span>
            {(user?.firstName || "").trim()} {(user?.lastName || "").trim()}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "bookingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking Id" />
      ),
      cell: ({ row }) => (
        <span>{row.original.bookingId || (row.original as any).BookingId}</span>
      ),
      enableSorting: false,
    },
    {
      id: "paymentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PaymentId" />
      ),
      cell: ({ row }) => (
        <span>
          {(row.original as any).paymentId || (row.original as any).PaymentId}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => <span>${row.original.amount}</span>,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => {
        const [withdrawType, setWithdrawType] = useState<"full" | "personal">(
          "full",
        );
        const [amount, setAmount] = useState("");

        return (
          <div className="text-right flex gap-2 items-center justify-end">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View Details"
            >
              <Eye />
            </Button>
            {showWithdraw && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outlineNavBtnPrimary" size="xl" spacing="lg">
                    Dispute
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-2xl rounded-2xl shadow-xl p-0">
                  <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-2xl font-bold text-center">
                      Withdraw
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-muted-foreground">
                      Select a withdrawal type and confirm the amount.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-6 pb-0 pt-2 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 w-full justify-center">
                      <Label
                        className={`flex-1 rounded-xl border bg-muted/30 p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-primary/60 ${withdrawType === "full" ? "border-primary ring-2 ring-primary/20" : ""}`}
                        htmlFor={`withdraw-${row.original.id}-full`}
                      >
                        <Input
                          type="radio"
                          id={`withdraw-${row.original.id}-full`}
                          name={`withdraw-${row.original.id}`}
                          value="full"
                          checked={withdrawType === "full"}
                          onChange={() => setWithdrawType("full")}
                          className="mb-2 size-5 accent-primary"
                        />
                        <span className="block text-base font-semibold text-center">
                          Full Withdraw
                        </span>
                        <span className="block text-xs text-muted-foreground text-center">
                          Withdraw the entire available balance.
                        </span>
                      </Label>
                      <Label
                        className={`flex-1 rounded-xl border bg-muted/30 p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-primary/60 ${withdrawType === "personal" ? "border-primary ring-2 ring-primary/20" : ""}`}
                        htmlFor={`withdraw-${row.original.id}-personal`}
                      >
                        <Input
                          type="radio"
                          id={`withdraw-${row.original.id}-personal`}
                          name={`withdraw-${row.original.id}`}
                          value="personal"
                          checked={withdrawType === "personal"}
                          onChange={() => setWithdrawType("personal")}
                          className="mb-2 size-5 accent-primary"
                        />
                        <span className="block text-base font-semibold text-center">
                          Personal Payment
                        </span>
                        <span className="block text-xs text-muted-foreground text-center">
                          Enter a custom amount for this payment.
                        </span>
                      </Label>
                    </div>
                    {withdrawType === "personal" && (
                      <div className="space-y-2 rounded-xl border bg-muted/20 p-4 flex flex-col items-center">
                        <Label
                          className="text-sm font-medium w-full"
                          htmlFor={`amount-${row.original.id}`}
                        >
                          Amount
                        </Label>
                        <Input
                          className="w-full rounded-lg border bg-background px-4 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          id={`amount-${row.original.id}`}
                          type="number"
                          min="0"
                          max={row.original.amount}
                          placeholder={`Max: ${row.original.amount}`}
                          value={amount}
                          onChange={(event) => {
                            const val = event.target.value;
                            if (Number(val) > Number(row.original.amount)) {
                              setAmount(String(row.original.amount));
                            } else {
                              setAmount(val);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter className="px-6 py-4 flex flex-row gap-3 justify-end">
                    <DialogClose asChild>
                      <Button variant="outlinePrimary" className="w-28">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className="w-28 font-semibold text-white bg-primary hover:bg-primary/90 shadow-sm rounded-lg"
                      variant="default"
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <PermissionGate permission="Payments" action="update">
              <ManageRefund<TPayments> row={row} refundId={row.original.id} />
            </PermissionGate>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}

export type TRefund = {
  id: string;
  transactionId: string;
  paymentId: string;
  amount: string;
  refundId?: string;
  Status: string;
};
export function getRefund(
  onView: (id: string) => void,
): ColumnDef<TPayments>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "passengerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Passenger Name" />
      ),
      cell: ({ row }) => (
        <span className="text-[#3A3A3A] font-medium">
          {row.original?.userDetails?.firstName}{" "}
          {row.original?.userDetails?.lastName}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Refund Id" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "paymentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PaymentId" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount $" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="managePayments" action="view">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View Details"
            >
              <Eye />
            </Button>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TRefundRequest = {
  id: string;
  PassengerName: string;
  RefundId: string;
  PaymentId: string;
  Amount: string;
  Status: string;
  userDetails?: {
    firstName: string;
    lastName: string;
  };
};

export function getRefundRequest(
  onView: (id: string) => void,
): ColumnDef<TRefundRequest>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "PassengerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Passenger Name" />
      ),
      cell: ({ row }) => {
        return (
          <span className="text-[#3A3A3A] font-medium">
            {row.original?.userDetails?.firstName}{" "}
            {row.original?.userDetails?.lastName}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "RefundId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Refund Id" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "PaymentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PaymentId" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "Amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount $" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="managePayments" action="view">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View Details"
            >
              <Eye />
            </Button>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Refund Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.Status ?? "")}
          className="capitalize"
        >
          {row.original.Status}
        </Badge>
      ),
      enableSorting: false,
    },
  ];
}

export type TCrewMember = {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
};
export function getCrewMember(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TCrewMember>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="Crew" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="Crew" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete crew member</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this crew member? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TStaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  permissions?: Array<{ id: string; permissionName: string }>;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export function getStaffMember(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TStaffMember>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <>
          {row.original?.user?.firstName} {row.original?.user?.lastName}
        </>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionIndicator
            userId={row.original.user?.id ?? ""}
            userRole="Staff member"
            userName={`${row.original.user?.firstName ?? ""} ${row.original.user?.lastName ?? ""}`}
          />
          <PermissionGate permission="manageStaffMembers" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              className="ml-4"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageStaffMembers" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete Staff Member</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this staff member? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outlinePrimary">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Delete staff member
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
};

export type TSupportTicket = {
  id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  region: string;
  raisedBy: string;
  createdAt: string;
};

export function getContactRequest(
  onView: (id: string) => void,
  onEmail: (id: string) => void,
): ColumnDef<TContactRequest>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.message}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), "dd MMM yyyy")
            : "N/A"}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "isResolved",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.isResolved ? "default" : "gray"}>
          {row.original.isResolved ? "Replied" : "Pending"}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageContactRequests" action="view">
            <Button
              onClick={() => onView(row.original.id)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View Details"
            >
              <Eye />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageContactRequests" action="update">
            <Button
              onClick={() => onEmail(row.original.id)}
              variant="outlineNavBtnInfo"
              size="xl"
              spacing="lg"
              tooltip="Reply"
            >
              <Reply />
            </Button>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TTestimonial = {
  id: string;
  customerName: string;
  customerImage: string;
  content: string;
  rating: string | number;
};

export function getTestimonial(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TTestimonial>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "content",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => (
        <div className="max-w-2xs text-wrap">{row.original.content}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ratings" />
      ),
      cell: ({ row }) => (
        <Badge>
          <Star />
          <span>{row.original.rating}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "customerImage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Photo" />
      ),
      cell: ({ row }) => (
        <img
          src={row.original.customerImage}
          className="w-[70px] h-[70px]"
          alt={row.original.id}
        />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageTestimonials" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageTestimonials" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Testimonial</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this testimonial? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TOurPartner = {
  id: string;
  companyName: string;
  photo: string;
  url: string;
};

export function getOurPartner(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TOurPartner>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "companyName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company Name" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="URL" />
      ),
      cell: ({ row }) => (
        <div className="w-[501px] text-wrap">{row.original.url}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "photo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Photo" />
      ),
      cell: ({ row }) => (
        <img
          src={row.original.photo}
          className="w-[70px] h-[70px]"
          alt="photoUrl"
        />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageOurPartners" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageOurPartners" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Our Partner</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this our partner? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TNews = {
  id: string;
  body: string;
};

export function getNews(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TNews>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "body",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="News" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageNews" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageNews" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete News</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this news? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TSetting = {
  id: string;
  paymentId: string;
  email: string;
  location: string;
  // phone: string | null;
  // whatsapp: string | null;
  // skype?: string;
  paymentSecretKey: string;
  phone: number | null;
  whatsapp: number | null;
  skype?: string;
};

export function getSettings(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TSetting>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "news",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="News" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="Settings" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="Settings" action="delete">
            <Button
              onClick={() => onDelete(row.original.id)}
              variant="outlineNavBtnDestructive"
              size="xl"
              spacing="lg"
              tooltip="Delete"
            >
              <Trash2 />
            </Button>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TIpWhiteList = {
  id: string;
  name: string;
  ip: string;
};

export function getIpWhiteList(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TIpWhiteList>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ip",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IP" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageIpAccess" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageIpAccess" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Ip White List</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this ip white-list? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TPage = {
  id: string;
  pageName: string;
  slug: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function getPageColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TPage>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pageName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Page Name" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "default" : "gray"}
          className="capitalize"
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="managePages" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Page"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="managePages" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Page</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this page? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TFaqs = {
  id: string;
  question: string;
  answer: string;
};

export function getFaqs(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TFaqs>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "question",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Question" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "answer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Answer" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageContentManagement" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageContentManagement" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Faq</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this faq? This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TChauffeurAvailablility = {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  ratings: string;
  rating?: string;
  status: string;
};

export function getChauffeurAvailablility(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TChauffeurAvailablility>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      // cell: ({row})=>(<>
      // {row.original.firstName} {row.original.lastName}
      // </>),
      enableSorting: false,
    },
    {
      accessorKey: "licenseNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="License Number" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ratings" />
      ),
      cell: ({ row }) => (
        <Badge>
          <Star />
          <span>{row.original.rating}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageChauffeurs" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="managePartnerChauffeurs" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Chauffeur Availability</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this chauffeur availability?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type THomeContent = {
  id: string;
  content: string;
  description: string;
};
export function getHomeContent(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<THomeContent>[] {
  return [
    {
      accessorKey: "content.title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Content Title" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "sectionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="sectionName" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="Content Management" action="update">
            <Button
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              onClick={() => onEdit(row.original.id)}
              tooltip="Edit"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="Content Management" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Content</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this content? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TContent = {
  id: string;
  content: string;
  description: string;
  firstName?: string;
  lastName?: string;
  ratings?: string;
  status: string;
};

export function getContent(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TContent>[] {
  return [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <>
          {row.original.firstName} {row.original.lastName}
        </>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "licenseNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="License Number" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "ratings",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ratings" />
      ),
      cell: ({ row }) => (
        <Badge>
          <Star />
          <span>{row.original.ratings}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="Content Management" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Details"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="Content Management" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Content</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this content? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TBlog = {
  id: string;
  title: string;
  status: string;
  blogAuthor?: {
    id: string;
    name: string;
    isActive: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
  featuredImage?: string | null;
};

export function getBlogColumns(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TBlog>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => <span>{row.original.title}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "blogAuthor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
      cell: ({ row }) => <span>{row.original.blogAuthor?.name || "N/A"}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="manageBlogs" action="view">
            <Button
              onClick={() => onView(row?.original?.id ?? "")}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="View"
            >
              <Eye />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageBlogs" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Blog"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="manageBlogs" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Blog</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this blog? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TServicePricing = {
  id: string;
  regionId: string;
  country: string;
  city: string;
  serviceType: string;
  vehicleId: string;
  ratePerHour: number;
  minHours: number;
  basePrice: number;
  minimumFare: number;
  status: string;
  pricingLevel: string;
  rateValidFrom: string;
  rateValidTo: string;
  region?: {
    id: string;
    regionName: string;
  };
  vehicle?: {
    id: string;
    vehicleType: string;
    brand?: string;
    model?: string;
  };
};

export function getServicePricing(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TServicePricing>[] {
  return [
    {
      id: "select",
      header: ({ table }) => <SelectHeaderCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "region.regionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region" />
      ),
      cell: ({ row }) => <span>{row.original?.region?.regionName || "-"}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="City" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "serviceType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Service Type" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "vehicle.vehicleType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle Type" />
      ),
      cell: ({ row }) => (
        <span>{row.original?.vehicle?.vehicleType || "-"}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "basePrice",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Base Price" />
      ),
      cell: ({ row }) => <span>${row.original.basePrice}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "ratePerHour",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate/Hour" />
      ),
      cell: ({ row }) => <span>${row.original.ratePerHour}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row?.original?.status ?? "")}
          className="capitalize"
        >
          <span>{row.original.status}</span>
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <PermissionGate permission="setRegionPricing" action="update">
            <Button
              onClick={() => onEdit(row.original.id)}
              variant="outlineNavBtnPrimary"
              size="xl"
              spacing="lg"
              tooltip="Edit Service Pricing"
            >
              <Edit />
            </Button>
          </PermissionGate>
          <PermissionGate permission="setRegionPricing" action="delete">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outlineNavBtnDestructive"
                  size="xl"
                  spacing="lg"
                  tooltip="Delete Service Pricing"
                >
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full sm:max-w-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Delete Service Pricing</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this service pricing? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Are you absolutely sure?</strong> This action cannot
                    be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    variant="destructive"
                  >
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

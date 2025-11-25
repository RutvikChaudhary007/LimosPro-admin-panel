import {
  IconArrowNarrowUp,
  IconArrowsUpDown,
  IconBrandWhatsapp,
  IconMap,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  CreditCardIcon,
  Edit,
  Eye,
  FolderKey,
  Mail,
  Phone,
  PhoneIcon,
  Reply,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IAffiliate } from "@/types/affiliate/affiliate.type";
import type { TChauffeur } from "@/types/chauffeur/chauffeur.type";
import AccessCell from "../regionAccess/RegionAccess";
import { Badge } from "../ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

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

export const getDashboardColumns = (): ColumnDef<TDashboardBooking>[] => {
  return [
    {
      accessorKey: "userName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Users" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "bookingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking ID" />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
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
  onAccess: (regionId: string, permissionIds: string[]) => void,
): ColumnDef<TRegion>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
    // {
    //   id: "access",
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Access" />,
    //   cell: ({ row }) => <AccessCell<TRegion> row={row} onAccess={onAccess} />,
    //   enableSorting: false,
    // },
    {
      id: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <AccessCell<TRegion> row={row} onAccess={onAccess} />

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
          <Button
            variant="outlineNavBtnDestructive"
            size="xl"
            spacing="lg"
            onClick={() => onDelete(row.original.id)}
            tooltip="Delete"
          >
            <Trash2 />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TRegionAdmin = {
  id: string;
  region?: string;
  regionName?: string;
  email: string;
};

export function getRegionAdminColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  _onAccess: (id: string) => void,
): ColumnDef<TRegionAdmin>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Edit"
          >
            <Edit />
          </Button>
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
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Regional Admin</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this regional admin? This
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
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export function getAffiliate(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<IAffiliate>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        useEffect(() => {
          console.log(
            "Page rows selected:",
            table.getSelectedRowModel().rows.length,
          );
          console.log("selected page row:", table.getIsAllPageRowsSelected());
          console.log(
            "some selected page row:",
            table.getIsSomePageRowsSelected(),
          );
          console.log(
            "changed:",
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false,
          );
          console.log(
            "old:",
            table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate"),
          );
        }, [
          table.getSelectedRowModel().rows.length,
          table.getIsAllPageRowsSelected(),
          table.getIsSomePageRowsSelected(),
          // table.getIsAllRowsSelected(),
        ]);

        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              return table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Affiliate Name" />
      ),
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row?.original?.id ?? "")}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id ?? "")}
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Edit"
          >
            <Edit />
          </Button>
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
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Affiliate</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this affiliate? This action
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
                  onClick={() => onDelete(row.original.id ?? "")}
                  variant="destructive"
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "vehicle.brand",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vehicle" />
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Edit"
          >
            <Edit />
          </Button>
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
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Chauffeur</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this chauffeur? This action
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View User"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Edit User"
          >
            <Edit />
          </Button>
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
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot
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
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TBooking = {
  id: string;
  userId: string;
  affiliateId: string;
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "affiliateId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Affiliate Id" />
      ),
      enableSorting: false,
    },
    {
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
      accessorKey: "scheduledTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Scheduled Time" />
      ),
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            type="button"
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Email User"
          >
            <Mail />
          </Button>
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
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View"
          >
            <Eye />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TFleet = {
  id: string;
  affiliateId: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vehicleType: string;
  capacity: number;
  documents: [];
  vehicleImages: [];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null | undefined;
};

export function getFleets(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TFleet>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "affiliateId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Affiliate Id" />
      ),
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View Fleet"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Edit Fleet"
          >
            <Edit />
          </Button>
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
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Fleet</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this fleet? This action cannot
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Distance In Km" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View Trip Details"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onMap(row.original.id)}
            variant="outlineNavBtnWarning"
            size="xl"
            spacing="lg"
            tooltip="View On Map"
          >
            <IconMap />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

const getDate = (date: string) => {
  return `${new Date(date?.split("T")[0])
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", "-")}`;
};
export type TNotification = {
  id: string;
  notification: string;
  description: string;
  created_at: string;
};
export function getNotification(): ColumnDef<TNotification>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "notification",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notification" />
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
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created On" />
      ),
      enableSorting: false,
      cell: ({ row }) => getDate(row.original.created_at),
    },
  ];
}

export type TPayments = {
  id: string;
  PassengerName: string;
  BookingId: string;
  PaymentId: string;
  Amount: string;
  Status: string;
  userDetails?: {
    firstName: string;
    lastName: string;
  };
};
export function getPayments(
  onView: (id: string) => void,
  onMap: (id: string) => void,
): ColumnDef<TPayments>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      accessorKey: "bookingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Booking Id" />
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View Details"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onMap(row.original.id)}
            variant="outlineNavBtnPrimary"
            size="xl"
            spacing="lg"
            tooltip="Card"
          >
            <CreditCardIcon />
          </Button>
        </div>
      ),
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Booking Details" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <DataTableColumnHeader column={column} title="Booking Details" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete crew member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this crew member? This action
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
  user?: {
    firstName: string;
    lastName: string;
  };
};

export function getStaffMember(
  onEdit: (id: string) => void,
  onAccess: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TStaffMember>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
    // {
    //   id: "access",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Access" />
    //   ),
    //   cell: ({ row }) => (
    //     <Button onClick={() => onAccess(row.original.id)}>Manage Access</Button>
    //   ),
    //   enableSorting: false
    // },
    {
      id: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Manage Access"
            onClick={() => onAccess(row.original.id)}
          >
            <FolderKey />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Staff Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this staff member? This action
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
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            
            
          >
            <Trash2  />
          </Button> */}
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
};

export function getContactRequest(
  onView: (id: string) => void,
  onEmail: (id: string) => void,
): ColumnDef<TContactRequest>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex justify-end items-center px-4">
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
          <Button
            onClick={() => onEmail(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Reply"
          >
            <Reply />
          </Button>
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
};

export function getTestimonial(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<TTestimonial>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <div className="w-[501px] text-wrap">{row.original.content}</div>
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Testimonial</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this testimonial? This action
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
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            
            
          >
            <Trash2  />
          </Button> */}
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Our Partner</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this our partner? This action
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
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            
            
          >
            <Trash2  />
          </Button> */}
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete News</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this news? This action cannot
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
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            
            
          >
            <Trash2  />
          </Button> */}
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Delete"
          >
            <Trash2 />
          </Button>
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
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
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            
            
          >
            <Trash2  />
          </Button> */}
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
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] "
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="font-medium data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
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
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            
            
          >
            <Trash2  />
          </Button> */}
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            onClick={() => onEdit(row.original.id)}
            tooltip="Edit"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
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
        <div className="flex justify-end items-center px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Details"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
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
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center justify-end">
          <Button
            onClick={() => onView(row?.original?.id ?? "")}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View"
          >
            <Eye />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Edit Blog"
          >
            <Edit />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outlineNavBtnBlack"
                size="xl"
                spacing="lg"
                tooltip="Delete"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Delete Blog</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this blog? This action cannot
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
        </div>
      ),
      enableSorting: false,
    },
  ];
}

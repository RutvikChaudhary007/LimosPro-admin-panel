import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Mail, Phone, Reply, Star, Trash2 } from "lucide-react"
import { Badge } from "../ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AccessCell from "../regionAccess/RegionAccess"
import type { TRegion } from "@/types/region/region.type"

export type TDashboardBooking = {
  id: string
  userName: string
  bookingId: string
  price: number
  commute: string
  status: string
}

export const getDashboardColumns = (): ColumnDef<TDashboardBooking>[] => {
  return [
    {
      accessorKey: "userName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="USERS" />,
      // cell: ({row})=>(<>
      // {row.original.firstName} {row.original.lastName}
      // </>),
      enableSorting: false,
    },
    {
      accessorKey: "bookingId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking ID" />,
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price $" />,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Label
          className={cn("flex w-20 items-center rounded bg-[#D9D9D9] px-2 text-sm", [
            getStatusColor(row.original.status),
            row.original.status.toLocaleLowerCase() === "active" && "text-white",
          ])}
        >
          {row.original.status}
        </Label>
      ),
      enableSorting: false,
    },
  ]
}

export function getRegionColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onAccess: (regionId: string, permissionIds: string[]) => void
): ColumnDef<TRegion>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Region Name" />,
      enableSorting: false,
    },
    // { accessorKey: "admin", header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,enableSorting: false, },
    {
      id: "access",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Access" />,
      cell: ({ row }) => <AccessCell row={row} onAccess={onAccess} />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button onClick={() => onEdit(row.original.id)} variant="outlineBlack">
            <Edit />
          </Button>
          <Button onClick={() => onDelete(row.original.id)} variant="outlineBlack">
            <Trash2 />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TRegionAdmin = {
  id: string
  region?: string
  regionName?: string
  email: string
}

export function getRegionAdminColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
  //   onAccess: (id: string) => void
): ColumnDef<TRegionAdmin>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Region Name" />,
      enableSorting: false,
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Regional Admin</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this regional admin? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TAffiliate = {
  id: string
  userId: string
  isChauffer: boolean
  companyName: string
  taxId: string
  entityType: string
  businessEmail: string
  businessContactNumber: string
  businessAddress: string
  businessLocation: {
    latitude: number
    longitude: number
  }
  commissionRate: string
  documents: []
  stripeAccountId: string
  stripeAccountStatus: string
  status: string
  createdAt: string
  updatedAt: string
}

export const getStatusColor = (status: string): string => {
  if (status?.toLowerCase() === "active") {
    return "bg-[#444444]"
  } else if (status?.toLowerCase() === "inactive") {
    return "bg-[#B8B8B8] text-black"
  } else if (status?.toLowerCase() === "suspended") {
    return "bg-[#ECECEC] text-black"
  } else if (status?.toLowerCase() === "completed") {
    return "bg-[#444444] text-white"
  } else if (status?.toLowerCase() === "ongoing") {
    return "bg-[#ECECEC] text-black"
  } else if (status?.toLowerCase() === "canceled") {
    return "bg-[#B8B8B8] text-black"
  }
  return "bg-[#ececeb] text-black"
}
export function getAffiliate(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TAffiliate>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate Name" />,
      enableSorting: false,
    },
    {
      accessorKey: "businessEmail",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Business Email" />,
      enableSorting: false,
    },
    {
      accessorKey: "businessAddress",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Business Address" />,
      enableSorting: false,
    },
    {
      accessorKey: "commissionRate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Commission Rate" />,
      cell: ({ row }) => {
        return (
          <span className="text-sm text-black">{row?.original?.commissionRate} % Per Ride</span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "isChauffer",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Chauffeur" />,
      cell: ({ row }) => <span>{row.original.isChauffer ? "Yes" : "No"}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <div className="inset-shadow-2xs inset-shadow-[#EEEEEE]">
          <Badge
            variant={"default"}
            className={`rounded capitalize ${getStatusColor(row.original.status)}`}
          >
            {row.original.status}
          </Badge>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Affiliate</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this affiliate? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TChauffeur = {
  id: string
  userId: string
  affiliateId: string
  status: string
  password: string
  panNumber: string
  licenseNumber: string
  vehicleId: string
  documents:
    | [
        {
          size: number
          fileUrl: string
          mimetype: string
          originalName: string
        },
        {
          size: number
          fileUrl: string
          mimetype: string
          originalName: string
        },
      ]
    | string[]
  rating: string
  availability: boolean
  location: {
    latitude: number
    longitude: number
  }
  businessAddress: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  gratuity: string
  createdAt: string
  updatedAt: string
  vehicle: {
    id: string
    affiliateId: string
    plateNumber: string
    brand: string
    model: string
    year: number
    color: string
    vehicleType: string
    capacity: number
    documents: []
    vehicleImages: []
    createdAt: string
    updatedAt: string
    deletedAt: string | null | undefined
  }
}

export function getChauffeur(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TChauffeur>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "vehicleId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vehicle Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "licenseNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="License Number" />,
      enableSorting: false,
    },
    {
      accessorKey: "panNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pan Number" />,
      enableSorting: false,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
      cell: ({ row }) => {
        return (
          <Badge
            variant={"default"}
            className="rounded bg-[#D9D9D9] px-1 py-0.5 text-sm text-black"
          >
            <Star className="fill-[#3A3A3A]" />{" "}
            <span className="text-sm text-[#3A3A3A]">{row.original.rating}</span>
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge
          variant={"default"}
          className={`h-5 w-[70px] rounded capitalize inset-shadow-xs inset-shadow-[${getStatusColor(row.original.status)}] ${getStatusColor(row.original.status)}`}
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>

          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Chauffeur</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this chauffeur? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TUsers = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  status: string
  paymentMethod: string
  profilePicture: string
  social: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}
export function getUsers(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TUsers>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <span>
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      enableSorting: false,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge
          variant={"default"}
          className={`cursor-pointer rounded capitalize inset-shadow-xs inset-shadow-[${getStatusColor(row.original.status)}] ${getStatusColor(row.original.status)} h-5 w-[70px]`}
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TBooking = {
  id: string
  userId: string
  affiliateId: string
  bookingType: string
  pickupLocation: {
    latitude: number
    longitude: number
  }
  dropoffLocation: {
    latitude: number
    longitude: number
  }
  isThirdPartyUser: boolean
  thirdPartyUser: {
    name: string
    email: string
    phone: string
  }
  scheduledTime: string
  fare: number
  status: string
  createdAt: string
  updatedAt: string
}

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "-"
  return format(new Date(dateString), "MMM d, yyyy h:mm a")
}

export function getBooking(onView: (id: string) => void): ColumnDef<TBooking>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "bookingType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Type" />,
      enableSorting: false,
    },
    {
      accessorKey: "scheduledTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Scheduled Time" />,
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "fare",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price $" />,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge
          variant={"default"}
          className={`cursor-pointer rounded capitalize inset-shadow-xs inset-shadow-[${getStatusColor(row.original.status)}] ${getStatusColor(row.original.status)} h-5 w-[70px]`}
        >
          {row.original.status}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            type="button"
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Mail className="text-[#5A5A5A]" />
          </Button>
          <Button
            type="button"
            onClick={() => {
              const phone = row?.original?.thirdPartyUser?.phone
              if (phone) {
                window.location.href = `tel:${phone}`
              }
            }}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Phone className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TFleet = {
  id: string
  affiliateId: string
  plateNumber: string
  brand: string
  model: string
  year: number
  color: string
  vehicleType: string
  capacity: number
  documents: []
  vehicleImages: []
  createdAt: string
  updatedAt: string
  deletedAt: string | null | undefined
}

export function getFleets(
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TFleet>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "plateNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plate Number" />,
      enableSorting: false,
    },
    {
      accessorKey: "vehicleType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vehicle Type" />,
      enableSorting: false,
    },
    {
      accessorKey: "model",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
      enableSorting: false,
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Capacity" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Fleet</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this fleet? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TTrips = {
  id: string
  bookingId: string
  chaufferId: string
  tripType: string
  tripStatus: string
  tripStartTime: string
  tripEndTime: string
  distanceInKm: number
  gratuity: number
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

export function getTrips(
  onView: (id: string) => void,
  onMap: (id: string) => void
): ColumnDef<TTrips>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "tripType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trip Type" />,
      enableSorting: false,
    },
    {
      accessorKey: "tripStatus",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trip Status" />,
      cell: ({ row }) => (
        <Badge
          variant={"default"}
          className={`cursor-pointer rounded capitalize inset-shadow-xs inset-shadow-[${getStatusColor(row.original.tripStatus)}] ${getStatusColor(row.original.tripStatus)} h-5 w-[70px]`}
        >
          {row.original.tripStatus}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "distanceInKm",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Distance In Km" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onMap(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1] p-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-location"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
            </svg>
            {/* <Icons path="/mapPin.svg" alt="map icon" className="text-[#5A5A5A] w-4 h-4" /> */}
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

const getDate = (date: string) => {
  return `${new Date(date?.split("T")[0])
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", "-")}`
}
export type TNotification = {
  id: string
  notification: string
  description: string
  created_at: string
}
export function getNotification(): ColumnDef<TNotification>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Notification" />,
      enableSorting: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      enableSorting: false,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created On" />,
      enableSorting: false,
      cell: ({ row }) => getDate(row.original.created_at),
    },
  ]
}

export type TPayments = {
  id: string
  PassengerName: string
  BookingId: string
  PaymentId: string
  Amount: string
  Status: string
}
export function getPayments(
  onView: (id: string) => void,
  onMap: (id: string) => void
): ColumnDef<TPayments>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Passenger Name" />,
      cell: ({ row }) => {
        console.log("row", row.original?.userDetails)
        return (
          <span className="font-medium text-[#3A3A3A]">
            {row.original?.userDetails?.firstName} {row.original?.userDetails?.lastName}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "bookingId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "paymentId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="PaymentId" />,
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount $" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onMap(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1] p-0"
            // disabled={true}
          >
            <Icons path="/card.svg" alt="card icon" className="text-[#5A5A5A]" />
            {/* <Icons path="/mapPin.svg" alt="map icon" className="text-[#5A5A5A] w-4 h-4" /> */}
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TRefund = {
  id: string
  transactionId: string
  id: string
  paymentId: string
  amount: string
  refundId?: string
  Status: string
}
export function getRefund(onView: (id: string) => void): ColumnDef<TPayments>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Passenger Name" />,
      cell: ({ row }) => (
        <span className="font-medium text-[#3A3A3A]">
          {row.original?.userDetails?.firstName} {row.original?.userDetails?.lastName}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Refund Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "paymentId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="PaymentId" />,
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount $" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TRefundRequest = {
  id: string
  PassengerName: string
  RefundId: string
  PaymentId: string
  Amount: string
  Status: string
}

export function getRefundRequest(onView: (id: string) => void): ColumnDef<TRefundRequest>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Passenger Name" />,
      cell: ({ row }) => {
        console.log("row", row.original?.userDetails)
        return (
          <span className="font-medium text-[#3A3A3A]">
            {row.original?.userDetails?.firstName} {row.original?.userDetails?.lastName}
          </span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "RefundId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Refund Id" />,
      enableSorting: false,
    },
    {
      accessorKey: "PaymentId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="PaymentId" />,
      enableSorting: false,
    },
    {
      accessorKey: "Amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount $" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Details" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Refund Status" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            variant="secondary"
            className={cn(
              "h-[33px] w-[103px] rounded bg-[#F1F1F1]",
              getStatusColor(row.original.Status)
            )}
          >
            {row.original.Status}
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TCrewMember = {
  id: string
  name: string
  designation: string
  email: string
  phone: string
}
export function getCrewMember(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TCrewMember>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      enableSorting: false,
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      enableSorting: false,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Details" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete crew member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this crew member? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TStaffMember = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export function getStaffMember(
  onEdit: (id: string) => void,
  onAccess: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TStaffMember>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <>
          {row.original?.user?.firstName} {row.original?.user?.lastName}
        </>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "user.email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      enableSorting: false,
    },
    {
      id: "access",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Access" />,
      cell: ({ row }) => (
        <Button
          variant="secondary"
          onClick={() => onAccess(row.original.id)}
          className="h-[33px] w-[108px] cursor-pointer text-sm"
        >
          Manage Access
        </Button>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Staff Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this staff member? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TContactRequest = {
  id: string
  name: string
  email: string
  phone: string
  message: string
}

export function getContactRequest(
  onView: (id: string) => void,
  onEmail: (id: string) => void
): ColumnDef<TContactRequest>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      enableSorting: false,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      enableSorting: false,
    },
    {
      accessorKey: "message",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onView(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEmail(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Reply className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TTestimonial = {
  id: string
  customerName: string
  customerImage: string
  content: string
}

export function getTestimonial(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TTestimonial>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      enableSorting: false,
    },
    {
      accessorKey: "content",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
      cell: ({ row }) => <div className="w-[501px] text-wrap">{row.original.content}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "customerImage",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Photo" />,
      cell: ({ row }) => <img src={row.original.customerImage} className="h-[70px] w-[70px]" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Testimonial</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this testimonial? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TOurPartner = {
  id: string
  companyName: string
  photo: string
  url: string
}

export function getOurPartner(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TOurPartner>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Company Name" />,
      enableSorting: false,
    },
    {
      accessorKey: "url",
      header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
      cell: ({ row }) => <div className="w-[501px] text-wrap">{row.original.url}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "photo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Photo" />,
      cell: ({ row }) => (
        <img src={row.original.photo} className="h-[70px] w-[70px]" alt="photoUrl" />
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Our Partner</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this our partner? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TNews = {
  id: string
  body: string
}

export function getNews(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TNews>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="News" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete News</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this news? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TSetting = {
  id: string
  paymentId: string
  email: string
  location: string
  // phone: string | null;
  // whatsapp: string | null;
  // skype?: string;
  paymentSecretKey: string
  phone: number | null
  whatsapp: number | null
  skype?: string
}

export function getSettings(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TSetting>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="News" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TIpWhiteList = {
  id: string
  name: string
  ip: string
}

export function getIpWhiteList(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TIpWhiteList>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Ip White List</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this ip white-list? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TFaqs = {
  id: string
  question: string
  answer: string
}

export function getFaqs(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TFaqs>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
          className="font-medium data-[state=checked]:border-[#d6d6d6] data-[state=checked]:bg-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A]"
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Question" />,
      enableSorting: false,
    },
    {
      accessorKey: "answer",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Answer" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Faq</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this faq? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TChauffeurAvailablility = {
  id: string
  firstName: string
  lastName: string
  licenseNumber: string
  ratings: string
  status: string
}

export function getChauffeurAvailablility(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TChauffeurAvailablility>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      // cell: ({row})=>(<>
      // {row.original.firstName} {row.original.lastName}
      // </>),
      enableSorting: false,
    },
    {
      accessorKey: "licenseNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="License Number" />,
      enableSorting: false,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ratings" />,
      cell: ({ row }) => (
        <Label className="flex w-16 items-center rounded bg-[#D9D9D9] px-1">
          <Star className="max-h-4 max-w-4 fill-black text-sm" />{" "}
          <span className="text-xl">{row.original.rating}</span>
        </Label>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Label
          className={cn("flex w-14 items-center rounded bg-[#D9D9D9] px-2 text-sm", [
            getStatusColor(row.original.status),
            row.original.status.toLocaleLowerCase() === "active" && "text-white",
          ])}
        >
          {row.original.status}
        </Label>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Chauffeur Availability</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this chauffeur availability? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type THomeContent = {
  id: string
  content: string
  description: string
}
// home: object[],
//   about: object[],
//   service: object[],
//   cities: object[],
//   fleets: object[],
//   faqs: object[],
//   contact_us: object[],
//   blog: object[],
export function getHomeContent(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<THomeContent>[] {
  return [
    {
      accessorKey: "content.title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Content Title" />,
      enableSorting: false,
    },
    {
      accessorKey: "sectionName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="sectionName" />,
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Content</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this content? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TContent = {
  id: string
  content: string
  description: string
}

export function getContent(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<TContent>[] {
  return [
    {
      accessorKey: "firstName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <>
          {row.original.firstName} {row.original.lastName}
        </>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "licenseNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="License Number" />,
      enableSorting: false,
    },
    {
      accessorKey: "ratings",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ratings" />,
      cell: ({ row }) => (
        <Label className="flex w-14 items-center rounded bg-[#D9D9D9] px-2">
          <Star className="max-h-4 max-w-4 fill-black text-sm" />{" "}
          <span className="text-xl">{row.original.ratings}</span>
        </Label>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Label
          className={cn("flex w-14 items-center rounded bg-[#D9D9D9] px-2 text-sm", [
            getStatusColor(row.original.status),
            row.original.status.toLocaleLowerCase() === "active" && "text-white",
          ])}
        >
          {row.original.status}
        </Label>
      ),
      enableSorting: false,
    },
    {
      id: "action",
      header: ({ column }) => (
        <div className="flex items-center justify-end px-4">
          <DataTableColumnHeader column={column} title="Action" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-right">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="secondary"
            className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-[33px] w-[34px] cursor-pointer rounded bg-[#F1F1F1]"
              >
                <Trash2 className="text-[#5A5A5A]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Delete Content</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this content? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Are you absolutely sure?</strong> This action cannot be undone.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => onDelete(row.original.id)} variant="destructive">
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
            onClick={() => onDelete(row.original.id)}
            variant="secondary"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button> */}
        </div>
      ),
      enableSorting: false,
    },
  ]
}

// import { type ColumnDef } from "@tanstack/react-table"
// import { DataTableColumnHeader } from "./DataTableColumnHeader";
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "../ui/button";
// import { Edit, Trash2 } from "lucide-react";

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.
// export type TRegion = {
//   id: string;
//   regionName: string;
//   admin: string;
//   onAccess: (id:string)=> void;
//   onEdit: (id:string)=> void;
//   onDelete: (id:string)=> void;
// }

// export const columns: ColumnDef<TRegion>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "regionName",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Region Name" />
//     ),
//   },
//   {
//     accessorKey: "admin",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Admin" />
//     ),
//   },
//   {
//     accessorKey: "access",
//     header: ({ column }) =>(
//       <DataTableColumnHeader column={column} title="Access" />
//     ),
//     cell: ({ row }) => {
//         const {id} = row.original;
//         return (<div className=""><Button variant={"outline"} className="cursor-pointer w-[108px] h-[33px] text-sm">Manage Access</Button></div>);
//     },
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "onEdit",
//     header: ({ column }) =>(
//       <DataTableColumnHeader column={column} title="Action" />
//     ),
//     cell: ({ row }) => {
//         return (<div className="text-right flex gap-2 items-center"><Button onClick={()=>row.original.onEdit(row.original.id)} variant={"outline"} className='cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]'><Edit className='text-[#5A5A5A]' /></Button>
//                     <Button onClick={()=>row.original.onDelete(row.original.id)} variant={"outline"} className='cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]'><Trash2 className='text-[#5A5A5A]' /></Button></div>);
//     },
//     enableSorting: false,
//     enableHiding: false,
//   },
// ]

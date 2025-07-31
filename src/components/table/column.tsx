import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Mail, Phone, Star, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { format } from 'date-fns';
import Icons from "../common/Icons";

export type TDashboardBooking = {
  id: string;
  userName: string;
  bookingId: string;
  price: string;
  commute: string;
}

export const getDashboardColumns = (): ColumnDef<TDashboardBooking>[]=>{
  return [
    
  ]
}

export type TRegion = {
  id: string;
  regionName: string;
  admin: string;
}
export function getRegionColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onAccess: (id: string) => void
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
    { accessorKey: "regionName", header: ({ column }) => <DataTableColumnHeader column={column} title="Region Name" />,enableSorting: false, },
    { accessorKey: "admin", header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,enableSorting: false, },
    {
      id: "access",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Access" />,
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => onAccess(row.original.id)}
          className="cursor-pointer w-[108px] h-[33px] text-sm"
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
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TRegionAdmin = {
  id: string;
  regionName: string;
  email: string;
}

export function getRegionAdminColumns(
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onAccess: (id: string) => void
): ColumnDef<TRegionAdmin>[]{
  
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
    { accessorKey: "regionName", header: ({ column }) => <DataTableColumnHeader column={column} title="Region Name" />,enableSorting: false, },
    { accessorKey: "email", header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,enableSorting: false, },
    {
      id: "access",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Access" />,
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => onAccess(row.original.id)}
          className="cursor-pointer w-[108px] h-[33px] text-sm"
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
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TAffiliate = 
  {   
        id: string,
        userId: string,
        isChauffer: boolean,
        companyName: string,
        taxId: string,
        entityType: string,
        businessEmail: string,
        businessContactNumber: string,
        businessAddress: string,
        businessLocation: {
            latitude: number,
            longitude: number
        },
        commissionRate: string,
        documents: [],
        stripeAccountId: string,
        stripeAccountStatus: string,
        status: string,
        createdAt: string,
        updatedAt: string
    };

  export  const getStatusColor = (status: string): string =>   {
            if(status?.toLowerCase() ==="active") {
              return "bg-[#444444]";
            } else if(status?.toLowerCase()==="inactive") {
              return "bg-[#B8B8B8] text-black";
            } else if(status?.toLowerCase()==="suspended") {
              return "bg-[#ECECEC] text-black";
            } else if(status?.toLowerCase()==="completed") {
              return "bg-[#444444] text-white";
            } else if(status?.toLowerCase()==="ongoing") {
              return "bg-[#ECECEC] text-black";
            } else if(status?.toLowerCase()==="canceled") {
              return "bg-[#B8B8B8] text-black";
            } 
            return "bg-[#ececeb] text-black";
          }
export function getAffiliate(
  onView: (id:string) => void,
  onEdit: (id:string) => void,
  onDelete: (id:string) => void,
): ColumnDef<TAffiliate>[] {
  return [
    {id: "select",
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
    { accessorKey: "companyName", header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate Name" />,enableSorting: false, },
    { accessorKey: "businessEmail", header: ({ column }) => <DataTableColumnHeader column={column} title="Business Email" />,enableSorting: false, },
    { accessorKey: "businessAddress", header: ({ column }) => <DataTableColumnHeader column={column} title="Business Address" />, enableSorting: false, },
    { accessorKey: "commissionRate", header: ({ column }) => <DataTableColumnHeader column={column} title="Commission Rate" />,
    cell: ({row})=>{
      return (<span className="text-sm text-black">{row?.original?.commissionRate} % Per Ride</span>)},enableSorting: false, },
    { accessorKey: "isChauffer", header: ({ column }) => <DataTableColumnHeader column={column} title="Chauffeur" />,
    cell: ({row})=>(
      <span>{row.original.isChauffer?"Yes": "No"}</span>
    )
    ,enableSorting: false, },
    { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({row})=> (<div className="inset-shadow-2xs inset-shadow-[#EEEEEE]">
      <Badge variant={"default"}  className={`capitalize rounded ${getStatusColor(row.original.status)}`}>{row.original.status}</Badge> 
      </div>
    )
    ,enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TChauffeur = {
          id: string,
          userId: string,
          affiliateId: string,
          status: string,
          panNumber: string,
          licenseNumber: string,
          vehicleId: string,
          documents: [
              {
                  size: number,
                  fileUrl: string,
                  mimetype: string,
                  originalName: string
              },
              {
                  size: number,
                  fileUrl: string,
                  mimetype: string,
                  originalName: string
              }
          ],
          rating: string,
          availability: boolean,
          location: {
              latitude: number,
              longitude: number
          },
          gratuity: string,
          createdAt: string,
          updatedAt: string,
          vehicle: {
              id: string,
              affiliateId: string,
              plateNumber: string,
              brand: string,
              model: string,
              year: number,
              color: string,
              vehicleType: string,
              capacity: number,
              documents: [],
              vehicleImages: [],
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null | undefined,
          }
  };

export function getChauffeur(
  onView: (id:string) => void,
  onEdit: (id:string) => void,
  onDelete: (id:string) => void,
): ColumnDef<TChauffeur>[]{
  return [
    {id: "select",
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
    { accessorKey: "vehicleId", header: ({ column }) => <DataTableColumnHeader column={column} title="Vehicle Id" />,enableSorting: false, },
    { accessorKey: "licenseNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="License Number" />,enableSorting: false, },
    { accessorKey: "panNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="Pan Number" />, enableSorting: false, },
    { accessorKey: "rating", header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({row})=>{
      return (<Badge variant={"default"} className="text-sm text-black bg-[#D9D9D9] px-1 py-0.5 rounded"><Star className="fill-[#3A3A3A]"/> <span className="text-[#3A3A3A] text-sm">{row.original.rating}</span></Badge>)},enableSorting: false, },
    { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({row})=> (
      <Badge variant={"default"}  className={`capitalize rounded inset-shadow-xs inset-shadow-[${getStatusColor(row.original.status)}] ${getStatusColor(row.original.status)}`}>{row.original.status}</Badge> 
    )
    ,enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export type TUsers = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: string,
    gender: string,
    status: string,
    paymentMethod: string,
    profilePicture: string,
    social: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string
}
export function getUsers(
  onView: (id:string) => void,
  onEdit: (id:string) => void,
  onDelete: (id:string) => void,
):ColumnDef<TUsers>[]{
  return [
    {id: "select",
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
    { id: "id", header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({row})=> (<span>{row.original.firstName} {row.original.lastName}</span>),
    enableSorting: false, },
    { accessorKey: "email", header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,enableSorting: false, },
    { accessorKey: "phoneNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />, enableSorting: false, },
    { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({row})=> (
      <Badge variant={"default"}  className={`capitalize cursor-pointer rounded inset-shadow-xs inset-shadow-[${getStatusColor(row.original.status)}] ${getStatusColor(row.original.status)} w-[70px] h-5`}>{row.original.status}</Badge> 
    )
    ,enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}

export type TBooking = {
      id: string,
      userId: string,
      affiliateId: string,
      bookingType: string,
      pickupLocation: {
          latitude: number,
          longitude: number
      },
      dropoffLocation: {
          latitude: number,
          longitude: number
      },
      isThirdPartyUser: boolean,
      thirdPartyUser: {
          name: string,
          email: string,
          phone: string
      },
      scheduledTime: string,
      fare: number,
      status: string,
      createdAt: string,
      updatedAt: string
  };

  
      
export const formatDate = (dateString: string | null) => {
          if (!dateString) return '-';
          return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

export function getBooking(
  onView: (id:string) => void,
):ColumnDef<TBooking>[] {
  return [
    {id: "select",
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
    { accessorKey: "affiliateId", header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate Id" />,
    enableSorting: false, },
    { accessorKey: "bookingType", header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Type" />,enableSorting: false, },
    { accessorKey: "scheduledTime", header: ({ column }) => <DataTableColumnHeader column={column} title="Scheduled Time" />,
    cell: ({row})=>(
      <span>{formatDate(row.original.createdAt)}</span>
    ), enableSorting: false, },
    { accessorKey: "fare", header: ({ column }) => <DataTableColumnHeader column={column} title="Price $" />, enableSorting: false, },
    { accessorKey: "status", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({row})=> (
      <Badge variant={"default"}  className={`capitalize cursor-pointer rounded inset-shadow-xs inset-shadow-[${getStatusColor(row.original.status)}] ${getStatusColor(row.original.status)} w-[70px] h-5`}>{row.original.status}</Badge> 
    )
    ,enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Mail className="text-[#5A5A5A]" />
          </Button>
          <Button
            type="button"
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Phone className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
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
    id: string,
    affiliateId: string,
    plateNumber: string,
    brand: string,
    model: string,
    year: number,
    color: string,
    vehicleType: string,
    capacity: number,
    documents: [],
    vehicleImages: [],
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null | undefined,
};

export function getFleets(
  onView: (id:string) => void,
  onEdit: (id:string) => void,
  onDelete: (id:string) => void,
): ColumnDef<TFleet>[] {
  return [
    {id: "select",
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
    { accessorKey: "affiliateId", header: ({ column }) => <DataTableColumnHeader column={column} title="Affiliate Id" />,enableSorting: false, },
    { accessorKey: "plateNumber", header: ({ column }) => <DataTableColumnHeader column={column} title="Plate Number" />, enableSorting: false, },
    { accessorKey: "vehicleType", header: ({ column }) => <DataTableColumnHeader column={column} title="Vehicle Type" />
    ,enableSorting: false, },
    { accessorKey: "model", header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />
    ,enableSorting: false, },
    { accessorKey: "capacity", header: ({ column }) => <DataTableColumnHeader column={column} title="Capacity" />
    ,enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onEdit(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Edit className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onDelete(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Trash2 className="text-[#5A5A5A]" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ]
}


export type TTrips = {
    id: string,
    bookingId: string,
    chaufferId: string,
    tripType: string,
    tripStatus: string,
    tripStartTime: string,
    tripEndTime: string,
    distanceInKm: number,
    gratuity: number,
    paymentStatus: string,
    createdAt: string,
    updatedAt: string
}

export function getTrips(
  onView : (id: string) => void,
  onMap : (id: string) => void,
): ColumnDef<TTrips>[]{
  return [
    {id: "select",
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
    { accessorKey: "bookingId", header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Id" />,enableSorting: false, },
    { accessorKey: "tripType", header: ({ column }) => <DataTableColumnHeader column={column} title="Trip Type" />, enableSorting: false, },
    { accessorKey: "tripStatus", header: ({ column }) => <DataTableColumnHeader column={column} title="Trip Status" />
    ,
    cell: ({row})=> (
      <Badge variant={"default"}  className={`capitalize cursor-pointer rounded inset-shadow-xs inset-shadow-[${getStatusColor(row.original.tripStatus)}] ${getStatusColor(row.original.tripStatus)} w-[70px] h-5`}>{row.original.tripStatus}</Badge> 
    )
    ,enableSorting: false, },
    { accessorKey: "distanceInKm", header: ({ column }) => <DataTableColumnHeader column={column} title="Distance In Km" />
    ,
    enableSorting: false, },
    {
      id: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="text-right flex gap-2 items-center">
          <Button
            onClick={() => onView(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]"
          >
            <Eye className="text-[#5A5A5A]" />
          </Button>
          <Button
            onClick={() => onMap(row.original.id)}
            variant="outline"
            className="cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px] p-0"
          >
            <Icons path="/Location.svg" alt="map icon" className="text-[#5A5A5A]" />
            {/* <Icons path="/mapPin.svg" alt="map icon" className="text-[#5A5A5A] w-4 h-4" /> */}
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
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
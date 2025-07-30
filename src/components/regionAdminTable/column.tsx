import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";

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
            if(status==="Active") {
              return "bg-[#444444]";
            } else if(status==="Inactive") {
              return "bg-[#B8B8B8]";
            } else if(status==="Suspended") {
              return "bg-[#ECECEC]";
            } 
            return "bg-[##ececeb]";
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
    cell: ({row})=> (
      <Button variant={"secondary"}  className={`capitalize cursor-pointer rounded inset-shadow-xs inset-shadow-[#EEEEEE] ${getStatusColor(row.original.status)}`}>{row.original.status}</Button> 
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
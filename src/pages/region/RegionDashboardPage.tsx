import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { ChevronDown, Edit, Plus, Trash2 } from "lucide-react"
import { useState } from "react"


const showOptions = [
    { value: 10, label: "Show 10" },
    { value: 20, label: "Show 20" },
    { value: 30, label: "Show 30" },
];

const tableData = [
    {regionName: "Region 1", admin: "Chris Johnson" },
    {regionName: "Region 1", admin: "Ovi Smith" },
    {regionName: "Region 1", admin: "June Parker" },
    {regionName: "Region 1", admin: "Casey Walker" },
    {regionName: "Region 1", admin: "Jordon Lee" },
    {regionName: "Region 1", admin: "Taylor Morgan" },
    {regionName: "Region 1", admin: "Sam Patel" },
];
function RegionDashboardPage() {

    const [selected, setSelected] = useState(showOptions[0]);
    return (
        <AdminRootLayout>
            <div className="px-10 py-6">
                <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-lg">
                    <div className="w-full h-full flex items-center justify-between">
                        <div>
                            <h2 className="font-medium text-xl text-black">Region Management</h2>
                            <h4><span className="text-[#959595] w-14 h-4">LIMOSPRO</span> <span className="text-[#959595] w-[116px] h-4">/ Region Management</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Regions</span></h4>
                        </div>
                        <Button className="bg-[#E4E4E4] flex items-center rounded">
                            <Plus className="text-[#515151]" />
                            <span className="text-[#515151] font-medium text-sm">Add Regions</span>
                        </Button>
                    </div>
                </Header>

                <div className="flex justify-between">
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-56 h-10 flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] bg-[#FDFDFD] cursor-pointer">
                                {selected.label} <ChevronDown className="ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer" align="start">
                            <DropdownMenuGroup>
                                {showOptions.map(option => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        className="flex items-center justify-between hover:bg-[#F1F1F1]"
                                        onClick={() => setSelected(option)}
                                    >
                                        {option.label} <ChevronDown className="ml-2" />
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="w-[369px] h-[39px] mt-5 flex items-center justify-between gap-3">
                        <Button variant={"outline"} className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0">
                            <span className="text-[#959595] text-sm w-[93px] h-[19px]">Delete</span>
                            <Trash2 size={14} className="text-[#959595] cursor-pointer" />
                        </Button>
                        <div className="p-2.5 w-[220px] h-full flex items-center focus-visible:border-none focus-visible:outline-none"><Input type="search" placeholder="search" className="text-[#959595]" /></div>
                    </div>
                </div>
                <div className="mt-5 rounded-[6px]">
                    <Table className="py-4 bg-[#FDFDFD]  drop-shadow shadow-inner shadow-[#F1F1F1]">
  <TableHeader className="w-full h-[31px] px-4 py-1.5 bg-[#F5F5F5]">
    <TableRow style={{paddingLeft:"30px",paddingRight:'30px'}} className="w-full h-full ">
      <TableHead className="w-[100px]">#</TableHead>
      <TableHead>Region Name</TableHead>
      <TableHead>Admin</TableHead>
      <TableHead className="text-center">Access</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className="p-4">
    {tableData && tableData.map((row,i)=>(
        <TableRow key={i}>
            <TableCell className="font-medium"><Checkbox /></TableCell>
            <TableCell>Region 1</TableCell>
            <TableCell>Chris Johnson</TableCell>
            <TableCell className="text-center"><Button variant={"outline"}>Manage Access</Button></TableCell>
            <TableCell className="text-right">
                <Button variant={"outline"}><Edit/></Button>
                <Button variant={"outline"}><Trash2/></Button>
            </TableCell>
    </TableRow>
    ))}
    
  </TableBody>
</Table>
<Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
                </div>
            </div>
        </AdminRootLayout>
    )
}

export default RegionDashboardPage

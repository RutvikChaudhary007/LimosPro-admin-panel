import { IconFilterX } from "@tabler/icons-react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllSupportTickets } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { Spinner } from "@/components/Spinner";
import {
  getSupportTickets,
  type TSupportTicket,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const statusOptions = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const typeOptions = [
  { label: "Dispute", value: "DISPUTE" },
  { label: "Support Issue", value: "SUPPORT_ISSUE" },
];

const SupportTicketsPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isFetching, isError, refetch } = useFetchAllSupportTickets({
    page: newPage,
    limit: perPage,
    status: selectedStatus || undefined,
    type: selectedType || undefined,
  });

  const totalItems = data?.pagination?.totalItems ?? data?.tickets?.length ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const tickets = useMemo(
    () => (data?.tickets ?? []) as TSupportTicket[],
    [data?.tickets],
  );

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.VIEW_SUPPORT_TICKETS.replace(":id", id));
  };

  const columns = useMemo(() => getSupportTickets(handleView), [handleView]);

  const handleClearFilters = () => {
    setSelectedStatus("");
    setSelectedType("");
    setSearchValue("");
    setNewPage(1);
  };

  const handlePageChange = (page: number) => {
    setNewPage(page);
    window.scrollTo(0, 0);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setNewPage(1);
    refetch();
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Support Tickets")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Support Tickets"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Support Tickets" },
          ]}
        />

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <SelectDropDown
              placeholder="Select Status"
              items={statusOptions}
              value={selectedStatus}
              setSelectedItem={setSelectedStatus}
            />
            <SelectDropDown
              placeholder="Select Type"
              items={typeOptions}
              value={selectedType}
              setSelectedItem={setSelectedType}
            />
          </div>
          <div className="w-full max-w-fit flex flex-wrap items-center justify-between gap-4">
            <Button
              onClick={handleClearFilters}
              type="button"
              variant="outlineSecondary"
            >
              <IconFilterX /> <span>Clear Filter</span>
            </Button>
            <div>
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>

        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            data={tickets}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
            emptyMessage="No support tickets found."
          />
        )}

        <PaginationControls
          currentPage={newPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          totalItems={totalItems}
          perPage={perPage}
        />
      </div>
    </>
  );
};

export default SupportTicketsPage;

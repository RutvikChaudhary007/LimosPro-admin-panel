// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchALLFAQs from "@/api/faq.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getFaqs, type TFaqs } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { toastPromise, useToast } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "30", label: "Show 30" },
];

const FaqsPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPage, setNewPage] = useState(1);
  const [tableRef, setTableRef] = useState<any>(null);
  const [perPage, setPerPage] = useState(10);
  const [selectedOption, setSelectedOption] =
    useState<string>(optionDefaultValue);
  const { data, refetch, isFetching, isError } = useFetchALLFAQs(perPage);
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TFaqs>(data?.items, newPage, perPage, data?.pagination);

  useEffect(() => {
    setPerPage(Number(selectedOption));
    setNewPage(1);
    setPage(1);
  }, [selectedOption]);
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_FAQ.replace(":id", id));
  };
  const deleteFaq = queries.useDeleteFaqMutation();
  const bulkDeleteFaq = queries.useBulkDeleteFaqMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteFaq.mutateAsync(id), {
        loading: "Deleting FAQ...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! FAQ deleted successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Delete FAQ failed",
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Delete FAQ failed",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete FAQ failed",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };
  const columns = getFaqs(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setNewPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Faq")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Frequently Asked Question"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Faq" }]}
          action={{
            label: "Add Faq",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_FAQ,
          }}
        />

        <div className="flex justify-between">
          <SelectDropDown
            placeholder={selectedOption}
            items={showOptions}
            value={selectedOption}
            setSelectedItem={setSelectedOption}
          />
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteFaq}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Faqs"
                descTitle="faqs"
              />
            </span>
            <div className="">
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder="search"
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
            data={currentItems}
            rowSelection={rowSelection}
            onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}
        {/* Pagination */}
        {totalPages > 0 && calculatedTotalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default FaqsPage;

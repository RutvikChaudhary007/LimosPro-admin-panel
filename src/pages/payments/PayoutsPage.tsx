import { useMemo, useState } from "react";
import {
  useFetchPartnerTransactions,
  useManualPartnerPayoutMutation,
} from "@/api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import {
  getPayoutWalletColumns,
  type TPayoutWallet,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const PayoutsPage = () => {
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // API hook
  const {
    data: apiData,
    isError,
    isFetching,
  } = useFetchPartnerTransactions({ page: currentPage, limit: perPage });
  const manualPayoutMutation = useManualPartnerPayoutMutation();

  const payoutsData: TPayoutWallet[] = useMemo(() => {
    if (isError || !apiData?.wallets?.length) {
      return [];
    }
    return apiData.wallets;
  }, [apiData, isError]);

  const totalPages = Math.max(1, apiData?.pagination?.totalPages || 1);
  const currentItems = useMemo(() => payoutsData, [payoutsData]);

  const columns = useMemo(
    () =>
      getPayoutWalletColumns(
        (payload) => manualPayoutMutation.mutateAsync(payload),
        { showWithdraw: true },
      ),
    [manualPayoutMutation],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Payouts")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Payouts"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Payments", path: constant.ROUTING_URLS.PAYMENTS },
            { label: "Payouts" },
          ]}
        />
        <DataTable
          columns={columns}
          data={currentItems}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          emptyMessage={isFetching ? "Loading..." : "No payouts found."}
        />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          totalItems={payoutsData.length}
          perPage={perPage}
        />
      </div>
    </>
  );
};

export default PayoutsPage;

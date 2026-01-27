import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { getPayments, type TPayments } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const dummyPayouts: TPayments[] = [
  {
    id: "63f78860-ca8c-4708-a656-b3f9e90ab00d",
    partnerId: "edb4bbc2-1868-42d5-8830-637b4f405e79",
    partnerName: "bhoraniya enterprice",
    transactionType: "payment",
    amount: 631.24,
    status: "completed",
    bookingId: "77c23874-34d9-48dd-aa12-379b62917700",
    grossCallback: 792.99,
    platformMargin: 138.45,
    userDetails: undefined,
  },
  {
    id: "693e93a1-8019-4a5b-9f87-14a1a9c3b959",
    partnerId: "edb4bbc2-1868-42d5-8830-637b4f405e79",
    partnerName: "bhoraniya enterprice",
    transactionType: "payment",
    amount: 746.68,
    status: "completed",
    bookingId: "45a011b6-47b9-467e-a21b-5d6058a8d6aa",
    grossCallback: 904.99,
    platformMargin: 131.77,
    userDetails: undefined,
  },
];

const PayoutsPage = () => {
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const data = useMemo(() => dummyPayouts, []);
  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [currentPage, data, perPage]);

  const handleView = useCallback(
    (id: string) => {
      navigate(constant.ROUTING_URLS.VIEW_PAYMENTS.replace(":id", id));
    },
    [navigate],
  );

  const columns = useMemo(
    () => getPayments(handleView, { showWithdraw: false }),
    [handleView],
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
          emptyMessage="No payouts found."
        />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          totalItems={data.length}
          perPage={perPage}
        />
      </div>
    </>
  );
};

export default PayoutsPage;

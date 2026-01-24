import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAuditLogs } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { Spinner } from "@/components/Spinner";
import { getAuditLogColumns, type TAuditLog } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { constant } from "@/lib/constant";
import { formatFieldValue } from "@/utils/formatters";
import { generatePageTitle } from "@/utils/seo";

const AuditLogsPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [newPage, setNewPage] = useState(1);

  const { data, isFetching, isError, refetch } = useFetchAuditLogs({
    page: newPage,
    limit: perPage,
  });

  const logs = useMemo(() => {
    const items = (data?.logs ?? []) as TAuditLog[];
    return items.map((log) => {
      const moduleValue =
        log.module || (log as any).moduleName || (log as any).resource;
      const actionValue =
        log.action || (log as any).actionType || (log as any).operation;
      const methodValue = log.method || (log as any).httpMethod;

      return {
        ...log,
        id: String(log.id ?? ""),
        statusCode: log.statusCode ?? "N/A",
        module: formatFieldValue(moduleValue),
        action: formatFieldValue(actionValue),
        method: formatFieldValue(methodValue),
      };
    });
  }, [data?.logs]);

  const filteredLogs = useMemo(() => {
    if (!searchValue.trim()) return logs;
    const query = searchValue.toLowerCase();
    return logs.filter((log) =>
      [log.id, log.module, log.action, log.method]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [logs, searchValue]);

  const pagination = data?.pagination ?? {};
  const isServerPaginated = Boolean(
    pagination?.totalPages ??
      pagination?.totalItems ??
      pagination?.total ??
      pagination?.count,
  );
  const totalItems =
    typeof pagination?.totalItems === "number"
      ? pagination.totalItems
      : typeof pagination?.total === "number"
        ? pagination.total
        : typeof pagination?.count === "number"
          ? pagination.count
          : filteredLogs.length;
  const totalPages =
    typeof pagination?.totalPages === "number"
      ? pagination.totalPages
      : typeof pagination?.pages === "number"
        ? pagination.pages
        : Math.max(1, Math.ceil(totalItems / perPage));
  const paginatedLogs = useMemo(() => {
    if (isServerPaginated) return filteredLogs;
    const start = (newPage - 1) * perPage;
    return filteredLogs.slice(start, start + perPage);
  }, [filteredLogs, isServerPaginated, newPage, perPage]);

  useEffect(() => {
    if (newPage > totalPages) setNewPage(1);
  }, [newPage, totalPages]);

  const handleView = (id: string) => {
    navigate(constant.ROUTING_URLS.AUDIT_LOGS_DETAIL.replace(":id", id));
  };

  const columns = useMemo(() => getAuditLogColumns(handleView), [handleView]);

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Audit Logs")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Audit Logs"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Audit Logs" }]}
        />

        <div className="flex items-end justify-between gap-4">
          <div className="w-full max-w-fit">
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

        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            data={paginatedLogs}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
            emptyMessage="No audit logs found."
          />
        )}

        <PaginationControls
          currentPage={newPage}
          totalPages={totalPages}
          onPageChange={(value) => {
            setNewPage(value);
            window.scrollTo(0, 0);
          }}
          onPerPageChange={(value) => {
            setPerPage(value);
            setNewPage(1);
            refetch();
          }}
          totalItems={totalItems}
          perPage={perPage}
        />
      </div>
    </>
  );
};

export default AuditLogsPage;

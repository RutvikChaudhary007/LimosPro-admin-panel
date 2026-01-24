import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFetchAuditLogById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { formatFieldValue } from "@/utils/formatters";
import { generatePageTitle } from "@/utils/seo";

const AuditLogDetailsPage = () => {
  const { id } = useParams();
  const { data, isFetching, isError, refetch } = useFetchAuditLogById({ id });

  const detail = useMemo(() => {
    if (!data) return null;
    return {
      id: formatFieldValue(data.id),
      action: formatFieldValue(data.action),
      module: formatFieldValue(data.module),
      method: formatFieldValue(data.httpMethod || data.method),
      statusCode: formatFieldValue(data.statusCode),
      endpoint: formatFieldValue(data.endpoint),
      createdAt: formatFieldValue(data.createdAt),
      updatedAt: formatFieldValue(data.updatedAt),
      entityType: formatFieldValue(data.entityType),
      entityId: formatFieldValue(data.entityId),
      entityName: formatFieldValue(data.entityName),
      userEmail: formatFieldValue(data.userEmail),
      userRole: formatFieldValue(data.userRole),
      userName: formatFieldValue(
        data.userName ||
          (typeof data.userEmail === "string"
            ? data.userEmail.split("@")[0]
            : "N/A"),
      ),
      ipAddress: formatFieldValue(data.ipAddress),
      userAgent: formatFieldValue(data.userAgent),
      changes: data.changes ?? null,
    };
  }, [data]);

  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && !detail) {
    return (
      <EmptyDataState
        entityName="Audit Log"
        listRoute={constant.ROUTING_URLS.AUDIT_LOGS}
      />
    );
  }

  return (
    <>
      <PageTitle title={generatePageTitle("Audit Log Details")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Audit Log Details"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Audit Logs", path: constant.ROUTING_URLS.AUDIT_LOGS },
            { label: "Details" },
          ]}
          backAction={{
            variant: "outlinePrimary",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.AUDIT_LOGS,
          }}
        />

        {isFetching ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card>
                <CardBody>
                  <CardHeader>
                    <CardTitle className="flex flex-wrap items-center gap-3">
                      {detail?.module}
                      <Badge className="uppercase" variant="outline">
                        {detail?.action}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <FieldSeparator />
                  <CardContent className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                      <Section title="Overview">
                        <DetailRow label="Log ID" value={detail?.id} />
                        <DetailRow label="HTTP Method" value={detail?.method} />
                        <DetailRow
                          label="Status Code"
                          value={detail?.statusCode}
                        />
                        <DetailRow label="Endpoint" value={detail?.endpoint} />
                        <DetailRow
                          label="Created At"
                          value={detail?.createdAt}
                        />
                        <DetailRow
                          label="Updated At"
                          value={detail?.updatedAt}
                        />
                      </Section>

                      <Section title="Entity">
                        <DetailRow
                          label="Entity Type"
                          value={detail?.entityType}
                        />
                        <DetailRow label="Entity ID" value={detail?.entityId} />
                        <DetailRow
                          label="Entity Name"
                          value={detail?.entityName}
                        />
                      </Section>
                    </div>
                  </CardContent>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Changes</CardTitle>
                  </CardHeader>
                  <FieldSeparator />
                  <CardContent>
                    <ChangesSection value={detail?.changes} />
                  </CardContent>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Action Performed By</CardTitle>
                  </CardHeader>
                  <FieldSeparator />
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border border-base-light-gray bg-base-white px-4 py-5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                          {getInitials(detail?.userName)}
                        </div>
                        <div className="space-y-1">
                          <div className="text-base font-semibold text-base-black">
                            {detail?.userName}
                          </div>
                          <div className="text-sm text-base-gray">
                            {detail?.userEmail}
                          </div>
                          <Badge variant="secondary" className="uppercase">
                            {detail?.userRole}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-base-gray">
                          IP Address
                        </span>
                        <div className="mt-1 text-sm font-semibold text-base-black">
                          {detail?.ipAddress}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-base-gray">
                          Browser
                        </span>
                        <div className="mt-1 text-sm font-semibold text-base-black">
                          {detail?.userAgent}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h6 className="font-montserrat font-bold text-base-black text-sm mb-4">
      {title}
    </h6>
    <div className="grid grid-cols-1 md:grid-cols-[max-content_1fr] gap-x-6 gap-y-3">
      {children}
    </div>
  </div>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <>
    <Label className="font-montserrat font-semibold capitalize text-base-black">
      {label}:
    </Label>
    <span className="text-sm text-base-black/80 break-words">
      {formatFieldValue(value)}
    </span>
  </>
);

const getInitials = (value?: string) => {
  if (!value) return "NA";
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const formatChangeLabel = (key: string) => {
  if (/user/i.test(key)) return "This user's details were updated";
  return key.replace(/_/g, " ");
};

const ChangesSection = ({ value }: { value: unknown }) => {
  if (!value || typeof value !== "object") {
    return <span className="text-sm text-base-gray">N/A</span>;
  }

  const changes = value as Record<string, any>;
  const before = (changes.before ?? {}) as Record<string, unknown>;
  const after = (changes.after ?? {}) as Record<string, unknown>;
  const keys = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  );
  const tailKeys = ["createdAt", "updatedAt", "created_at", "updated_at"];
  const hiddenKeys = ["businessLocation", "business_location"];
  const orderedKeys = [
    ...keys
      .filter((key) => !hiddenKeys.includes(key))
      .filter((key) => !tailKeys.includes(key)),
    ...keys
      .filter((key) => !hiddenKeys.includes(key))
      .filter((key) => tailKeys.includes(key)),
  ];

  if (keys.length === 0) {
    return <span className="text-sm text-base-gray">N/A</span>;
  }

  return (
    <div className="md:col-span-2">
      <div className="hidden md:grid grid-cols-[200px_1fr_1fr] gap-x-6 text-xs font-bold uppercase tracking-widest text-base-gray px-4">
        <span>Field</span>
        <span>Before</span>
        <span>After</span>
      </div>
      <div className="mt-3 rounded-lg border border-base-light-gray divide-y divide-base-light-gray/70 bg-base-white">
        {orderedKeys.map((key) => (
          <div
            key={key}
            className="grid gap-3 px-4 py-4 md:grid-cols-[200px_1fr_1fr]"
          >
            <Label className="font-montserrat font-semibold capitalize text-base-black">
              {formatChangeLabel(key)}
            </Label>
            <div className="text-sm text-base-black/80">
              {renderChangeValue(before[key], key)}
            </div>
            <div className="text-sm text-base-black/80">
              {renderChangeValue(after[key], key)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderChangeValue = (value: unknown, key?: string) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-base-gray">N/A</span>;
  }

  if (typeof value === "string" && isImageUrl(value)) {
    return (
      <img
        src={value}
        alt="Document"
        className="h-16 w-16 rounded border border-base-light-gray object-cover"
        loading="lazy"
      />
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-base-gray">N/A</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded border border-base-light-gray p-2"
          >
            {renderChangeValue(item)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (key && /user/i.test(key)) {
      return (
        <div className="space-y-1">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {formatFieldValue(
              record.name ||
                record.fullName ||
                record.userName ||
                record.firstName,
            )}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            {formatFieldValue(record.email || record.userEmail)}
          </div>
        </div>
      );
    }
    const imageUrl =
      (record.fileUrl as string) ||
      (record.url as string) ||
      (record.imageUrl as string);
    if (imageUrl && isImageUrl(imageUrl)) {
      return (
        <img
          src={imageUrl}
          alt="Document"
          className="h-16 w-16 rounded border border-base-light-gray object-cover"
          loading="lazy"
        />
      );
    }
    return <KeyValueTree value={record} />;
  }

  return <span>{formatFieldValue(value)}</span>;
};

const KeyValueTree = ({ value }: { value: unknown }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-sm text-base-gray">N/A</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-sm text-base-gray">N/A</span>;
    }
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded border border-base-light-gray bg-base-light-gray/40 p-3"
          >
            <KeyValueTree value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className="text-sm text-base-gray">N/A</span>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-[max-content_1fr] gap-x-4 gap-y-3">
        {entries.map(([key, val]) => (
          <div
            key={key}
            className={cn(
              "grid grid-cols-1 md:grid-cols-[max-content_1fr] gap-x-4 gap-y-2",
              typeof val === "object" && val !== null && "md:col-span-2",
            )}
          >
            <Label className="font-montserrat font-semibold capitalize text-base-black">
              {key}:
            </Label>
            <div className="text-sm text-base-black/80 break-words">
              <KeyValueTree value={val} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "string" && isImageUrl(value)) {
    return (
      <img
        src={value}
        alt="Document"
        className="h-24 w-24 rounded border border-base-light-gray object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <span className="text-sm text-base-black/80 break-words">
      {formatFieldValue(value)}
    </span>
  );
};

const isImageUrl = (value: string) =>
  /^https?:\/\//i.test(value) &&
  /(\.png|\.jpe?g|\.gif|\.webp|\.svg|\.bmp|\.tiff)$/i.test(value.split("?")[0]);

export default AuditLogDetailsPage;

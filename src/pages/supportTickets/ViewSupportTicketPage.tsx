import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  Paperclip,
  Send,
  XCircle,
} from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  replySupportTicket,
  updateSupportTicketStatus,
  useFetchSupportTicketById,
} from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { SelectDropDown } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { formatFieldValue } from "@/utils/formatters";

type SupportTicketConversation = {
  id?: string | number;
  senderType?: string;
  senderName?: string;
  userName?: string;
  message?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ViewSupportTicketPage = () => {
  const { id } = useParams();
  const { data, isFetching, isError, refetch } = useFetchSupportTicketById({
    id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateSupportTicketStatus,
    onSuccess: () => refetch(),
  });

  const [assignee, setAssignee] = useState<string | undefined>(undefined);
  const [messageInput, setMessageInput] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(
    null,
  );
  const [messages, setMessages] = useState<
    {
      id: string;
      author: "user" | "agent";
      name: string;
      message: string;
      date?: string;
    }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (data?.assignedTo || data?.assignedToId) {
      setAssignee(String(data.assignedTo ?? data?.assignedToId));
    } else {
      setAssignee(undefined);
    }
  }, [data?.assignedTo, data?.assignedToId]);

  useEffect(() => {
    if (!data?.id) return;
    const conversations = Array.isArray(data?.conversations)
      ? (data.conversations as SupportTicketConversation[])
      : [];
    if (conversations.length) {
      const mapped = conversations
        .map((item, index) => {
          const author =
            item?.senderType === "admin" || item?.senderType === "support"
              ? ("agent" as const)
              : ("user" as const);
          return {
            id: String(item?.id ?? index),
            author,
            name: String(
              item?.senderName ?? item?.userName ?? item?.senderType ?? "User",
            ),
            message: String(item?.message ?? item?.text ?? ""),
            date: item?.createdAt ?? item?.updatedAt,
          };
        })
        .filter((item) => item.message.trim());
      if (mapped.length) {
        setMessages(mapped);
        return;
      }
    }
    setMessages([
      {
        id: "initial",
        author: "user",
        name: formatFieldValue(data?.raisedBy || data?.userType),
        message: formatFieldValue(data?.description),
        date: data?.createdAt,
      },
      {
        id: "support",
        author: "agent",
        name: "Support Team",
        message: "Thanks for reaching out — we are reviewing your request.",
        date: data?.createdAt,
      },
    ]);
  }, [
    data?.id,
    data?.raisedBy,
    data?.userType,
    data?.description,
    data?.createdAt,
    data?.conversations,
  ]);

  const handleSendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !id) return;
    await toastPromise(
      replySupportTicket({
        id,
        message: trimmed,
        attachment: selectedAttachment,
      }),
      {
        loading: "Sending reply...",
        success: "Reply sent",
        error: "Failed to send reply",
      },
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        author: "agent",
        name: "Support Team",
        message: trimmed,
        date: new Date().toISOString(),
      },
    ]);
    setMessageInput("");
    setSelectedAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const [file] = Array.from(event.target.files ?? []);
    setSelectedAttachment(file ?? null);
  };

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    await toastPromise(updateStatusMutation.mutateAsync({ id, status }), {
      loading: "Updating status...",
      success: "Ticket status updated",
      error: "Failed to update status",
    });
  };

  const formatTicketDate = (value?: string) => {
    if (!value) return "N/A";
    try {
      return format(new Date(value), "EEEE, dd MMM yyyy");
    } catch {
      return "N/A";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || Number.isNaN(bytes)) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const attachmentItems = useMemo<
    { label: string; url?: string; type?: string; size?: number }[]
  >(() => {
    const attachments = data?.attachments;
    if (!attachments)
      return [] as {
        label: string;
        url?: string;
        type?: string;
        size?: number;
      }[];
    if (Array.isArray(attachments)) {
      return attachments
        .map((item) => {
          if (typeof item === "string") {
            return { label: item };
          }
          return {
            label: String(
              item?.originalName ?? item?.fileName ?? item?.fileUrl ?? "",
            ),
            url: item?.fileUrl,
            type: item?.fileType ?? item?.mimeType,
            size: item?.fileSize,
          };
        })
        .filter((item) => item.label);
    }
    if (typeof attachments === "string" && attachments.includes(",")) {
      return attachments
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => ({ label: item }));
    }
    return [{ label: String(attachments) }];
  }, [data?.attachments]);

  const assigneeOptions = useMemo(
    () =>
      [
        { label: "Unassigned", value: "UNASSIGNED" },
        { label: "Support Desk", value: "Support Desk" },
        { label: "Billing Team", value: "Billing Team" },
        { label: "Operations", value: "Operations" },
        data?.assignedTo
          ? { label: String(data.assignedTo), value: String(data.assignedTo) }
          : null,
      ].filter(Boolean) as { label: string; value: string }[],
    [data?.assignedTo],
  );

  const assigneePlaceholder = data?.assignedTo ? "Assign to" : "N/A";

  const isClosed = data?.status === "CLOSED";
  const headerActions: NonNullable<
    ComponentProps<typeof PageHeader>["action"]
  > = isClosed
    ? [
        {
          label: `Status: ${formatFieldValue(data?.status)}`,
          variant: "outlineNavBtnSecondary",
        },
      ]
    : [
        {
          label: "Resolve",
          icon: <CheckCircle2 />,
          variant: "outlineNavBtnPrimary",
          onClick: () => handleStatusUpdate("RESOLVED"),
        },
        {
          label: "Closed",
          icon: <XCircle />,
          variant: "outlineNavBtnDestructive",
          onClick: () => handleStatusUpdate("CLOSED"),
        },
      ];

  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="Support Ticket"
        listRoute={constant.ROUTING_URLS.SUPPORT_TICKETS}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Support Ticket Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Support Tickets",
            path: constant.ROUTING_URLS.SUPPORT_TICKETS,
          },
          { label: "View Ticket" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.SUPPORT_TICKETS,
        }}
        action={headerActions}
      />

      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody className="space-y-6">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>{formatFieldValue(data?.title)}</CardTitle>
                  <CardDescription className="text-sm font-bold">
                    Ticket ID: {formatFieldValue(data?.id)}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {formatFieldValue(data?.type)}
                  </Badge>
                  <Badge variant="outline">
                    {formatFieldValue(data?.category)}
                  </Badge>
                  <Badge variant="secondary">
                    {formatFieldValue(data?.priority)}
                  </Badge>
                  <Badge
                    variant={
                      data?.status === "OPEN"
                        ? "destructive"
                        : data?.status === "RESOLVED"
                          ? "success"
                          : "default"
                    }
                  >
                    {formatFieldValue(data?.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <FieldSeparator />
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="rounded-lg border border-base-light-gray/60 p-4">
                    <h6 className="font-montserrat font-semibold text-sm text-base-black mb-4">
                      Ticket Summary
                    </h6>
                    <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                      <Label className="font-montserrat font-semibold capitalize">
                        Raised By:
                      </Label>
                      <Label>
                        {formatFieldValue(data?.raisedBy || data?.userType)}
                      </Label>

                      <Label className="font-montserrat font-semibold capitalize">
                        Region:
                      </Label>
                      <Label>{formatFieldValue(data?.region)}</Label>

                      <Label className="font-montserrat font-semibold capitalize">
                        Description:
                      </Label>
                      <Label>{formatFieldValue(data?.description)}</Label>
                    </div>
                  </div>

                  <div className="rounded-lg border border-base-light-gray/60 p-4 space-y-4">
                    <h6 className="font-montserrat font-semibold text-sm text-base-black">
                      Timeline
                    </h6>
                    <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                      <Label className="font-montserrat font-semibold capitalize">
                        Created:
                      </Label>
                      <Label>{formatTicketDate(data?.createdAt)}</Label>

                      <Label className="font-montserrat font-semibold capitalize">
                        Updated:
                      </Label>
                      <Label>{formatTicketDate(data?.updatedAt)}</Label>
                    </div>
                  </div>

                  <div className="rounded-lg border border-base-light-gray/60 p-4">
                    <h6 className="font-montserrat font-semibold text-sm text-base-black mb-4">
                      Resolution
                    </h6>
                    <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                      <Label className="font-montserrat font-semibold capitalize">
                        Assigned To:
                      </Label>
                      <div>
                        <SelectDropDown
                          placeholder={assigneePlaceholder}
                          items={assigneeOptions}
                          value={assignee}
                          setSelectedItem={setAssignee}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-base-light-gray/60 p-4">
                    <h6 className="font-montserrat font-semibold text-sm text-base-black mb-4">
                      Attachments
                    </h6>
                    {attachmentItems.length ? (
                      <div className="space-y-2">
                        {attachmentItems.map((attachment) => {
                          const meta = [
                            attachment.type ?? "",
                            attachment.size
                              ? formatFileSize(attachment.size)
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" • ");

                          const content = (
                            <div
                              key={attachment.label}
                              className="flex items-center justify-between rounded border border-base-light-gray/70 px-3 py-2 transition hover:border-base-primary"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  <Paperclip className="size-4 text-base-gray" />
                                </div>
                                <div>
                                  <p className="text-sm text-base-black">
                                    {attachment.label}
                                  </p>
                                  {meta ? (
                                    <p className="text-xs text-base-gray">
                                      {meta}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-base-primary">
                                View
                              </span>
                            </div>
                          );

                          return attachment.url ? (
                            <a
                              key={attachment.label}
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              {content}
                            </a>
                          ) : (
                            <div key={attachment.label}>{content}</div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-base-gray">N/A</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded border border-base-light-gray/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <h6 className="font-montserrat font-semibold text-sm text-base-black">
                        Conversation
                      </h6>
                    </div>
                    <div
                      className={cn(
                        "space-y-4 rounded bg-base-light-gray/20 p-4 max-h-[420px] overflow-y-auto pr-2",
                      )}
                    >
                      {messages.length ? (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "group flex items-start gap-3",
                              message.author === "agent" &&
                                "justify-end text-right",
                            )}
                          >
                            {message.author === "user" && (
                              <div className="size-9 rounded-full bg-base-primary/10 text-base-primary grid place-items-center text-xs font-semibold">
                                {message.name?.[0] || "U"}
                              </div>
                            )}
                            <div
                              className={cn(
                                "max-w-[80%] space-y-1 rounded px-3 py-2 text-sm shadow-sm",
                                message.author === "agent"
                                  ? "bg-base-primary text-base-white"
                                  : "bg-base-white text-base-black border border-base-light-gray/60",
                              )}
                            >
                              <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
                                {message.name || "User"}
                              </p>
                              <p>{message.message}</p>
                              {message.date && (
                                <p className="text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-70">
                                  {formatTicketDate(message.date)}
                                </p>
                              )}
                            </div>
                            {message.author === "agent" && (
                              <div className="size-9 rounded-full bg-base-black/10 text-base-black grid place-items-center text-xs font-semibold">
                                {message.name?.[0] || "A"}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-base-gray">
                          No messages yet.
                        </p>
                      )}
                    </div>
                    <div className="mt-4 space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleAttachmentChange}
                      />
                      <Textarea
                        placeholder="Type your response..."
                        className="min-h-24"
                        value={messageInput}
                        onChange={(event) =>
                          setMessageInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      {selectedAttachment ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-base-light-gray/60 px-3 py-2 text-sm">
                          <div className="flex items-center gap-2 text-base-black">
                            <Paperclip className="size-4 text-base-gray" />
                            <span>{selectedAttachment.name}</span>
                          </div>
                          {selectedAttachment.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(selectedAttachment)}
                              alt={selectedAttachment.name}
                              className="h-14 w-20 rounded object-cover"
                            />
                          ) : null}
                          <button
                            type="button"
                            className="text-xs font-semibold text-base-danger"
                            onClick={() => setSelectedAttachment(null)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : null}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                          variant="outlineSecondary"
                          type="button"
                          onClick={handleAttachmentClick}
                        >
                          <Paperclip /> Attach file
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleSendMessage}
                        >
                          <Send /> Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewSupportTicketPage;

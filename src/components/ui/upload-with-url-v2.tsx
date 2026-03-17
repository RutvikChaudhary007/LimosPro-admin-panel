import { cva, type VariantProps } from "class-variance-authority";
import { Link, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Upload from "@/assets/Icons/ic-document-arrow-up.svg?react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import adminAxiosInstance from "@/utils/axiosInstance";
import { Badge } from "./badge";
import { Field, FieldDescription, FieldLabel, FieldSeparator } from "./field";
import { Input } from "./input";

/* ------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------ */
type UploadMode = "url" | "file";

export interface UploadValue {
  id: string;
  url: string;
}

interface InternalUploadItem {
  id: string; // internal tracking id
  backendId: string; // id from backend
  source: "url" | "file";
  previewSrc: string;
  fileName?: string;
}

interface UploadWithUrlV2Props extends VariantProps<typeof uploadBoxVariants> {
  value?: any;
  multiple?: boolean;
  maxSize?: number;
  accept?: string;
  title?: string;
  info?: boolean;
  disabled?: boolean;
  onChange?: (items: any) => void;
}

/* ------------------------------------------------------ */
/* VARIANTS */
/* ------------------------------------------------------ */
const uploadBoxVariants = cva(
  "border w-full rounded transition-all duration-200 font-quicksand bg-base-white border-base-gray",
  {
    variants: {
      variant: {
        primary: "text-base-primary",
        secondary: "text-base-secondary",
        dark: "text-base-black",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const dragOverVariants = cva(
  "border border-dashed rounded p-6 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer",
  {
    variants: {
      isDragging: {
        true: "border-base-primary bg-base-primary/10",
        false: "border-base-gray bg-base-white",
      },
    },
  },
);

/* ------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------ */
export default function UploadWithUrlV2({
  value,
  // variant,
  multiple = false,
  maxSize = 10,
  accept = "image/*",
  title = "Upload Image",
  info = true,
  disabled = false,
  onChange,
}: UploadWithUrlV2Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<UploadMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<InternalUploadItem[]>([]);
  const maxFileBytes = maxSize * 1024 * 1024;

  // Sync internal state with external value prop
  useEffect(() => {
    // Normalize value to an array of any type for processing
    const rawValueArray = Array.isArray(value) ? value : value ? [value] : [];

    const newUploads: InternalUploadItem[] = (rawValueArray as any[])
      .map((item) => {
        if (!item) return null;

        let backendId = "";
        let url = "";

        if (typeof item === "string") {
          backendId = item;
          url = item;
        } else if (typeof item === "object") {
          backendId = item.id || item.url || item.src || "";
          url = item.url || item.src || "";
        }

        if (!url) return null;

        const existing = uploads.find((u) => u.backendId === backendId);
        if (existing) return existing;

        return {
          id: `upload-${Date.now()}-${Math.random()}`,
          backendId: backendId,
          source:
            typeof item === "string" || item.id === item.url ? "url" : "file",
          previewSrc: url,
          fileName: url.split("/").pop() || "image",
        } as InternalUploadItem;
      })
      .filter((u): u is InternalUploadItem => u !== null);

    // Only update if content mismatch to avoid loops
    const idsMatch =
      newUploads.length === uploads.length &&
      newUploads.every((nu, i) => nu.backendId === uploads[i]?.backendId);

    if (!idsMatch) {
      setUploads(newUploads);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* ------------------------------------------------------ */
  /* URL VALIDATION & ADD */
  /* ------------------------------------------------------ */
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddUrl = () => {
    const normalizedUrl = urlInput.trim();

    if (!isValidUrl(normalizedUrl)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    // Since we don't have a backend ID for external URLs,
    // we use the URL as ID for consistency in this component,
    // or we might need a separate way to handle external URLs if the backend requires an ID.
    // For now, I'll use the URL as ID if none exists.
    const newItem: UploadValue = {
      id: normalizedUrl,
      url: normalizedUrl,
    };

    if (multiple) {
      const currentArray = Array.isArray(value) ? value : value ? [value] : [];
      onChange?.([...currentArray, newItem]);
    } else {
      onChange?.(newItem);
    }

    setUrlInput("");
    setUrlError(null);
  };

  /* ------------------------------------------------------ */
  /* FILE UPLOAD */
  /* ------------------------------------------------------ */
  const matchesAccept = (file: File, accept: string) => {
    return accept.split(",").some((p) => {
      p = p.trim();
      if (p === "*" || p === "*/*") return true;
      if (p.endsWith("/*") && file.type.startsWith(p.replace("/*", "")))
        return true;
      if (
        p.startsWith(".") &&
        file.name.toLowerCase().endsWith(p.toLowerCase())
      )
        return true;
      return file.type === p;
    });
  };

  const addFiles = async (list: FileList | null) => {
    if (!list || disabled || loading) return;

    const arr = Array.from(list);
    const validFiles: File[] = [];

    for (const f of arr) {
      if (f.size > maxFileBytes) {
        setUrlError(`"${f.name}" is too large. Max size is ${maxSize} MB.`);
        continue;
      }
      if (accept !== "*" && !matchesAccept(f, accept)) {
        setUrlError(`"${f.name}" format is not allowed.`);
        continue;
      }
      validFiles.push(f);
    }

    if (validFiles.length > 0) {
      setLoading(true);
      setUrlError(null);
      try {
        const uploadedItems: UploadValue[] = [];

        // If single mode, we only take the first file
        const filesToUpload = multiple ? validFiles : [validFiles[0]];

        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append("files", file);

          const response = await adminAxiosInstance.post(
            API_ENDPOINTS.MEDIA.UPLOAD_IMAGES,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );

          if (response.data.status && response.data.data.files.length > 0) {
            const { id, url } = response.data.data.files[0];
            uploadedItems.push({ id, url });
          } else {
            throw new Error(response.data.message || "Upload failed");
          }
        }

        if (multiple) {
          const currentArray = Array.isArray(value)
            ? value
            : value
              ? [value]
              : [];
          onChange?.([...currentArray, ...uploadedItems]);
        } else {
          onChange?.(uploadedItems[0]);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload image(s)";
        setUrlError(errorMessage);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  /* ------------------------------------------------------ */
  /* REMOVE UPLOAD */
  /* ------------------------------------------------------ */
  const removeUpload = (backendId: string) => {
    const valueArray = Array.isArray(value) ? value : value ? [value] : [];
    const newValues = valueArray.filter((v) => v.id !== backendId);

    if (multiple) {
      onChange?.(newValues);
    } else {
      onChange?.(undefined);
    }
  };

  /* ------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------ */
  return (
    <div className="space-y-2 w-full font-quicksand">
      <Field>
        <FieldLabel className="text-base-black gap-0">{title}</FieldLabel>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "url" ? "default" : "outlineBlack"}
            onClick={() => {
              setMode("url");
              setUrlError(null);
            }}
            disabled={disabled || loading}
          >
            <Link />
            URL
          </Button>

          <Button
            type="button"
            variant={mode === "file" ? "default" : "outlineBlack"}
            onClick={() => {
              setMode("file");
              setUrlError(null);
            }}
            disabled={disabled || loading}
          >
            <Upload />
            Upload
          </Button>
        </div>

        <FieldDescription>
          Select how you want to add the image.
        </FieldDescription>
      </Field>

      {/* CONTENT */}
      <div>
        {mode === "url" ? (
          /* URL MODE */
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter image URL here..."
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && urlInput.trim()) {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                disabled={disabled || loading}
              />
              <Button
                type="button"
                onClick={handleAddUrl}
                disabled={disabled || loading || !urlInput.trim()}
                size="xl"
                spacing="lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Plus />}
              </Button>
            </div>

            {urlError && (
              <p className="text-xs text-base-danger font-bold">{urlError}</p>
            )}
          </div>
        ) : (
          /* FILE MODE */
          <div
            role="button"
            tabIndex={disabled || loading ? -1 : 0}
            className={dragOverVariants({ isDragging: dragOver })}
            onClick={() => !disabled && !loading && inputRef.current?.click()}
            onDragOver={(e) => {
              if (disabled || loading) return;
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              if (disabled || loading) return;
              e.preventDefault();
              setDragOver(false);
              setUrlError(null);
              addFiles(e.dataTransfer.files);
            }}
            onKeyDown={(e) =>
              !disabled &&
              !loading &&
              ["Enter", " "].includes(e.key) &&
              inputRef.current?.click()
            }
          >
            {loading ? (
              <Loader2 className="size-10 mb-2 animate-spin text-base-primary" />
            ) : (
              <Upload className="size-10 mb-2 transition-all" />
            )}
            <p className="font-bold text-xs text-base-black">
              {loading
                ? "Uploading..."
                : "Drag your file(s) to start uploading"}
            </p>

            {!loading && (
              <>
                <div className="w-full py-6 px-8">
                  <FieldSeparator className="flex items-center [&_[data-slot=separator]]:bg-base-gray [&_[data-slot=field-separator-content]]:px-2.5! [&_[data-slot=field-separator-content]]:font-quicksand [&_[data-slot=field-separator-content]]:font-bold [&_[data-slot=field-separator-content]]:text-xs [&_[data-slot=field-separator-content]]:text-base-gray [&_[data-slot=field-separator-content]]:bg-base-white">
                    Or
                  </FieldSeparator>
                </div>
                <Button
                  type="button"
                  variant="outlinePrimary"
                  className="h-9 p-2"
                  size="xl"
                  spacing="sm"
                  disabled={disabled || loading}
                >
                  Browse Files
                </Button>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple={multiple}
              accept={accept}
              disabled={disabled || loading}
              onChange={(e) => {
                setUrlError(null);
                addFiles(e.target.files);
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
          </div>
        )}
      </div>

      {/* INFO */}
      {info && (
        <div className="flex justify-between text-xs text-base-gray font-bold">
          <span>Supported formats: {accept}</span>
          <span>Max size: {maxSize} MB</span>
        </div>
      )}

      {/* PREVIEW GRID */}
      {uploads.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {uploads.map((item) => (
            <div
              key={item.id}
              className="h-50 w-50 relative group rounded overflow-hidden border border-base-gray bg-base-white"
            >
              {/* PREVIEW IMAGE */}
              <img
                src={item.previewSrc}
                alt={item.fileName}
                className="w-full aspect-square object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <Button
                  type="button"
                  variant="outlineNavBtnBlack"
                  size="xl"
                  spacing="lg"
                  onClick={() => removeUpload(item.backendId)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-white"
                  aria-label={`Remove ${item.fileName}`}
                  disabled={disabled || loading}
                >
                  <Trash2 />
                </Button>
              </div>

              {/* SOURCE BADGE */}
              <div className="absolute top-2 left-2">
                <Badge>
                  {item.source === "url" ? (
                    <>
                      <Link className="size-3 mr-1" />
                      URL
                    </>
                  ) : (
                    <>
                      <Upload className="size-3 mr-1" />
                      File
                    </>
                  )}
                </Badge>
              </div>

              {/* FILE NAME TOOLTIP */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-base-white font-medium truncate">
                  {item.fileName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

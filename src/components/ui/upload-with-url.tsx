import { cva, type VariantProps } from "class-variance-authority";
import { Link, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Upload from "@/assets/Icons/ic-document-arrow-up.svg?react";
import { Button } from "@/components/ui/button";
import { Badge } from "./badge";
import { Field, FieldDescription, FieldLabel, FieldSeparator } from "./field";
import { Input } from "./input";

/* ------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------ */
type UploadMode = "url" | "file";

interface UploadItem {
  id: string;
  source: "url" | "file";
  previewSrc: string;
  selectedFile?: File;
  imageUrl?: string;
  fileName?: string;
}

interface UploadWithUrlProps extends VariantProps<typeof uploadBoxVariants> {
  value?: (File | string)[];
  multiple?: boolean;
  maxSize?: number;
  accept?: string;
  title?: string;
  info?: boolean;
  disabled?: boolean;
  onChange?: (items: (File | string)[]) => void;
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
export default function UploadWithUrl({
  value = [],
  // variant,
  multiple = false,
  maxSize = 10,
  accept = "image/*",
  title = "Upload Image",
  info = true,
  disabled = false,
  onChange,
}: UploadWithUrlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<UploadMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const maxFileBytes = maxSize * 1024 * 1024;

  // Sync internal state with external value prop
  useEffect(() => {
    const newUploads: UploadItem[] = [];

    // Helper to check if an item is already in current uploads to avoid recreating object URLs if possible
    // For simplicity and correctness with "value" prop changes, we might regenerate.
    // But to avoid flickering, we can try to match.
    // However, since "value" is the source of truth, we map it to UploadItems.

    value.forEach((item) => {
      if (item instanceof File) {
        // Check if we already have this file in state to preserve previewSrc
        const existing = uploads.find((u) => u.selectedFile === item);
        if (existing) {
          newUploads.push(existing);
        } else {
          const previewSrc = item.type.startsWith("image/")
            ? URL.createObjectURL(item)
            : "";
          newUploads.push({
            id: `file-${Date.now()}-${Math.random()}`,
            source: "file",
            previewSrc,
            selectedFile: item,
            fileName: item.name,
          });
        }
      } else if (typeof item === "string") {
        const existing = uploads.find((u) => u.imageUrl === item);
        if (existing) {
          newUploads.push(existing);
        } else {
          newUploads.push({
            id: `url-${Date.now()}-${Math.random()}`,
            source: "url",
            previewSrc: item, // For URL, preview is the URL itself
            imageUrl: item,
            fileName: item.split("/").pop() || "image",
          });
        }
      }
    });

    // Cleanup old object URLs that are no longer in use
    uploads.forEach((u) => {
      if (
        u.source === "file" &&
        u.previewSrc &&
        !newUploads.find((nu) => nu.previewSrc === u.previewSrc)
      ) {
        URL.revokeObjectURL(u.previewSrc);
      }
    });

    // Only update if length or content mismatch to avoid loops if value is referentially unstable but content same
    // For now, simple set.
    if (
      JSON.stringify(newUploads.map((u) => u.id)) !==
      JSON.stringify(uploads.map((u) => u.id))
    ) {
      setUploads(newUploads);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* ------------------------------------------------------ */
  /* URL VALIDATION & FETCH */
  /* ------------------------------------------------------ */
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchImageFromUrl = async (url: string) => {
    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    setUrlLoading(true);
    setUrlError(null);

    try {
      // In a real app, you might want to verify the URL is an image via a HEAD request or similar,
      // but here we might just trust it or let the img tag fail.
      // The previous implementation fetched the blob. We can keep that if we want to validate size/type.
      // However, for "Upload with URL", often we just want to store the URL string.
      // If we fetch blob, we are converting URL -> File essentially.
      // But the requirement says "File | string". So if it's a URL, we keep it as string.
      // We can do a quick check if it's reachable/image if needed, but simple is better.

      // Let's just validate it loads as an image or simple fetch check?
      // The previous code did a fetch. Let's keep it lightweight but robust.
      // If we just want the URL string, we don't need to fetch the blob unless we want to validate constraints.

      // Let's try to fetch headers to validate type/size if possible, otherwise just add it.
      // CORS might block fetch.

      // For this implementation, let's assume if it's a valid URL string, we accept it.
      // We can try to load it in an Image object to verify it's an image.

      const img = new Image();
      img.onload = () => {
        const newItem = url;
        const newValues = multiple ? [...value, newItem] : [newItem];
        onChange?.(newValues);
        setUrlInput("");
        setUrlLoading(false);
      };
      img.onerror = () => {
        setUrlError("Failed to load image from URL");
        setUrlLoading(false);
      };
      img.src = url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch image";
      setUrlError(errorMessage);
      setUrlLoading(false);
    }
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

  const addFiles = (list: FileList | null) => {
    if (!list || disabled) return;

    const arr = Array.from(list);
    const validFiles: File[] = [];

    for (const f of arr) {
      // Size check
      if (f.size > maxFileBytes) {
        setUrlError(`"${f.name}" is too large. Max size is ${maxSize} MB.`);
        continue;
      }

      // Accept check
      if (accept !== "*" && !matchesAccept(f, accept)) {
        setUrlError(`"${f.name}" format is not allowed.`);
        continue;
      }

      // Rename logic (optional, kept from previous)
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      const dotIndex = f.name.lastIndexOf(".");
      const namePart = dotIndex !== -1 ? f.name.slice(0, dotIndex) : f.name;
      const extPart = dotIndex !== -1 ? f.name.slice(dotIndex) : "";
      const newFileName = `${namePart}_${timestamp}${extPart}`;

      const newFile = new File([f], newFileName, { type: f.type });
      validFiles.push(newFile);
    }

    if (validFiles.length > 0) {
      const newValues = multiple
        ? [...value, ...validFiles]
        : validFiles.slice(0, 1);
      onChange?.(newValues);
    }
  };

  /* ------------------------------------------------------ */
  /* REMOVE UPLOAD */
  /* ------------------------------------------------------ */
  const removeUpload = (id: string) => {
    // Find the item to remove
    const itemToRemove = uploads.find((u) => u.id === id);
    if (!itemToRemove) return;

    // Filter out from value
    // We need to match by reference for Files or value for strings
    const newValues = value.filter((v) => {
      if (v instanceof File) return v !== itemToRemove.selectedFile;
      return v !== itemToRemove.imageUrl;
    });

    onChange?.(newValues);
  };

  /* ------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------ */
  return (
    <div className="space-y-4 w-full font-quicksand">
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
            disabled={disabled}
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
            disabled={disabled}
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
          <div className="space-y-4">
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
                    e.preventDefault(); // Prevent form submission
                    fetchImageFromUrl(urlInput);
                  }
                }}
                disabled={disabled || urlLoading}
              />
              <Button
                type="button"
                onClick={() => fetchImageFromUrl(urlInput)}
                disabled={disabled || urlLoading || !urlInput.trim()}
                size="xl"
                spacing="lg"
              >
                {urlLoading ? <Loader2 className="animate-spin" /> : <Plus />}
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
            tabIndex={disabled ? -1 : 0}
            className={dragOverVariants({ isDragging: dragOver })}
            onClick={() => !disabled && inputRef.current?.click()}
            onDragOver={(e) => {
              if (disabled) return;
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              if (disabled) return;
              e.preventDefault();
              setDragOver(false);
              setUrlError(null);
              addFiles(e.dataTransfer.files);
            }}
            onKeyDown={(e) =>
              !disabled &&
              ["Enter", " "].includes(e.key) &&
              inputRef.current?.click()
            }
          >
            <Upload className="size-10 mb-2 transition-all" />
            <p className="font-bold text-xs text-base-black">
              Drag your file(s) to start uploading
            </p>

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
            >
              Browse Files
            </Button>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple={multiple}
              accept={accept}
              disabled={disabled}
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
        <div className="flex justify-between text-xs text-base-gray mt-2 font-bold">
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
                  onClick={() => removeUpload(item.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-white"
                  aria-label={`Remove ${item.fileName}`}
                >
                  <Trash2 />
                </Button>
              </div>

              {/* SOURCE BADGE */}
              <div className="absolute top-2 left-2">
                <Badge>
                  {item.source === "url" ? (
                    <>
                      <Link />
                      URL
                    </>
                  ) : (
                    <>
                      <Upload />
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

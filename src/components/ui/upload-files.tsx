import { cva, type VariantProps } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconFilesUpload from "@/assets/Icons/ic-document-arrow-up.svg?react";
import { Button } from "./button";
import { FieldSeparator } from "./field";

const uploadBoxVariants = cva(
  "border w-full border-dashed rounded p-10 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer font-quicksand bg-base-white border-base-gray [&_svg]:**:stroke-current ",
  {
    variants: {
      variant: {
        primary: "text-base-primary",
        secondary: "text-base-secondary",
        dark: "text-base-black",
      },
      drag: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        drag: true,
        className: "border-base-primary",
      },
      {
        variant: "secondary",
        drag: true,
        className: "border-base-secondary",
      },
      {
        variant: "dark",
        drag: true,
        className: "border-base-black",
      },
    ],
    defaultVariants: {
      variant: "primary",
      drag: false,
    },
  },
);

interface FilesUploadProps extends VariantProps<typeof uploadBoxVariants> {
  value?: File[];
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  maxSize?: number;
  accept?: string;
  title?: string;
  browseLabel?: string;
  info?: boolean;
  disabled?: boolean;
}

type FileWithPreview = File & {
  fileUrl?: string;
  mimetype?: string;
  originalName?: string;
  name?: string; // For browser File objects
  size: number;
  status?: "pending" | "uploaded" | "error";
  preview?: string;
  type?: string;
};

export default function FilesUpload({
  variant,
  value = [],
  onChange,
  multiple = true,
  maxSize = 10,
  accept = ".jpg, .jpeg, .png, .doc, .xls, .txt, .pdf, .svg",
  title = "Upload Files",
  browseLabel = "Browse Files",
  info = true,
  disabled = false,
}: FilesUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const maxFileBytes = maxSize * 1024 * 1024;

  // Sync internal state with external value prop
  useEffect(() => {
    if (value) {
      const filesWithPreviews = value.map((f: FileWithPreview) => {
        const file = f as FileWithPreview;
        console.log("file preview:", file);
        if (f?.type?.startsWith("image/") && !file.preview) {
          file.preview = URL.createObjectURL(f);
        }
        if (f?.mimetype?.startsWith("image/") && !file.preview) {
          file.preview = f.fileUrl;
        }
        return file;
      });
      setFiles(filesWithPreviews);
    }
  }, [value]);

  function addFiles(list: FileList | null) {
    if (!list || disabled) return;
    const arr = Array.from(list);
    const validated: FileWithPreview[] = [];

    for (const f of arr) {
      if (f.size > maxFileBytes) continue;
      if (accept !== "*" && !matchesAccept(f, accept)) continue;

      // Add date DDMMYYYY before extension
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      const dotIndex = f.name.lastIndexOf(".");
      const namePart = dotIndex !== -1 ? f.name.slice(0, dotIndex) : f.name;
      const extPart = dotIndex !== -1 ? f.name.slice(dotIndex) : "";

      const newFileName = `${namePart}_${timestamp}${extPart}`;

      const x: FileWithPreview = new File([f], newFileName, { type: f.type });
      if (f.type.startsWith("image/")) x.preview = URL.createObjectURL(x);
      validated.push(x);
    }

    const newFiles = multiple
      ? [...files, ...validated]
      : validated.slice(0, 1);
    setFiles(newFiles);
    onChange?.(newFiles);
  }

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

  const removeFile = (name: string) => {
    const newFiles = files.filter((f) => {
      if (f.name === name) {
        if (f.preview) URL.revokeObjectURL(f.preview);
        return false;
      }
      return true;
    });
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const formatFileSize = (size: number) =>
    size < 1024
      ? `${size} B`
      : size < 1024 * 1024
        ? `${(size / 1024).toFixed(1)} KB`
        : `${(size / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="w-full font-quicksand">
      <p className="font-bold text-base text-base-black mb-2">{title}</p>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`${uploadBoxVariants({ variant, drag: dragOver })} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
          addFiles(e.dataTransfer.files);
        }}
        onKeyDown={(e) =>
          !disabled &&
          ["Enter", " "].includes(e.key) &&
          inputRef.current?.click()
        }
      >
        <IconFilesUpload className="size-10 mb-2 transition" />
        <p className="font-bold text-xs text-base-black">
          Drag your file(s) to start uploading
        </p>

        <div className="w-full py-6 px-8">
          <FieldSeparator className="flex items-center [&_[data-slot=separator]]:bg-base-gray [&_[data-slot=field-separator-content]]:px-2.5! [&_[data-slot=field-separator-content]]:font-quicksand [&_[data-slot=field-separator-content]]:font-bold [&_[data-slot=field-separator-content]]:text-xs [&_[data-slot=field-separator-content]]:text-base-gray [&_[data-slot=field-separator-content]]:bg-base-white">
            Or
          </FieldSeparator>
        </div>

        <Button
          variant={
            variant === "primary"
              ? "outlinePrimary"
              : variant === "secondary"
                ? "outlineSecondary"
                : variant === "dark"
                  ? "outlineBlack"
                  : "outlinePrimary"
          }
          className="h-9 p-2"
          size="xl"
          spacing="sm"
        >
          {browseLabel}
        </Button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          onChange={(e) => {
            addFiles(e.target.files);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </div>

      {info && (
        <div className="flex justify-between text-xs text-base-gray mt-2 font-bold">
          <span>Supported file formats: {accept}</span>
          <span>Max size: {maxSize} MB</span>
        </div>
      )}

      <div className="space-y-2 mt-6">
        {files.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-base-gray rounded px-2 py-2.5 bg-base-white"
          >
            <div className="flex items-center gap-2">
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <IconFilesUpload className="size-10" />
              )}
              <div className="text-xs">
                <div className="font-bold text-base-black mb-1">{f.name}</div>
                <div className="font-medium text-base-gray">
                  {formatFileSize(f.size)}
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              onClick={() => removeFile(f.name)}
              aria-label={`Remove ${f.name}`}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

import {
  IconFileExcel,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconFileWord,
} from "@tabler/icons-react";
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
  name?: string;
  size: number;
  status?: "loading" | "ready";
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
  const [error, setError] = useState<string | null>(null);
  const maxFileBytes = maxSize * 1024 * 1024;

  // Sync internal state with external value prop
  useEffect(() => {
    if (value) {
      // console.log("fileupload value:",value)
      const filesWithPreviews = value.map((f: FileWithPreview) => {
        const file = f as FileWithPreview;
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

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <IconFileTypePdf className="size-10" />;
    if (type.includes("word") || type.includes("doc"))
      return <IconFileWord className="size-10" />;
    if (type.includes("excel") || type.includes("sheet"))
      return <IconFileExcel className="size-10" />;
    if (type.includes("text") || type.includes("plain"))
      return <IconFileTypeTxt className="size-10" />;
    return <IconFilesUpload className="size-10" />;
  };

  function addFiles(list: FileList | null) {
    if (!list || disabled) return;

    const arr = Array.from(list);
    const validated: FileWithPreview[] = [];

    for (const f of arr) {
      // ❌ Size check
      if (f.size > maxFileBytes) {
        setError(`"${f.name}" is too large. Max size is ${maxSize} MB.`);
        continue;
      }

      // ❌ Accept check
      if (accept !== "*" && !matchesAccept(f, accept)) {
        setError(`"${f.name}" format is not allowed.`);
        continue;
      }

      // ----- ADD TIMESTAMP -----
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${pad(now.getDate())}${pad(
        now.getMonth() + 1,
      )}${now.getFullYear()}_${pad(now.getHours())}${pad(
        now.getMinutes(),
      )}${pad(now.getSeconds())}`;

      const dotIndex = f.name.lastIndexOf(".");
      const namePart = dotIndex !== -1 ? f.name.slice(0, dotIndex) : f.name;
      const extPart = dotIndex !== -1 ? f.name.slice(dotIndex) : "";
      const newFileName = `${namePart}_${timestamp}${extPart}`;

      const x: FileWithPreview = new File([f], newFileName, { type: f.type });
      x.status = "loading";

      const objectURL = URL.createObjectURL(x);

      // -------------------------------------------------
      //  IMAGE LOADING
      // -------------------------------------------------
      if (f.type.startsWith("image/")) {
        const img = new Image();
        img.src = objectURL;

        img.onload = () => {
          x.preview = objectURL;
          x.status = "ready";
          setFiles((prev) => [...prev]);
        };

        validated.push(x);
        continue;
      }

      // -------------------------------------------------
      //  VIDEO LOADING
      // -------------------------------------------------
      if (f.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = objectURL;

        video.onloadeddata = () => {
          x.preview = objectURL; // optional preview
          x.status = "ready";
          setFiles((prev) => [...prev]);
        };

        validated.push(x);
        continue;
      }

      // -------------------------------------------------
      //  AUDIO LOADING
      // -------------------------------------------------
      if (f.type.startsWith("audio/")) {
        const audio = document.createElement("audio");
        audio.src = objectURL;

        audio.onloadeddata = () => {
          x.status = "ready";
          setFiles((prev) => [...prev]);
        };

        validated.push(x);
        continue;
      }

      // -------------------------------------------------
      //  OTHER DOC TYPES: PDF, DOC, XLS, ZIP, TXT, SVG...
      // -------------------------------------------------
      x.status = "ready"; // no preview needed
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
        className={`${uploadBoxVariants({
          variant,
          drag: dragOver,
        })} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
          setError(null);
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
          type="button"
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
            setError(null);
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
            className="flex items-center justify-between border border-base-gray rounded px-2 py-2.5 bg-base-white overflow-hidden w-full"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* 👇 IMAGE LOADER */}
              {f.status === "loading" ? (
                <div className="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 rounded-full border-2 border-base-gray border-t-base-primary box-border overflow-hidden animate-spin"></div>
              ) : (f.preview && f?.type?.startsWith("image/")) ||
                f?.mimetype?.startsWith("image/") ? (
                <img src={f.preview} className="w-10 h-10 rounded" />
              ) : (
                getFileIcon(f.type)
              )}

              <div className="text-xs flex-1 min-w-0">
                <div className="font-bold text-base-black mb-1 truncate w-full max-w-full">
                  {f.name}
                </div>
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
        {error && (
          <div className="text-base-danger text-xs font-bold mt-2">{error}</div>
        )}
      </div>
    </div>
  );
}

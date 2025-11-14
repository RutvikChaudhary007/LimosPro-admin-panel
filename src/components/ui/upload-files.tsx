import { cva, type VariantProps } from "class-variance-authority";
import { Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const uploadBoxVariants = cva(
  "border w-full border-dashed rounded p-10 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer bg-white border-gray-300",
  {
    variants: {
      variant: {
        primary: "text-blue-600",
        secondary: "text-purple-600",
        dark: "text-gray-900",
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
        className: "border-blue-600 bg-blue-50",
      },
      {
        variant: "secondary",
        drag: true,
        className: "border-purple-600 bg-purple-50",
      },
      {
        variant: "dark",
        drag: true,
        className: "border-gray-900 bg-gray-50",
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

      const x: FileWithPreview = f;
      if (f.type.startsWith("image/")) x.preview = URL.createObjectURL(f);
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
    <div className="w-full">
      <p className="font-bold text-base text-gray-900 mb-2">{title}</p>

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
        <Upload className="w-10 h-10 mb-2" />
        <p className="font-bold text-xs text-gray-900">
          Drag your file(s) to start uploading
        </p>

        <div className="w-full py-6 px-8">
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2.5 text-xs font-bold text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled}
          className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
            variant === "primary"
              ? "border-blue-600 text-blue-600 hover:bg-blue-50"
              : variant === "secondary"
                ? "border-purple-600 text-purple-600 hover:bg-purple-50"
                : "border-gray-900 text-gray-900 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {browseLabel}
        </button>

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
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
          <span>Supported file formats: {accept}</span>
          <span>Max size: {maxSize} MB</span>
        </div>
      )}

      <div className="space-y-2 mt-6">
        {files.map((f) => (
          <div
            key={f.name}
            className="flex items-center justify-between border border-gray-300 rounded px-2 py-2.5 bg-white"
          >
            <div className="flex items-center gap-2">
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
              <div className="text-xs">
                <div className="font-bold text-gray-900 mb-1">{f.name}</div>
                <div className="font-medium text-gray-500">
                  {formatFileSize(f.size)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeFile(f.name)}
              disabled={disabled}
              className="p-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
              aria-label={`Remove ${f.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

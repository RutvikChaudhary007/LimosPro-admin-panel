import { cva, type VariantProps } from "class-variance-authority";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// IMAGE ONLY UPLOAD
const uploadBoxVariants = cva(
  "border w-[200px] h-[200px] border-dashed rounded flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer font-quicksand bg-base-white border-base-gray",
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
        className: "border-base-primary bg-base-primary/10",
      },
      {
        variant: "secondary",
        drag: true,
        className: "border-base-secondary bg-base-secondary/10",
      },
      {
        variant: "dark",
        drag: true,
        className: "border-base-black bg-base-black/10",
      },
    ],
    defaultVariants: {
      variant: "primary",
      drag: false,
    },
  },
);

interface ImagesUploadProps extends VariantProps<typeof uploadBoxVariants> {
  multiple?: boolean;
  maxSize?: number;
  accept?: string;
  title?: string;
  info?: boolean;
  disabled?: boolean;
}

type FileWithPreview = File & { preview?: string };

export default function ImagesUpload({
  variant,
  multiple = true,
  maxSize = 10,
  accept = "image/*",
  title = "Upload Images",
  info = true,
  disabled = false,
}: ImagesUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const maxFileBytes = maxSize * 1024 * 1024;

  function addFiles(list: FileList | null) {
    if (!list || disabled) return;
    const arr = Array.from(list);
    const validated: FileWithPreview[] = [];

    for (const f of arr) {
      if (f.size > maxFileBytes) continue;
      if (!f.type.startsWith("image/")) continue;

      // Create date string like DDMMYYYY
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      const dotIndex = f.name.lastIndexOf(".");
      const namePart = dotIndex !== -1 ? f.name.slice(0, dotIndex) : f.name;
      const extPart = dotIndex !== -1 ? f.name.slice(dotIndex) : "";

      const newFileName = `${namePart}_${timestamp}${extPart}`;

      const newFile: FileWithPreview = new File([f], newFileName, {
        type: f.type,
      });
      newFile.preview = URL.createObjectURL(newFile);
      validated.push(newFile);
    }

    setFiles((prev) =>
      multiple ? [...prev, ...validated] : validated.slice(0, 1),
    );
  }

  const removeFile = (name: string) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.name === name);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.name !== name);
    });
  };

  return (
    <div className="w-full font-quicksand">
      <p className="font-bold text-base text-base-black mb-2">{title}</p>

      <div className="flex flex-wrap items-start gap-4">
        {/* Upload Box */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={`${uploadBoxVariants({ variant, drag: dragOver })} ${disabled ? "opacity-50 cursor-not-allowed" : "mr-2"}`}
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
          <Plus className="size-10" />
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
        {/* Thumbnails */}
        {files.map((f, i) => (
          <div
            key={i}
            className="relative w-[200px] h-[200px] rounded overflow-hidden"
          >
            <img
              src={f.preview}
              alt={f.name}
              className="w-full h-full object-cover rounded"
            />
            <Button
              type="button"
              className="absolute top-2.5 right-2.5 bg-base-white"
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
      {info && (
        <p className="text-xs text-base-gray mt-2 font-bold">
          Max size: {maxSize} MB
        </p>
      )}
    </div>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

type FileWithPreview = File & { preview?: string };

type ImageItem = {
  id: string;
  type: "file" | "url";
  file?: FileWithPreview;
  url?: string;
  preview: string;
};

interface ImagesUploadProps extends VariantProps<typeof uploadBoxVariants> {
  multiple?: boolean;
  maxSize?: number;
  accept?: string;
  title?: string;
  info?: boolean;
  disabled?: boolean;
  value?: File | File[] | string | string[] | null;
  onFilesSelected?: (files: FileWithPreview[]) => void;
}

export default function ImagesUpload({
  variant,
  multiple = true,
  maxSize = 10,
  accept = "image/*",
  title = "Upload Images",
  info = true,
  disabled = false,
  value,
  onFilesSelected,
}: ImagesUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<ImageItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const maxFileBytes = maxSize * 1024 * 1024;

  // Initialize items from value prop
  useEffect(() => {
    if (!value) {
      setItems([]);
      return;
    }

    const newItems: ImageItem[] = [];

    if (typeof value === "string") {
      // Single URL
      newItems.push({
        id: `url-${Date.now()}`,
        type: "url",
        url: value,
        preview: value,
      });
    } else if (Array.isArray(value)) {
      // Array of Files or URLs
      value.forEach((item, index) => {
        if (typeof item === "string") {
          newItems.push({
            id: `url-${Date.now()}-${index}`,
            type: "url",
            url: item,
            preview: item,
          });
        } else if (item instanceof File) {
          const preview = URL.createObjectURL(item);
          newItems.push({
            id: `file-${Date.now()}-${index}`,
            type: "file",
            file: Object.assign(item, { preview }),
            preview,
          });
        }
      });
    } else if (value instanceof File) {
      // Single File
      const preview = URL.createObjectURL(value);
      newItems.push({
        id: `file-${Date.now()}`,
        type: "file",
        file: Object.assign(value, { preview }),
        preview,
      });
    }

    setItems(newItems);
  }, [value]);

  function addFiles(list: FileList | null) {
    if (!list || disabled) return;
    const arr = Array.from(list);
    const validated: FileWithPreview[] = [];
    const newItems: ImageItem[] = [];

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

      newItems.push({
        id: `file-${Date.now()}-${newFile.name}`,
        type: "file",
        file: newFile,
        preview: newFile.preview,
      });
    }

    setItems((prev) =>
      multiple ? [...prev, ...newItems] : newItems.slice(0, 1),
    );

    // Call callback if provided
    if (onFilesSelected) {
      const allFiles = multiple
        ? [
            ...items.filter((i) => i.type === "file").map((i) => i.file!),
            ...validated,
          ]
        : validated.slice(0, 1);
      onFilesSelected(allFiles);
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const removed = prev.find((item) => item.id === id);
      if (removed?.type === "file" && removed.file?.preview) {
        URL.revokeObjectURL(removed.file.preview);
      }
      const newItems = prev.filter((item) => item.id !== id);

      // Notify parent of change
      if (onFilesSelected) {
        const files = newItems
          .filter((i) => i.type === "file")
          .map((i) => i.file!);
        onFilesSelected(files);
      }

      return newItems;
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
        {items.map((item) => (
          <div
            key={item.id}
            className="relative w-[200px] h-[200px] rounded overflow-hidden"
          >
            <img
              src={item.preview}
              alt={item.type === "file" ? item.file?.name : "Image"}
              className="w-full h-full object-fill rounded"
            />
            <Button
              type="button"
              className="absolute top-2.5 right-2.5 bg-base-white"
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.type === "file" ? item.file?.name : "image"}`}
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

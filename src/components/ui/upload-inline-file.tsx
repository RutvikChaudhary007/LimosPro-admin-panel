import { cva, type VariantProps } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import IconInlineFileUpload from "@/assets/Icons/ic-document-arrow-up.svg?react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------ */
/* VARIANTS */
/* ------------------------------------------------------ */
const uploadBoxVariants = cva(
  "font-quicksand border w-full rounded p-4 gap-4 lg:gap-2 flex items-center transition-all duration-200 cursor-pointer font-quicksand bg-transparent border-base-gray [&_svg]:stroke-current text-base-gray [&_svg]:**:stroke-current [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "hover:text-base-primary hover:border-base-primary",
        secondary: "hover:text-base-secondary hover:border-base-secondary",
        dark: "hover:text-base-black hover:border-base-black",
        light: "hover:text-base-light-gray hover:border-base-light-gray",
      },
      drag: {
        true: "",
        false: "",
      },
      hasFile: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        hasFile: true,
        class: "text-base-primary-dark border-base-primary-dark",
      },
      {
        variant: "secondary",
        hasFile: true,
        class: "text-base-secondary-dark border-base-secondary-dark",
      },
      { variant: "dark", hasFile: true, class: "text-black border-black" },
      {
        variant: "light",
        hasFile: true,
        class: "text-base-white border-base-white",
      },
    ],
    defaultVariants: {
      variant: "primary",
      drag: false,
      hasFile: false,
    },
  },
);

interface InlineFileUploadProps extends VariantProps<typeof uploadBoxVariants> {
  multiple?: boolean;
  maxSize?: number;
  accept?: string;
  title?: string;
  removable?: boolean;
}

export default function InlineFileUpload({
  variant,
  maxSize = 10,
  multiple = false,
  accept = ".jpg, .jpeg, .png, .doc, .xls, .txt, .pdf, .svg",
  title = "Upload File",
  removable = true,
}: InlineFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const maxFileBytes = maxSize * 1024 * 1024;

  /* File validation */
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

  const handleFile = (list: FileList | null) => {
    if (!list) return;
    const validFiles: File[] = [];

    Array.from(list).forEach((f) => {
      if (
        f.size <= maxFileBytes &&
        (accept === "*" || matchesAccept(f, accept))
      ) {
        validFiles.push(f);
      }
    });

    if (validFiles.length === 0) return;

    setFiles((prev) => (multiple ? [...prev, ...validFiles] : [validFiles[0]]));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          uploadBoxVariants({
            variant,
            drag: dragOver,
            hasFile: files.length > 0,
          }),
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files);
        }}
      >
        <IconInlineFileUpload className="size-6 shrink-0" />

        {files.length > 0 ? (
          <div className="flex flex-col sm:flex-row sm:flex-wrap w-full gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full sm:w-auto min-w-0 border border-dashed border-base-gray rounded px-2 py-1 text-sm"
              >
                <span className="truncate max-w-[120px] font-bold">
                  {file.name}
                </span>
                {removable && (
                  <Button
                    variant="outlineNavBtnBlack"
                    className="ml-2 w-6 h-6 p-2 [&_svg:not([class*='size-'])]:size-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="font-medium">{title}</span>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => {
            handleFile(e.target.files);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </div>
    </div>
  );
}

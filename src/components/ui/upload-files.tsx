import IconFilesUpload from "@/assets/Icons/ic-document-arrow-up.svg?react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { FieldSeparator } from "./field";

/* ------------------------------------------------------------------ */
/* VARIANTS (same pattern as Input) */
/* ------------------------------------------------------------------ */
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
	uploadUrl?: string;
	multiple?: boolean;
	maxSize?: number;
	accept?: string;
	title?: string;
	browseLabel?: string;
	info?: boolean;
}

type FileWithPreview = File & { preview?: string };

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */
export default function FilesUpload({
	variant,
	multiple = true,
	maxSize = 10,
	accept = ".jpg, .jpeg, .png, .doc, .xls, .txt, .pdf, .svg",
	title = "Upload Files",
	browseLabel = "Browse Files",
	info = true,
}: FilesUploadProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [dragOver, setDragOver] = useState(false);
	const maxFileBytes = maxSize * 1024 * 1024;

	/* -------------------- File handling -------------------- */
	function addFiles(list: FileList | null) {
		if (!list) return;
		const arr = Array.from(list);
		const validated: FileWithPreview[] = [];

		for (const f of arr) {
			if (f.size > maxFileBytes) continue;
			if (accept !== "*" && !matchesAccept(f, accept)) continue;

			const x: FileWithPreview = f;
			if (f.type.startsWith("image/")) x.preview = URL.createObjectURL(f);
			validated.push(x);
		}

		setFiles((prev) =>
			multiple ? [...prev, ...validated] : validated.slice(0, 1),
		);
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
		setFiles((prev) => {
			const removed = prev.find((f) => f.name === name);
			if (removed?.preview) URL.revokeObjectURL(removed.preview);
			return prev.filter((f) => f.name !== name);
		});
	};

	const formatFileSize = (size: number) =>
		size < 1024
			? `${size} B`
			: size < 1024 * 1024
				? `${(size / 1024).toFixed(1)} KB`
				: `${(size / (1024 * 1024)).toFixed(1)} MB`;

	/* -------------------- Render -------------------- */
	return (
		<div className="w-full font-quicksand">
			<p className="font-bold text-base text-base-black mb-2">{title}</p>

			<button
				type="button"
				className={cn(uploadBoxVariants({ variant, drag: dragOver }))}
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setDragOver(true);
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragOver(false);
					addFiles(e.dataTransfer.files);
				}}
				onKeyDown={(e) =>
					["Enter", " "].includes(e.key) && inputRef.current?.click()
				}
			>
				<IconFilesUpload className="size-10 mb-2 transition" />
				<p className="font-bold text-[12px] text-base-black">
					Drag your file(s) to start uploading
				</p>

				<div className="w-full py-6 px-8">
					<FieldSeparator className="flex items-center [&_[data-slot=separator]]:bg-base-gray [&_[data-slot=field-separator-content]]:px-2.5! [&_[data-slot=field-separator-content]]:font-quicksand [&_[data-slot=field-separator-content]]:font-bold [&_[data-slot=field-separator-content]]:text-[12px] [&_[data-slot=field-separator-content]]:text-base-gray [&_[data-slot=field-separator-content]]:bg-base-white">
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
					onChange={(e) => {
						addFiles(e.target.files);
						if (inputRef.current) inputRef.current.value = "";
					}}
				/>
			</button>

			{info && (
				<div className="flex justify-between text-[12px] text-base-gray mt-2 font-bold">
					<span>Supported file formats: {accept}</span>
					<span>Max size: {maxSize} MB</span>
				</div>
			)}

			<div className="space-y-2 mt-6">
				{files.map((f) => (
					<div
						key={f.name}
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
							<div className="text-[12px]">
								<div className="font-bold text-base-black mb-1">{f.name}</div>
								<div className="font-medium text-base-gray">
									{formatFileSize(f.size)}
								</div>
							</div>
						</div>

						<Button
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

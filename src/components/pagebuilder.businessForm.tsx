/**
 * ================================
 * v4
 * ================================
 */

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronUp, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PreviewRenderer from "@/components/previewRenderer/PreviewRenderer ";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SelectDropDown } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import { useSticky } from "@/hooks/useSticky";
import { styledLog } from "@/utils/styledLog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

function SortableItem({ id, children }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="mb-3">
        {/* Drag Handle - now properly connected via listeners */}
        <Button
          {...listeners}
          type="button"
          variant="outlineNavBtnBlack"
          spacing="sm"
          className="cursor-grab active:cursor-grabbing mb-2"
        >
          <span className="drag-handle">⠿</span>
          Drag to reorder
        </Button>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

function LayoutBlock({
  block,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: any) {
  const [expanded, setExpanded] = useState(true);
  return (
    <Card>
      <CardBody className="overflow-hidden">
        <CardHeader className={`border-b ${expanded ? "!pb-2" : "!pb-1"}`}>
          <CardTitle>
            <span className="text-sm font-medium text-base-gray mr-2">
              #{String(index + 1).padStart(2, "0")}
            </span>
            {block.type
              .replace(/([A-Z])/g, " $1")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="Move Up"
            >
              <MoveUp />
            </Button>
            <Button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip="Move Down"
            >
              <MoveDown />
            </Button>
            <Button
              type="button"
              onClick={() => setExpanded(!expanded)}
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              tooltip={expanded ? "Collapse" : "Expand"}
            >
              <ChevronUp
                className={`transition-all ${expanded ? "" : "-rotate-180"}`}
              />
            </Button>
            <Button
              type="button"
              onClick={onRemove}
              variant="outlineNavBtnDestructive"
              size="xl"
              spacing="lg"
              tooltip="Delete Block"
            >
              <Trash2 />
            </Button>
          </CardAction>
        </CardHeader>

        {expanded && (
          <CardContent className="space-y-4">{children}</CardContent>
        )}
      </CardBody>
    </Card>
  );
}

// ... rest of your schema definitions remain the same ...
const heroSchema = z.object({
  image: z.string().url().or(z.literal("")).optional(),
  alt: z.string().optional(),
  h1: z.string().optional(),
  p: z.string().optional(),
  btn: z.string().optional(),
});

const serviceSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("serviceSection"),
  service: z.string().optional(),
  subService: z.string().optional(),
  infoCards: z
    .array(
      z.object({
        // Changed from infocard to infoCards (array)
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

const dedicatedServiceSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("dedicatedServiceSection"),
  img: z.string().url().or(z.literal("")).optional(),
  textRich: z.string().optional(),
});

const corporateServiceOfferingsSchema = z.object({
  id: z.string().optional(),
  type: z.literal("corporateServiceOfferings"),
  serviceCards: z
    .array(
      z.object({
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        button: z.string().optional(),
        btnTitle: z.string().optional(),
      }),
    )
    .optional(),
});

const corporateServicesAndFeaturesSchema = z.object({
  id: z.string().optional(),
  type: z.literal("corporateServicesAndFeatures"),
  infoCards: z
    .array(
      z.object({
        // Changed to array
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        height: z.number().optional(),
        width: z.number().optional(),
        orientation: z.enum(["vertical", "horizontal"]).optional(),
      }),
    )
    .optional(),
});

const whoWeSupportSchema = z.object({
  id: z.string().optional(),
  type: z.literal("whoWeSupport"),
  imageCards: z
    .array(
      z.object({
        // Changed to array
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().or(z.array(z.string())).optional(),
        button: z.string().optional(),
        btnTitle: z.string().optional(),
      }),
    )
    .optional(),
});

const ourGlobalReachSchema = z.object({
  id: z.string().optional(),
  type: z.literal("ourGlobalReach"),
  imageCards: z
    .array(
      z.object({
        // Changed to array
        src: z.string().url().or(z.literal("")).optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        description: z.string().or(z.array(z.string())).optional(),
        button: z.string().optional(),
        btnTitle: z.string().optional(),
      }),
    )
    .optional(),
});

const contactForServiceSchema = z.object({
  id: z.string().optional(),
  type: z.literal("contactForService"),
  textRich: z.string().optional(),
  btn: z.string().optional(),
  btnTitle: z.string().optional(),
});

const contentBlockSchema = z.union([
  serviceSectionSchema,
  dedicatedServiceSectionSchema,
  corporateServiceOfferingsSchema,
  corporateServicesAndFeaturesSchema,
  whoWeSupportSchema,
  ourGlobalReachSchema,
  contactForServiceSchema,
]);

const openGraphSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url().or(z.literal("")).optional(),
  images: z.array(z.string().url()).optional(),
  siteName: z.string().optional(),
  type: z.string().optional(),
});

const twitterSchema = z.object({
  card: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

const jsonLdDataSchema = z
  .object({
    "@context": z.url().default("https://schema.org"),
    "@type": z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    url: z.url().optional(),
    image: z.union([z.url(), z.array(z.url())]).optional(),

    // Organization-specific
    logo: z.url().optional(),
    contactPoint: z
      .array(
        z.object({
          "@type": z.literal("ContactPoint"),
          telephone: z.string(),
          contactType: z.string(),
          areaServed: z.union([z.string(), z.array(z.string())]).optional(),
          availableLanguage: z
            .union([z.string(), z.array(z.string())])
            .optional(),
        }),
      )
      .optional(),

    sameAs: z.array(z.string().url()).optional(),
  })
  .strict()
  .catchall(z.any());

const jsonLdSchema = z
  .any()
  .transform((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [];
  })
  .pipe(
    z.array(
      z.object({
        type: z.enum([
          "Organization",
          "WebSite",
          "WebPage",
          "Service",
          "LocalBusiness",
          "FAQPage",
          "BlogPosting",
          "BreadcrumbList",
          "Product",
          "Event",
          "Person",
          "Article",
        ]),
        data: jsonLdDataSchema,
      }),
    ),
  )
  .default([]);

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  openGraph: openGraphSchema.optional(),
  twitter: twitterSchema.optional(),
  jsonLd: jsonLdSchema.optional(),
});

export const pageTemplateSchema = z.object({
  pageName: z
    .string()
    .refine((v) => v.trim() !== "", { message: "Page name is required" }),
  slug: z
    .string()
    .max(100)
    .refine((v) => v.trim() !== "", { message: "Slug is required" }),
  hero: heroSchema,
  content: z.array(contentBlockSchema).min(1).optional(),
  seo: seoSchema.optional(),
  isActive: z.boolean().default(true).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export type PageTemplateFormData = z.infer<typeof pageTemplateSchema>;

const uid = () => Math.random().toString(36).slice(2, 9);

// Helper function to format date and time
const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper component for labeled inputs
function LabeledInput({ label, ...props }: any) {
  const id = props.name || `input-${Math.random()}`;
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

// Helper component for TinyEditor with label
interface LabeledEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  [key: string]: any;
}

function LabeledEditor({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: LabeledEditorProps) {
  const id = name || `editor-${Math.random()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <TinyEditorRHF
        value={value || ""}
        onChange={(val: any) => {
          onChange(val);
        }}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
}

// Helper component for simple textarea
interface LabeledTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export function LabeledTextarea({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: LabeledTextareaProps) {
  const id = name || `textarea-${Math.random()}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={4}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </div>
  );
}

function transformData(data: Partial<PageTemplateFormData>) {
  if (!data) return undefined;
  styledLog(data, "transformData data:", "success");
  return {
    ...data,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export default function PageTemplateEditor({
  initialData,
  onSubmit,
}: {
  initialData?: PageTemplateFormData;
  onSubmit: (data: PageTemplateFormData) => void;
}) {
  // ... state declarations remain the same ...
  const [activeTab, setActiveTab] = useState<"hero" | "content" | "seo">(
    "hero",
  );
  const [mediaOpen, setMediaOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaCb, setMediaCb] = useState<null | ((url: string) => void)>(null);
  const [apiOpen, setApiOpen] = useState(false);

  const form = useForm<PageTemplateFormData>({
    resolver: zodResolver(pageTemplateSchema),
    defaultValues: initialData
      ? transformData(initialData)
      : {
          pageName: "",
          slug: "",
          hero: { image: "", alt: "", h1: "", p: "", btn: "" },
          content: [],
          isActive: true,
          seo: undefined,
        },
  });

  const { control, register, handleSubmit, watch, setValue, getValues, reset } =
    form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "content" as const,
    keyName: "_key",
  });

  useEffect(() => {
    const c = getValues().content || [];
    const next = c.map((b: any) => ({ id: b.id || uid(), ...b }));
    setValue("content", next as any);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Increased distance for better UX
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item: any) => item._key === active.id);
      const newIndex = fields.findIndex((item: any) => item._key === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  // ... rest of your component code remains the same until the content tab ...
  const openMedia = (cb: (url: string) => void) => {
    setMediaCb(() => cb);
    setMediaOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaCb) mediaCb(url);
    setMediaOpen(false);
    setMediaCb(null);
  };

  const watched = watch();

  // Robustly derive preview content by combining 'fields' (correct order)
  // with 'watched.content' (live values) using the stable 'id'.
  const previewContent = fields.map((field: any) => {
    const liveValue = (watched.content || []).find(
      (c: any) => c.id === field.id,
    );
    return liveValue || field;
  });

  const previewData = { ...watched, content: previewContent };

  const onHandleSubmit = (data: PageTemplateFormData) => {
    onSubmit(data);
  };

  // Sticky hook for the Block Adder panel
  const { stickyRef, sentinelRef } = useSticky(100, activeTab);
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>{watched.pageName || "Untitled"}</CardTitle>
                {watched && initialData && (
                  <CardDescription className="space-y-[2px] text-sm">
                    <div>
                      Status:{" "}
                      <span className="text-base-secondary">Changed</span> ·{" "}
                      <Button variant="linkPrimary" spacing="none">
                        Revert to published
                      </Button>
                    </div>
                    {initialData.updatedAt && (
                      <p>
                        Last Modified: {formatDateTime(initialData.updatedAt)}
                      </p>
                    )}
                    {initialData.createdAt && (
                      <p>Created: {formatDateTime(initialData.createdAt)}</p>
                    )}
                  </CardDescription>
                )}
                <CardAction>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      spacing="sm"
                    >
                      {showPreview ? "Back to Editor" : "Edit"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      variant={showPreview ? "default" : "outlinePrimary"}
                      spacing="sm"
                    >
                      {showPreview ? "Hide Preview" : "Live Preview"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setApiOpen(true)}
                      spacing="sm"
                    >
                      API
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="">
                {/* Tabs */}
                <div className="flex gap-8">
                  {["hero", "content", "seo"].map((tab) => (
                    <Button
                      type="button"
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      variant="ghost"
                      spacing="sm"
                      className={`capitalize border-b-2 rounded-none transition ${
                        activeTab === tab
                          ? "border-base-black"
                          : "border-transparent"
                      }`}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                <Separator orientation="horizontal" className="mb-6 " />

                {/* Main Content */}
                <div className="">
                  {/* Editor Panel */}
                  <div
                    className={`transition-all duration-300 ${
                      showPreview ? "hidden" : "w-full"
                    }`}
                  >
                    <div className="w-full space-y-6">
                      {/* Hero Tab */}
                      {activeTab === "hero" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <h3 className="text-xl font-semibold col-span-full">
                              Page Title & Slug
                            </h3>
                            <LabeledInput
                              label="Title"
                              {...register("pageName")}
                            />
                            <LabeledInput label="Slug" {...register("slug")} />
                          </div>

                          <Separator className="my-6" />

                          <div className="grid grid-cols-2 gap-4">
                            <h3 className="text-xl font-semibold col-span-full">
                              Hero Section
                            </h3>
                            <Controller
                              control={control}
                              name="hero.image"
                              render={({ field }) => (
                                <LabeledInput
                                  label="Hero Image URL"
                                  {...field}
                                />
                              )}
                            />
                            <Controller
                              control={control}
                              name="hero.alt"
                              render={({ field }) => (
                                <LabeledInput label="Alt Text" {...field} />
                              )}
                            />
                            <Controller
                              control={control}
                              name="hero.h1"
                              render={({ field }) => (
                                <LabeledInput label="Heading (H1)" {...field} />
                              )}
                            />
                            <Controller
                              control={control}
                              name="hero.btn"
                              render={({ field }) => (
                                <LabeledInput label="Button Text" {...field} />
                              )}
                            />
                            <div className="col-span-full space-y-2">
                              <Label>Description (Paragraph)</Label>
                              <Controller
                                control={control}
                                name="hero.p"
                                render={({ field }) => (
                                  <TinyEditorRHF
                                    value={(field.value as string) || ""}
                                    onChange={(val) => {
                                      field.onChange(val);
                                    }}
                                  />
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() =>
                                openMedia((url) => setValue("hero.image", url))
                              }
                              variant="outlinePrimary"
                              spacing="sm"
                              className="hidden"
                            >
                              Choose Media
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Content Tab */}
                      {activeTab === "content" && (
                        <div className="flex flex-col md:flex-row gap-6 h-full">
                          {/* Left Column - Content Blocks */}
                          <div className="w-full [992px]:w-3/4 lg:w-7/12 xl:w-8/12 flex flex-col gap-3">
                            <h3 className="text-lg font-semibold">
                              Layout Blocks
                            </h3>

                            {fields.length === 0 ? (
                              <div className="flex-1 text-center border border-dashed border-base-gray rounded p-2 grid place-content-center">
                                <p className="text-base-gray">
                                  No content blocks added yet.
                                </p>
                                <p className="text-sm text-base-gray mt-1">
                                  Add a block using the buttons on the right
                                </p>
                              </div>
                            ) : (
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                              >
                                <SortableContext
                                  items={fields.map((f: any) => f._key)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {fields.map((field: any, index: number) => {
                                    const type = field.type;
                                    return (
                                      <SortableItem
                                        key={field._key}
                                        id={field._key}
                                      >
                                        <LayoutBlock
                                          block={{ type }}
                                          index={index}
                                          onRemove={() => remove(index)}
                                          onMoveUp={() =>
                                            move(index, index - 1)
                                          }
                                          onMoveDown={() =>
                                            move(index, index + 1)
                                          }
                                          canMoveUp={index > 0}
                                          canMoveDown={
                                            index < fields.length - 1
                                          }
                                        >
                                          {type === "serviceSection" && (
                                            <ServiceSectionBlock
                                              blockIndex={index}
                                              openMedia={openMedia}
                                            />
                                          )}
                                          {type ===
                                            "dedicatedServiceSection" && (
                                            <>
                                              <LabeledInput
                                                label="Image URL"
                                                {...register(
                                                  `content.${index}.img`,
                                                )}
                                              />
                                              <Controller
                                                control={control}
                                                name={`content.${index}.textRich`}
                                                render={({ field }) => (
                                                  <LabeledTextarea
                                                    label="Rich Text (HTML)"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                  />
                                                )}
                                              />{" "}
                                              <Button
                                                type="button"
                                                onClick={() =>
                                                  openMedia((url) =>
                                                    setValue(
                                                      `content.${index}.img`,
                                                      url,
                                                    ),
                                                  )
                                                }
                                                variant="outlinePrimary"
                                                spacing="sm"
                                              >
                                                Choose Image
                                              </Button>
                                            </>
                                          )}
                                          {type ===
                                            "corporateServiceOfferings" && (
                                            <CorporateServiceOfferingsBlock
                                              blockIndex={index}
                                              openMedia={openMedia}
                                            />
                                          )}
                                          {type ===
                                            "corporateServicesAndFeatures" && (
                                            <CorporateServicesAndFeaturesBlock
                                              blockIndex={index}
                                              openMedia={openMedia}
                                            />
                                          )}
                                          {type === "imageCards" && (
                                            <ImageCardsBlock
                                              blockIndex={index}
                                              openMedia={openMedia}
                                            />
                                          )}
                                          {type === "whoWeSupport" && (
                                            <ImageCardsBlock
                                              blockIndex={index}
                                              openMedia={openMedia}
                                            />
                                          )}
                                          {type === "ourGlobalReach" && (
                                            <ImageCardsBlock
                                              blockIndex={index}
                                              openMedia={openMedia}
                                            />
                                          )}
                                          {type === "contactForService" && (
                                            <>
                                              <Controller
                                                control={control}
                                                name={`content.${index}.textRich`}
                                                render={({ field }) => (
                                                  <LabeledTextarea
                                                    label="Rich Text (HTML)"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                  />
                                                )}
                                              />{" "}
                                              <LabeledInput
                                                label="Button Link"
                                                {...register(
                                                  `content.${index}.btn`,
                                                )}
                                              />
                                              <LabeledInput
                                                label="Button Text"
                                                {...register(
                                                  `content.${index}.btnTitle`,
                                                )}
                                              />
                                            </>
                                          )}
                                        </LayoutBlock>
                                      </SortableItem>
                                    );
                                  })}
                                </SortableContext>
                              </DndContext>
                            )}
                          </div>

                          {/* Right Column - Add Block Buttons */}
                          <div className="w-full [992px]:w-1/4 lg:w-5/12 xl:w-4/12">
                            <div ref={sentinelRef} className="h-px"></div>
                            <Card ref={stickyRef}>
                              <CardBody>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    Add New Block
                                  </CardTitle>
                                  <CardDescription>
                                    Click a button to add a new content block
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "serviceSection",
                                        service: "",
                                        subService: "",
                                        infoCards: [],
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Service Section
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "dedicatedServiceSection",
                                        img: "",
                                        textRich: "",
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Dedicated Service
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "corporateServiceOfferings",
                                        serviceCards: undefined,
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Corporate Offerings
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "corporateServicesAndFeatures",
                                        infoCards: [],
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Features
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "whoWeSupport",
                                        imageCards: [],
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Who We Support
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "ourGlobalReach",
                                        imageCards: [],
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Global Reach
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "contactForService",
                                      })
                                    }
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Contact CTA
                                  </Button>
                                </CardContent>
                              </CardBody>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* SEO Tab - UPDATED VERSION */}
                      {activeTab === "seo" && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold">
                            Search Engine Optimization
                          </h3>

                          {/* Basic SEO Fields */}
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>Basic SEO</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Controller
                                  control={control}
                                  name="seo.title"
                                  render={({ field }) => (
                                    <LabeledInput
                                      label="Meta Title"
                                      {...field}
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.description"
                                  render={({ field }) => (
                                    <LabeledTextarea
                                      label="Meta Description"
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.keywords"
                                  render={({ field }) => (
                                    <LabeledTextarea
                                      label="Keywords (comma separated)"
                                      value={
                                        Array.isArray(field.value)
                                          ? field.value.join(", ")
                                          : field.value || ""
                                      }
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      onChange={(val: string) => {
                                        try {
                                          styledLog(
                                            val,
                                            "keywords input:",
                                            "info",
                                          );
                                          const keywords = val
                                            .split(",")
                                            .map((k) => k.trim())
                                            .filter((k) => k.length > 0);
                                          styledLog(
                                            keywords,
                                            "keywords parsed:",
                                            "info",
                                          );
                                          field.onChange(keywords);
                                        } catch (err) {
                                          console.error(
                                            "Error parsing keywords",
                                            err,
                                          );
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </CardContent>
                            </CardBody>
                          </Card>

                          {/* Open Graph Fields */}
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>
                                  Open Graph (Facebook/LinkedIn)
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Controller
                                  control={control}
                                  name="seo.openGraph.title"
                                  render={({ field }) => (
                                    <LabeledInput
                                      label="OG Title"
                                      {...field}
                                      placeholder="Defaults to Meta Title if empty"
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.openGraph.description"
                                  render={({ field }) => (
                                    <LabeledTextarea
                                      label="OG Description"
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      placeholder="Defaults to Meta Description if empty"
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.openGraph.url"
                                  render={({ field }) => (
                                    <LabeledInput
                                      label="OG URL"
                                      {...field}
                                      placeholder="https://yourdomain.com/page"
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.openGraph.siteName"
                                  render={({ field }) => (
                                    <LabeledInput
                                      label="Site Name"
                                      {...field}
                                      placeholder="Your Site Name"
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.openGraph.type"
                                  render={({ field }) => (
                                    <div className="space-y-2">
                                      <Label className="text-xs uppercase tracking-wide">
                                        OG Type
                                      </Label>
                                      <SelectDropDown
                                        placeholder="Select type"
                                        classname="w-full"
                                        items={[
                                          {
                                            value: "website",
                                            label: "Website",
                                          },
                                          {
                                            value: "article",
                                            label: "Article",
                                          },
                                          { value: "book", label: "Book" },
                                          {
                                            value: "profile",
                                            label: "Profile",
                                          },
                                        ]}
                                        value={field.value}
                                        setSelectedItem={field.onChange}
                                      />
                                    </div>
                                  )}
                                />

                                <div>
                                  <Label className="text-xs uppercase tracking-wide mb-2 block">
                                    OG Images (URLs, one per line)
                                  </Label>
                                  <Controller
                                    control={control}
                                    name="seo.openGraph.images"
                                    render={({ field }) => (
                                      <Textarea
                                        rows={3}
                                        value={field.value?.join("\n") || ""}
                                        onChange={(e) => {
                                          const images = e.target.value
                                            .split("\n")
                                            .map((url) => url.trim())
                                            .filter((url) => url.length > 0);
                                          field.onChange(images);
                                        }}
                                        onBlur={field.onBlur}
                                        placeholder="https://limospro-media.s3.amazonaws.com/og/limospro-homepage-og.jpg"
                                      />
                                    )}
                                  />
                                  <p className="text-xs text-base-gray mt-1">
                                    Recommended size: 1200×630 pixels
                                  </p>
                                </div>
                              </CardContent>
                            </CardBody>
                          </Card>

                          {/* Twitter Fields */}
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>Twitter Cards</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Controller
                                  control={control}
                                  name="seo.twitter.card"
                                  render={({ field }) => (
                                    <div className="space-y-2">
                                      <Label className="text-xs uppercase tracking-wide">
                                        Card Type
                                      </Label>

                                      <SelectDropDown
                                        placeholder="Select card type"
                                        classname="w-full"
                                        items={[
                                          {
                                            value: "summary_large_image",
                                            label: "Summary with Large Image",
                                          },
                                          {
                                            value: "summary",
                                            label: "Summary",
                                          },
                                          { value: "app", label: "App" },
                                          { value: "player", label: "Player" },
                                        ]}
                                        value={field.value}
                                        setSelectedItem={field.onChange}
                                      />
                                    </div>
                                  )}
                                />

                                <Controller
                                  control={control}
                                  name="seo.twitter.title"
                                  render={({ field }) => (
                                    <LabeledInput
                                      label="Twitter Title"
                                      {...field}
                                      placeholder="Defaults to OG Title if empty"
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name="seo.twitter.description"
                                  render={({ field }) => (
                                    <LabeledTextarea
                                      label="Twitter Description"
                                      value={field.value}
                                      onChange={field.onChange}
                                      placeholder="Defaults to OG Description if empty"
                                    />
                                  )}
                                />
                                <div>
                                  <Label className="text-xs uppercase tracking-wide mb-2 block">
                                    Twitter Images (URLs, one per line)
                                  </Label>
                                  <Controller
                                    control={control}
                                    name="seo.twitter.images"
                                    render={({ field }) => (
                                      <Textarea
                                        rows={3}
                                        value={field.value?.join("\n") || ""}
                                        onChange={(e) => {
                                          const images = e.target.value
                                            .split("\n")
                                            .map((url) => url.trim())
                                            .filter((url) => url.length > 0);
                                          field.onChange(images);
                                        }}
                                        onBlur={field.onBlur}
                                        placeholder="https://limospro-media.s3.amazonaws.com/og/limospro-homepage-og.jpg"
                                      />
                                    )}
                                  />
                                  <p className="text-xs text-base-gray mt-1">
                                    Recommended size: 1200×628 pixels
                                  </p>
                                </div>
                              </CardContent>
                            </CardBody>
                          </Card>
                        </div>
                      )}
                    </div>
                    <Separator className="my-6" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => reset()}
                        variant="outlinePrimary"
                      >
                        Reset
                      </Button>
                      <Button onClick={() => console.log(getValues())}>
                        Next
                      </Button>
                    </div>
                  </div>
                  {/* Live Preview Panel */}
                  {showPreview && (
                    <div className="w-full bg-background p-0 overflow-y-auto">
                      <div className="border-b border-border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h2 className="text-lg font-bold">Preview Mode</h2>
                            <p className="text-sm text-base-gray">
                              Viewing: {watched.pageName || "Untitled Page"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                              Preview Mode
                            </div>
                            <Button
                              onClick={() => setShowPreview(false)}
                              variant="outline"
                              spacing="sm"
                            >
                              Back to Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Render the actual preview */}
                      <PreviewRenderer data={previewData} />
                    </div>
                  )}
                </div>
              </CardContent>
            </CardBody>
          </Card>

          {/* Media Library Modal */}
          {mediaOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-11/12 md:w-2/3 max-h-3/4 overflow-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Media Library</CardTitle>
                  <Button
                    onClick={() => setMediaOpen(false)}
                    variant="outline"
                    spacing="sm"
                  >
                    Close
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      "https://placehold.co/800/400",
                      "https://placehold.co/1200/630",
                      "https://placehold.co/600/400",
                    ].map((s) => (
                      <div
                        key={s}
                        className="border border-border p-2 rounded text-center"
                      >
                        <img
                          src={s}
                          alt="media"
                          className="w-full h-28 object-cover rounded mb-2"
                        />
                        <Button
                          onClick={() => handleMediaSelect(s)}
                          variant="outline"
                          spacing="sm"
                          size="sm"
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* API Preview Modal */}
          {apiOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <Card className="w-96">
                <CardHeader>
                  <CardTitle>API Output</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(JSON.stringify(getValues(), null, 2))
                        .then(() => {
                          toast.success("Copied to clipboard!");
                          setApiOpen(false);
                        })
                        .catch((err) => {
                          console.error("Failed to copy: ", err);
                          toast.error("Failed to copy to clipboard");
                        });
                    }}
                    variant="default"
                    spacing="sm"
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title id="copyJsonIconTitle">Copy JSON</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy JSON
                  </Button>
                  <pre className="text-xs bg-muted p-3 rounded max-h-80 overflow-auto">
                    {JSON.stringify(getValues(), null, 2)}
                  </pre>

                  <Button
                    onClick={() => setApiOpen(false)}
                    variant="outline"
                    spacing="md"
                    className="w-full"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

interface ServiceSectionBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

function ServiceSectionBlock({
  blockIndex,
  openMedia,
}: ServiceSectionBlockProps) {
  const { register, setValue, control } = useFormContext();

  // Nested field array for infoCards
  const {
    fields: infocardFields,
    append: appendInfocard,
    remove: removeInfocard,
  } = useFieldArray({
    name: `content.${blockIndex}.infoCards` as const,
  });

  return (
    <>
      <LabeledInput
        label="Service"
        {...register(`content.${blockIndex}.service`)}
      />
      <LabeledInput
        label="Subservice"
        {...register(`content.${blockIndex}.subService`)}
      />

      {/* Info Cards Section */}
      <div className="border-t border-border pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-base-gray uppercase tracking-wide">
            Info Cards ({infocardFields.length})
          </h4>
          <Button
            type="button"
            onClick={() =>
              appendInfocard({
                src: "",
                alt: "",
                title: "",
                description: "",
              })
            }
            variant="secondary"
            spacing="sm"
            size="sm"
          >
            + Add Card
          </Button>
        </div>

        {infocardFields.length > 0 && (
          <div className="space-y-4">
            {infocardFields.map((field, cardIndex) => (
              <Card key={field.id}>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Card #{cardIndex + 1}</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        onClick={() => removeInfocard(cardIndex)}
                        variant="destructive"
                        spacing="sm"
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LabeledInput
                      label="Image URL"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.src`,
                      )}
                    />
                    <LabeledInput
                      label="Alt Text"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.alt`,
                      )}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.title`,
                      )}
                    />
                    <Controller
                      control={control}
                      name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                      render={({ field }) => (
                        <LabeledEditor
                          label="Description"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        openMedia((url) =>
                          setValue(
                            `content.${blockIndex}.infoCards.${cardIndex}.src`,
                            url,
                          ),
                        )
                      }
                      variant="outlinePrimary"
                      spacing="sm"
                    >
                      Choose Image
                    </Button>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

interface CorporateServiceOfferingsBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

function CorporateServiceOfferingsBlock({
  blockIndex,
  openMedia,
}: CorporateServiceOfferingsBlockProps) {
  const { register, setValue, control } = useFormContext();

  const {
    fields: servicecardFields,
    append: appendServicecard,
    remove: removeServicecard,
  } = useFieldArray({
    name: `content.${blockIndex}.serviceCards` as const,
  });
  console.log("servicecardFields:", servicecardFields);

  return (
    <>
      <div className="border-t border-gray-700 pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Service Cards ({servicecardFields.length})
          </h4>
          <Button
            type="button"
            onClick={() =>
              appendServicecard({
                src: "",
                alt: "",
                title: "",
                description: "",
                button: "",
                btnTitle: "",
              })
            }
            variant="secondary"
            spacing="sm"
            size="sm"
          >
            + Add Card
          </Button>
        </div>

        {servicecardFields.length > 0 && (
          <div className="space-y-4">
            {servicecardFields.map((field, cardIndex) => (
              <Card key={field.id}>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Card #{cardIndex + 1}</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        onClick={() => removeServicecard(cardIndex)}
                        variant="destructive"
                        spacing="sm"
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LabeledInput
                      label="Image URL"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.src`,
                      )}
                    />
                    <LabeledInput
                      label="Alt Text"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.alt`,
                      )}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.title`,
                      )}
                    />
                    <Controller
                      control={control}
                      name={`content.${blockIndex}.serviceCards.${cardIndex}.description`}
                      render={({ field }) => (
                        <LabeledTextarea
                          label="Description"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
                    <LabeledInput
                      label="Button Link"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.button`,
                      )}
                    />
                    <LabeledInput
                      label="Button Text"
                      {...register(
                        `content.${blockIndex}.serviceCards.${cardIndex}.btnTitle`,
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        openMedia((url) =>
                          setValue(
                            `content.${blockIndex}.serviceCards.${cardIndex}.src`,
                            url,
                          ),
                        )
                      }
                      variant="outlinePrimary"
                      spacing="sm"
                    >
                      Choose Image
                    </Button>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

interface CorporateServicesAndFeaturesBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

function CorporateServicesAndFeaturesBlock({
  blockIndex,
  openMedia,
}: CorporateServicesAndFeaturesBlockProps) {
  const { register, setValue, control } = useFormContext();

  const {
    fields: infocardFields,
    append: appendInfocard,
    remove: removeInfocard,
  } = useFieldArray({
    name: `content.${blockIndex}.infoCards` as const,
  });

  return (
    <>
      <div className="border-t border-gray-700 pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Info Cards ({infocardFields.length})
          </h4>
          <Button
            type="button"
            onClick={() =>
              appendInfocard({
                src: "",
                alt: "",
                title: "",
                description: "",
                height: 60,
                width: 60,
                orientation: "horizontal",
              })
            }
            variant="secondary"
            spacing="sm"
            size="sm"
          >
            + Add Card
          </Button>
        </div>
        {infocardFields.length > 0 && (
          <div className="space-y-4">
            {infocardFields.map((field, cardIndex) => (
              <Card key={field.id}>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Card #{cardIndex + 1}</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        onClick={() => removeInfocard(cardIndex)}
                        variant="destructive"
                        spacing="sm"
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LabeledInput
                      label="Image URL"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.src`,
                      )}
                    />
                    <LabeledInput
                      label="Alt Text"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.alt`,
                      )}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(
                        `content.${blockIndex}.infoCards.${cardIndex}.title`,
                      )}
                    />
                    <Controller
                      control={control}
                      name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
                      render={({ field }) => (
                        <LabeledTextarea
                          label="Description"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <LabeledInput
                        label="Height (px)"
                        type="number"
                        {...register(
                          `content.${blockIndex}.infoCards.${cardIndex}.height`,
                          {
                            valueAsNumber: true,
                          },
                        )}
                      />
                      <LabeledInput
                        label="Width (px)"
                        type="number"
                        {...register(
                          `content.${blockIndex}.infoCards.${cardIndex}.width`,
                          {
                            valueAsNumber: true,
                          },
                        )}
                      />
                    </div>
                    <div className="block text-sm">
                      <div className="text-xs text-gray-400 mb-1.5 tracking-wide">
                        Orientation
                      </div>

                      <Controller
                        control={control}
                        name={`content.${blockIndex}.infoCards.${cardIndex}.orientation`}
                        render={({ field }) => (
                          <SelectDropDown
                            placeholder="Select orientation"
                            classname="w-full"
                            items={[
                              { value: "horizontal", label: "Horizontal" },
                              { value: "vertical", label: "Vertical" },
                            ]}
                            value={field.value}
                            setSelectedItem={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        openMedia((url) =>
                          setValue(
                            `content.${blockIndex}.infoCards.${cardIndex}.src`,
                            url,
                          ),
                        )
                      }
                      variant="outlinePrimary"
                      spacing="sm"
                    >
                      Choose Image
                    </Button>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

interface ImageCardsBlockProps {
  blockIndex: number;
  openMedia: (cb: (url: string) => void) => void;
}

function ImageCardsBlock({ blockIndex, openMedia }: ImageCardsBlockProps) {
  const { register, setValue, control } = useFormContext();

  const {
    fields: imagecardFields,
    append: appendImagecard,
    remove: removeImagecard,
  } = useFieldArray({
    name: `content.${blockIndex}.imageCards` as const,
  });

  return (
    <>
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Image Cards ({imagecardFields.length})
          </h4>
          <Button
            type="button"
            onClick={() =>
              appendImagecard({
                src: "",
                alt: "",
                title: "",
                description: "",
                button: "",
                btnTitle: "",
              })
            }
            variant="secondary"
            spacing="sm"
            size="sm"
          >
            + Add Card
          </Button>
        </div>

        {imagecardFields.length > 0 && (
          <div className="space-y-4">
            {imagecardFields.map((field, cardIndex) => (
              <Card key={field.id}>
                <CardBody>
                  <CardHeader>
                    <CardTitle>Card #{cardIndex + 1}</CardTitle>
                    <CardAction>
                      <Button
                        type="button"
                        onClick={() => removeImagecard(cardIndex)}
                        variant="destructive"
                        spacing="sm"
                      >
                        Remove
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LabeledInput
                      label="Image URL"
                      {...register(
                        `content.${blockIndex}.imageCards.${cardIndex}.src`,
                      )}
                    />
                    <LabeledInput
                      label="Alt Text"
                      {...register(
                        `content.${blockIndex}.imageCards.${cardIndex}.alt`,
                      )}
                    />
                    <LabeledInput
                      label="Title"
                      {...register(
                        `content.${blockIndex}.imageCards.${cardIndex}.title`,
                      )}
                    />
                    <Controller
                      control={control}
                      name={`content.${blockIndex}.imageCards.${cardIndex}.description`}
                      render={({ field }) => (
                        <LabeledTextarea
                          label="Description"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
                    <LabeledInput
                      label="Button Link"
                      {...register(
                        `content.${blockIndex}.imageCards.${cardIndex}.button`,
                      )}
                    />
                    <LabeledInput
                      label="Button Text"
                      {...register(
                        `content.${blockIndex}.imageCards.${cardIndex}.btnTitle`,
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        openMedia((url) =>
                          setValue(
                            `content.${blockIndex}.imageCards.${cardIndex}.src`,
                            url,
                          ),
                        )
                      }
                      variant="outlinePrimary"
                      spacing="sm"
                    >
                      Choose Image
                    </Button>
                  </CardContent>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

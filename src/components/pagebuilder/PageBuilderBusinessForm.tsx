/**
 * ================================
 * v4 - Refactored with Modular Components
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconFileText } from "@tabler/icons-react";
import { Copy, Link2, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { useFetchAllMetaKeywords } from "@/api";
import PreviewRenderer from "@/components/pagebuilder/partials/PreviewRenderer";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { SelectDropDown } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TinyEditorRHF } from "@/components/ui/tiny-text-editor";
import { useSticky } from "@/hooks/useSticky";
import {
  type PageTemplateFormData,
  type PageTemplateWithTimestamps,
  pageTemplateSchema,
} from "@/types/pagebuilder.types";
import {
  formatDateTime,
  getDefaultJsonLdItem,
  transformData,
  uid,
} from "@/utils/pagebuilder.utils";
import { generateSlug } from "@/utils/slug";
import { AutoCompleteInput } from "../AutoCompleteInput";
import { Badge } from "../ui/badge";
import {
  ContactForServiceBlock,
  CorporateServiceOfferingsBlock,
  CorporateServicesAndFeaturesBlock,
  DedicatedServiceSectionBlock,
  ImageCardsBlock,
  LayoutBlock,
  ServiceSectionBlock,
  SortableItem,
} from ".";

export default function PageTemplateEditor({
  initialData,
  onSubmit,
}: {
  initialData?: PageTemplateWithTimestamps;
  onSubmit: (data: PageTemplateFormData) => void;
}) {
  // ... state declarations remain the same ...
  const [activeTab, setActiveTab] = useState<
    "hero" | "content" | "seo" | "jsonld"
  >("hero");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaCb, setMediaCb] = useState<null | ((url: string) => void)>(null);
  const [apiOpen, setApiOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  const keywordSuggestions = [
    "SEO",
    "Search Engine Optimization",
    "Social Media",
    "Social Marketing",
    "Marketing",
    "Market Research",
    "Google",
    "Google Ads",
    "Google Analytics",
    "Content",
    "Content Writing",
    "Content Strategy",
    "Copywriting",
    "Conversion Rate",
    "Campaign Management",
    "Customer Engagement",
    "Email Marketing",
    "Ecommerce",
    "Brand Strategy",
    "Business Growth",
  ];

  const { data: metaKeywordsData } = useFetchAllMetaKeywords({});

  const form = useForm<PageTemplateFormData>({
    resolver: zodResolver(pageTemplateSchema),
    defaultValues: initialData
      ? {
          category: initialData.category ?? "business",
          ...transformData(initialData),
        }
      : {
          category: "business",
          pageName: "",
          slug: "",
          hero: { image: "", alt: "", h1: "", p: "", btn: "" },
          content: [],
          isActive: true,
          seo: undefined,
          jsonLd: [],
        },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = form;

  // Log validation errors
  if (Object.keys(errors).length > 0) {
    console.log("Form validation errors:", errors);
  }
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "content" as const,
    keyName: "_key",
  });

  const {
    fields: jsonLdFields,
    append: appendJsonLd,
    remove: removeJsonLd,
  } = useFieldArray({
    control,
    name: "jsonLd" as const,
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

  const handleSyncSlug = () => {
    const currentTitle = getValues("pageName");
    if (currentTitle) {
      setValue("slug", generateSlug(currentTitle), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    const previousTitle = watched.pageName || "";
    const currentSlug = watched.slug || "";
    const previousAutoSlug = previousTitle ? generateSlug(previousTitle) : "";

    const shouldSyncSlug = !currentSlug || currentSlug === previousAutoSlug;
    if (shouldSyncSlug) {
      setValue("slug", generateSlug(newTitle), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Robustly derive preview content by combining 'fields' (correct order)
  // with 'watched.content' (live values) using the stable 'id'.
  const previewContent = fields.map((field: any) => {
    const liveValue = (watched.content || []).find(
      (c: any) => c.id === field.id,
    );
    return liveValue || field;
  });

  const previewData = {
    ...watched,
    content: previewContent,
    jsonLd: watched.jsonLd ?? form.getValues("jsonLd"),
  };

  const onHandleSubmit = (data: any) => {
    console.log("Form data before processing:", data);
    const formData = data as PageTemplateFormData;
    // Move jsonLd from top level to seo.jsonLd for backend compatibility
    // if (!formData.seo) {
    //   formData.seo = {};
    // }
    // formData.seo.jsonLd = formData.jsonLd || [];
    // delete formData.jsonLd;
    console.log("Form data after processing:", formData);
    onSubmit(formData);
  };

  // Sticky hook for the Block Adder panel
  const { stickyRef, sentinelRef } = useSticky(100, 768, activeTab);
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>{watched.pageName || "Untitled Page"}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {initialData?.updatedAt ? (
                    <span>
                      Last Modified {formatDateTime(initialData.updatedAt)}
                    </span>
                  ) : (
                    <span>Draft Page</span>
                  )}
                </CardDescription>
                <CardAction className="flex items-center gap-3">
                  <Button type="button" onClick={() => setApiOpen(true)}>
                    API
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outlinePrimary"
                  >
                    {showPreview ? "Back to Editor" : "Live Preview"}
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="">
                {/* Tabs */}
                <div className="flex gap-8">
                  {["hero", "content", "seo", "jsonld"].map((tab) => (
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
                        <div className="space-y-6">
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>Page Title & Slug</CardTitle>
                              </CardHeader>
                              <CardContent className="flex gap-4">
                                <Field>
                                  <FieldLabel
                                    htmlFor="pageName"
                                    className="text-base-black gap-0"
                                  >
                                    Title{" "}
                                    <span className="text-base-danger">*</span>
                                  </FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      id="pageName"
                                      type="text"
                                      placeholder="Enter page title"
                                      {...register("pageName", {
                                        onChange: handleTitleChange,
                                      })}
                                      className={
                                        errors.pageName
                                          ? "border-base-danger"
                                          : ""
                                      }
                                    />
                                    <InputGroupAddon>
                                      <IconFileText />
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <FieldDescription>
                                    Enter the Title here.
                                  </FieldDescription>
                                  {errors.pageName && (
                                    <FormMessage>
                                      {errors.pageName.message}
                                    </FormMessage>
                                  )}
                                </Field>

                                <Field>
                                  <FieldLabel
                                    htmlFor="slug"
                                    className="text-base-black gap-0"
                                  >
                                    Slug{" "}
                                    <span className="text-base-danger">*</span>
                                  </FieldLabel>
                                  <InputGroup>
                                    <InputGroupInput
                                      id="slug"
                                      type="text"
                                      placeholder="Enter page slug"
                                      {...register("slug")}
                                      className={
                                        errors.slug ? "border-base-danger" : ""
                                      }
                                    />
                                    <InputGroupAddon>
                                      <Link2 />
                                    </InputGroupAddon>
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        onClick={handleSyncSlug}
                                        size="icon-sm"
                                        tooltip="Regenerate slug from title"
                                        className="hover:bg-transparent"
                                      >
                                        <RefreshCw />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <FieldDescription>
                                    Enter the Slug here.
                                  </FieldDescription>
                                  {errors.slug && (
                                    <FormMessage>
                                      {errors.slug.message}
                                    </FormMessage>
                                  )}
                                </Field>
                              </CardContent>
                            </CardBody>
                          </Card>

                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor="hero.image"
                                    >
                                      Hero Image URL
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name="hero.image"
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id="hero.image"
                                            type="text"
                                            placeholder="https://..."
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor="hero.alt"
                                    >
                                      Alt Text
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name="hero.alt"
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id="hero.alt"
                                            type="text"
                                            placeholder="Image description"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor="hero.h1"
                                    >
                                      Heading (H1)
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name="hero.h1"
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id="hero.h1"
                                            type="text"
                                            placeholder="Hero heading"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor="hero.btn"
                                    >
                                      Button Text
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name="hero.btn"
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id="hero.btn"
                                            type="text"
                                            placeholder="Button label"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                </div>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="hero.p"
                                  >
                                    Description (Paragraph)
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="hero.p"
                                    render={({ field }) => (
                                      <TinyEditorRHF
                                        id="hero.p"
                                        value={(field.value as string) || ""}
                                        onChange={(val) => {
                                          field.onChange(val);
                                        }}
                                      />
                                    )}
                                  />
                                </Field>
                              </CardContent>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* Content Tab */}
                      {activeTab === "content" && (
                        <div className="flex flex-col md:flex-row gap-6 h-full">
                          <div className="w-full [992px]:w-3/4 lg:w-7/12 xl:w-9/12 flex flex-col gap-3">
                            <h3 className="text-xl font-bold leading-[120%] font-montserrat">
                              Content Blocks
                            </h3>
                            {fields.length === 0 ? (
                              <div className="flex-1 text-center border border-dashed border-base-gray rounded p-2 grid place-content-center">
                                <p className="text-base-gray">
                                  No blocks added yet. Use the sidebar to add
                                  your first block.
                                </p>
                              </div>
                            ) : (
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                              >
                                <div className="space-y-4">
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
                                              <DedicatedServiceSectionBlock
                                                blockIndex={index}
                                                openMedia={openMedia}
                                              />
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
                                              <ContactForServiceBlock
                                                blockIndex={index}
                                              />
                                            )}
                                          </LayoutBlock>
                                        </SortableItem>
                                      );
                                    })}
                                  </SortableContext>
                                </div>
                              </DndContext>
                            )}
                          </div>

                          {/* Block Selector Sidebar */}
                          <div className="w-full [992px]:w-1/4 lg:w-5/12 xl:w-3/12">
                            <div ref={sentinelRef} className="h-px"></div>
                            <Card ref={stickyRef}>
                              <CardBody>
                                <CardHeader>
                                  <CardTitle>Add Blocks</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "serviceSection",
                                        service: "",
                                        subService: "",
                                        infoCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Service Section
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "dedicatedServiceSection",
                                        img: "",
                                        textRich: "",
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Dedicated Service
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "corporateServiceOfferings",
                                        serviceCards: undefined,
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Corporate Offerings
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "corporateServicesAndFeatures",
                                        infoCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Features
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "whoWeSupport",
                                        imageCards: [],
                                      })
                                    }
                                    className="justify-start"
                                  >
                                    + Who We Support
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      append({
                                        id: uid(),
                                        type: "contactForService",
                                      })
                                    }
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

                      {/* SEO Tab */}
                      {activeTab === "seo" && (
                        <div className="space-y-6">
                          <Card>
                            <CardBody>
                              <CardHeader>
                                <CardTitle>Basic SEO</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.title"
                                  >
                                    Meta Title
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.title"
                                    render={({ field }) => (
                                      <InputGroup>
                                        <InputGroupInput
                                          id="seo.title"
                                          type="text"
                                          placeholder="Enter meta title"
                                          {...field}
                                        />
                                      </InputGroup>
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.description"
                                  >
                                    Meta Description
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.description"
                                    render={({ field }) => (
                                      <Textarea
                                        id="seo.description"
                                        rows={3}
                                        placeholder="Enter meta description"
                                        value={field.value || ""}
                                        onChange={(e) =>
                                          field.onChange(e.target.value)
                                        }
                                        onBlur={field.onBlur}
                                      />
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="keyword-input"
                                  >
                                    Meta Keywords
                                  </FieldLabel>

                                  <Controller
                                    control={form.control}
                                    name="seo.keywords"
                                    render={({ field }) => {
                                      const keywords = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : typeof field.value === "string"
                                          ? field.value
                                              .split(",")
                                              .map((k) => k.trim())
                                              .filter(Boolean)
                                          : [];

                                      const addKeyword = (kw: string) => {
                                        if (!kw.trim() || keywords.includes(kw))
                                          return;
                                        field.onChange([...keywords, kw]);
                                      };

                                      const removeKeyword = (index: number) => {
                                        field.onChange(
                                          keywords.filter(
                                            (_, i) => i !== index,
                                          ),
                                        );
                                      };

                                      return (
                                        <>
                                          <AutoCompleteInput
                                            value={keywordInput}
                                            setValue={setKeywordInput}
                                            list={
                                              metaKeywordsData?.metaKeywords?.map(
                                                (k: { keyword: string }) =>
                                                  k.keyword,
                                              ) || keywordSuggestions
                                            }
                                            onAdd={(kw) => {
                                              addKeyword(kw);
                                              setKeywordInput("");
                                            }}
                                            placeholder="Add keyword"
                                            inputId="keyword-input"
                                          />
                                          <FieldDescription>
                                            Add SEO keywords here (type to
                                            search, press Enter, or click +).
                                          </FieldDescription>

                                          {/* Keywords List */}
                                          {keywords.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                              {keywords.map(
                                                (
                                                  keyword: string,
                                                  index: number,
                                                ) => (
                                                  <Badge
                                                    key={index}
                                                    className="capitalize"
                                                  >
                                                    <span>{keyword}</span>
                                                    <span
                                                      className="cursor-pointer"
                                                      onClick={() =>
                                                        removeKeyword(index)
                                                      }
                                                    >
                                                      <X className="size-4" />
                                                    </span>
                                                  </Badge>
                                                ),
                                              )}
                                            </div>
                                          )}
                                        </>
                                      );
                                    }}
                                  />
                                </Field>
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
                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.openGraph.title"
                                  >
                                    OG Title
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.openGraph.title"
                                    render={({ field }) => (
                                      <InputGroup>
                                        <InputGroupInput
                                          id="seo.openGraph.title"
                                          type="text"
                                          placeholder="Defaults to Meta Title if empty"
                                          {...field}
                                        />
                                      </InputGroup>
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.openGraph.description"
                                  >
                                    OG Description
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.openGraph.description"
                                    render={({ field }) => (
                                      <Textarea
                                        id="seo.openGraph.description"
                                        rows={3}
                                        placeholder="Defaults to Meta Description if empty"
                                        value={field.value || ""}
                                        onChange={(e) =>
                                          field.onChange(e.target.value)
                                        }
                                        onBlur={field.onBlur}
                                      />
                                    )}
                                  />
                                </Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor="seo.openGraph.url"
                                    >
                                      OG URL
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name="seo.openGraph.url"
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id="seo.openGraph.url"
                                            type="text"
                                            placeholder="https://yourdomain.com/page"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>

                                  <Field>
                                    <FieldLabel
                                      className="text-base-black gap-0"
                                      htmlFor="seo.openGraph.siteName"
                                    >
                                      Site Name
                                    </FieldLabel>
                                    <Controller
                                      control={control}
                                      name="seo.openGraph.siteName"
                                      render={({ field }) => (
                                        <InputGroup>
                                          <InputGroupInput
                                            id="seo.openGraph.siteName"
                                            type="text"
                                            placeholder="Your Site Name"
                                            {...field}
                                          />
                                        </InputGroup>
                                      )}
                                    />
                                  </Field>
                                </div>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.openGraph.type"
                                  >
                                    OG Type
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.openGraph.type"
                                    render={({ field }) => (
                                      <SelectDropDown
                                        id="seo.openGraph.type"
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
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.openGraph.images"
                                  >
                                    OG Images (URLs, one per line)
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.openGraph.images"
                                    render={({ field }) => (
                                      <div className="space-y-2">
                                        <Textarea
                                          id="seo.openGraph.images"
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
                                          placeholder="https://..."
                                        />
                                        <FieldDescription>
                                          Recommended size: 1200×630 pixels
                                        </FieldDescription>
                                      </div>
                                    )}
                                  />
                                </Field>
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
                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.twitter.card"
                                  >
                                    Card Type
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.twitter.card"
                                    render={({ field }) => (
                                      <SelectDropDown
                                        id="seo.twitter.card"
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
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.twitter.title"
                                  >
                                    Twitter Title
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.twitter.title"
                                    render={({ field }) => (
                                      <InputGroup>
                                        <InputGroupInput
                                          id="seo.twitter.title"
                                          type="text"
                                          placeholder="Defaults to OG Title if empty"
                                          {...field}
                                        />
                                      </InputGroup>
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.twitter.description"
                                  >
                                    Twitter Description
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.twitter.description"
                                    render={({ field }) => (
                                      <Textarea
                                        id="seo.twitter.description"
                                        rows={3}
                                        placeholder="Defaults to OG Description if empty"
                                        value={field.value || ""}
                                        onChange={(e) =>
                                          field.onChange(e.target.value)
                                        }
                                        onBlur={field.onBlur}
                                      />
                                    )}
                                  />
                                </Field>

                                <Field>
                                  <FieldLabel
                                    className="text-base-black gap-0"
                                    htmlFor="seo.twitter.images"
                                  >
                                    Twitter Images (URLs, one per line)
                                  </FieldLabel>
                                  <Controller
                                    control={control}
                                    name="seo.twitter.images"
                                    render={({ field }) => (
                                      <div className="space-y-2">
                                        <Textarea
                                          id="seo.twitter.images"
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
                                          placeholder="https://..."
                                        />
                                        <FieldDescription>
                                          Recommended size: 1200×628 pixels
                                        </FieldDescription>
                                      </div>
                                    )}
                                  />
                                </Field>
                              </CardContent>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {/* JSON-LD Tab */}
                      {activeTab === "jsonld" && (
                        <div className="flex flex-col md:flex-row gap-6 h-full">
                          <div className="w-full [992px]:w-3/4 lg:w-7/12 xl:w-8/12 flex flex-col gap-3">
                            <h3 className="text-xl font-bold leading-[120%] font-montserrat">
                              Structured Data (JSON-LD)
                            </h3>

                            {jsonLdFields.length === 0 ? (
                              <div className="flex-1 text-center border border-dashed border-base-gray rounded p-2 grid place-content-center">
                                <p className="text-base-gray">
                                  No structured data items added yet.
                                </p>
                                <p className="text-sm text-base-gray mt-1">
                                  Add a block using the buttons on the right
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {jsonLdFields.map(
                                  (field: any, index: number) => {
                                    const type = field.type;
                                    return (
                                      <Card key={field.id}>
                                        <CardBody>
                                          <CardHeader>
                                            <CardTitle>{type}</CardTitle>
                                            <CardAction>
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                spacing="sm"
                                                onClick={() =>
                                                  removeJsonLd(index)
                                                }
                                              >
                                                Remove
                                              </Button>
                                            </CardAction>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            {/* Type Specific Fields */}
                                            {type === "FAQPage" && (
                                              <div className="space-y-4">
                                                <div className="flex items-center space-x-2 border p-3 rounded bg-base-primary/10">
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.renderHtml`}
                                                    render={({ field }) => (
                                                      <Checkbox
                                                        id={`renderHtml-${index}`}
                                                        checked={
                                                          field.value as boolean
                                                        }
                                                        onCheckedChange={
                                                          field.onChange
                                                        }
                                                      />
                                                    )}
                                                  />
                                                  <label
                                                    htmlFor={`renderHtml-${index}`}
                                                    className="text-sm font-medium leading-none cursor-pointer"
                                                  >
                                                    Render as visible FAQ
                                                    section on page
                                                  </label>
                                                </div>

                                                <Label>
                                                  Questions & Answers
                                                </Label>
                                                <Controller
                                                  control={control}
                                                  name={`jsonLd.${index}.data.mainEntity`}
                                                  render={({ field }) => {
                                                    const faqs = (field.value ||
                                                      []) as any[];
                                                    return (
                                                      <div className="space-y-4">
                                                        {faqs.map(
                                                          (faq, faqIndex) => (
                                                            <div
                                                              key={faqIndex}
                                                              className="grid grid-cols-1 gap-4 p-4 border rounded relative"
                                                            >
                                                              <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute top-2 right-2 h-6 w-6"
                                                                onClick={() => {
                                                                  const newFaqs =
                                                                    [...faqs];
                                                                  newFaqs.splice(
                                                                    faqIndex,
                                                                    1,
                                                                  );
                                                                  field.onChange(
                                                                    newFaqs,
                                                                  );
                                                                }}
                                                              >
                                                                ✕
                                                              </Button>
                                                              <Field>
                                                                <FieldLabel
                                                                  className="text-base-black gap-0"
                                                                  htmlFor={`jsonLd.${index}.data.mainEntity.${faqIndex}.name`}
                                                                >
                                                                  Question
                                                                </FieldLabel>
                                                                <InputGroup>
                                                                  <InputGroupInput
                                                                    id={`jsonLd.${index}.data.mainEntity.${faqIndex}.name`}
                                                                    type="text"
                                                                    value={
                                                                      faq.name
                                                                    }
                                                                    onChange={(
                                                                      e: React.ChangeEvent<HTMLInputElement>,
                                                                    ) => {
                                                                      const newFaqs =
                                                                        [
                                                                          ...faqs,
                                                                        ];
                                                                      newFaqs[
                                                                        faqIndex
                                                                      ] = {
                                                                        ...newFaqs[
                                                                          faqIndex
                                                                        ],
                                                                        name: e
                                                                          .target
                                                                          .value,
                                                                      };
                                                                      field.onChange(
                                                                        newFaqs,
                                                                      );
                                                                    }}
                                                                  />
                                                                </InputGroup>
                                                              </Field>
                                                              <Field>
                                                                <FieldLabel
                                                                  className="text-base-black gap-0"
                                                                  htmlFor={`jsonLd.${index}.data.mainEntity.${faqIndex}.acceptedAnswer.text`}
                                                                >
                                                                  Answer
                                                                </FieldLabel>
                                                                <Textarea
                                                                  id={`jsonLd.${index}.data.mainEntity.${faqIndex}.acceptedAnswer.text`}
                                                                  rows={3}
                                                                  value={
                                                                    faq
                                                                      .acceptedAnswer
                                                                      .text
                                                                  }
                                                                  onChange={(
                                                                    e,
                                                                  ) => {
                                                                    const newFaqs =
                                                                      [...faqs];
                                                                    newFaqs[
                                                                      faqIndex
                                                                    ] = {
                                                                      ...newFaqs[
                                                                        faqIndex
                                                                      ],
                                                                      acceptedAnswer:
                                                                        {
                                                                          ...newFaqs[
                                                                            faqIndex
                                                                          ]
                                                                            .acceptedAnswer,
                                                                          text: e
                                                                            .target
                                                                            .value,
                                                                        },
                                                                    };
                                                                    field.onChange(
                                                                      newFaqs,
                                                                    );
                                                                  }}
                                                                />
                                                              </Field>
                                                            </div>
                                                          ),
                                                        )}
                                                        <Button
                                                          type="button"
                                                          variant="outline"
                                                          onClick={() =>
                                                            field.onChange([
                                                              ...faqs,
                                                              {
                                                                "@type":
                                                                  "Question",
                                                                name: "",
                                                                acceptedAnswer:
                                                                  {
                                                                    "@type":
                                                                      "Answer",
                                                                    text: "",
                                                                  },
                                                              },
                                                            ])
                                                          }
                                                        >
                                                          + Add Question
                                                        </Button>
                                                      </div>
                                                    );
                                                  }}
                                                />
                                              </div>
                                            )}

                                            {(type === "Organization" ||
                                              type === "LocalBusiness") && (
                                              <div className="space-y-4">
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.name`}
                                                  >
                                                    Name
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.name`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.name`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.url`}
                                                  >
                                                    URL
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.url`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.url`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.logo`}
                                                  >
                                                    Logo URL
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.logo`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.logo`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.description`}
                                                  >
                                                    Description
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.description`}
                                                    render={({ field }) => (
                                                      <Textarea
                                                        id={`jsonLd.${index}.data.description`}
                                                        rows={3}
                                                        value={field.value}
                                                        onChange={(e) =>
                                                          field.onChange(
                                                            e.target.value,
                                                          )
                                                        }
                                                      />
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.telephone`}
                                                  >
                                                    Telephone
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.telephone`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.telephone`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>

                                                {/* Address (Only for LocalBusiness) */}
                                                {type === "LocalBusiness" && (
                                                  <div className="border p-4 rounded space-y-3">
                                                    <p className="font-semibold text-sm">
                                                      Address
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                      <Field>
                                                        <FieldLabel
                                                          className="text-base-black gap-0"
                                                          htmlFor={`jsonLd.${index}.data.address.streetAddress`}
                                                        >
                                                          Street
                                                        </FieldLabel>
                                                        <Controller
                                                          control={control}
                                                          name={`jsonLd.${index}.data.address.streetAddress`}
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <InputGroup>
                                                              <InputGroupInput
                                                                id={`jsonLd.${index}.data.address.streetAddress`}
                                                                type="text"
                                                                {...field}
                                                                value={String(
                                                                  field.value ??
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  field.onChange(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                              />
                                                            </InputGroup>
                                                          )}
                                                        />
                                                      </Field>
                                                      <Field>
                                                        <FieldLabel
                                                          className="text-base-black gap-0"
                                                          htmlFor={`jsonLd.${index}.data.address.addressLocality`}
                                                        >
                                                          City
                                                        </FieldLabel>
                                                        <Controller
                                                          control={control}
                                                          name={`jsonLd.${index}.data.address.addressLocality`}
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <InputGroup>
                                                              <InputGroupInput
                                                                id={`jsonLd.${index}.data.address.addressLocality`}
                                                                type="text"
                                                                {...field}
                                                                value={String(
                                                                  field.value ??
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  field.onChange(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                              />
                                                            </InputGroup>
                                                          )}
                                                        />
                                                      </Field>
                                                      <Field>
                                                        <FieldLabel
                                                          className="text-base-black gap-0"
                                                          htmlFor={`jsonLd.${index}.data.address.addressRegion`}
                                                        >
                                                          Region/State
                                                        </FieldLabel>
                                                        <Controller
                                                          control={control}
                                                          name={`jsonLd.${index}.data.address.addressRegion`}
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <InputGroup>
                                                              <InputGroupInput
                                                                id={`jsonLd.${index}.data.address.addressRegion`}
                                                                type="text"
                                                                {...field}
                                                                value={String(
                                                                  field.value ??
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  field.onChange(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                              />
                                                            </InputGroup>
                                                          )}
                                                        />
                                                      </Field>
                                                      <Field>
                                                        <FieldLabel
                                                          className="text-base-black gap-0"
                                                          htmlFor={`jsonLd.${index}.data.address.postalCode`}
                                                        >
                                                          Zip Code
                                                        </FieldLabel>
                                                        <Controller
                                                          control={control}
                                                          name={`jsonLd.${index}.data.address.postalCode`}
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <InputGroup>
                                                              <InputGroupInput
                                                                id={`jsonLd.${index}.data.address.postalCode`}
                                                                type="text"
                                                                {...field}
                                                                value={String(
                                                                  field.value ??
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  field.onChange(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                              />
                                                            </InputGroup>
                                                          )}
                                                        />
                                                      </Field>
                                                      <Field className="col-span-full">
                                                        <FieldLabel
                                                          className="text-base-black gap-0"
                                                          htmlFor={`jsonLd.${index}.data.address.addressCountry`}
                                                        >
                                                          Country
                                                        </FieldLabel>
                                                        <Controller
                                                          control={control}
                                                          name={`jsonLd.${index}.data.address.addressCountry`}
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <InputGroup>
                                                              <InputGroupInput
                                                                id={`jsonLd.${index}.data.address.addressCountry`}
                                                                type="text"
                                                                {...field}
                                                                value={String(
                                                                  field.value ??
                                                                    "",
                                                                )}
                                                                onChange={(e) =>
                                                                  field.onChange(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                              />
                                                            </InputGroup>
                                                          )}
                                                        />
                                                      </Field>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {(type === "Article" ||
                                              type === "BlogPosting") && (
                                              <div className="space-y-4">
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.headline`}
                                                  >
                                                    Headline
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.headline`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.headline`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.image`}
                                                  >
                                                    Image URL
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.image`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.image`}
                                                          type="text"
                                                          value={String(
                                                            (Array.isArray(
                                                              field.value,
                                                            )
                                                              ? field.value[0]
                                                              : field.value) ??
                                                              "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.author.name`}
                                                  >
                                                    Author Name
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.author.name`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.author.name`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                                <Field>
                                                  <FieldLabel
                                                    className="text-base-black gap-0"
                                                    htmlFor={`jsonLd.${index}.data.publisher.name`}
                                                  >
                                                    Publisher Name
                                                  </FieldLabel>
                                                  <Controller
                                                    control={control}
                                                    name={`jsonLd.${index}.data.publisher.name`}
                                                    render={({ field }) => (
                                                      <InputGroup>
                                                        <InputGroupInput
                                                          id={`jsonLd.${index}.data.publisher.name`}
                                                          type="text"
                                                          {...field}
                                                          value={String(
                                                            field.value ?? "",
                                                          )}
                                                          onChange={(e) =>
                                                            field.onChange(
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </InputGroup>
                                                    )}
                                                  />
                                                </Field>
                                              </div>
                                            )}
                                          </CardContent>
                                        </CardBody>
                                      </Card>
                                    );
                                  },
                                )}
                              </div>
                            )}
                          </div>
                          {/* Right Column */}
                          <div className="w-full [992px]:w-1/4 lg:w-5/12 xl:w-4/12">
                            <div ref={sentinelRef} className="h-px"></div>
                            <Card ref={stickyRef}>
                              <CardBody>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    Add New Item
                                  </CardTitle>
                                  <CardDescription>
                                    Click a button to add content
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const newItem =
                                        getDefaultJsonLdItem("Organization");
                                      if (newItem) appendJsonLd(newItem as any);
                                    }}
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Organization
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const newItem =
                                        getDefaultJsonLdItem("LocalBusiness");
                                      if (newItem) appendJsonLd(newItem as any);
                                    }}
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Local Business
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const newItem =
                                        getDefaultJsonLdItem("FAQPage");
                                      if (newItem) appendJsonLd(newItem as any);
                                    }}
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + FAQ Page
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const newItem =
                                        getDefaultJsonLdItem("BreadcrumbList");
                                      if (newItem) appendJsonLd(newItem as any);
                                    }}
                                    variant="outlinePrimary"
                                    spacing="sm"
                                    className="justify-start"
                                  >
                                    + Breadcrumb List
                                  </Button>
                                </CardContent>
                              </CardBody>
                            </Card>
                          </div>
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
                      <Button type="submit">Submit</Button>
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
                            <Badge>Preview Mode</Badge>
                            <Button
                              onClick={() => setShowPreview(false)}
                              variant="outlinePrimary"
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
                <CardHeader>
                  <CardTitle>Media Library</CardTitle>
                  <CardAction>
                    <Button
                      onClick={() => setMediaOpen(false)}
                      variant="outline"
                      spacing="sm"
                    >
                      Close
                    </Button>
                  </CardAction>
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
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setApiOpen(false)}
            >
              <Card
                className="w-full sm:max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <CardBody className="p-2">
                  <CardHeader>
                    <CardTitle>API Output</CardTitle>
                    <CardAction className="flex gap-2">
                      <Button
                        type="button"
                        variant="outlineNavBtnPrimary"
                        size="lg"
                        spacing="sm"
                        className="w-8"
                        tooltip="Copy Json"
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
                      >
                        <Copy />
                      </Button>
                      <Button
                        type="button"
                        variant="outlineNavBtnDestructive"
                        size="lg"
                        spacing="sm"
                        className="w-8"
                        tooltip="Close"
                        onClick={() => setApiOpen(false)}
                      >
                        <X />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded border border-base-gray bg-muted/40 overflow-hidden">
                      <pre className="text-xs p-3 max-h-[55vh] overflow-auto">
                        {JSON.stringify(getValues(), null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

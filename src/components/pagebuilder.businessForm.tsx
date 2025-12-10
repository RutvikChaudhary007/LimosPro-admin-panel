// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { ChevronDown, MoreVertical, GripVertical, Trash2 } from "lucide-react";

// const heroSchema = z.object({
//   image: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   h1: z.string().optional(),
//   p: z.string().optional(),
//   btn: z.string().optional(),
// });

// const serviceSectionSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("serviceSection"),
//   service: z.string().optional(),
//   subservice: z.string().optional(),
//   infocard: z.object({
//     src: z.string().url().or(z.literal("")).optional(),
//     alt: z.string().optional(),
//     title: z.string().optional(),
//     description: z.string().optional(),
//   }).optional(),
// });

// const dedicatedServiceSectionSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("dedicatedServiceSection"),
//   img: z.string().url().or(z.literal("")).optional(),
//   textRich: z.string().optional(),
// });

// const corporateServiceOfferingsSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("corporateServiceOfferings"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const corporateServicesAndFeaturesSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("corporateServicesAndFeatures"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   height: z.number().optional(),
//   width: z.number().optional(),
//   orientation: z.enum(["vertical", "horizontal"]).optional(),
// });

// const whoWeSupportSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("whoWeSupport"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const ourGlobalReachSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("ourGlobalReach"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const contactForServiceSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("contactForService"),
//   textRich: z.string().optional(),
//   btn: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const contentBlockSchema = z.union([
//   serviceSectionSchema,
//   dedicatedServiceSectionSchema,
//   corporateServiceOfferingsSchema,
//   corporateServicesAndFeaturesSchema,
//   whoWeSupportSchema,
//   ourGlobalReachSchema,
//   contactForServiceSchema,
// ]);

// const seoSchema = z.object({
//   title: z.string().optional(),
//   description: z.string().optional(),
//   keywords: z.array(z.string()).optional(),
// });

// const pageTemplateSchema = z.object({
//   pageName: z.string().optional(),
//   slug: z.string().optional(),
//   hero: heroSchema.optional(),
//   content: z.array(contentBlockSchema).optional(),
//   seo: seoSchema.optional(),
// });

// export type PageTemplateFormData = z.infer<typeof pageTemplateSchema>;

// const uid = () => Math.random().toString(36).slice(2, 9);

// function Input({ label, ...props }: any) {
//   return (
//     <label className="block text-sm mb-3">
//       <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">{label}</div>
//       <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" {...props} />
//     </label>
//   );
// }

// function TextArea({ label, ...props }: any) {
//   return (
//     <label className="block text-sm mb-3">
//       <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">{label}</div>
//       <textarea className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none" rows={4} {...props} />
//     </label>
//   );
// }

// function LayoutBlock({ block, index, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, children }: any) {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <div className="bg-gray-800 border border-gray-700 rounded mb-3 overflow-hidden">
//       <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 hover:bg-gray-850 group">
//         <div className="flex items-center gap-2">
//           <GripVertical size={16} className="text-gray-500 group-hover:text-gray-300" />
//           <span className="text-xs text-gray-400 font-mono">#{String(index + 1).padStart(2, "0")}</span>
//           <span className="text-sm text-gray-300 font-medium capitalize">{block.type.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <button onClick={onMoveUp} disabled={!canMoveUp} className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 text-xs" title="Move up">↑</button>
//           <button onClick={onMoveDown} disabled={!canMoveDown} className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 text-xs" title="Move down">↓</button>
//           <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-gray-700 rounded">
//             <ChevronDown size={16} className={`text-gray-400 transition ${expanded ? "" : "-rotate-90"}`} />
//           </button>
//           <button onClick={onRemove} className="p-1 hover:bg-red-900 rounded">
//             <Trash2 size={16} className="text-gray-400" />
//           </button>
//         </div>
//       </div>

//       {expanded && (
//         <div className="p-4 space-y-3">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function PageListPage({ initialData }: { initialData?: PageTemplateFormData }) {
//   const [activeTab, setActiveTab] = useState<"hero" | "content" | "seo">("hero");
//   const [mediaOpen, setMediaOpen] = useState(false);
//   const [mediaCb, setMediaCb] = useState<null | ((url: string) => void)>(null);

//   const form = useForm<PageTemplateFormData>({
//     resolver: zodResolver(pageTemplateSchema),
//     defaultValues: initialData || {
//       pageName: "",
//       slug: "",
//       hero: { image: "", alt: "", h1: "", p: "", btn: "" },
//       content: [],
//       seo: { title: "", description: "", keywords: [] },
//     },
//   });

//   const { control, register, handleSubmit, watch, setValue, getValues, reset } = form;
//   const { fields, append, remove, move } = useFieldArray({ control, name: "content" as const });

//   useEffect(() => {
//     const c = getValues().content || [];
//     const next = c.map((b: any) => ({ id: b.id || uid(), ...b }));
//     setValue("content", next as any);
//   }, []);

//   const openMedia = (cb: (url: string) => void) => {
//     setMediaCb(() => cb);
//     setMediaOpen(true);
//   };

//   const handleMediaSelect = (url: string) => {
//     if (mediaCb) mediaCb(url);
//     setMediaOpen(false);
//     setMediaCb(null);
//   };

//   const watched = watch();

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <div className="bg-black border-b border-gray-800 px-6 py-4">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-bold">{watched.pageName || "Untitled"}</h1>
//             <div className="text-xs text-gray-400 mt-2 space-y-1">
//               <div>Status: <span className="text-yellow-400">Changed</span> · <button className="text-blue-400 hover:text-blue-300">Revert to published</button></div>
//               <div>Last Modified: January 16th 2025, 3:24 PM</div>
//               <div>Created: January 16th 2025, 3:06 PM</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">Edit</button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">Live Preview</button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">Versions <span className="ml-1 text-gray-400">2</span></button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">API</button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-gray-900 border-b border-gray-800 px-6">
//         <div className="flex gap-8">
//           {["hero", "content", "seo"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab as any)}
//               className={`py-3 px-1 text-sm font-medium capitalize border-b-2 transition ${
//                 activeTab === tab ? "border-blue-500 text-white" : "border-transparent text-gray-400 hover:text-gray-300"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Editor Panel */}
//         <div className="flex-1 border-r border-gray-800 p-6 overflow-y-auto">
//           <div className="max-w-2xl space-y-6">
//             {/* Hero Tab */}
//             {activeTab === "hero" && (
//               <>
//                 <div>
//                   <Input label="Title" {...register("pageName")} />
//                   <Input label="Slug" {...register("slug")} />
//                 </div>

//                 <div className="border-t border-gray-700 pt-6">
//                   <h3 className="text-lg font-semibold mb-4">Hero</h3>
//                   <Controller control={control} name="hero.image" render={({ field }) => <Input label="Hero Image URL" {...field} />} />
//                   <Controller control={control} name="hero.alt" render={({ field }) => <Input label="Alt Text" {...field} />} />
//                   <Controller control={control} name="hero.h1" render={({ field }) => <Input label="Heading (H1)" {...field} />} />
//                   <Controller control={control} name="hero.p" render={({ field }) => <TextArea label="Description" {...field} />} />
//                   <Controller control={control} name="hero.btn" render={({ field }) => <Input label="Button Text" {...field} />} />
//                   <button type="button" onClick={() => openMedia((url) => setValue("hero.image", url))} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700">
//                     Choose Media
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Content Tab */}
//             {activeTab === "content" && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">Layout</h3>
//                   <div className="flex gap-2 flex-wrap">
//                     <button type="button" onClick={() => append({ id: uid(), type: "serviceSection", service: "", subservice: "", infocard: { src: "", alt: "", title: "", description: "" } })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Service
//                     </button>
//                     <button type="button" onClick={() => append({ id: uid(), type: "dedicatedServiceSection", img: "", textRich: "" })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Dedicated
//                     </button>
//                     <button type="button" onClick={() => append({ id: uid(), type: "corporateServiceOfferings", src: "", alt: "", title: "", description: "", button: "", btnTitle: "" })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Corp Offerings
//                     </button>
//                     <button type="button" onClick={() => append({ id: uid(), type: "corporateServicesAndFeatures", src: "", alt: "", title: "", description: "", height: 200, width: 300, orientation: "vertical" })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Features
//                     </button>
//                     <button type="button" onClick={() => append({ id: uid(), type: "whoWeSupport", src: "", alt: "", title: "", description: "", button: "", btnTitle: "" })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Who We Support
//                     </button>
//                     <button type="button" onClick={() => append({ id: uid(), type: "ourGlobalReach", src: "", alt: "", title: "", description: "", button: "", btnTitle: "" })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Global Reach
//                     </button>
//                     <button type="button" onClick={() => append({ id: uid(), type: "contactForService", textRich: "", btn: "", btnTitle: "" })} className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700">
//                       + Contact CTA
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   {fields.map((f, idx) => {
//                     const type = (watched.content && watched.content[idx] && (watched.content[idx] as any).type) || f.type || "serviceSection";
//                     return (
//                       <LayoutBlock
//                         key={f.id}
//                         block={{ type }}
//                         index={idx}
//                         onRemove={() => remove(idx)}
//                         onMoveUp={() => move(idx, idx - 1)}
//                         onMoveDown={() => move(idx, idx + 1)}
//                         canMoveUp={idx > 0}
//                         canMoveDown={idx < fields.length - 1}
//                       >
//                         {type === "serviceSection" && (
//                           <>
//                             <Input label="Service" {...register(`content.${idx}.service`)} />
//                             <Input label="Subservice" {...register(`content.${idx}.subservice`)} />
//                             <div className="border-t border-gray-700 pt-3 mt-3">
//                               <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">InfoCard</h4>
//                               <Input label="Image URL" {...register(`content.${idx}.infocard.src`)} />
//                               <Input label="Alt Text" {...register(`content.${idx}.infocard.alt`)} />
//                               <Input label="Title" {...register(`content.${idx}.infocard.title`)} />
//                               <TextArea label="Description" {...register(`content.${idx}.infocard.description`)} />
//                               <button type="button" onClick={() => openMedia((url) => setValue(`content.${idx}.infocard.src`, url))} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600">
//                                 Choose Image
//                               </button>
//                             </div>
//                           </>
//                         )}
//                         {type === "dedicatedServiceSection" && (
//                           <>
//                             <Input label="Image URL" {...register(`content.${idx}.img`)} />
//                             <TextArea label="Rich Text (HTML)" {...register(`content.${idx}.textRich`)} />
//                             <button type="button" onClick={() => openMedia((url) => setValue(`content.${idx}.img`, url))} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600">
//                               Choose Image
//                             </button>
//                           </>
//                         )}
//                         {type === "corporateServiceOfferings" && (
//                           <>
//                             <Input label="Image URL" {...register(`content.${idx}.src`)} />
//                             <Input label="Alt Text" {...register(`content.${idx}.alt`)} />
//                             <Input label="Title" {...register(`content.${idx}.title`)} />
//                             <TextArea label="Description" {...register(`content.${idx}.description`)} />
//                             <Input label="Button Link" {...register(`content.${idx}.button`)} />
//                             <Input label="Button Text" {...register(`content.${idx}.btnTitle`)} />
//                             <button type="button" onClick={() => openMedia((url) => setValue(`content.${idx}.src`, url))} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600">
//                               Choose Image
//                             </button>
//                           </>
//                         )}
//                         {type === "corporateServicesAndFeatures" && (
//                           <>
//                             <Input label="Image URL" {...register(`content.${idx}.src`)} />
//                             <Input label="Alt Text" {...register(`content.${idx}.alt`)} />
//                             <Input label="Title" {...register(`content.${idx}.title`)} />
//                             <TextArea label="Description" {...register(`content.${idx}.description`)} />
//                             <div className="grid grid-cols-2 gap-3">
//                               <Input label="Height (px)" type="number" {...register(`content.${idx}.height`, { valueAsNumber: true })} />
//                               <Input label="Width (px)" type="number" {...register(`content.${idx}.width`, { valueAsNumber: true })} />
//                             </div>
//                             <label className="block text-sm mb-3">
//                               <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Orientation</div>
//                               <select {...register(`content.${idx}.orientation`)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
//                                 <option value="">Select orientation</option>
//                                 <option value="vertical">Vertical</option>
//                                 <option value="horizontal">Horizontal</option>
//                               </select>
//                             </label>
//                             <button type="button" onClick={() => openMedia((url) => setValue(`content.${idx}.src`, url))} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600">
//                               Choose Image
//                             </button>
//                           </>
//                         )}
//                         {type === "whoWeSupport" && (
//                           <>
//                             <Input label="Image URL" {...register(`content.${idx}.src`)} />
//                             <Input label="Alt Text" {...register(`content.${idx}.alt`)} />
//                             <Input label="Title" {...register(`content.${idx}.title`)} />
//                             <TextArea label="Description" {...register(`content.${idx}.description`)} />
//                             <Input label="Button Link" {...register(`content.${idx}.button`)} />
//                             <Input label="Button Text" {...register(`content.${idx}.btnTitle`)} />
//                             <button type="button" onClick={() => openMedia((url) => setValue(`content.${idx}.src`, url))} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600">
//                               Choose Image
//                             </button>
//                           </>
//                         )}
//                         {type === "ourGlobalReach" && (
//                           <>
//                             <Input label="Image URL" {...register(`content.${idx}.src`)} />
//                             <Input label="Alt Text" {...register(`content.${idx}.alt`)} />
//                             <Input label="Title" {...register(`content.${idx}.title`)} />
//                             <TextArea label="Description" {...register(`content.${idx}.description`)} />
//                             <Input label="Button Link" {...register(`content.${idx}.button`)} />
//                             <Input label="Button Text" {...register(`content.${idx}.btnTitle`)} />
//                             <button type="button" onClick={() => openMedia((url) => setValue(`content.${idx}.src`, url))} className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600">
//                               Choose Image
//                             </button>
//                           </>
//                         )}
//                         {type === "contactForService" && (
//                           <>
//                             <TextArea label="Rich Text (HTML)" {...register(`content.${idx}.textRich`)} />
//                             <Input label="Button Link" {...register(`content.${idx}.btn`)} />
//                             <Input label="Button Text" {...register(`content.${idx}.btnTitle`)} />
//                           </>
//                         )}
//                       </LayoutBlock>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* SEO Tab */}
//             {activeTab === "seo" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">Search Engine Optimization</h3>
//                 <Controller control={control} name="seo.title" render={({ field }) => <Input label="Meta Title" {...field} />} />
//                 <Controller control={control} name="seo.description" render={({ field }) => <TextArea label="Meta Description" {...field} />} />
//                 <Controller control={control} name="seo.keywords" render={({ field }) => <Input label="Keywords (comma separated)" value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""} onChange={(e) => field.onChange(e.target.value)} />} />
//               </div>
//             )}

//             <div className="flex gap-2 pt-4 border-t border-gray-700">
//               <button onClick={() => console.log(getValues())} className="px-4 py-2 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700">
//                 Save
//               </button>
//               <button onClick={() => reset()} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700">
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Live Preview Panel */}
//         <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
//           <h3 className="text-lg font-semibold mb-6">Live Preview</h3>

//           <div className="space-y-6">
//             {/* Page Info */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Page</div>
//               <div className="text-sm text-gray-300 font-medium">{watched.pageName || "Untitled Page"}</div>
//               <div className="text-xs text-gray-500 mt-1">{watched.slug || "no-slug"}</div>
//             </div>

//             {/* Hero Preview */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Hero Section</div>
//               {watched.hero?.image ? (
//                 <img src={watched.hero.image} alt={watched.hero.alt || "hero"} className="w-full h-32 object-cover rounded mb-3" />
//               ) : (
//                 <div className="w-full h-32 bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-500 text-xs">No image</div>
//               )}
//               <div className="space-y-2">
//                 <div className="text-white font-semibold">{watched.hero?.h1 || "—"}</div>
//                 <div className="text-xs text-gray-400 line-clamp-2">{watched.hero?.p || "—"}</div>
//                 {watched.hero?.btn && <div className="text-xs text-blue-400 mt-2">{watched.hero.btn}</div>}
//               </div>
//             </div>

//             {/* Content Blocks */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Content Blocks</div>
//               <div className="text-sm text-gray-300">{(watched.content || []).length} block{(watched.content?.length || 0) !== 1 ? 's' : ''}</div>

//               {(watched.content || []).map((block: any, idx: number) => (
//                 <div key={idx} className="mt-3 pt-3 border-t border-gray-700">
//                   <div className="text-xs text-gray-400 mb-1">{String(idx + 1).padStart(2, '0')} · {block.type}</div>
//                   {block.type === "serviceSection" && (
//                     <div className="text-xs">
//                       <div className="text-gray-300 font-medium">{block.service} {block.subservice && `(${block.subservice})`}</div>
//                       <div className="text-gray-500 mt-1">{block.title}</div>
//                     </div>
//                   )}
//                   {block.type === "dedicatedServiceSection" && (
//                     <div className="text-xs">
//                       {block.img && <img src={block.img} alt="media" className="w-full h-16 object-cover rounded mt-1 mb-2" />}
//                       <div className="text-gray-300 line-clamp-2">{block.textRich || "—"}</div>
//                     </div>
//                   )}
//                   {block.type === "corporateServiceOfferings" && (
//                     <div className="text-xs">
//                       {block.src && <img src={block.src} alt={block.alt} className="w-full h-16 object-cover rounded mt-1 mb-2" />}
//                       <div className="text-gray-300 font-medium">{block.title}</div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">{block.description}</div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* SEO */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">SEO</div>
//               <div className="space-y-2">
//                 <div>
//                   <div className="text-xs text-gray-500">Title</div>
//                   <div className="text-xs text-gray-300 line-clamp-1">{watched.seo?.title || "—"}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Description</div>
//                   <div className="text-xs text-gray-300 line-clamp-2">{watched.seo?.description || "—"}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Media Library Modal */}
//       {mediaOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded shadow-lg p-6 w-11/12 md:w-2/3 max-h-3/4 overflow-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-white">Media Library</h3>
//               <button onClick={() => setMediaOpen(false)} className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-700">Close</button>
//             </div>
//             <div className="grid grid-cols-3 gap-3">
//               {["https://placekitten.com/800/400", "https://placekitten.com/1200/630", "https://placekitten.com/600/400"].map((s) => (
//                 <div key={s} className="border border-gray-700 p-2 rounded text-center">
//                   <img src={s} alt="media" className="w-full h-28 object-cover rounded mb-2" />
//                   <button onClick={() => handleMediaSelect(s)} className="px-2 py-1 border border-gray-700 rounded text-xs hover:bg-gray-700">Select</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

/**
 * ======================================
 * v2
 */

// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { ChevronDown, MoreVertical, GripVertical, Trash2 } from "lucide-react";

// const heroSchema = z.object({
//   image: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   h1: z.string().optional(),
//   p: z.string().optional(),
//   btn: z.string().optional(),
// });

// const serviceSectionSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("serviceSection"),
//   service: z.string().optional(),
//   subservice: z.string().optional(),
//   infocard: z
//     .object({
//       src: z.string().url().or(z.literal("")).optional(),
//       alt: z.string().optional(),
//       title: z.string().optional(),
//       description: z.string().optional(),
//     })
//     .optional(),
// });

// const dedicatedServiceSectionSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("dedicatedServiceSection"),
//   img: z.string().url().or(z.literal("")).optional(),
//   textRich: z.string().optional(),
// });

// const corporateServiceOfferingsSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("corporateServiceOfferings"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const corporateServicesAndFeaturesSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("corporateServicesAndFeatures"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   height: z.number().optional(),
//   width: z.number().optional(),
//   orientation: z.enum(["vertical", "horizontal"]).optional(),
// });

// const whoWeSupportSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("whoWeSupport"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const ourGlobalReachSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("ourGlobalReach"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const contactForServiceSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("contactForService"),
//   textRich: z.string().optional(),
//   btn: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const contentBlockSchema = z.union([
//   serviceSectionSchema,
//   dedicatedServiceSectionSchema,
//   corporateServiceOfferingsSchema,
//   corporateServicesAndFeaturesSchema,
//   whoWeSupportSchema,
//   ourGlobalReachSchema,
//   contactForServiceSchema,
// ]);

// const seoSchema = z.object({
//   title: z.string().optional(),
//   description: z.string().optional(),
//   keywords: z.array(z.string()).optional(),
// });

// const pageTemplateSchema = z.object({
//   pageName: z.string().optional(),
//   slug: z.string().optional(),
//   hero: heroSchema.optional(),
//   content: z.array(contentBlockSchema).optional(),
//   seo: seoSchema.optional(),
// });

// export type PageTemplateFormData = z.infer<typeof pageTemplateSchema>;

// const uid = () => Math.random().toString(36).slice(2, 9);

// function Input({ label, ...props }: any) {
//   return (
//     <label className="block text-sm mb-3">
//       <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
//         {label}
//       </div>
//       <input
//         className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
//         {...props}
//       />
//     </label>
//   );
// }

// function TextArea({ label, ...props }: any) {
//   return (
//     <label className="block text-sm mb-3">
//       <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
//         {label}
//       </div>
//       <textarea
//         className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
//         rows={4}
//         {...props}
//       />
//     </label>
//   );
// }

// function LayoutBlock({
//   block,
//   index,
//   onRemove,
//   onMoveUp,
//   onMoveDown,
//   canMoveUp,
//   canMoveDown,
//   children,
// }: any) {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <div className="bg-gray-800 border border-gray-700 rounded mb-3 overflow-hidden">
//       <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 hover:bg-gray-850 group">
//         <div className="flex items-center gap-2">
//           <GripVertical
//             size={16}
//             className="text-gray-500 group-hover:text-gray-300"
//           />
//           <span className="text-xs text-gray-400 font-mono">
//             #{String(index + 1).padStart(2, "0")}
//           </span>
//           <span className="text-sm text-gray-300 font-medium capitalize">
//             {block.type.replace(/([A-Z])/g, " $1").toLowerCase()}
//           </span>
//         </div>
//         <div className="flex items-center gap-1">
//           <button
//             onClick={onMoveUp}
//             disabled={!canMoveUp}
//             className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 text-xs"
//             title="Move up"
//           >
//             ↑
//           </button>
//           <button
//             onClick={onMoveDown}
//             disabled={!canMoveDown}
//             className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 text-xs"
//             title="Move down"
//           >
//             ↓
//           </button>
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="p-1 hover:bg-gray-700 rounded"
//           >
//             <ChevronDown
//               size={16}
//               className={`text-gray-400 transition ${expanded ? "" : "-rotate-90"}`}
//             />
//           </button>
//           <button onClick={onRemove} className="p-1 hover:bg-red-900 rounded">
//             <Trash2 size={16} className="text-gray-400" />
//           </button>
//         </div>
//       </div>

//       {expanded && <div className="p-4 space-y-3">{children}</div>}
//     </div>
//   );
// }

// export default function PageTemplateEditor({
//   initialData,
// }: {
//   initialData?: PageTemplateFormData;
// }) {
//   const [activeTab, setActiveTab] = useState<"hero" | "content" | "seo">(
//     "hero"
//   );
//   const [mediaOpen, setMediaOpen] = useState(false);
//   const [mediaCb, setMediaCb] = useState<null | ((url: string) => void)>(null);

//   const form = useForm<PageTemplateFormData>({
//     resolver: zodResolver(pageTemplateSchema),
//     defaultValues: initialData || {
//       pageName: "",
//       slug: "",
//       hero: { image: "", alt: "", h1: "", p: "", btn: "" },
//       content: [],
//       seo: { title: "", description: "", keywords: [] },
//     },
//   });

//   const { control, register, handleSubmit, watch, setValue, getValues, reset } =
//     form;
//   const { fields, append, remove, move } = useFieldArray({
//     control,
//     name: "content" as const,
//   });

//   useEffect(() => {
//     const c = getValues().content || [];
//     const next = c.map((b: any) => ({ id: b.id || uid(), ...b }));
//     setValue("content", next as any);
//   }, []);

//   const openMedia = (cb: (url: string) => void) => {
//     setMediaCb(() => cb);
//     setMediaOpen(true);
//   };

//   const handleMediaSelect = (url: string) => {
//     if (mediaCb) mediaCb(url);
//     setMediaOpen(false);
//     setMediaCb(null);
//   };

//   const watched = watch();

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <div className="bg-black border-b border-gray-800 px-6 py-4">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-bold">
//               {watched.pageName || "Untitled"}
//             </h1>
//             <div className="text-xs text-gray-400 mt-2 space-y-1">
//               <div>
//                 Status: <span className="text-yellow-400">Changed</span> ·{" "}
//                 <button className="text-blue-400 hover:text-blue-300">
//                   Revert to published
//                 </button>
//               </div>
//               <div>Last Modified: January 16th 2025, 3:24 PM</div>
//               <div>Created: January 16th 2025, 3:06 PM</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">
//               Edit
//             </button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">
//               Live Preview
//             </button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">
//               Versions <span className="ml-1 text-gray-400">2</span>
//             </button>
//             <button
//               onClick={() => setApiOpen(true)}
//               className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800"
//             >
//               API
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-gray-900 border-b border-gray-800 px-6">
//         <div className="flex gap-8">
//           {["hero", "content", "seo"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab as any)}
//               className={`py-3 px-1 text-sm font-medium capitalize border-b-2 transition ${
//                 activeTab === tab
//                   ? "border-blue-500 text-white"
//                   : "border-transparent text-gray-400 hover:text-gray-300"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Editor Panel */}
//         <div className="flex-1 border-r border-gray-800 p-6 overflow-y-auto">
//           <div className="max-w-2xl space-y-6">
//             {/* Hero Tab */}
//             {activeTab === "hero" && (
//               <>
//                 <div>
//                   <Input label="Title" {...register("pageName")} />
//                   <Input label="Slug" {...register("slug")} />
//                 </div>

//                 <div className="border-t border-gray-700 pt-6">
//                   <h3 className="text-lg font-semibold mb-4">Hero</h3>
//                   <Controller
//                     control={control}
//                     name="hero.image"
//                     render={({ field }) => (
//                       <Input label="Hero Image URL" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.alt"
//                     render={({ field }) => (
//                       <Input label="Alt Text" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.h1"
//                     render={({ field }) => (
//                       <Input label="Heading (H1)" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.p"
//                     render={({ field }) => (
//                       <TextArea label="Description" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.btn"
//                     render={({ field }) => (
//                       <Input label="Button Text" {...field} />
//                     )}
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       openMedia((url) => setValue("hero.image", url))
//                     }
//                     className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
//                   >
//                     Choose Media
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Content Tab */}
//             {activeTab === "content" && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">Layout</h3>
//                   <div className="flex gap-2 flex-wrap">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "serviceSection",
//                           service: "",
//                           subservice: "",
//                           infocard: {
//                             src: "",
//                             alt: "",
//                             title: "",
//                             description: "",
//                           },
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Service
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "dedicatedServiceSection",
//                           img: "",
//                           textRich: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Dedicated
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "corporateServiceOfferings",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           button: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Corp Offerings
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "corporateServicesAndFeatures",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           height: 200,
//                           width: 300,
//                           orientation: "vertical",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Features
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "whoWeSupport",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           button: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Who We Support
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "ourGlobalReach",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           button: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Global Reach
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "contactForService",
//                           textRich: "",
//                           btn: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Contact CTA
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <SortableList
//                     items={fields}
//                     onSortEnd={(oldIndex: number, newIndex: number) => {
//                       move(oldIndex, newIndex);
//                     }}
//                   >
//                     {fields.map((f, idx) => {
//                       const type =
//                         (watched.content &&
//                           watched.content[idx] &&
//                           (watched.content[idx] as any).type) ||
//                         f.type;

//                       return (
//                         <SortableItem key={f.id} id={f.id}>
//                           <LayoutBlock
//                             key={f.id}
//                             block={{ type }}
//                             index={idx}
//                             onRemove={() => remove(idx)}
//                             onMoveUp={() => move(idx, idx - 1)}
//                             onMoveDown={() => move(idx, idx + 1)}
//                             canMoveUp={idx > 0}
//                             canMoveDown={idx < fields.length - 1}
//                           >
//                             {type === "serviceSection" && (
//                               <>
//                                 <Input
//                                   label="Service"
//                                   {...register(`content.${idx}.service`)}
//                                 />
//                                 <Input
//                                   label="Subservice"
//                                   {...register(`content.${idx}.subservice`)}
//                                 />
//                                 <div className="border-t border-gray-700 pt-3 mt-3">
//                                   <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                                     InfoCard
//                                   </h4>
//                                   <Input
//                                     label="Image URL"
//                                     {...register(`content.${idx}.infocard.src`)}
//                                   />
//                                   <Input
//                                     label="Alt Text"
//                                     {...register(`content.${idx}.infocard.alt`)}
//                                   />
//                                   <Input
//                                     label="Title"
//                                     {...register(
//                                       `content.${idx}.infocard.title`
//                                     )}
//                                   />
//                                   <TextArea
//                                     label="Description"
//                                     {...register(
//                                       `content.${idx}.infocard.description`
//                                     )}
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       openMedia((url) =>
//                                         setValue(
//                                           `content.${idx}.infocard.src`,
//                                           url
//                                         )
//                                       )
//                                     }
//                                     className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                   >
//                                     Choose Image
//                                   </button>
//                                 </div>
//                               </>
//                             )}
//                             {type === "dedicatedServiceSection" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.img`)}
//                                 />
//                                 <TextArea
//                                   label="Rich Text (HTML)"
//                                   {...register(`content.${idx}.textRich`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.img`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "corporateServiceOfferings" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.button`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "corporateServicesAndFeatures" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <div className="grid grid-cols-2 gap-3">
//                                   <Input
//                                     label="Height (px)"
//                                     type="number"
//                                     {...register(`content.${idx}.height`, {
//                                       valueAsNumber: true,
//                                     })}
//                                   />
//                                   <Input
//                                     label="Width (px)"
//                                     type="number"
//                                     {...register(`content.${idx}.width`, {
//                                       valueAsNumber: true,
//                                     })}
//                                   />
//                                 </div>
//                                 <label className="block text-sm mb-3">
//                                   <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
//                                     Orientation
//                                   </div>
//                                   <select
//                                     {...register(`content.${idx}.orientation`)}
//                                     className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
//                                   >
//                                     <option value="">Select orientation</option>
//                                     <option value="vertical">Vertical</option>
//                                     <option value="horizontal">
//                                       Horizontal
//                                     </option>
//                                   </select>
//                                 </label>
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "whoWeSupport" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.button`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "ourGlobalReach" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.button`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "contactForService" && (
//                               <>
//                                 <TextArea
//                                   label="Rich Text (HTML)"
//                                   {...register(`content.${idx}.textRich`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.btn`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                               </>
//                             )}
//                           </LayoutBlock>
//                         </SortableItem>
//                       );
//                     })}
//                   </SortableList>
//                 </div>
//               </div>
//             )}

//             {/* SEO Tab */}
//             {activeTab === "seo" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">
//                   Search Engine Optimization
//                 </h3>
//                 <Controller
//                   control={control}
//                   name="seo.title"
//                   render={({ field }) => (
//                     <Input label="Meta Title" {...field} />
//                   )}
//                 />
//                 <Controller
//                   control={control}
//                   name="seo.description"
//                   render={({ field }) => (
//                     <TextArea label="Meta Description" {...field} />
//                   )}
//                 />
//                 <Controller
//                   control={control}
//                   name="seo.keywords"
//                   render={({ field }) => (
//                     <Input
//                       label="Keywords (comma separated)"
//                       value={
//                         Array.isArray(field.value)
//                           ? field.value.join(", ")
//                           : field.value || ""
//                       }
//                       onChange={(e) => field.onChange(e.target.value)}
//                     />
//                   )}
//                 />
//               </div>
//             )}

//             <div className="flex gap-2 pt-4 border-t border-gray-700">
//               <button
//                 onClick={() => console.log(getValues())}
//                 className="px-4 py-2 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => reset()}
//                 className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Live Preview Panel */}
//         <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
//           <h3 className="text-lg font-semibold mb-6">Live Preview</h3>

//           <div className="space-y-6">
//             {/* Page Info */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
//                 Page
//               </div>
//               <div className="text-sm text-gray-300 font-medium">
//                 {watched.pageName || "Untitled Page"}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 {watched.slug || "no-slug"}
//               </div>
//             </div>

//             {/* Hero Preview */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                 Hero Section
//               </div>
//               {watched.hero?.image ? (
//                 <img
//                   src={watched.hero.image}
//                   alt={watched.hero.alt || "hero"}
//                   className="w-full h-32 object-cover rounded mb-3"
//                 />
//               ) : (
//                 <div className="w-full h-32 bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-500 text-xs">
//                   No image
//                 </div>
//               )}
//               <div className="space-y-2">
//                 <div className="text-white font-semibold">
//                   {watched.hero?.h1 || "—"}
//                 </div>
//                 <div className="text-xs text-gray-400 line-clamp-2">
//                   {watched.hero?.p || "—"}
//                 </div>
//                 {watched.hero?.btn && (
//                   <div className="text-xs text-blue-400 mt-2">
//                     {watched.hero.btn}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Content Blocks */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                 Content Blocks
//               </div>
//               <div className="text-sm text-gray-300 mb-3">
//                 {(watched.content || []).length} block
//                 {(watched.content?.length || 0) !== 1 ? "s" : ""}
//               </div>

//               {(watched.content || []).map((block: any, idx: number) => (
//                 <div key={idx} className="mt-3 pt-3 border-t border-gray-700">
//                   <div className="text-xs text-gray-400 mb-1">
//                     {String(idx + 1).padStart(2, "0")} · {block.type}
//                   </div>
//                   {block.type === "serviceSection" && (
//                     <div className="text-xs">
//                       <div className="text-gray-300 font-medium">
//                         {block.service}{" "}
//                         {block.subservice && `(${block.subservice})`}
//                       </div>
//                       {block.infocard?.title && (
//                         <div className="text-gray-500 mt-1">
//                           {block.infocard.title}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   {block.type === "dedicatedServiceSection" && (
//                     <div className="text-xs">
//                       {block.img && (
//                         <img
//                           src={block.img}
//                           alt="media"
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 line-clamp-2">
//                         {block.textRich || "—"}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "corporateServiceOfferings" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">
//                         {block.description}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "corporateServicesAndFeatures" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 text-xs mt-1">
//                         {block.orientation} · {block.width}x{block.height}px
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "whoWeSupport" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">
//                         {block.description}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "ourGlobalReach" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">
//                         {block.description}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "contactForService" && (
//                     <div className="text-xs">
//                       <div className="text-gray-300 line-clamp-2">
//                         {block.textRich || "—"}
//                       </div>
//                       <div className="text-blue-400 text-xs mt-1">
//                         {block.btnTitle || "Button"}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* SEO */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                 SEO
//               </div>
//               <div className="space-y-2">
//                 <div>
//                   <div className="text-xs text-gray-500">Title</div>
//                   <div className="text-xs text-gray-300 line-clamp-1">
//                     {watched.seo?.title || "—"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Description</div>
//                   <div className="text-xs text-gray-300 line-clamp-2">
//                     {watched.seo?.description || "—"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Media Library Modal */}
//       {mediaOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded shadow-lg p-6 w-11/12 md:w-2/3 max-h-3/4 overflow-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-white">Media Library</h3>
//               <button
//                 onClick={() => setMediaOpen(false)}
//                 className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 "https://placekitten.com/800/400",
//                 "https://placekitten.com/1200/630",
//                 "https://placekitten.com/600/400",
//               ].map((s) => (
//                 <div
//                   key={s}
//                   className="border border-gray-700 p-2 rounded text-center"
//                 >
//                   <img
//                     src={s}
//                     alt="media"
//                     className="w-full h-28 object-cover rounded mb-2"
//                   />
//                   <button
//                     onClick={() => handleMediaSelect(s)}
//                     className="px-2 py-1 border border-gray-700 rounded text-xs hover:bg-gray-700"
//                   >
//                     Select
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

/**
 * =====================
 * v3
 * =====================
 */

// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { ChevronDown, MoreVertical, GripVertical, Trash2 } from "lucide-react";

// function SortableItem({ id, children }: any) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition,
//       }}
//       {...attributes}
//     >
//       {/* Drag Handle */}
//       <div
//         {...listeners}
//         className="cursor-grab active:cursor-grabbing px-2 py-1 bg-gray-700 text-xs rounded mb-2 w-fit"
//       >
//         ⠿ Drag
//       </div>

//       {/* Content */}
//       {children}
//     </div>
//   );
// }

// function SortableList({ items, onSortEnd, children }: any) {
//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
//   );

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={(event) => {
//         const { active, over } = event;
//         if (!over) return;

//         if (active.id !== over.id) {
//           const oldIndex = items.findIndex((i: any) => i.id === active.id);
//           const newIndex = items.findIndex((i: any) => i.id === over.id);
//           onSortEnd(oldIndex, newIndex);
//         }
//       }}
//     >
//       <SortableContext items={items} strategy={verticalListSortingStrategy}>
//         {children}
//       </SortableContext>
//     </DndContext>
//   );
// }

// const heroSchema = z.object({
//   image: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   h1: z.string().optional(),
//   p: z.string().optional(),
//   btn: z.string().optional(),
// });

// const serviceSectionSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("serviceSection"),
//   service: z.string().optional(),
//   subservice: z.string().optional(),
//   infocard: z
//     .object({
//       src: z.string().url().or(z.literal("")).optional(),
//       alt: z.string().optional(),
//       title: z.string().optional(),
//       description: z.string().optional(),
//     })
//     .optional(),
// });

// const dedicatedServiceSectionSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("dedicatedServiceSection"),
//   img: z.string().url().or(z.literal("")).optional(),
//   textRich: z.string().optional(),
// });

// const corporateServiceOfferingsSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("corporateServiceOfferings"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const corporateServicesAndFeaturesSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("corporateServicesAndFeatures"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   height: z.number().optional(),
//   width: z.number().optional(),
//   orientation: z.enum(["vertical", "horizontal"]).optional(),
// });

// const whoWeSupportSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("whoWeSupport"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const ourGlobalReachSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("ourGlobalReach"),
//   src: z.string().url().or(z.literal("")).optional(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const contactForServiceSchema = z.object({
//   id: z.string().optional(),
//   type: z.literal("contactForService"),
//   textRich: z.string().optional(),
//   btn: z.string().optional(),
//   btnTitle: z.string().optional(),
// });

// const contentBlockSchema = z.union([
//   serviceSectionSchema,
//   dedicatedServiceSectionSchema,
//   corporateServiceOfferingsSchema,
//   corporateServicesAndFeaturesSchema,
//   whoWeSupportSchema,
//   ourGlobalReachSchema,
//   contactForServiceSchema,
// ]);

// const seoSchema = z.object({
//   title: z.string().optional(),
//   description: z.string().optional(),
//   keywords: z.array(z.string()).optional(),
// });

// const pageTemplateSchema = z.object({
//   pageName: z.string().optional(),
//   slug: z.string().optional(),
//   hero: heroSchema.optional(),
//   content: z.array(contentBlockSchema).optional(),
//   seo: seoSchema.optional(),
// });

// export type PageTemplateFormData = z.infer<typeof pageTemplateSchema>;

// const uid = () => Math.random().toString(36).slice(2, 9);

// function Input({ label, ...props }: any) {
//   return (
//     <label className="block text-sm mb-3">
//       <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
//         {label}
//       </div>
//       <input
//         className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
//         {...props}
//       />
//     </label>
//   );
// }

// function TextArea({ label, ...props }: any) {
//   return (
//     <label className="block text-sm mb-3">
//       <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
//         {label}
//       </div>
//       <textarea
//         className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
//         rows={4}
//         {...props}
//       />
//     </label>
//   );
// }

// function LayoutBlock({
//   block,
//   index,
//   onRemove,
//   onMoveUp,
//   onMoveDown,
//   canMoveUp,
//   canMoveDown,
//   children,
// }: any) {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <div className="bg-gray-800 border border-gray-700 rounded mb-3 overflow-hidden">
//       <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700 hover:bg-gray-850 group">
//         <div className="flex items-center gap-2">
//           <GripVertical
//             size={16}
//             className="text-gray-500 group-hover:text-gray-300"
//           />
//           <span className="text-xs text-gray-400 font-mono">
//             #{String(index + 1).padStart(2, "0")}
//           </span>
//           <span className="text-sm text-gray-300 font-medium capitalize">
//             {block.type.replace(/([A-Z])/g, " $1").toLowerCase()}
//           </span>
//         </div>
//         <div className="flex items-center gap-1">
//           <button
//             onClick={onMoveUp}
//             disabled={!canMoveUp}
//             className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 text-xs"
//             title="Move up"
//           >
//             ↑
//           </button>
//           <button
//             onClick={onMoveDown}
//             disabled={!canMoveDown}
//             className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 text-xs"
//             title="Move down"
//           >
//             ↓
//           </button>
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="p-1 hover:bg-gray-700 rounded"
//           >
//             <ChevronDown
//               size={16}
//               className={`text-gray-400 transition ${expanded ? "" : "-rotate-90"}`}
//             />
//           </button>
//           <button onClick={onRemove} className="p-1 hover:bg-red-900 rounded">
//             <Trash2 size={16} className="text-gray-400" />
//           </button>
//         </div>
//       </div>

//       {expanded && <div className="p-4 space-y-3">{children}</div>}
//     </div>
//   );
// }

// export default function PageTemplateEditor({
//   initialData,
// }: {
//   initialData?: PageTemplateFormData;
// }) {
// const [activeTab, setActiveTab] = useState<"hero" | "content" | "seo">(
//   "hero"
// );
// const [mediaOpen, setMediaOpen] = useState(false);
// const [mediaCb, setMediaCb] = useState<null | ((url: string) => void)>(null);
// const [apiOpen, setApiOpen] = useState(false);

// const form = useForm<PageTemplateFormData>({
//   resolver: zodResolver(pageTemplateSchema),
//   defaultValues: initialData || {
//     pageName: "",
//     slug: "",
//     hero: { image: "", alt: "", h1: "", p: "", btn: "" },
//     content: [],
//     seo: { title: "", description: "", keywords: [] },
//   },
// });

// const { control, register, handleSubmit, watch, setValue, getValues, reset } =
//   form;
// const { fields, append, remove, move } = useFieldArray({
//   control,
//   name: "content" as const,
// });

// useEffect(() => {
//   const c = getValues().content || [];
//   const next = c.map((b: any) => ({ id: b.id || uid(), ...b }));
//   setValue("content", next as any);
// }, []);

// const openMedia = (cb: (url: string) => void) => {
//   setMediaCb(() => cb);
//   setMediaOpen(true);
// };

// const handleMediaSelect = (url: string) => {
//   if (mediaCb) mediaCb(url);
//   setMediaOpen(false);
//   setMediaCb(null);
// };

// const watched = watch();

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <div className="bg-black border-b border-gray-800 px-6 py-4">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-bold">
//               {watched.pageName || "Untitled"}
//             </h1>
//             <div className="text-xs text-gray-400 mt-2 space-y-1">
//               <div>
//                 Status: <span className="text-yellow-400">Changed</span> ·{" "}
//                 <button className="text-blue-400 hover:text-blue-300">
//                   Revert to published
//                 </button>
//               </div>
//               <div>Last Modified: January 16th 2025, 3:24 PM</div>
//               <div>Created: January 16th 2025, 3:06 PM</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">
//               Edit
//             </button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">
//               Live Preview
//             </button>
//             <button className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800">
//               Versions <span className="ml-1 text-gray-400">2</span>
//             </button>
//             <button
//               onClick={() => setApiOpen(true)}
//               className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800"
//             >
//               API
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-gray-900 border-b border-gray-800 px-6">
//         <div className="flex gap-8">
//           {["hero", "content", "seo"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab as any)}
//               className={`py-3 px-1 text-sm font-medium capitalize border-b-2 transition ${
//                 activeTab === tab
//                   ? "border-blue-500 text-white"
//                   : "border-transparent text-gray-400 hover:text-gray-300"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Editor Panel */}
//         <div className="flex-1 border-r border-gray-800 p-6 overflow-y-auto">
//           <div className="max-w-2xl space-y-6">
//             {/* Hero Tab */}
//             {activeTab === "hero" && (
//               <>
//                 <div>
//                   <Input label="Title" {...register("pageName")} />
//                   <Input label="Slug" {...register("slug")} />
//                 </div>

//                 <div className="border-t border-gray-700 pt-6">
//                   <h3 className="text-lg font-semibold mb-4">Hero</h3>
//                   <Controller
//                     control={control}
//                     name="hero.image"
//                     render={({ field }) => (
//                       <Input label="Hero Image URL" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.alt"
//                     render={({ field }) => (
//                       <Input label="Alt Text" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.h1"
//                     render={({ field }) => (
//                       <Input label="Heading (H1)" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.p"
//                     render={({ field }) => (
//                       <TextArea label="Description" {...field} />
//                     )}
//                   />
//                   <Controller
//                     control={control}
//                     name="hero.btn"
//                     render={({ field }) => (
//                       <Input label="Button Text" {...field} />
//                     )}
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       openMedia((url) => setValue("hero.image", url))
//                     }
//                     className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
//                   >
//                     Choose Media
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Content Tab */}
//             {activeTab === "content" && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">Layout</h3>
//                   <div className="flex gap-2 flex-wrap">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "serviceSection",
//                           service: "",
//                           subservice: "",
//                           infocard: {
//                             src: "",
//                             alt: "",
//                             title: "",
//                             description: "",
//                           },
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Service
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "dedicatedServiceSection",
//                           img: "",
//                           textRich: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Dedicated
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "corporateServiceOfferings",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           button: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Corp Offerings
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "corporateServicesAndFeatures",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           height: 200,
//                           width: 300,
//                           orientation: "vertical",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Features
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "whoWeSupport",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           button: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Who We Support
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "ourGlobalReach",
//                           src: "",
//                           alt: "",
//                           title: "",
//                           description: "",
//                           button: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Global Reach
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         append({
//                           id: uid(),
//                           type: "contactForService",
//                           textRich: "",
//                           btn: "",
//                           btnTitle: "",
//                         })
//                       }
//                       className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
//                     >
//                       + Contact CTA
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <SortableList
//                     items={fields}
//                     onSortEnd={(oldIndex: number, newIndex: number) => {
//                       move(oldIndex, newIndex);
//                     }}
//                   >
//                     {fields.map((f, idx) => {
//                       const type =
//                         (watched.content &&
//                           watched.content[idx] &&
//                           (watched.content[idx] as any).type) ||
//                         f.type;
//                       return (
//                         <SortableItem key={f.id} id={f.id}>
//                           <LayoutBlock
//                             key={f.id}
//                             block={{ type }}
//                             index={idx}
//                             onRemove={() => remove(idx)}
//                             onMoveUp={() => move(idx, idx - 1)}
//                             onMoveDown={() => move(idx, idx + 1)}
//                             canMoveUp={idx > 0}
//                             canMoveDown={idx < fields.length - 1}
//                           >
//                             {type === "serviceSection" && (
//                               <>
//                                 <Input
//                                   label="Service"
//                                   {...register(`content.${idx}.service`)}
//                                 />
//                                 <Input
//                                   label="Subservice"
//                                   {...register(`content.${idx}.subservice`)}
//                                 />
//                                 <div className="border-t border-gray-700 pt-3 mt-3">
//                                   <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                                     InfoCard
//                                   </h4>
//                                   <Input
//                                     label="Image URL"
//                                     {...register(`content.${idx}.infocard.src`)}
//                                   />
//                                   <Input
//                                     label="Alt Text"
//                                     {...register(`content.${idx}.infocard.alt`)}
//                                   />
//                                   <Input
//                                     label="Title"
//                                     {...register(
//                                       `content.${idx}.infocard.title`
//                                     )}
//                                   />
//                                   <TextArea
//                                     label="Description"
//                                     {...register(
//                                       `content.${idx}.infocard.description`
//                                     )}
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       openMedia((url) =>
//                                         setValue(
//                                           `content.${idx}.infocard.src`,
//                                           url
//                                         )
//                                       )
//                                     }
//                                     className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                   >
//                                     Choose Image
//                                   </button>
//                                 </div>
//                               </>
//                             )}
//                             {type === "dedicatedServiceSection" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.img`)}
//                                 />
//                                 <TextArea
//                                   label="Rich Text (HTML)"
//                                   {...register(`content.${idx}.textRich`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.img`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "corporateServiceOfferings" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.button`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "corporateServicesAndFeatures" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <div className="grid grid-cols-2 gap-3">
//                                   <Input
//                                     label="Height (px)"
//                                     type="number"
//                                     {...register(`content.${idx}.height`, {
//                                       valueAsNumber: true,
//                                     })}
//                                   />
//                                   <Input
//                                     label="Width (px)"
//                                     type="number"
//                                     {...register(`content.${idx}.width`, {
//                                       valueAsNumber: true,
//                                     })}
//                                   />
//                                 </div>
//                                 <label className="block text-sm mb-3">
//                                   <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
//                                     Orientation
//                                   </div>
//                                   <select
//                                     {...register(`content.${idx}.orientation`)}
//                                     className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
//                                   >
//                                     <option value="">Select orientation</option>
//                                     <option value="vertical">Vertical</option>
//                                     <option value="horizontal">
//                                       Horizontal
//                                     </option>
//                                   </select>
//                                 </label>
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "whoWeSupport" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.button`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "ourGlobalReach" && (
//                               <>
//                                 <Input
//                                   label="Image URL"
//                                   {...register(`content.${idx}.src`)}
//                                 />
//                                 <Input
//                                   label="Alt Text"
//                                   {...register(`content.${idx}.alt`)}
//                                 />
//                                 <Input
//                                   label="Title"
//                                   {...register(`content.${idx}.title`)}
//                                 />
//                                 <TextArea
//                                   label="Description"
//                                   {...register(`content.${idx}.description`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.button`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     openMedia((url) =>
//                                       setValue(`content.${idx}.src`, url)
//                                     )
//                                   }
//                                   className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
//                                 >
//                                   Choose Image
//                                 </button>
//                               </>
//                             )}
//                             {type === "contactForService" && (
//                               <>
//                                 <TextArea
//                                   label="Rich Text (HTML)"
//                                   {...register(`content.${idx}.textRich`)}
//                                 />
//                                 <Input
//                                   label="Button Link"
//                                   {...register(`content.${idx}.btn`)}
//                                 />
//                                 <Input
//                                   label="Button Text"
//                                   {...register(`content.${idx}.btnTitle`)}
//                                 />
//                               </>
//                             )}
//                           </LayoutBlock>
//                         </SortableItem>
//                       );
//                     })}
//                   </SortableList>
//                 </div>
//               </div>
//             )}

//             {/* SEO Tab */}
//             {activeTab === "seo" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">
//                   Search Engine Optimization
//                 </h3>
//                 <Controller
//                   control={control}
//                   name="seo.title"
//                   render={({ field }) => (
//                     <Input label="Meta Title" {...field} />
//                   )}
//                 />
//                 <Controller
//                   control={control}
//                   name="seo.description"
//                   render={({ field }) => (
//                     <TextArea label="Meta Description" {...field} />
//                   )}
//                 />
//                 <Controller
//                   control={control}
//                   name="seo.keywords"
//                   render={({ field }) => (
//                     <Input
//                       label="Keywords (comma separated)"
//                       value={
//                         Array.isArray(field.value)
//                           ? field.value.join(", ")
//                           : field.value || ""
//                       }
//                       onChange={(e) => field.onChange(e.target.value)}
//                     />
//                   )}
//                 />
//               </div>
//             )}

//             <div className="flex gap-2 pt-4 border-t border-gray-700">
//               <button
//                 onClick={() => console.log(getValues())}
//                 className="px-4 py-2 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => reset()}
//                 className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Live Preview Panel */}
//         <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
//           <h3 className="text-lg font-semibold mb-6">Live Preview</h3>

//           <div className="space-y-6">
//             {/* Page Info */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
//                 Page
//               </div>
//               <div className="text-sm text-gray-300 font-medium">
//                 {watched.pageName || "Untitled Page"}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 {watched.slug || "no-slug"}
//               </div>
//             </div>

//             {/* Hero Preview */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                 Hero Section
//               </div>
//               {watched.hero?.image ? (
//                 <img
//                   src={watched.hero.image}
//                   alt={watched.hero.alt || "hero"}
//                   className="w-full h-32 object-cover rounded mb-3"
//                 />
//               ) : (
//                 <div className="w-full h-32 bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-500 text-xs">
//                   No image
//                 </div>
//               )}
//               <div className="space-y-2">
//                 <div className="text-white font-semibold">
//                   {watched.hero?.h1 || "—"}
//                 </div>
//                 <div className="text-xs text-gray-400 line-clamp-2">
//                   {watched.hero?.p || "—"}
//                 </div>
//                 {watched.hero?.btn && (
//                   <div className="text-xs text-blue-400 mt-2">
//                     {watched.hero.btn}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Content Blocks */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                 Content Blocks
//               </div>
//               <div className="text-sm text-gray-300 mb-3">
//                 {(watched.content || []).length} block
//                 {(watched.content?.length || 0) !== 1 ? "s" : ""}
//               </div>

//               {(watched.content || []).map((block: any, idx: number) => (
//                 <div key={idx} className="mt-3 pt-3 border-t border-gray-700">
//                   <div className="text-xs text-gray-400 mb-1">
//                     {String(idx + 1).padStart(2, "0")} · {block.type}
//                   </div>
//                   {block.type === "serviceSection" && (
//                     <div className="text-xs">
//                       <div className="text-gray-300 font-medium">
//                         {block.service}{" "}
//                         {block.subservice && `(${block.subservice})`}
//                       </div>
//                       {block.infocard?.title && (
//                         <div className="text-gray-500 mt-1">
//                           {block.infocard.title}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                   {block.type === "dedicatedServiceSection" && (
//                     <div className="text-xs">
//                       {block.img && (
//                         <img
//                           src={block.img}
//                           alt="media"
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 line-clamp-2">
//                         {block.textRich || "—"}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "corporateServiceOfferings" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">
//                         {block.description}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "corporateServicesAndFeatures" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 text-xs mt-1">
//                         {block.orientation} · {block.width}x{block.height}px
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "whoWeSupport" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">
//                         {block.description}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "ourGlobalReach" && (
//                     <div className="text-xs">
//                       {block.src && (
//                         <img
//                           src={block.src}
//                           alt={block.alt}
//                           className="w-full h-16 object-cover rounded mt-1 mb-2"
//                         />
//                       )}
//                       <div className="text-gray-300 font-medium">
//                         {block.title}
//                       </div>
//                       <div className="text-gray-500 line-clamp-2 mt-1">
//                         {block.description}
//                       </div>
//                     </div>
//                   )}
//                   {block.type === "contactForService" && (
//                     <div className="text-xs">
//                       <div className="text-gray-300 line-clamp-2">
//                         {block.textRich || "—"}
//                       </div>
//                       <div className="text-blue-400 text-xs mt-1">
//                         {block.btnTitle || "Button"}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* SEO */}
//             <div className="bg-gray-900 rounded p-4">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
//                 SEO
//               </div>
//               <div className="space-y-2">
//                 <div>
//                   <div className="text-xs text-gray-500">Title</div>
//                   <div className="text-xs text-gray-300 line-clamp-1">
//                     {watched.seo?.title || "—"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Description</div>
//                   <div className="text-xs text-gray-300 line-clamp-2">
//                     {watched.seo?.description || "—"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Media Library Modal */}
//       {mediaOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded shadow-lg p-6 w-11/12 md:w-2/3 max-h-3/4 overflow-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-white">Media Library</h3>
//               <button
//                 onClick={() => setMediaOpen(false)}
//                 className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 "https://placekitten.com/800/400",
//                 "https://placekitten.com/1200/630",
//                 "https://placekitten.com/600/400",
//               ].map((s) => (
//                 <div
//                   key={s}
//                   className="border border-gray-700 p-2 rounded text-center"
//                 >
//                   <img
//                     src={s}
//                     alt="media"
//                     className="w-full h-28 object-cover rounded mb-2"
//                   />
//                   <button
//                     onClick={() => handleMediaSelect(s)}
//                     className="px-2 py-1 border border-gray-700 rounded text-xs hover:bg-gray-700"
//                   >
//                     Select
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* APi preview */}
//       {apiOpen && (
//   <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//     <div className="bg-gray-800 p-6 rounded w-96">
//       <h3 className="text-lg font-semibold mb-4">API Output</h3>
//       <pre className="text-xs bg-gray-900 p-3 rounded max-h-80 overflow-auto">
//         {JSON.stringify(getValues(), null, 2)}
//       </pre>

//       <button
//         onClick={() => setApiOpen(false)}
//         className="mt-4 px-3 py-2 bg-gray-700 rounded text-sm"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}

//     </div>
//   );
// }

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
import { ChevronDown, Trash2 } from "lucide-react";
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
import { TinyEditorRHF } from "@/components/ui/rich-text-editor";
import { styledLog } from "@/utils/styledLog";

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
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing px-3 py-2 bg-gray-700 hover:bg-gray-600 text-xs rounded mb-2 w-fit flex items-center gap-2"
        >
          <span className="drag-handle">⠿</span>
          Drag to reorder
        </div>

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
    <div className="bg-gray-800 border border-gray-700 rounded overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 hover:bg-gray-850 group">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            #{String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm text-gray-300 font-medium capitalize">
            {block.type.replace(/([A-Z])/g, " $1").toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-700 rounded"
            title={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown
              size={16}
              className={`text-gray-400 transition ${expanded ? "" : "-rotate-90"}`}
            />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-900/30 rounded"
            title="Delete block"
          >
            <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {expanded && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

/**
 *==========================
 *   update schema
 *==========================
 */
// const heroSchema = z.object({
//   image: z.string().url(),
//   alt: z.string().optional(),
//   h1: z.string(),
//   p: z.string().optional(),
//   btn: z.string().url().optional(), // URL since it's likely a link
// });

// const commonCardSchema = z.object({
//   src: z.string().url(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string(),
//   button: z.string().url().optional(),
//   btnTitle: z.string().optional(),
// }).refine(
//   (data) => !(data.button && !data.btnTitle),
//   {
//     message: "btnTitle is required when button is provided",
//     path: ["btnTitle"],
//   }
// );

// const serviceSectionSchema = z.object({
//   type: z.literal("serviceSection"),
//   service: z.string().optional(),
//   subService: z.string().optional(), // camelCase
//   infoCards: z.array(commonCardSchema).min(1), // camelCase
// });

// const dedicatedServiceSectionSchema = z.object({
//   type: z.literal("dedicatedServiceSection"),
//   img: z.string().url(),
//   alt: z.string().optional(),
//   textRich: z.string(),
// });

// const corporateServiceOfferingsSchema = z.object({
//   type: z.literal("corporateServiceOfferings"),
//   src: z.string().url(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().url().optional(),
//   btnTitle: z.string().optional(),
//   serviceCards: z.array(commonCardSchema).min(1), // camelCase
// }).refine(
//   (data) => !(data.button && !data.btnTitle),
//   {
//     message: "btnTitle is required when button is provided",
//     path: ["btnTitle"],
//   }
// );

// const corporateServicesAndFeaturesSchema = z.object({
//   type: z.literal("corporateServicesAndFeatures"),
//   src: z.string().url(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   infoCards: z.array( // camelCase
//     commonCardSchema.extend({
//       height: z.number().positive(),
//       width: z.number().positive(),
//       orientation: z.enum(["vertical", "horizontal"]),
//     })
//   ).min(1),
// });

// const whoWeSupportSchema = z.object({
//   type: z.literal("whoWeSupport"),
//   src: z.string().url(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().url().optional(),
//   btnTitle: z.string().optional(),
//   imageCards: z.array(commonCardSchema).min(1), // camelCase
// }).refine(
//   (data) => !(data.button && !data.btnTitle),
//   {
//     message: "btnTitle is required when button is provided",
//     path: ["btnTitle"],
//   }
// );

// const ourGlobalReachSchema = z.object({
//   type: z.literal("ourGlobalReach"),
//   src: z.string().url(),
//   alt: z.string().optional(),
//   title: z.string().optional(),
//   description: z.string().optional(),
//   button: z.string().url().optional(),
//   btnTitle: z.string().optional(),
//   imageCards: z.array(commonCardSchema).min(1), // camelCase
// }).refine(
//   (data) => !(data.button && !data.btnTitle),
//   {
//     message: "btnTitle is required when button is provided",
//     path: ["btnTitle"],
//   }
// );

// const contactForServiceSchema = z.object({
//   type: z.literal("contactForService"),
//   textRich: z.string(),
//   btn: z.string().url().optional(),
//   btnTitle: z.string(),
// });

// const contentBlockSchema = z.discriminatedUnion("type", [
//   serviceSectionSchema,
//   dedicatedServiceSectionSchema,
//   corporateServiceOfferingsSchema,
//   corporateServicesAndFeaturesSchema,
//   whoWeSupportSchema,
//   ourGlobalReachSchema,
//   contactForServiceSchema,
// ]);

// const openGraphSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   url: z.string().url().optional(),
//   images: z.array(z.string().url()).min(1),
//   siteName: z.string().optional(),
//   type: z.string().optional(),
// });

// const twitterSchema = z.object({
//   card: z.enum(["summary", "summary_large_image", "app", "player"]),
//   title: z.string(),
//   description: z.string(),
//   images: z.array(z.string().url()).min(1),
// });

// const seoSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   keywords: z.array(z.string()).optional(),
//   canonical: z.string().url().optional(),
//   openGraph: openGraphSchema.optional(),
//   twitter: twitterSchema.optional(),
// });

/**
 * ===========================
 * update schema ends
 * ===========================
 */

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

// const pageTemplateSchema = z.object({
//   pageName: z.string().optional(),
//   slug: z.string().optional(),
//   hero: heroSchema.optional(),
//   content: z.array(contentBlockSchema).optional(),
//   seo: seoSchema.optional(),
// });

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
});

export type PageTemplateFormData = z.infer<typeof pageTemplateSchema>;

const uid = () => Math.random().toString(36).slice(2, 9);

function Input({ label, ...props }: any) {
  return (
    <label className="block text-sm mb-3">
      <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </div>
      <input
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        {...props}
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  [key: string]: any;
}

function TextArea({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: TextAreaProps) {
  return (
    <label htmlFor={name} className="block text-sm mb-3">
      <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </div>
      <TinyEditorRHF
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
        value={value || ""}
        onChange={(val: any) => {
          onChange(val);
        }}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </label>
  );
}

interface SimpleTextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export function SimpleTextArea({
  label,
  value,
  onChange,
  onBlur,
  name,
  ...props
}: SimpleTextAreaProps) {
  return (
    <label className="block text-sm mb-3">
      <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </div>
      <textarea
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
        rows={4}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        name={name}
        {...props}
      />
    </label>
  );
}

function transformData(data: Partial<PageTemplateFormData>) {
  if (!data) return undefined;
  styledLog(data, "transformData data:", "success");
  return {
    ...data,
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
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <div className=" bg-gray-900 text-white flex flex-col">
          {/* Header - unchanged */}
          <div className="bg-black border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {watched.pageName || "Untitled"}
                </h1>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <div>
                    Status: <span className="text-yellow-400">Changed</span> ·{" "}
                    <button className="text-blue-400 hover:text-blue-300">
                      Revert to published
                    </button>
                  </div>
                  <div>Last Modified: January 16th 2025, 3:24 PM</div>
                  <div>Created: January 16th 2025, 3:06 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800"
                >
                  {showPreview ? "Back to Editor" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 border rounded text-sm ${
                    showPreview
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 hover:bg-gray-800"
                  }`}
                >
                  {showPreview ? "Hide Preview" : "Live Preview"}
                </button>
                <button
                  type="button"
                  onClick={() => setApiOpen(true)}
                  className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-800"
                >
                  API
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-900 border-b border-gray-800 px-6">
            <div className="flex gap-8">
              {["hero", "content", "seo"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-3 px-1 text-sm font-medium capitalize border-b-2 transition ${
                    activeTab === tab
                      ? "border-blue-500 text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Editor Panel */}
            <div
              className={`border-r border-gray-800 p-6 overflow-y-auto transition-all duration-300 ${
                showPreview ? "hidden" : "w-full"
              }`}
            >
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Hero Tab */}
                {activeTab === "hero" && (
                  <>
                    <div>
                      <Input label="Title" {...register("pageName")} />
                      <Input label="Slug" {...register("slug")} />
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold mb-4">Hero</h3>
                      <Controller
                        control={control}
                        name="hero.image"
                        render={({ field }) => (
                          <Input label="Hero Image URL" {...field} />
                        )}
                      />
                      <Controller
                        control={control}
                        name="hero.alt"
                        render={({ field }) => (
                          <Input label="Alt Text" {...field} />
                        )}
                      />
                      <Controller
                        control={control}
                        name="hero.h1"
                        render={({ field }) => (
                          <Input label="Heading (H1)" {...field} />
                        )}
                      />
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
                      <Controller
                        control={control}
                        name="hero.btn"
                        render={({ field }) => (
                          <Input label="Button Text" {...field} />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMedia((url) => setValue("hero.image", url))
                        }
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
                      >
                        Choose Media
                      </button>
                    </div>
                  </>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Layout Blocks</h3>
                      <div className="flex gap-2 flex-wrap">
                        {/* ADD BLOCK BUTTONS - RESTORED */}
                        <button
                          type="button"
                          onClick={() =>
                            append({
                              id: uid(),
                              type: "serviceSection",
                              service: "",
                              subService: "",
                              infoCards: [], // ADD THIS - empty array
                            })
                          }
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          + Service Section
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            append({
                              id: uid(),
                              type: "dedicatedServiceSection",
                              img: "",
                              textRich: "",
                            })
                          }
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          + Dedicated Service
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            append({
                              id: uid(),
                              type: "corporateServiceOfferings",
                              serviceCards: undefined,
                            })
                          }
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          + Corp Offerings
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            append({
                              id: uid(),
                              type: "corporateServicesAndFeatures",
                              infoCards: [],
                            })
                          }
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          + Features
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {fields.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-gray-700 rounded">
                          <p className="text-gray-400">
                            No content blocks added yet.
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Add a block using the buttons above
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
                                <SortableItem key={field._key} id={field._key}>
                                  <LayoutBlock
                                    block={{ type }}
                                    index={index}
                                    onRemove={() => remove(index)}
                                    onMoveUp={() => move(index, index - 1)}
                                    onMoveDown={() => move(index, index + 1)}
                                    canMoveUp={index > 0}
                                    canMoveDown={index < fields.length - 1}
                                  >
                                    {type === "serviceSection" && (
                                      <ServiceSectionBlock
                                        blockIndex={index}
                                        openMedia={openMedia}
                                      />
                                    )}
                                    {type === "dedicatedServiceSection" && (
                                      <>
                                        <Input
                                          label="Image URL"
                                          {...register(`content.${index}.img`)}
                                        />
                                        <Controller
                                          control={control}
                                          name={`content.${index}.textRich`}
                                          render={({ field }) => (
                                            <TextArea
                                              label="Rich Text (HTML)"
                                              value={field.value || ""}
                                              onChange={field.onChange}
                                              onBlur={field.onBlur}
                                              name={field.name}
                                            />
                                          )}
                                        />{" "}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openMedia((url) =>
                                              setValue(
                                                `content.${index}.img`,
                                                url,
                                              ),
                                            )
                                          }
                                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm hover:bg-gray-600"
                                        >
                                          Choose Image
                                        </button>
                                      </>
                                    )}
                                    {type === "corporateServiceOfferings" && (
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
                                    {/* {type === "corporateServicesAndFeatures" && (
                                    <>
                                      <Input
                                        label="Image URL"
                                        {...register(`content.${index}.src`)}
                                      />
                                      <Input
                                        label="Alt Text"
                                        {...register(`content.${index}.alt`)}
                                      />
                                      <Input
                                        label="Title"
                                        {...register(`content.${index}.title`)}
                                      />
                                      <TextArea
                                        label="Description"
                                        {...register(
                                          `content.${index}.description`
                                        )}
                                      />
                                      <div className="grid grid-cols-2 gap-3">
                                        <Input
                                          label="Height (px)"
                                          type="number"
                                          {...register(
                                            `content.${index}.height`,
                                            {
                                              valueAsNumber: true,
                                            }
                                          )}
                                        />
                                        <Input
                                          label="Width (px)"
                                          type="number"
                                          {...register(
                                            `content.${index}.width`,
                                            {
                                              valueAsNumber: true,
                                            }
                                          )}
                                        />
                                      </div>
                                      <label className="block text-sm mb-3">
                                        <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                                          Orientation
                                        </div>
                                        <select
                                          {...register(
                                            `content.${index}.orientation`
                                          )}
                                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        >
                                          <option value="">
                                            Select orientation
                                          </option>
                                          <option value="vertical">
                                            Vertical
                                          </option>
                                          <option value="horizontal">
                                            Horizontal
                                          </option>
                                        </select>
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openMedia((url) =>
                                            setValue(
                                              `content.${index}.src`,
                                              url
                                            )
                                          )
                                        }
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm hover:bg-gray-600"
                                      >
                                        Choose Image
                                      </button>
                                    </>
                                  )} */}
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
                                            <TextArea
                                              label="Rich Text (HTML)"
                                              value={field.value || ""}
                                              onChange={field.onChange}
                                              onBlur={field.onBlur}
                                              name={field.name}
                                            />
                                          )}
                                        />{" "}
                                        <Input
                                          label="Button Link"
                                          {...register(`content.${index}.btn`)}
                                        />
                                        <Input
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

                    {/* Additional Add Block Buttons at Bottom */}
                    {fields.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-sm font-medium mb-3">
                          Add More Blocks
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() =>
                              append({
                                id: uid(),
                                type: "whoWeSupport",
                                imageCards: [],
                              })
                            }
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                          >
                            + Who We Support
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              append({
                                id: uid(),
                                type: "ourGlobalReach",
                                imageCards: [],
                              })
                            }
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                          >
                            + Global Reach
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              append({
                                id: uid(),
                                type: "contactForService",
                              })
                            }
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                          >
                            + Contact CTA
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Tab - UPDATED VERSION */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Search Engine Optimization
                    </h3>

                    {/* Basic SEO Fields */}
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <h4 className="text-sm font-medium mb-3 text-gray-300">
                        Basic SEO
                      </h4>
                      <Controller
                        control={control}
                        name="seo.title"
                        render={({ field }) => (
                          <Input label="Meta Title" {...field} />
                        )}
                      />
                      <Controller
                        control={control}
                        name="seo.description"
                        render={({ field }) => (
                          <SimpleTextArea
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
                          <SimpleTextArea
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
                                styledLog(val, "keywords input:", "info");
                                const keywords = val
                                  .split(",")
                                  .map((k) => k.trim())
                                  .filter((k) => k.length > 0);
                                styledLog(keywords, "keywords parsed:", "info");
                                field.onChange(keywords);
                              } catch (err) {
                                console.error("Error parsing keywords", err);
                              }
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Open Graph Fields */}
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <h4 className="text-sm font-medium mb-3 text-gray-300">
                        Open Graph (Facebook/LinkedIn)
                      </h4>
                      <Controller
                        control={control}
                        name="seo.openGraph.title"
                        render={({ field }) => (
                          <Input
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
                          <SimpleTextArea
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
                          <Input
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
                          <Input
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
                          <label className="block text-sm mb-3">
                            <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                              OG Type
                            </div>
                            <select
                              {...field}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            >
                              <option value="website">Website</option>
                              <option value="article">Article</option>
                              <option value="book">Book</option>
                              <option value="profile">Profile</option>
                            </select>
                          </label>
                        )}
                      />
                      <div className="mt-3">
                        <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                          OG Images (URLs, one per line)
                        </div>
                        <Controller
                          control={control}
                          name="seo.openGraph.images"
                          render={({ field }) => (
                            <SimpleTextArea
                              label=""
                              value={field.value?.join("\n") || ""}
                              onChange={(value: string) => {
                                const images = value
                                  .split("\n")
                                  .map((url) => url.trim())
                                  .filter((url) => url.length > 0);
                                field.onChange(images);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              placeholder="https://limospro-media.s3.amazonaws.com/og/limospro-homepage-og.jpg"
                            />
                          )}
                        />
                        {/* <SimpleTextArea
                          value={
                            watched.seo?.openGraph?.images?.join("\n") || ""
                          }
                          onChange={(value: string) => {
                            const images = value
                              .split("\n")
                              .map((url) => url.trim())
                              .filter((url) => url.length > 0);
                            setValue("seo.openGraph.images", images, { shouldDirty: true });
                          }}
                          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                          rows={3}
                          placeholder="https://limospro-media.s3.amazonaws.com/og/limospro-homepage-og.jpg"
                        /> */}
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 1200×630 pixels
                        </p>
                      </div>
                    </div>

                    {/* Twitter Fields */}
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                      <h4 className="text-sm font-medium mb-3 text-gray-300">
                        Twitter Cards
                      </h4>
                      <Controller
                        control={control}
                        name="seo.twitter.card"
                        render={({ field }) => (
                          <label className="block text-sm mb-3">
                            <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                              Card Type
                            </div>
                            <select
                              {...field}
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            >
                              <option value="summary_large_image">
                                Summary with Large Image
                              </option>
                              <option value="summary">Summary</option>
                              <option value="app">App</option>
                              <option value="player">Player</option>
                            </select>
                          </label>
                        )}
                      />
                      <Controller
                        control={control}
                        name="seo.twitter.title"
                        render={({ field }) => (
                          <Input
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
                          <SimpleTextArea
                            label="Twitter Description"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Defaults to OG Description if empty"
                          />
                        )}
                      />
                      <div className="mt-3">
                        <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                          Twitter Images (URLs, one per line)
                        </div>
                        <Controller
                          control={control}
                          name="seo.twitter.images"
                          render={({ field }) => (
                            <SimpleTextArea
                              label=""
                              value={field.value?.join("\n") || ""}
                              onChange={(value: string) => {
                                const images = value
                                  .split("\n")
                                  .map((url) => url.trim())
                                  .filter((url) => url.length > 0);
                                field.onChange(images);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              placeholder="https://limospro-media.s3.amazonaws.com/og/limospro-homepage-og.jpg"
                            />
                          )}
                        />
                        {/* <SimpleTextArea
                          // label="Description"
                           value={watched.seo?.openGraph?.images?.join("\n") || ""}
                          onChange={(value: string) => {
                            const images = value
                              .split("\n")
                              .map((url) => url.trim())
                              .filter((url) => url.length > 0);
                            setValue("seo.openGraph.images", images, { shouldDirty: true });
                          }}
                          placeholder="https://limospro-media.s3.amazonaws.com/og/limospro-homepage-og.jpg"
                        /> */}
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 1200×628 pixels
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => console.log(getValues())}
                    className="px-4 py-2 bg-blue-600 rounded text-sm font-medium hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            {/* Live Preview Panel - unchanged */}
            {showPreview && (
              <div className="w-full bg-white p-0 overflow-y-auto">
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 z-10">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Preview Mode
                      </h2>
                      <p className="text-sm text-gray-400">
                        Viewing: {watched.pageName || "Untitled Page"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full">
                        Preview Mode
                      </div>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
                      >
                        Back to Edit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Render the actual preview */}
                <PreviewRenderer data={previewData} />
              </div>
            )}
          </div>

          {/* Media Library Modal - unchanged */}
          {mediaOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded shadow-lg p-6 w-11/12 md:w-2/3 max-h-3/4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Media Library</h3>
                  <button
                    onClick={() => setMediaOpen(false)}
                    className="px-3 py-1.5 border border-gray-700 rounded text-sm hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "https://placekitten.com/800/400",
                    "https://placekitten.com/1200/630",
                    "https://placekitten.com/600/400",
                  ].map((s) => (
                    <div
                      key={s}
                      className="border border-gray-700 p-2 rounded text-center"
                    >
                      <img
                        src={s}
                        alt="media"
                        className="w-full h-28 object-cover rounded mb-2"
                      />
                      <button
                        onClick={() => handleMediaSelect(s)}
                        className="px-2 py-1 border border-gray-700 rounded text-xs hover:bg-gray-700"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Preview Modal - unchanged */}
          {apiOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded w-96">
                <h3 className="text-lg font-semibold mb-4">API Output</h3>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(JSON.stringify(getValues(), null, 2))
                      .then(() => {
                        // You can add a toast notification here
                        toast.success("Copied to clipboard!");
                        setApiOpen(false);
                      })
                      .catch((err) => {
                        console.error("Failed to copy: ", err);
                        toast.error("Failed to copy to clipboard");
                      });
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors flex items-center gap-2"
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
                </button>
                <pre className="text-xs bg-gray-900 p-3 rounded max-h-80 overflow-auto">
                  {JSON.stringify(getValues(), null, 2)}
                </pre>

                <button
                  onClick={() => setApiOpen(false)}
                  className="mt-4 px-3 py-2 bg-gray-700 rounded text-sm"
                >
                  Close
                </button>
              </div>
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
      <Input label="Service" {...register(`content.${blockIndex}.service`)} />
      <Input
        label="Subservice"
        {...register(`content.${blockIndex}.subService`)}
      />

      {/* Info Cards Section */}
      <div className="border-t border-gray-700 pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Info Cards ({infocardFields.length})
          </h4>
          <button
            type="button"
            onClick={() =>
              appendInfocard({
                src: "",
                alt: "",
                title: "",
                description: "",
              })
            }
            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs absolute bottom-4 right-4"
          >
            + Add Card
          </button>
        </div>

        {infocardFields.map((field, cardIndex) => (
          <div
            key={field.id}
            className="mb-4 p-4 bg-gray-800 rounded border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                Card #{cardIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => removeInfocard(cardIndex)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
              >
                Remove
              </button>
            </div>

            <Input
              label="Image URL"
              {...register(`content.${blockIndex}.infoCards.${cardIndex}.src`)}
            />
            <Input
              label="Alt Text"
              {...register(`content.${blockIndex}.infoCards.${cardIndex}.alt`)}
            />
            <Input
              label="Title"
              {...register(
                `content.${blockIndex}.infoCards.${cardIndex}.title`,
              )}
            />
            <Controller
              control={control}
              name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
              render={({ field }) => (
                <TextArea
                  label="Description"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <button
              type="button"
              onClick={() =>
                openMedia((url) =>
                  setValue(
                    `content.${blockIndex}.infoCards.${cardIndex}.src`,
                    url,
                  ),
                )
              }
              className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
            >
              Choose Image
            </button>
          </div>
        ))}
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
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Service Cards ({servicecardFields.length})
          </h4>
          <button
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
            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs absolute bottom-4 right-4"
          >
            + Add Card
          </button>
        </div>

        {servicecardFields.map((field, cardIndex) => (
          <div
            key={field.id}
            className="mb-4 p-4 bg-gray-800 rounded border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                Card #{cardIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => removeServicecard(cardIndex)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
              >
                Remove
              </button>
            </div>
            {`content.${blockIndex}.serviceCards.${cardIndex}.src`}
            <Input
              label="Image URL"
              {...register(
                `content.${blockIndex}.serviceCards.${cardIndex}.src`,
              )}
            />
            <Input
              label="Alt Text"
              {...register(
                `content.${blockIndex}.serviceCards.${cardIndex}.alt`,
              )}
            />
            <Input
              label="Title"
              {...register(
                `content.${blockIndex}.serviceCards.${cardIndex}.title`,
              )}
            />
            <Controller
              control={control}
              name={`content.${blockIndex}.serviceCards.${cardIndex}.description`}
              render={({ field }) => (
                <TextArea
                  label="Description"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Input
              label="Button Link"
              {...register(
                `content.${blockIndex}.serviceCards.${cardIndex}.button`,
              )}
            />
            <Input
              label="Button Text"
              {...register(
                `content.${blockIndex}.serviceCards.${cardIndex}.btnTitle`,
              )}
            />
            <button
              type="button"
              onClick={() =>
                openMedia((url) =>
                  setValue(
                    `content.${blockIndex}.serviceCards.${cardIndex}.src`,
                    url,
                  ),
                )
              }
              className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
            >
              Choose Image
            </button>
          </div>
        ))}
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
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Info Cards ({infocardFields.length})
          </h4>
          <button
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
            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs absolute bottom-4 right-4"
          >
            + Add Card
          </button>
        </div>

        {infocardFields.map((field, cardIndex) => (
          <div
            key={field.id}
            className="mb-4 p-4 bg-gray-800 rounded border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                Card #{cardIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => removeInfocard(cardIndex)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
              >
                Remove
              </button>
            </div>

            <Input
              label="Image URL"
              {...register(`content.${blockIndex}.infoCards.${cardIndex}.src`)}
            />
            <Input
              label="Alt Text"
              {...register(`content.${blockIndex}.infoCards.${cardIndex}.alt`)}
            />
            <Input
              label="Title"
              {...register(
                `content.${blockIndex}.infoCards.${cardIndex}.title`,
              )}
            />
            <Controller
              control={control}
              name={`content.${blockIndex}.infoCards.${cardIndex}.description`}
              render={({ field }) => (
                <TextArea
                  label="Description"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Height (px)"
                type="number"
                {...register(
                  `content.${blockIndex}.infoCards.${cardIndex}.height`,
                  {
                    valueAsNumber: true,
                  },
                )}
              />
              <Input
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
            <label className="block text-sm mb-3">
              <div className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                Orientation
              </div>
              <select
                {...register(
                  `content.${blockIndex}.infoCards.${cardIndex}.orientation`,
                )}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() =>
                openMedia((url) =>
                  setValue(
                    `content.${blockIndex}.infoCards.${cardIndex}.src`,
                    url,
                  ),
                )
              }
              className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
            >
              Choose Image
            </button>
          </div>
        ))}
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
      <div className="border-t border-gray-700 pt-4 mt-4 relative">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs text-gray-400 uppercase tracking-wide">
            Image Cards ({imagecardFields.length})
          </h4>
          <button
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
            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs absolute bottom-4 right-4"
          >
            + Add Card
          </button>
        </div>

        {imagecardFields.map((field, cardIndex) => (
          <div
            key={field.id}
            className="mb-4 p-4 bg-gray-800 rounded border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                Card #{cardIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => removeImagecard(cardIndex)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
              >
                Remove
              </button>
            </div>

            <Input
              label="Image URL"
              {...register(`content.${blockIndex}.imageCards.${cardIndex}.src`)}
            />
            <Input
              label="Alt Text"
              {...register(`content.${blockIndex}.imageCards.${cardIndex}.alt`)}
            />
            <Input
              label="Title"
              {...register(
                `content.${blockIndex}.imageCards.${cardIndex}.title`,
              )}
            />
            <Controller
              control={control}
              name={`content.${blockIndex}.imageCards.${cardIndex}.description`}
              render={({ field }) => (
                <TextArea
                  label="Description"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Input
              label="Button Link"
              {...register(
                `content.${blockIndex}.imageCards.${cardIndex}.button`,
              )}
            />
            <Input
              label="Button Text"
              {...register(
                `content.${blockIndex}.imageCards.${cardIndex}.btnTitle`,
              )}
            />
            <button
              type="button"
              onClick={() =>
                openMedia((url) =>
                  setValue(
                    `content.${blockIndex}.imageCards.${cardIndex}.src`,
                    url,
                  ),
                )
              }
              className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs hover:bg-gray-600"
            >
              Choose Image
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

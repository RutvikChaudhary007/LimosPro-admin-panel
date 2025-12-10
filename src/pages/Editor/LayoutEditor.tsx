// import { useState } from "react";
// import type { PageLayout, ContentBlock } from "@/types/layout";
// // import PageRenderer from "@/components/PageRenderer";
// import BlockEditor from "@/components/cms/BlockEditor";

// import {
//   DndContext,
//   type DragEndEvent,
//   closestCenter,
// } from "@dnd-kit/core";

// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
// } from "@dnd-kit/sortable";

// export default function LayoutEditor() {
//   const [layout, setLayout] = useState<PageLayout>({
//     hero: {
//       type: "heroSection",
//       image: "/hero.jpg",
//       alt: "hero",
//       h1: "Business & Corporate",
//       p: "Learn how our services help organizations.",
//       btn: "Get Started",
//     },
//     content: [
//       { type: "serviceSection", service: "Business", subservice: "Corporate" },
//       { type: "dedicatedServiceSection", img: "/dedicated.jpg", textrich: "Lorem ipsum" },
//     ],
//   });

//   const [preview, setPreview] = useState(true);

//   const updateContent = (i: number, newData: ContentBlock) => {
//     const updated = [...layout.content];
//     updated[i] = newData;
//     setLayout({ ...layout, content: updated });
//   };

//   const onDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;

//     const oldIndex = Number(active.id);
//     const newIndex = Number(over.id);

//     setLayout((prev) => ({
//       ...prev,
//       content: arrayMove(prev.content, oldIndex, newIndex),
//     }));
//   };

//   return (
//     <div className="flex h-screen">
//       {/* EDITOR PANEL */}
//       <div className="w-1/2 p-4 overflow-auto border-r bg-gray-100">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Layout Editor</h2>

//           <button
//             onClick={() => setPreview(!preview)}
//             className="px-4 py-2 rounded bg-blue-500 text-white"
//           >
//             {preview ? "Hide Preview" : "Show Preview"}
//           </button>
//         </div>

//         {/* HERO EDIT */}
//         <h3 className="font-semibold text-lg mb-2">Hero Section</h3>
//         <BlockEditor
//           block={layout.hero}
//           onChange={(v) => setLayout({ ...layout, hero: v })}
//         />

//         {/* CONTENT EDIT */}
//         <h3 className="font-semibold text-lg mt-6 mb-2">Content Blocks</h3>

//         <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//           <SortableContext
//             items={layout.content.map((_, i) => i.toString())}
//             strategy={verticalListSortingStrategy}
//           >
//             {layout.content.map((block, i) => (
//               <div key={i} id={i.toString()}>
//                 <BlockEditor block={block} onChange={(v:any) => updateContent(i, v)} />
//               </div>
//             ))}
//           </SortableContext>
//         </DndContext>
//       </div>

//       {/* PREVIEW PANEL */}
//       {preview && (
//         <div className="w-1/2 overflow-auto bg-white p-6">
//           <h2 className="text-xl font-bold mb-4">Live Preview</h2>
//           {/* <PageRenderer layout={layout} /> */}
//         </div>
//       )}
//     </div>
//   );
// }

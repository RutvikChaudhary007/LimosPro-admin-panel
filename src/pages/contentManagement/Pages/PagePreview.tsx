// // import React from "react";
// import { useParams } from "react-router-dom";
// // import { useFetchPageTemplateById } from "@/api";
// import { ErrorCard } from "@/components/common/ErrorCard";
// import { Spinner } from "@/components/Spinner";
// // import PageTitle from "@/components/common/PageTitle";
// // import PageHeader from "@/components/layout/Header";
// // import { generatePageTitle } from "@/utils/";

// // import { MOCK_PAGES } from "@/data/mockPages";

// function PagePreview() {
//   const { id } = useParams<{ id: string }>();
//   // const { data: page, isFetching, isError, refetch } = useFetchPageTemplateById(id || "");
//   const page = MOCK_PAGES.find((p) => p.id === id);
//   const isFetching = false;
//   const isError = !page;
//   const refetch = () => {};

//   if (isError) return <ErrorCard refetch={refetch} />;

//   const isLoading = isFetching;

//   return (
//     <>
//       {/* <PageTitle title={generatePageTitle("Page Preview")} /> */}
//       <div className="p-6 space-y-6 md:p-8 md:space-y-8">
//         {/* <PageHeader
//           title={`Preview: ${page?.pageName || "Loading..."}`}
//           breadcrumbs={[
//             { label: "Home", path: "/" },
//             { label: "Content Management" },
//             { label: "Pages", path: "/content-management/pages" },
//             { label: "Preview" },
//           ]}
//         /> */}
//         {isLoading ? (
//           <Spinner />
//         ) : (
//           <div className="space-y-8 border p-8 rounded-lg bg-white shadow-sm min-h-[500px]">
//             {/* Simulated Header */}
//             <div className="border-b pb-4 mb-8 text-center text-gray-400">
//               [Header Navigation Placeholder]
//             </div>

//             {/* Dynamic Content Blocks */}
//             <div className="space-y-12">
//               {page?.layout?.contentBlocks?.map((block, index) => {
//                 // Inline Block Renderer for Preview
//                 switch (block.blockType) {
//                   case "hero":
//                     return (
//                       <div key={index} className="relative bg-gray-900 text-white py-20 px-6 text-center rounded-lg overflow-hidden">
//                         {block.content.backgroundImage && (
//                           <img
//                             src={block.content.backgroundImage}
//                             alt="Hero Background"
//                             className="absolute inset-0 w-full h-full object-cover opacity-30"
//                           />
//                         )}
//                         <div className="relative z-10">
//                           <h1 className="text-4xl font-bold mb-4">{block.content.title}</h1>
//                           <p className="text-xl mb-8 text-gray-200">{block.content.subtitle}</p>
//                           {block.content.buttonText && (
//                             <a href={block.content.buttonUrl} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition">
//                               {block.content.buttonText}
//                             </a>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   case "features":
//                     return (
//                       <div key={index} className="py-12 px-6">
//                         <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                           {block.content.features?.map((feature: any, fIndex: number) => (
//                             <div key={fIndex} className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
//                               <div className="text-4xl mb-4">{/* Icon placeholder */}{feature.icon || "★"}</div>
//                               <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//                               <p className="text-gray-600">{feature.description}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   case "content":
//                     return (
//                       <div key={index} className="py-12 px-6 prose max-w-none">
//                         <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
//                       </div>
//                     );
//                   case "cta":
//                     return (
//                       <div key={index} className="bg-blue-50 py-16 px-6 text-center rounded-lg">
//                         <h2 className="text-3xl font-bold mb-4">{block.content.title}</h2>
//                         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{block.content.description}</p>
//                         {block.content.buttonText && (
//                           <a href={block.content.buttonUrl} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
//                             {block.content.buttonText}
//                           </a>
//                         )}
//                       </div>
//                     );
//                   default:
//                     return (
//                       <div key={index} className="p-4 border border-dashed border-gray-300 rounded text-center text-gray-500">
//                         Unknown block type: {block.blockType}
//                       </div>
//                     );
//                 }
//               })}
//               {page?.layout?.contentBlocks?.length === 0 && (
//                 <div className="text-center text-gray-400 py-12">
//                   This page has no content blocks.
//                 </div>
//               )}
//             </div>

//             {/* Simulated Footer */}
//             <div className="border-t pt-4 mt-12 text-center text-gray-400">
//               [Footer Placeholder]
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default PagePreview;

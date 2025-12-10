// import type { PageLayout } from "@/types/layout";
// import { COMPONENT_MAP } from "../utils/COMPONENT_MAP";

// type Props = {
//   layout: PageLayout;
// };

// export default function PageRenderer({ layout }: Props) {
//   if (!layout) return null;

//   const { hero, content } = layout;

//   const HeroComp = COMPONENT_MAP[hero.type];

//   return (
//     <div className="page-preview">
//       {HeroComp && <HeroComp {...hero} />}

//       {content.map((block, i) => {
//         const Comp = COMPONENT_MAP[block.type];
//         if (!Comp) return null;
//         return <Comp key={i} {...block} />;
//       })}
//     </div>
//   );
// }

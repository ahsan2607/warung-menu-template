// // ./src/components/menu/Menu.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { List, Grid, Minus, Plus } from "lucide-react";
// import { getMenuData } from "@/libraries/api";
// import MenuItemCard from "./MenuItemCard";
// import Cart from "../order/Cart";
// import type { MenuSection, Subcategory } from "@/types";

// const SectionAccordion: React.FC<{
//   title: string;
//   subCategories: Subcategory[];
//   // children: React.ReactNode;
// }> = ({ title, subCategories }) => {
//   const [open, setOpen] = useState(false);
//   const [viewMode, setViewMode] = useState<"list" | "grid">("list");

//   return (
//     <div className="border rounded-lg bg-white shadow-sm">
//       <button className="w-full p-2 flex items-center justify-between text-left" onClick={() => setOpen(!open)}>
//         <span className="text-lg font-semibold">{title}</span>
//         <span className="text-lg">{open ? <Minus /> : <Plus />}</span>
//       </button>

//       {open && (
//         <div className="p-2 pt-0">
//           <div className="flex justify-end gap-2 py-2">
//             <button
//               onClick={() => setViewMode("list")}
//               className={`rounded px-2 py-1 text-sm border ${viewMode === "list" ? "bg-gray-200" : "bg-gray-50"}`}
//               title="List view"
//             >
//               <List className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => setViewMode("grid")}
//               className={`rounded px-2 py-1 text-sm border ${viewMode === "grid" ? "bg-gray-200" : "bg-gray-50"}`}
//               title="Grid view"
//             >
//               <Grid className="h-4 w-4" />
//             </button>
//           </div>

//           {subCategories.map((subCategory, id) => (
//             <div key={id} className="mb-2">
//               <h4 className="font-medium">{subCategory.title}</h4>
//               <div className={viewMode === "grid" ? "grid gap-2 grid-cols-2" : "flex flex-col gap-1"}>
//                 {subCategory.items.map((item, id) => (
//                   <MenuItemCard key={id} item={item} viewMode={viewMode} />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function Menu() {
//   const [menuData, setMenuData] = useState<MenuSection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await getMenuData();
//       if (response.success) {
//         setMenuData(response.data || []);
//       } else {
//         setError(response.error || "Failed to load menu");
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, []);
//     console.log(menuData)

//   if (loading) {
//     return <div className="text-center p-4">Loading menu...</div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-600">Error: {error}</div>;
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-[1fr_360px]">
//       <div className="space-y-4">
//         {menuData.map((section, id) => (
//           <SectionAccordion key={id} title={section.title} subCategories={section.subcategories} />
//         ))}
//       </div>
//       <div className="md:sticky md:top-[72px] h-fit">
//         <Cart />
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import {Cart} from "@/components/Cart";
import { getMenuData } from "@/libraries/api";
import { useMenuData } from "@/context/MenuDataContext";
import { SectionAccordion } from "./MenuAccordion";

export const Menu = () => {
  const { menuData, setMenuData } = useMenuData();
  const [loading, setLoading] = useState(!menuData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (menuData) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      const response = await getMenuData();
      if (response.success) {
        setMenuData(response.data || []);
      } else {
        setError(response.error || "Failed to load menu");
      }
      setLoading(false);
    };
    fetchData();
  }, [menuData, setMenuData]);

  if (loading) {
    return <div className="text-center p-4">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="md:grid md:gap-6 md:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {menuData ? menuData.map((section, id) => (
          <SectionAccordion key={id} title={section.title} subCategories={section.subcategories} />
        )): null}
      </div>
      <div className="hidden md:block md:sticky md:top-[72px] h-fit">
        <Cart />
      </div>
    </div>
  );
}
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
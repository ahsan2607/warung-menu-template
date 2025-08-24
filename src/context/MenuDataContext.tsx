import React, { createContext, useContext, useState } from "react";
import type { MenuSection } from "@/types";

type MenuDataContextType = {
  menuData: MenuSection[] | null;
  setMenuData: React.Dispatch<React.SetStateAction<MenuSection[] | null>>;
};

const MenuDataContext = createContext<MenuDataContextType | undefined>(undefined);

export function MenuDataProvider({ children }: { children: React.ReactNode }) {
  const [menuData, setMenuData] = useState<MenuSection[] | null>(null);
  return (
    <MenuDataContext.Provider value={{ menuData, setMenuData }}>
      {children}
    </MenuDataContext.Provider>
  );
}

export function useMenuData() {
  const ctx = useContext(MenuDataContext);
  if (!ctx) throw new Error("useMenuData must be used within MenuDataProvider");
  return ctx;
}
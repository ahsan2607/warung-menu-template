// ./src/types/index.ts (No changes needed, but confirming it matches)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type VariationOption = {
  name: string;            // e.g. "Spiciness"
  choices: string[];       // e.g. ["Mild", "Medium", "Hot"]
  required?: boolean;
  defaultChoice?: string;
};

export type AddonOption = {
  id: string;
  name: string;
  price: number;
  maxQty?: number;         // optional cap (e.g. 5)
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  variations?: VariationOption[];
  addons?: AddonOption[];
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};